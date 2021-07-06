"""
    File: stock_daily_changes.py
    Written By: Ido Kolet
    
    Description:
        Add the prediction to .stk files
        Update the SQLite table
        This file should be run speratly and before the main 
"""

# Imports
import os
import sys
import json
import pickle
import sqlite3
import pandas_ta as ta
from keras.models import load_model
from pydantic import main
from aux_classes import Stock, MLModel
import pickle

# Refer to paths regardless of the script location
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Establish connection to the SQL db
con = sqlite3.connect("Server/api_data_base.db")
cur = con.cursor()


def sql_check_exist(symbol):
    """Check if stock exists in db

    Args:
        symbol: symbol to search in the sql

    Returns:
        boolean: if there is a record of the symbol in the db
    """
    # Select record with the symbol arg   
    cur.execute(
        f'''SELECT * FROM stocks_data
            WHERE symbol = "{symbol}"''')

    return not (cur.fetchone() is None)


def sql_add_row(symbol, gain):
    """Add a record to the db

    Args:
        symbol
        gain (float): init value
    """
    # Insert record to the db [symbol=symbol, fllowers=0, gain=gain]
    cur.execute(
        f'''INSERT INTO stocks_data(symbol, followers, gain)
            VALUES ("{symbol}", 0, {gain})''')

    con.commit()


def sql_update_gain(symbol, gain):
    """Update gain in the db

    Args:
        symbol
        gain (float): new value
    """
    # Upsate the symbol's record with the new gain
    cur.execute(
        f'''UPDATE stocks_data
            SET gain = {gain}
            WHERE symbol = "{symbol}"''')

    con.commit()


def get_prediction(stk, scaler, model):
    """Get the prediction fron the NN model for today and tommorow

    Args:
        stk: Stock object
        scaler: The scaler that was fitted on the training data
        model: The trained NN model of the stock

    Returns:
        Dictinary of list of today and tommorow's prediction.
        The lists are softmax results - [-,0,+]

    """    
    predictor = MLModel(stk.sym, stk.extended_df, scaler, model)
    predictions = predictor.predict()

    # Convert the result to dict of lists and round values
    return {k:[round(num*100, 2) for num in v.tolist()[0]] for k,v in predictions.items()}


def calc_daily_indicators(df):
    """Calc technical indicators

    Args:
        df: stocks raw data

    Returns:
        Dictionary of all the technical indicators
    """    
    # Use pandas_ta to calculate daily indicators
    tech_indicators = {
    "RSI": ta.rsi(df['close'], window=14).values[-1],
    "STOCH": ta.momentum.stoch(df['high'],df['low'],df['close'],9,6).values[-1][0],
    "STOCHRSI": ta.momentum.stochrsi(df['close']).values[-1][0],
    "MACD": ta.macd(df['close']).values[-1][1],
    "ADX": ta.adx(df['high'],df['low'],df['close'],14).values[-1][1],
    "WILLIAMS_R": ta.momentum.willr(df['high'],df['low'],df['close']).values[-1],
    "CCI": ta.cci(df['high'],df['low'],df['close']).values[-1],
    "ATR": ta.atr(df['high'],df['low'],df['close'],14).values[-1]
    }   

    # Round all the values to the 2 decimal point
    return {k: round(v, 2) for k, v in tech_indicators.items()}


# Fill the stock objects and the SQL db
def main():  
    # Get list of all the stocks
    with open("backend-env/initial_data.json") as f:
        stocks_list = json.loads(f.read())

    # Calc for each stock the prediction the tha ta
    for key, value in stocks_list.items():
        print(f"=====[{key}]=====")
        # Load dependencies files
        stk = pickle.load(open(f"backend-env/stocks_structs/{key}.stk","rb"))
        mdl = load_model(f"backend-env/ml_models/{key}.keras")
        sclr = pickle.load(open(f"backend-env/ml_scalers/{key}.sclr","rb"))

        # Set the new prediction and ta
        stk.technical_indicators = calc_daily_indicators(stk.raw_data)
        stk.classification = get_prediction(stk, sclr, mdl)

        # Save the updated object
        with open(f"backend-env/stocks_structs/{key}.stk", 'wb') as handle:
                pickle.dump(stk, handle, protocol=pickle.HIGHEST_PROTOCOL)

        # Update SQL
        change = round((((stk.raw_data['close'].iloc[-1] / stk.raw_data['close'].iloc[-2]) - 1) * 100), 2)

        if sql_check_exist(key):
            sql_update_gain(key, change)
        else:
            sql_add_row(key, change)


if __name__ == "main":
    main()
 


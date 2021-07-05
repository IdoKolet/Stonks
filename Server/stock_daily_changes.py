from keras.models import load_model
import pandas_ta as ta
import json
import pandas_ta as ta 
import sqlite3
import os, sys
from initial_traning import MLModel
from stock import Stock
import pickle

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))



# class Stock:
#     def __init__(self, symbol, company, category, start):
#         self.sym = symbol
#         self.company = company
#         self.category = category
#         self.start = start
#         self.last_update = datetime.today().strftime('%Y-%m-%d')
#         self.classification = None
#         self.technical_indicators = None
#         self.raw_data = None
#         self.extended_df = None

#print(os.listdir())



# Cerate connection to the SQL db
con = sqlite3.connect("backend-env/api_data_base.db")
cur = con.cursor()

# Check if stock exists in db
def sql_check_exist(symbol):
    cur.execute(
        f'''SELECT * FROM stocks_data
            WHERE symbol = "{symbol}"''')

    return cur.fetchone()


# Add record to the db
def sql_add_row(symbol, gain):
    cur = con.cursor()
    cur.execute(
        f'''INSERT INTO stocks_data(symbol, followers, gain)
            VALUES ("{symbol}", 0, {gain})''')

    con.commit()


# Update gain in the db
def sql_update_gain(symbol, gain):
    cur = con.cursor()
    cur.execute(
        f'''UPDATE stocks_data
            SET gain = {gain}
            WHERE symbol = "{symbol}"''')

    con.commit()


# Get the prediction fron the NN model
def get_prediction(stk, scaler, model):
    predictor = MLModel(stk.sym, stk.extended_df, scaler, model)
    predictions = predictor.predict()

    return {k:[round(num*100, 2) for num in v.tolist()[0]] for k,v in predictions.items()}

# Calc technical indicators
def calc_daily_indicators(df):
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

# Fill the stockobjects and the SQL db
with open("backend-env/initial_data.json") as f:
    stocks_list = json.loads(f.read())

for key, value in stocks_list.items():
    print(f"=====[{key}]=====")
    stk = pickle.load(open(f"backend-env/stocks_structs/{key}.stk","rb"))
    mdl = load_model(f"backend-env/ml_models/{key}.keras")
    sclr = pickle.load(open(f"backend-env/ml_scalers/{key}.sclr","rb"))
    stk.technical_indicators = calc_daily_indicators(stk.raw_data)
    stk.classification = get_prediction(stk, sclr, mdl)

    with open(f"backend-env/stocks_structs/{key}.stk", 'wb') as handle:
            pickle.dump(stk, handle, protocol=pickle.HIGHEST_PROTOCOL)

    change = round((((stk.raw_data['close'].iloc[-1] / stk.raw_data['close'].iloc[-2]) - 1) * 100), 2)

    if sql_check_exist(key) is None:
        sql_add_row(key, change)
    else:
        sql_update_gain(key, change)
 



"""
    File: main.py
    Written By: Ido Kolet
    
    Description:
        Main file - the API. 
"""

# Imports
import os
import json
import pickle

import numpy as np
from numpy.core.fromnumeric import reshape
import pandas as pd

import uvicorn
from pydantic import BaseModel
from sqlalchemy import desc
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, status, Depends

from aux_classes import Stock
from database import SessionLocal, StockModel, get_db, engine, Base



# --------------------------------
#       Auxillary functions
# --------------------------------

def slicer_vectorized(df,start,end):
    """Save only the date without the time in the index.
       Slicing the time from the datetime

    Args:
        df: Original df
        start: first char index
        end: last char index

    Returns:
        [type]: [description]
    """    
    reshaped = df.view((str,1)).reshape(len(df),-1)[:,start:end]
    return np.frombuffer(reshaped.tobytes(),dtype=(str,end-start))


def prepare_df(df):
    """Get price and Data cols, and reformmat them.
       Index of dates, col of prices rounded.

    Args:
        df: raw data

    Returns:
        Reformmated df
    """    
    rearranged_df = df.copy()
    rearranged_df["date"] = rearranged_df.index
    rearranged_df["date"] = slicer_vectorized(np.datetime_as_string(rearranged_df["date"]), 0, 10)
    rearranged_df["price"] = np.round(rearranged_df["close"], decimals=3)
    return rearranged_df[["date", "price"]]

# Load stocks dat from .stk objects
def load_data():
    """Load stocks data from .stk files

    Returns:
        Dict of all the stock's data
    """

    data = {}

    # For all the .stk files
    for filename in os.listdir("stocks_structs"): # Server\data
        # Load object and convert to dict
        cur_stock = pickle.load(open(f"stocks_structs/{filename}","rb"))
        cur_stock = cur_stock.__dict__

        # Reaarange raw data
        cur_stock["df"] = prepare_df(cur_stock.pop("raw_data"))
        # Delete extended_df for the object - not necassery for client
        del cur_stock["extended_df"]
        # Get the object's symbol
        symbol = cur_stock.pop("sym")

        # Add it to the dict - the symbol is the key
        data[symbol] = cur_stock

    return data






# --------------------------------
#          Initiate API
# --------------------------------

# Connection to SQL via SQL alchemy 
Base.metadata.create_all(engine)

# All stocks data from the .stk files
data = load_data()

# Create the API  - initate web ramework
app = FastAPI(title="Stonks")

# Permit Cross Origin requests
# Allows to run both client and server on localhost
app.add_middleware( CORSMiddleware,
                    allow_origins=["*"],
                    allow_credentials=True,
                    allow_methods=["*"],
                    allow_headers=["*"],
                    )

# Get port number from the operating system, deafult port: 8000
port_number = int(os.environ.get('PORT', 8000))

# Pydantic model for lists in post requests
class FavModel(BaseModel):
    fav_list: list


# --------------------------------
#       Handle HTTP requests
# --------------------------------

@app.post('/')
def send_initial_data(request: FavModel, db: Session = Depends(get_db)):
    """Send dashoard data to client
        5 days of all stocks, mostviewed, top gainers, top losers
    Args:
        db (Session): Connection to db

    Raises:
        HTTPException: 500 if crashes

    Returns:
        5 days of all stocks, data to dashboard tables
    """

    favorites = request.fav_list

    try:
        # Query the data from the SQL db
        most_viewed = db.query(StockModel.symbol, StockModel.followers).order_by(desc(StockModel.followers)).limit(3).all()
        gainers = db.query(StockModel.symbol, StockModel.gain).order_by(desc(StockModel.gain)).all()

        # Create response JSON
        data_to_send = {"OpCode": "Initial Data",
                        "Stocks": {key:value["df"].tail(5).to_dict('records') 
                                    for key, value in data.items() if key in favorites},
                        "MostViewed": most_viewed,
                        "TopGainers": gainers[:3],
                        "TopLosers": gainers[::-1][:3]}
    except:
        # If the func crashes - raise error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Something went wrong")
    return data_to_send


@app.get('/all')
def send_all_stocks_data(db: Session = Depends(get_db)):
    """Send dashoard data to client
        5 days of all stocks
    Args:
        db (Session): Connection to db

    Raises:
        HTTPException: 500 if crashes

    Returns:
        5 days of all stocks
    """
    try:
        # Create response JSON

        data_to_send = {"OpCode": "All Data",
                        "Tech": {key:value["df"].tail(5).to_dict('records') 
                                    for key, value in data.items() if value["category"] == "Tech"},
                        "Med": {key:value["df"].tail(5).to_dict('records') 
                                    for key, value in data.items() if value["category"] == "Med"},
                        "Crypt": {key:value["df"].tail(5).to_dict('records') 
                                    for key, value in data.items() if value["category"] == "Crypt"}
                       }
    except:
        # If the func crashes - raise error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Something went wrong")
    return data_to_send

@app.post('/favorites')
def send_favorites_data(request: FavModel):
    """Send favorites data to client
        5 days of favorites stocks
    Args:
        HTTP request

    Raises:
        HTTPException: 404 if not found, 500 if crashes

    Returns:
        5 days of favorites stocks
    """
    favorites = request.fav_list
    try:
        # Create response JSON
        data_to_send = {"OpCode": "Favorites Data",
                        "Stocks": {key:value["df"].tail(5).to_dict('records') 
                                    for key, value in data.items() if key in favorites}}
    except:
        # If the func crashes - raise error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Something went wrong")
    return data_to_send


@app.get('/stock/{symbol}/')
def send_full_df(symbol: str):
    """Send full stock data to client
        all historical data, technical indicators & tech analysis 
    Args:
        db (Session): Connection to db

    Raises:
        HTTPException: 404 if not found, 500 if crashes

    Returns:
        historical data, technical indicators & tech analysis
    """
    
    # If client asked for non existing resource - raise 404 not found
    if symbol not in data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Data on this stock is missing")

    try:
        # Create response JSON
        data_to_send = {"OpCode": "Full Stock Data",
                        "Symbol": symbol,
                        "Name": data[symbol]["company"],
                        "Category" : data[symbol]["category"],
                        "LastClose": "[Price, Change in price, precentage]",
                        "Classification": data[symbol]["classification"],
                        "TechnicalIndicators": data[symbol]["technical_indicators"],
                        "Prices": data[symbol]["df"].to_dict('records')} 
    except:
        # If the func crashes - raise error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Something went wrong")
    return data_to_send



@app.patch('/follow/{symbol}/')
def update_counter(symbol: str, inc: bool = True,  db: Session = Depends(get_db)):
    """Update counter stock counter in sql data base 

    Args:
        symbol
        inc (bool, optional): follow / unfollow. Defaults to True.
        db (Session): Connection to db
    """
    quote = db.query(StockModel).filter(StockModel.symbol == symbol).first()

    # If client asked to update unsported stock - raise 404 not found
    if quote is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="unsupported stock")
    try:
        db.query(StockModel).filter(StockModel.symbol == symbol).update({'followers': (quote.followers + 1) if inc else (quote.followers - 1)})    
        db.commit()
    except:
        # If the func crashes - raise error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Something went wrong")




if __name__ == "__main__":
    # Run the "app" server (of FastAPI)
    # On development, run this command on PS: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=port_number)
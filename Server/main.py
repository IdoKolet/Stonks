from fastapi import FastAPI, HTTPException, status
import os
import pandas as pd
import numpy as np
import pickle
import json
import uvicorn
from database import engine, Base

from sqlalchemy.orm import Session
from database import SessionLocal, StockModel, get_db
from fastapi import Depends
#from models import StockModel

from sqlalchemy import desc

from aux_classes import Stock


def slicer_vectorized(a,start,end):
    b = a.view((str,1)).reshape(len(a),-1)[:,start:end]
    return np.frombuffer(b.tobytes(),dtype=(str,end-start))

# Get price and Data cols, and reformmat them
def prepare_df(df):
    rearranged_df = df.copy()
    rearranged_df["date"] = rearranged_df.index
    rearranged_df["date"] = slicer_vectorized(np.datetime_as_string(rearranged_df["date"]), 0, 10)
    rearranged_df["price"] = np.round(rearranged_df["close"], decimals=3)
    return rearranged_df[["date", "price"]]

# Load stocks dat from .stk objects
def load_data():
    data = {}
    for filename in os.listdir("stocks_structs"): # backend-env\data
        cur_stock = pickle.load(open(f"stocks_structs/{filename}","rb"))
        cur_stock = cur_stock.__dict__

        cur_stock["df"] = prepare_df(cur_stock.pop("raw_data"))
        del cur_stock["extended_df"]
        symbol = cur_stock.pop("sym")

        data[symbol] = cur_stock

    return data



# Get cinnection to the db
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
#     pass


from pydantic import BaseModel

class StockSchema(BaseModel):
    symbol : str
    followers : int
    gain : int



#models.Base.metadata.create_all(engine)
Base.metadata.create_all(engine)


data = load_data()


from fastapi.middleware.cors import CORSMiddleware

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



class FavModel(BaseModel):
    fav_list: list



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
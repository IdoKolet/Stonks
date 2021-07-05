from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
#import models

import os

from sqlalchemy import Column, Integer, String, Float
#from database import Base
from fastapi import Depends




SQLALCHEMY_DATABASE_URL = "sqlite:///./api_data_base.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, 
                       connect_args={"check_same_thread": False})



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



Base = declarative_base()


class StockModel(Base):
    __tablename__ = "bie"
    __table_args__ = {'extend_existing': True}
    #id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, primary_key=True)
    #symbol = Column(String)
    followers = Column(Integer)
    gain = Column(Float)
    prediction = Column(Float)




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    pass



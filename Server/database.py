"""
    File: database.py
    Written By: Ido Kolet
    
    Description:
        Communication with SQLite db using SQLalchemy 
"""

# Imports
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Url to the SQLite db
SQLALCHEMY_DATABASE_URL = "sqlite:///./api_data_base.db"

# Initiate SQlalchemy connection
engine = create_engine(SQLALCHEMY_DATABASE_URL, 
                       connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# SQL chart fields: id, symbol, followers & gain
class StockModel(Base):
    __tablename__ = "stocks_data"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    followers = Column(Integer)
    gain = Column(Float)


# Generate ref to the db
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    pass



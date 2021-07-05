from sqlalchemy import Column, Integer, String, Float
from database import Base

class StockModel(Base):
    __tablename__ = "stocks_data"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    followers = Column(Integer)
    gain = Column(Float)

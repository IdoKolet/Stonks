import datetime

# Stock struct
class Stock:
    def __init__(self, symbol, company, category, start):
        self.sym = symbol
        self.company = company
        self.category = category
        self.start = start
        self.last_update = datetime.today().strftime('%Y-%m-%d')
        self.classification = None
        self.technical_indicators = None
        self.raw_data = None
        self.extended_df = None
""" Research file
    The production version is \colab_files\colab_data_downloader.ipynb
"""

class Stock:
    """Struct Class - used to save all the stock's data as one object
    """
    def __init__(self, symbol, company, category, start):
        self.sym = symbol
        self.company = company
        self.category = category
        self.start = start
        self.last_update = datetime.today().strftime('%Y-%m-%d')
        self.regression_price = None
        self.classification = None
        self.technical_indicators = None
        self.raw_data = None
        self.extended_df = None


class DataDownloader:
    """Class of methods use for downloading the data

       indicators: Dictionary of all the TA-lib indicators to calculate
    """

    indicators = Indicators.create_indicators_file()   
    
    @staticmethod
    def call(stock):
        """Call the query and analyze functions

        Args:
            stock: symbol

        Returns:
            Todays date
            The raw df from yahoo finance
            The full dataset - yahoo finance + talib
        """
        prices = DataDownloader.query(stock.sym)
        analyzed = DataDownloader.analyze(prices, stock.start)
        return datetime.today().strftime('%Y-%m-%d'), prices, analyzed
        
    @staticmethod
    def query(symbol):
        """Quering Yahoo finanace for the stock historical data:
           Open, Close, High, Low and Volume

        Args:
            symbol

        Returns:
            yahoo finance response df
        """
        data = yf.download(symbol)

        # Update the columns names for TALIB
        data.rename(columns={'Open':'open', 'High':'high',
                             'Low':'low', 'Adj Close': 'close',
                             'Volume':'volume'}, inplace=True)
        
        data.drop(['Close'], axis = 1, inplace = True) 
        
        return data

    @staticmethod
    def analyze(df, start):
        """Add the TALIB technical analysis to the df.
           The function uses the dictionaty of technical indicators
           of TALIB abstract functions/

        Args:
            The yahoo finance raw data
            start: initial date to train from.

        Returns:
            The df of yahoo dinance with the addition of TALIB
        """
        extended_df = df.loc[df.index > start] 
        
        # Calculate each technical indicator and add a column of it to the df 
        for indicator in DataDownloader.indicators.values():
            
            new_data = pd.DataFrame(indicator[0](df))  # Calc the current indicator
            # Tag the new columns with the indicator name
            columns = new_data.columns
            new_cols = {col:tag for col, tag in zip(columns, indicator[1])} 
            new_data = new_data.rename(columns=new_cols)
            extended_df = extended_df.join(new_data)

        # Drop Na rows
        extended_df = extended_df.dropna()

        return extended_df


if __name__ == "__main__":
    # Get the init initinal installing data
    with open("./initial_data.json") as f:
        initial_data = json.loads(f.read())

    # Create list of all the Stocks objects for each symbol
    stocks_list = []
    for key, value in initial_data.items():
        cur_stock = Stock(key, value["company_name"], value["category"], value["start_date"])
        stocks_list.append(cur_stock)

    # Save the Stock objects
    for stk in stocks_list:
       stk.last_update, stk.raw_data, stk.extended_df = DataDownloader.call(stk)

       with open(f'./stocks_structs/{stk.sym}.stk', 'wb') as handle:
            pickle.dump(stk, handle, protocol=pickle.HIGHEST_PROTOCOL)

""" Research file
    The production version is \colab_files\colab_models_training.ipynb
"""

import math
import pandas_datareader as web
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential, load_model
from keras.layers import Dense, LSTM, Softmax
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_fscore_support
from pickle import dump

#  load cleaned df ===> scale ===> add target ===> split to sliding window
# ===> train (validation) + save model ===> test ===> predict tommorow
class MLModel:
    """A class used for creating NN for each stock
        Work flow: load cleaned df ==> scale ==> add target ==> 
        split to sliding window ==> train (validation) + save model ==> 
        test ==> predict tommorow
    """

    def __init__(self, symbol, df, scaler=None, model=None):
        """Constructor

        Args:
            symbol (str): Stock symbol
            df (Pandas DF): data df
            model (keras model, optional): If the is already a trained model us it
        """
        self.symbol = symbol
        self.df = df
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.scaler = scaler
        self.model = model


    def preprocess(self):
        """Do all the preprocessing to the raw data (yahoo finance + talib) 
        """
        X = self.df.iloc[:-1]   # The input is all the data without today 
        y = self.one_hot_tags()   # One hot vector for the prediction [-,0,+]
        
        # Split to train and test
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

        # Scale & to sliding windows train data
        self.scaler = MinMaxScaler(feature_range=(0,1))
        X_train_scaled = self.scaler.fit_transform(self.X_train)
        X_train_scaled = pd.DataFrame(data=X_train_scaled, columns=self.X_train.columns, index=self.X_train.index)
        self.X_train, self.y_train = self.to_windows(X_train_scaled, self.y_train)
        
        # Scale & to sliding windows test data
        X_test_scaled = self.scaler.transform(self.X_test)
        X_test_scaled = pd.DataFrame(data=X_test_scaled, columns=self.X_test.columns, index=self.X_test.index)
        self.X_test, self.y_test = self.to_windows(X_test_scaled, self.y_test)
        

    def one_hot_tags(self):
        """Calculate the change in price, and tag the data with on hot.
                   today - yestarday
            dif = ----------------- * 100 %
                    yestarday

            +: [0,0,1]
            0: [0,1,0]
            -: [1,0,0]

        Returns:
            vector (np array): One hot encoding vector.
        """
        
        # Calc the difference
        differences = (self.df["close"].iloc[1:].reset_index(drop=True) /
                       self.df["close"].iloc[:-1].reset_index(drop=True)) - 1 

        # Init zeros np array
        vector = np.zeros((differences.size,3))

        # Set the "one tag" by the difference
        for diff,i in zip(differences, range(differences.size)):
            if diff > 0.02:
                vector[i,2] = 1
            elif diff < -0.02:
                vector[i,0] = 1
            else:
                vector[i,1] = 1
        
        return vector

    def to_windows(self, X, y, size=60):
        """Restruct the data as sliding window

        Args:
            X: data
            y: tags
            size (int, optional): window size. Defaults to 60.

        Returns:
            windows (np array): data restructes as windows
            tags (np array): the compatiable tags to the windows
        """
        windows = []
        tags = y[size:]

        # Build the windows strcture.
        for i in range(size, len(X)):
            windows.append(X[i-size:i])

        # Convert to np array
        windows, tags = np.array(windows), np.array(tags) 
        return windows, tags


    def set_model(self):
        """Create NN with Dense, LSTM and softmax layers
        """
        model = Sequential()
        model.add(LSTM(50, return_sequences=True))
        model.add(LSTM(50, return_sequences=False))
        model.add(Dense(25))
        model.add(Dense(3))     # 3 multi-class classification 
        model.add(Softmax())

        model.compile(optimizer='adam', loss='categorical_crossentropy')
        self.model = model


    def train(self):
        """Train the NN
        """
        self.model.fit(self.X_train, self.y_train, validation_split=0.2, 
                       shuffle=False, batch_size=1, epochs=12)


    def save_model(self):
        """Save the trained model & transformed scaler
        """
        self.model.save(f"ml_models/{self.symbol}.keras")
        dump(self.scaler, open(f"ml_scalers/{self.symbol}.sclr", 'wb'))


    def test(self):
        """Test the trained model on the test set and calc scores

        Returns:
            scores: percision, recall and f1
        """
        pred = self.model.predict(self.X_test)
        return precision_recall_fscore_support(np.argmax(self.y_test, axis=1), np.argmax(pred, axis=1), average='macro')


    def predict(self):
        """Predict next day classification

        Returns:
            probabillity vector 
        """
        
        X_prev = self.df.tail(61)
        X_prev.drop(X_prev.tail(1).index,inplace=True)
        X_prev_scaled = self.scaler.transform(X_prev)
        X_prev_scaled = pd.DataFrame(data=X_prev_scaled, columns=X_prev.columns, index=X_prev.index)
        X_prev_scaled = np.reshape(X_prev_scaled.to_numpy(), (1, X_prev_scaled.shape[0],  X_prev_scaled.shape[1]))

        X_new = self.df.tail(60)
        X_new_scaled = self.scaler.transform(X_new)
        X_new_scaled = pd.DataFrame(data=X_new_scaled, columns=X_new.columns, index=X_new.index)
        X_new_scaled = np.reshape(X_new_scaled.to_numpy(), (1, X_new_scaled.shape[0],  X_new_scaled.shape[1]))

        return {"new": self.model.predict(X_new_scaled), "prev": self.model.predict(X_prev_scaled)}


    def activate(self):
        """Create model for stock from scratch
        """
        print(f"==========[ {self.symbol} ]==========")
        print("[+] Preprocessing...")
        self.preprocess()
        print("[+] Initiating model...")
        self.set_model()
        print("[+] Training...")
        self.train()
        print("[+] Saving model & scaler...")
        self.save_model()
        print("[+] Testing...")
        test_scores = self.test()
        print(f"Precision: {test_scores[0]}, Recall: {test_scores[1]}, F1: {test_scores[2]}")

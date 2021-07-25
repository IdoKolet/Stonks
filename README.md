<p align="center">
  <img src="https://user-images.githubusercontent.com/73475107/124584452-f2651380-de5c-11eb-917f-3682c64d727e.png" width="50%" height="50%">
</p>

# Stonks
> Machine learning based system for stock price trend prediction.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Reaserch](#reserch)
* [Screenshots](#screenshots)
* [Installation](#installation)
* [Run](#run)
* [Room for Improvement](#room-for-improvement)

## General Information
The system is built in a client-server architecture, and the communication is based on HTTP protocol.
The Python server is a REST API, built using FastAPI. It supplies data about the stock to the client (Historical data, trend prediction, favorites stocks, etc.)  
The client (as the web server is reffered in this doc), is consist of GUI built using ReactJS and Axios for the communication.
The user data is stored at Firebase cloud: email, password, name and favorites list.


## Technologies Used
- FastAPI
- Axios
- Firebase (Auth & Real-Time database)
- SQLite
- React JS 
- Neural Networks (LSTM)


## Features
- Download stocks historical data from [yahoo-finance](https://github.com/ranaroussi/yfinance)
- Calculate n



## Research



## Screenshots
**Screen Flow Diagram**  
![image](https://user-images.githubusercontent.com/73475107/126896910-68ac047a-746f-4fa6-bf96-07da96e86aae.png)

**Log In**  
![image](https://user-images.githubusercontent.com/73475107/126896928-65da6e6e-3b99-4428-83f0-8a0174259b0c.png)

**Sign Up**  
![image](https://user-images.githubusercontent.com/73475107/126896931-041b3428-566c-44d8-beba-a93b1fd56c47.png)

**Forgot Password**  
![image](https://user-images.githubusercontent.com/73475107/126896936-57d8c53d-c727-4147-855a-0a99b3c892a4.png)

**Forgot Password - Email**  
![image](https://user-images.githubusercontent.com/73475107/126896943-770b97aa-3620-472d-adac-73e924ca72f7.png)

**Dashboard**  
![image](https://user-images.githubusercontent.com/73475107/126896953-03ca9dc1-fbe2-4574-a5eb-66fdcb079cbb.png)

**Favorites**  
![image](https://user-images.githubusercontent.com/73475107/126896970-05cac807-96c2-4658-b5fe-98949a5719b9.png)

**All Stocks**  
![image](https://user-images.githubusercontent.com/73475107/126896980-3529f3cb-5ed6-4c9d-a09f-3dadf9b5b980.png)

**Stock View**  
![image](https://user-images.githubusercontent.com/73475107/126896996-59fa92ed-b776-4492-97f4-07af8aa96ab1.png)



## Installation
Clone the repo
   ```sh
   git clone https://github.com/IdoKolet/Stonks.git
   ```
### Server (Python 3.7.8 +)
1. Install requierments libs (run in powershell from Server directory)
   ```sh
   pip install -r requierments.txt
   ```
2. Download TALIB from this [link](https://blog.quantinsti.com/install-ta-lib-python/).
  **Note: If you run the downloader from google colab, there is a block of TALIB installation code.**
  
### Client (npm)
1. Install dependencied (run in powershell from Client directory)
   ```sh
   npm install
   ```
2. Create a new [Firebase project](https://firebase.google.com/)
3. Copy the configuration variables to the .env.local file:
<img src="https://user-images.githubusercontent.com/73475107/126638242-f5e41503-3abf-4ae0-ab48-06baf4e9b3e6.png" width="50%" height="50%">
4. Enable firebase authentication with username and password in the firebase.
5. Enable firebase Real-Time Database and set it rules to:
<img src="https://user-images.githubusercontent.com/73475107/126638565-d9edb173-a9b0-49c1-8e35-767e16ea9a14.png" width="30%" height="30%">

 
## Run
### Server
**Download data and train models (via google colab)**
1. 
2.
**Run the API itself**
3. Run without saving cache (run in powershell from Server directory)
   ```sh
   python -B .\main.py
   ```
   
### Client
1. Run web server (run in powershell from Client directory)
   ```sh
   npm start
   ```
2. Connect to localhost:3000 via the browser.

## Room for Improvement
- Search Bar & Navigatiob Bar.
- HTTPS.
- Make server more secured useing API key unique for each user.
- Imporve features.
- Reasearch for better NN model.
- Collect data and train model by user request instead of pre-set list. (Make it dynamic)

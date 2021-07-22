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

## General Information
The system is built in a client-server architecture, and the communication is based on HTTP protocol.
The Python server is a REST API, built using FastAPI. It supplies data about the stock to the client (Historical data, trend prediction, favorites stocks, etc.)  
The client (as the web server is reffered in this doc), is consist of GUI built using ReactJS and Axios for the communication.
The user data is saved at Firebase cloud.


## Technologies Used
- FastAPI
- Axios
- Firebase (Auth & Real-Time database)
- SQLite
- React JS 
- Neural Networks (LSTM)


## Features



## Research



## Screenshots

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
  Note: If you run the downloader from google colab, there is a block of TALIB installation code.
  
### Client (npm)
1. Install dependencied (run in powershell from Client directory)
   ```sh
   npm install
   ```
2. Create a new [Firebase project](https://firebase.google.com/)
3. Copy the configuration variable to the .env.local file:
<img src="https://user-images.githubusercontent.com/73475107/126638242-f5e41503-3abf-4ae0-ab48-06baf4e9b3e6.png" width="50%" height="50%">
4. Enable firebase authentication with username and password in the firebase.
5. Enable firebase Real-Time Database and set it rules to:
<img src="https://user-images.githubusercontent.com/73475107/126638565-d9edb173-a9b0-49c1-8e35-767e16ea9a14.png" width="30%" height="30%">

 
## Run
### Server
1. 
2.
3. Run without saving cache (run in powershell from Server directory)
   ```sh
   python -B .\main.py
   ```
   
### Client
1. Run web server (run in powershell from Client directory)
   ```sh
   npm start
   ```
2. Connect to localhost:3000 from the browser.

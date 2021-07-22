<p align="center">
  <img src="https://user-images.githubusercontent.com/73475107/124584452-f2651380-de5c-11eb-917f-3682c64d727e.png" width="50%" height="50%">
</p>
# **All the project is uploaded, README file isn't done!**

# Stonks - Machine learning based system for security price trend prediction

The system is built in a client-server architecture.  
The server-side is written in Python with FastAPI.  
The client-side is written in JS with React and Axios.

## Main Self Learning Topics
- Neural Networks (LSTM)
- FastAPI
- Axios
- React
- Firebase 

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

 
  

## Run the Project
### Server Side

### Client side

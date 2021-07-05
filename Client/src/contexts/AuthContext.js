/*
    File: AuthContext.js
    Implemet the connection between the app and firbase.
    Use context instead of passing props down manually at every level - 
    "Global" for a tree of React components.
 */

import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import axios from 'axios'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    // currentUser holds the user credentials that are used when 
    // Changing the user's favorites list. 
    const [currentUser, setCurrentUser] = useState()

    const [loading, setLoading] = useState(true)

    // Sign up using email and password
    function signup(email,password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    // Log in using email and password
    function login(email,password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    // Set the dispalyName in the user profile to username
    function setUserName(username){
        return auth.currentUser.updateProfile({displayName: username})
    }

    // Log out
    function logout() {
        return auth.signOut()
    }

    // Reset password by email - send mail
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }


    // Get the favorites list of the user from firebase realtime database
    // Save the list ot th elical storage. if its empty save []
    function readFavorites() {
        console.log("Start reading")
        // Get refference to the user's section in the firebase
        var ref = db.ref(`users/${auth.currentUser.uid}`);
        
        // Set favorites to an empty lost
        var favorites = [];
        
        // If there is already favorites list
        // of the user in the firebase set favorites to it.
        ref.on('value', (snapshot) => {
            console.log("snapshot" + snapshot.val());
            
            if (snapshot.val() !== null){
                favorites = snapshot.val();
            }
            
            // Save the favorites list to local storage
            localStorage.setItem("favorites", JSON.stringify(favorites));
            
          }, (errorObject) => {
            console.log('The read failed: ' + errorObject.name);
          }); 
          console.log("End reading")
    }

    // Add Stock to favorites list - update at firebase realtime database
    // and add it to the lcoal storage.
    // Send the python server request to update the counter
    async function addToFavorites(symbol){
        // Get refference to the user's section in the firebase
        var ref = db.ref(`users/${auth.currentUser.uid}`);
        
        // Import favoties list from the local storage
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        
        // If it's the first favorite set only one element in the list
        if(favorites === []) {
            favorites = [symbol]
            console.log(favorites);
        }
        // Otherwise, add it to the list 
        else {
            const index = favorites.indexOf(symbol)
            if(index === -1) {
                favorites.push(symbol)
            }
            console.log(favorites);
        }

        // Save the updated list to the firebase
        favorites = favorites.sort()
        localStorage.setItem("favorites", JSON.stringify(favorites));
        ref.set(favorites);

        // Send the python server request to increase the counter
        try {
            await axios
            .patch('http://localhost:8000/follow/' + symbol + '/')
            .then(res => {
                console.log(res);
            });
            setLoading(false);
            
        } catch (e) {
          console.log(e);
        }
    }

    // Remove Stock from favorites list - update at firebase realtime database
    // and remove it from the lcoal storage.
    // Send the python server request to update the counter
    async function removeFromFavorites(symbol){

        // Get refference to the user's section in the firebase
        var ref = db.ref(`users/${auth.currentUser.uid}`);

        // Import favoties list from the local storage
        var favorites = JSON.parse(localStorage.getItem("favorites"));

        // Check if the symbol is already in the list, and remove it
        const index = favorites.indexOf(symbol)
        if(index > -1) {
            favorites.splice(index, 1)
        }
        
        // Update the firebase and the local storage. 
        console.log(favorites)
        localStorage.setItem("favorites", JSON.stringify(favorites));
        ref.set(favorites);
        
        // Send the python server request to decreace the counter
        try {
            await axios
            .patch('http://localhost:8000/follow/' + symbol + '/?inc=false')
            .then(res => {
                console.log(res);
            });
            setLoading(false);
            
        } catch (e) {
          console.log(e);
        }
    }

    // Check if symbol is in favorites list (saved in local storage)
    function inFavList(symbol){

        // Import favoties list from the local storage
        var favorites = localStorage.getItem("favorites");
        favorites = JSON.parse(favorites);

        // Check if the symbol is in the list
        if (favorites !== null && favorites !== []){     
            const index = favorites.indexOf(symbol)
            if(index > -1) {
                return true;
            }
        }
        return false;
    
    }


    // Get the current connected user - runs only once, when mounting the component
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)  
        })
        return unsubscribe
    }, [])
    
    // Context data to share with the other files
    const value = {currentUser, addToFavorites, readFavorites, 
                    removeFromFavorites, inFavList, login, logout, signup, setUserName, resetPassword, }

    // Provide the context data while not loading
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

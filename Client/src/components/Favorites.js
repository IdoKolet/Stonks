/*
    File: Favorites.js
    Favorites page (component).
 */
    import React, { useState, useEffect } from "react"
    import { useAuth } from '../contexts/AuthContext'
    import { useHistory } from "react-router-dom"
    import  Sidebar  from './Sidebar'
    import {NavigationBar} from './Searchbar'
    import { Grid } from '@material-ui/core'
    import StockCard from './StockCard'
    import styled from 'styled-components'
    
    import axios from 'axios'
    import spinLogo from '../icon_spin2.gif'
    import noFav from '../not_found.png'
    
    
    const StocksWrap = styled.div`
        margin-right: 0;
        margin-bottom: 0;
        padding-left: 0em;
        padding-top: 0.4em;
        float:right;
        width: 85%;
        
    `;
    
    export default function Favorites() {
        // Current connected user and logout function
        const { currentUser, logout } = useAuth()
        // Route history
        const history = useHistory()
    
        // Data from server
        const [stocksData, setStocksData] = useState({})
        
        // Loading state
        const [loading, setLoading] = useState(true)
        
        // Favorites list from local storage
        const favorites = JSON.parse(localStorage.getItem("favorites"));
    
        // Handle log out, if success - move to login page, else - display an error.
        async function handleLogout() {
            try {
                await logout()
                history.push("/")
            } catch {
                console.log("Failed to log out")
            }
        }
        
        // Download favorites stock data
        const fetchData = async () => {
            try {
                await axios
                .post('http://localhost:8000/favorites', {
                    // Send favorites list in post
                    fav_list: favorites
                })
                .then(res => {
                    // Set the data to var
                    console.log(res.data["Stocks"])
                    setStocksData(res.data["Stocks"]);
                });
                setLoading(false);
            } catch (e) {
              console.log(e);
            }
        };
        
        // Download the data only once when the page is loaded
        useEffect(() => {
            fetchData()
        }, []);


        // Render stock card
        const renderCard = (key) => {
            return (
                <Grid item xs={3} >
                <div class="stock-card">
                    {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                        <StockCard symbol={key} data={stocksData[key]}/> 
                    )}
                </div>
                </Grid>
            );
        };

        
        
    
        return (
            <>
                <div className="Searchbar"><NavigationBar userName={currentUser.displayName}/></div>
                <div className="Sidebar"><Sidebar onClick={handleLogout}/></div>
                
                <StocksWrap >
                    <div style={{alignItems: 'center', color:'#374052'}}>
                        <h1 align="center">Favorites</h1>
                    </div> 
                    {/* All Favorite stocks cards */}
                    <Grid container xs={12} spacing={1}>
                        {(favorites === null || favorites.length === 0) ? 
                            <div style={{display:"flex", justifyContent:"center", paddingTop:"2rem"}}>
                                <img src={noFav} height="80%" width = "60%" alt="" class="center"/>
                            </div> : 
                            favorites.map(renderCard)}
                    </Grid>
                </StocksWrap>
            </>
        )
    }


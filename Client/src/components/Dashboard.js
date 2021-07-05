/*
    File: Dashboard.js
    Dashboard page (component), main screen.
 */
import React, { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"
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
    padding-left: 1em;
    padding-top: 1em;
    float:right;
    width: 85%;
    
`;

export default function Dashboard() {
    // Current connected user and logout function
    const { currentUser, logout } = useAuth()
    
    // Route 
    const history = useHistory()
    // Loading state
    const [loading, setLoading] = useState(true)

    // Data from server
    const [stocksData, setStocksData] = useState({})
    const [mostViewed, setMostViewed] = useState([])
    const [topGainers, setTopGainers] = useState([])
    const [topLosers, setTopLosers] = useState([])

    // Favorite list from local storage
    const favorites = JSON.parse(localStorage.getItem("favorites"));

    // Handle log out, if success - move to login page, else - log an error.
    async function handleLogout() {
        try {
            await logout()
            history.push("/")
        } catch {
            console.log("Failed to log out")
        }
    }
    
    // Download favorites and table data
    async function fetchData() {
        try {
            await axios
            .post('http://localhost:8000/', {
                fav_list: favorites
            })
            .then(res => {
                // Set the downloaded data into vars
                console.log(res.data["MostViewed"])
                console.log(res.data["TopGainers"])
                setStocksData(res.data["Stocks"]);
                setMostViewed(res.data["MostViewed"])
                setTopGainers(res.data["TopGainers"])
                setTopLosers(res.data["TopLosers"])
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
            <Grid item xs={4} spacing={4}>
            <div class="stock-card">
                {loading ? (<img src={spinLogo} height="50%" width="50%" alt=""/>) : (
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
                <h1 align="center">Dashboard</h1>
            </div> 

            
            <div style={{alignItems: 'center', color:'#d96914'}}>
                <h2>Favorites</h2>
            </div> 
                <Grid container xs={12} direction="row" justify="center" alignItems="stretch">
                    {/* Favorite stocks */}
                    <Grid container xs={9} spacing={2} width={"75%"}>
                        
                        {(favorites === null || favorites.length === 0) ? 
                            <div style={{display:"flex", justifyContent:"center"}}>
                                <img src={noFav} height="55%" width = "70%" alt="" class="center"/>
                            </div> : 
                        favorites.map(renderCard)}
                    </Grid>

                    {/* Most viewed, Top gainers and top losers tables */}
                    <Grid container xs={3} style={{paddingLeft: "30px"}}>
                    <div class="stock-card" style={{alignItems: 'center', color:'#d96914'}}>
                                <h2>Most Viewed</h2>    
                                
                            </div>
                            {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                            <div class="stock-card">
                            <table class="table table-hover">
                                <thead><tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Symbol</th>
                                    <th scope="col">Followers</th>
                                </tr></thead>
                                <tbody>
                                    <tr><th scope="row">1</th>
                                        <td><Link to={"/stock/" + mostViewed[0].symbol} style={{color: "#374052"}}>{mostViewed[0].symbol}</Link></td>
                                        <td>{mostViewed[0].followers}</td>
                                    </tr>
                                    <tr><th scope="row">2</th>
                                        <td><Link to={"/stock/" + mostViewed[1].symbol} style={{color: "#374052"}}>{mostViewed[1].symbol}</Link></td>
                                        <td>{mostViewed[1].followers}</td>
                                    </tr>
                                    <tr><th scope="row">3</th>
                                        <td><Link to={"/stock/" + mostViewed[2].symbol} style={{color: "#374052"}}>{mostViewed[2].symbol}</Link></td>
                                        <td>{mostViewed[2].followers}</td>
                                    </tr>
                                </tbody>
                            </table>
                                
                            </div>
                            )}

                            <div class="stock-card" style={{ alignItems: 'center', color:'#d96914'}}>
                                <h2>Top Gainers</h2>
                            </div>
                            {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                            <div class="stock-card">
                            <table class="table table-hover">
                                <thead><tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Symbol</th>
                                    <th scope="col">Gain (%)</th>
                                </tr></thead>
                                <tbody>
                                    <tr><th scope="row">1</th>
                                        <td><Link to={"/stock/" + topGainers[0].symbol} style={{color: "#374052"}}>{topGainers[0].symbol}</Link></td>
                                        <td>{topGainers[0].gain}</td>
                                    </tr>
                                    <tr><th scope="row">2</th>
                                        <td><Link to={"/stock/" + topGainers[1].symbol} style={{color: "#374052"}}>{topGainers[1].symbol}</Link></td>
                                        <td>{topGainers[1].gain}</td>
                                    </tr>
                                    <tr><th scope="row">3</th>
                                        <td><Link to={"/stock/" + topGainers[2].symbol} style={{color: "#374052"}}>{topGainers[2].symbol}</Link></td>
                                        <td>{topGainers[2].gain}</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            )}

                            <div class="stock-card" style={{ alignItems: 'center', color:'#d96914'}}>
                                <h2>Top Losers</h2>
                                
                            </div>
                            {loading ? (<img src={spinLogo} height="50%" width = "50%" alt="" />) : (
                            <div class="stock-card">
                            <table class="table table-hover">
                                <thead><tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Symbol</th>
                                    <th scope="col">Lose (%)</th>
                                </tr></thead>

                                <tr><th scope="row">1</th>
                                        <td><Link to={"/stock/" + topLosers[0].symbol} style={{color: "#374052"}}>{topLosers[0].symbol}</Link></td>
                                        <td>{topLosers[0].gain}</td>
                                    </tr>
                                    <tr><th scope="row">2</th>
                                        <td><Link to={"/stock/" + topLosers[1].symbol} style={{color: "#374052"}}>{topLosers[1].symbol}</Link></td>
                                        <td>{topLosers[1].gain}</td>
                                    </tr>
                                    <tr><th scope="row">3</th>
                                        <td><Link to={"/stock/" + topLosers[2].symbol} style={{color: "#374052"}}>{topLosers[2].symbol}</Link></td>
                                        <td>{topLosers[2].gain}</td>
                                </tr>

                                
                            </table>
                                
                            </div>
                            )}

                    </Grid>
                </Grid>

            </StocksWrap>
        </>
    )
}

/*
    File: AllStocks.js
    All stocks page (component).
 */
    import React, { useState, useEffect } from "react"
    import { useAuth } from '../contexts/AuthContext'
    import { useHistory } from "react-router-dom"
    import  Sidebar  from './Sidebar'
    import {NavigationBar} from './Searchbar'
    import StockCard from './StockCard'
    import { Container, Row, Col } from 'reactstrap';
    import styled from 'styled-components'
    import axios from 'axios'
    import spinLogo from '../icon_spin2.gif'

    import * as FcIcons from 'react-icons/fc'
    import * as FaIcons from 'react-icons/fa'
    import * as GiIcons from 'react-icons/gi'
    import { IconContext } from 'react-icons/lib'
    
    
    const StocksWrap = styled.div`
        margin-right: 0;
        margin-bottom: 0;
        float:right;
        width: 85%;
        
    `;
    
    export default function AllStocks() {
        // Current connected user and logout function
        const { currentUser, logout } = useAuth()
        // Route history
        const history = useHistory()
        const [loading, setLoading] = useState(true)

        // Data from server 
        const [tech, setTech] = useState([])
        const [med, setMed] = useState([])
        const [crypt, setCrypt] = useState([])
    
        // Handle log out, if success - move to login page, else - log an error.
        async function handleLogout() {
            try {
                 await logout()
                 history.push("/")
            } catch {
                console.log("Failed to log out")
            }
        }
        
        // Download 3 lists of stocks data by categories
        const fetchData = async () => {
            try {
                await axios
                .get('http://localhost:8000/all')
                .then(res => {
                  setTech(res.data["Tech"])
                  setMed(res.data["Med"])
                  setCrypt(res.data["Crypt"])
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
        
        
        // Render technology category card 
        const renderTechCard = (key) => {
            console.log(key)
            return (
                <Col sm="3" md="3" lg="3">
                <div class="stock-card">
                    {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                        <StockCard symbol={key} data={tech[key]}/> 
                    )}
                </div>
                </Col>
            );
        };

        // Render medical category card 
        const renderMedCard = (key) => {
            console.log(key)
            return (
                <Col sm="3" md="3" lg="3">
                <div class="stock-card">
                    {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                        <StockCard symbol={key} data={med[key]}/> 
                    )}
                </div>
                </Col>
            );
        };

        // Render crypto category card 
        const renderCryptCard = (key) => {
            console.log(key)
            return (
                <Col sm="3" md="3" lg="3">
                <div class="stock-card">
                    {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                        <StockCard symbol={key} data={crypt[key]}/> 
                    )}
                </div>
                </Col>
            );
        };

        return (
            <>
                <div className="Searchbar"><NavigationBar userName={currentUser.displayName}/></div>
                <div className="Sidebar"><Sidebar onClick={handleLogout}/></div>
                
                {/*<Sidebar />*/}
                
                <StocksWrap > 
                    <div style={{alignItems: 'center', color:'#374052'}}>
                        <h1 align="center">All Stocks</h1>
                    </div> 
                    
                    <Container fluid={true} >
                        <div id="tech">
                        <Row >
                            <Col sm="9" md="9" lg="9">
                                <div class="stock-card" style={{ color:'#0ac6ff'}}>
                                    <h2>
                                    <IconContext.Provider value={{color:'#0ac6ff'}}><GiIcons.GiComputing size={'2rem'}/></IconContext.Provider>
                                    &nbsp;Technology
                                    </h2>
                                </div>
                            </Col>
                            <Col sm="3" md="3" lg="3">
                                
                            </Col>
                        </Row>
                        {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                            <Row>
                                {Object.keys(tech).map(renderTechCard)}
                            </Row>
                        )}
                        </div>
                        
                        <div id="med">
                        <Row>
                            <Col sm="9" md="9" lg="9">
                                <div class="stock-card" style={{ color:'#e91e65'}}>
                                    <h2>
                                    <FcIcons.FcBiotech />
                                    &nbsp;Medical
                                    </h2>
                                </div>
                            </Col>
                            <Col sm="3" md="3" lg="3">
                                
                            </Col>
                        </Row>

                        {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                            <Row>
                                {Object.keys(med).map(renderMedCard)}
                            </Row>
                        )}
                        
                        </div>

                        <div id="cryp">
                        <Row >
                            <Col sm="9" md="9" lg="9">
                                <div class="stock-card" style={{ color:'#ffd700'}}>
                                    <h2>
                                    <IconContext.Provider value={{color:'#ffd700'}}>
                                        <FaIcons.FaBitcoin />
                                    </IconContext.Provider>
                                    &nbsp;Crypto Currency
                                    </h2>
                                </div>
                            </Col>
                            <Col sm="3" md="3" lg="3">
                                
                            </Col>
                        </Row>
                        {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                            <Row>
                                {Object.keys(crypt).map(renderCryptCard)}
                            </Row>
                        )}
                        </div>
                        
    
                    </Container>
                </StocksWrap>   
            </>
        )
    }
    
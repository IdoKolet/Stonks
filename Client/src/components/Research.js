/*
    File: Research.js
    Research page (component).
 */
    import React from "react"
    import { useAuth } from '../contexts/AuthContext'
    import { useHistory } from "react-router-dom"
    import  Sidebar  from './Sidebar'
    import {NavigationBar} from './Searchbar'
    import styled from 'styled-components'
    import system from '../system_structure.png'
    import model from '../model_structure.png'
    
    
    const StocksWrap = styled.div`
        margin-right: 0;
        margin-bottom: 0;
        padding-left: 0em;
        padding-top: 0.4em;
        float:right;
        width: 85%;
        
    `;
    
    export default function Research() {
        // Current connected user and logout function
        const { currentUser, logout } = useAuth()
        // Route history
        const history = useHistory()
    
    
        // Handle log out, if success - move to login page, else - display an error.
        async function handleLogout() {
            try {
                 await logout()
                 history.push("/")
            } catch {
                console.log("Failed to log out")
            }
        }
        

        return (
            <>
                <div className="Searchbar"><NavigationBar userName={currentUser.displayName}/></div>
                <div className="Sidebar"><Sidebar onClick={handleLogout}/></div>

                
                <StocksWrap >
                    <div style={{alignItems: 'center', color:'#374052'}}>
                        <h1 align="center">Research</h1>
                    </div> 
                    <h2 style={{paddingLeft:"2rem"}}>System Structure</h2>
                    <div style={{display:"flex", justifyContent:"center"}}>
                    <img src={system} height="100%" width = "95%" alt="" class="center" style={{border:'3px solid #374052'}}/>
                    </div>

                    <h2 style={{paddingLeft:"2rem", paddingTop:"1rem"}}>Machine Learning</h2>
                    <div style={{display:"flex", justifyContent:"center", paddingBottom:"1rem"}}>
                    <img src={model} height="100%" width = "95%" alt="" class="center" style={{border:'3px solid #374052'}}/>
                    </div>
                </StocksWrap>
            </>
        )
    }


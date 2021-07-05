/*  File name: StockView.js
*   Extended stock data page (component)
*/
import React, { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'
import { useHistory, useParams } from "react-router-dom"
import  Sidebar  from './Sidebar'
import {NavigationBar} from './Searchbar'
import { Container, Row, Col} from 'reactstrap'
import styled from 'styled-components'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { Card } from "react-bootstrap"
import * as GrIcons from 'react-icons/gr'
import * as HiIcons from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'

import * as GiIcons from 'react-icons/gi'
import * as FcIcons from 'react-icons/fc'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'

import axios from 'axios'
import spinLogo from '../icon_spin2.gif'


const StocksWrap = styled.div`
    padding-left: 1vw;
    padding-top: 5vh;
    float:right;
    width: 85%;
    
`;

const StyledTooltip = styled.div`
    border-radius: 0.25rem;
    font-size: 1rem;
    padding: 0.5rem;
    box-shadow: 15px 30px 40px 5px rgba(0, 0, 0, 0.5);
    text-align: center;
`;


const RangeButton = styled.button`
    width: max-content;
    padding-right: 1.5vw;
    padding-left: 1.5vw;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin: 0.5vw;
    background: #374052;
    color: white;
    border-radius: 4px;
    border: 0px;

    &:hover:enabled {
        background: #505c76;
        color: #e1e0fc;
        border-left: 4px solid #ff0000
        cursor: pointer;
    }

    ${({ active }) =>
        active  &&`
        background: #d5a423;
    `}

`;


// Tool tip for the graph
function CustomTooltip({active, payload, label}){
    if (active) {
        return (
            <StyledTooltip>
                <p><b>${payload[0].value.toFixed(2)} USD</b>  {format(parseISO(label), "eee, d MMM yyyy")}</p>              
            </StyledTooltip>
        );
    }
    return null;
}

// Add parameters of symbol and data
export default function StockView(props) {
    const { addToFavorites, removeFromFavorites, inFavList } = useAuth()
    const { symbol } = useParams()
    const [displayDays, setDiaplayDays] = useState(5)
    const [graphData, setGraphData] = useState([])
    // Current connected user and logout function
    const { currentUser, logout } = useAuth()
    // Route history
    const history = useHistory()

   
    const [loading, setLoading] = useState(true);
    const [classification, setClassification] = useState([]);
    // Technical Analysis
    const [ta, setTa] = useState({});
    const [color, setColor] = useState("green");

    const [company, setCompany] = useState("");
    const [category, setCategory] = useState("");

    const [starClicked, setStarClicked] =  useState(inFavList(symbol));


    // Handle log out, if success - move to login page, else - display an error.
    async function handleLogout() {
        try {
            await logout()
            history.push("/")
        } catch {
            console.log("Failed to log out")
        }
    } 

    const fetchData = async () => {
        try {
            await axios
            .get('http://localhost:8000/stock/' + symbol + '/')
            .then(res => {
              setGraphData(res.data["Prices"]);
              setClassification(res.data["Classification"]);
              setTa(res.data["TechnicalIndicators"])
              setCompany(res.data["Name"]);
              setCategory(res.data["Category"]);
              var initData = res.data["Prices"].slice(-5);
              setColor(initData[0]["price"] < initData[4]["price"] ? "green" : "red");
              
            });
            setLoading(false);
            
        } catch (e) {
          console.log(e);
        }
    };
    
    useEffect(() => {
        fetchData()        
    }, []);

    function changeGraphContentSize (size) {
        console.log(typeof(graphData[0].date))
        setDiaplayDays(size)
        setColor(graphData[size === 0 ? 0 : (graphData.length-size)].price < graphData[graphData.length-1].price ? "green" : "red")
    };

    // Set the price borders of the graph by finding the min and max
    // price of the current resolution
    function getMinMax(arr) {
        let min = arr[0]["price"], max = arr[0]["price"];
        
        // For all values in resolution
        for (let i = 1, len=arr.length; i < len; i++) {
            // Check if current value is min or max
            let v = arr[i]["price"];
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
        }

        // Set the min for little more less than what is really is.
        min = Math.floor(min - max * 0.01)
        
        // But more than 0, set the max automaticlly.
        return [Math.max(0, min), "auto"];
    }
    
    

    return (
        <>
            <div className="Searchbar"><NavigationBar userName={currentUser.displayName}/></div>
            <div className="Sidebar"><Sidebar onClick={handleLogout}/></div>

            <StocksWrap>
                <Container fluid={true} >

                    <Row>
                        <Col sm="9" md="9" lg="9">
                            <div class="stock-card">
                               
                            {loading ? (<img src={spinLogo} height="50%" width = "50%" alt=""/>) : (
                                <>
                                <div>
                                    <h2>
                                    {category === "Tech" && <IconContext.Provider value={{color:'#0ac6ff'}}><GiIcons.GiComputing size={'2rem'}/></IconContext.Provider>}
                                    {category === "Med" && <FcIcons.FcBiotech size={'2rem'}/>}
                                    {category === "Crypto" && <IconContext.Provider value={{color:'#ffd700'}}><FaIcons.FaBitcoin /></IconContext.Provider>}
                                    &nbsp;{company} - {symbol}
                                    </h2>
                                    <h3>Last Close: {graphData[graphData.length - 1]["price"]} USD</h3> 
                                    <h4>
                                        Change in Price: &nbsp;
                                        {(graphData[graphData.length - 1]["price"] - graphData[graphData.length - 2]["price"]).toFixed(2)}&nbsp;
                                        ({(((graphData[graphData.length - 1]["price"] / graphData[graphData.length - 2]["price"]) - 1) * 100).toFixed(2)}%)
                                    </h4>
                                    <div style={{cursor: "pointer", position: "absolute", right: "1.5vw", top: "2vh"}}>
                                        <IconContext.Provider value={{color:'#e8ba2e'}}>
                                            {starClicked 
                                                ? <AiIcons.AiFillStar size={'3rem'} onClick={() => {setStarClicked(false); removeFromFavorites(symbol) }}/> 
                                                :  <AiIcons.AiOutlineStar size={'3rem'} onClick={() => {setStarClicked(true); addToFavorites(symbol) }}/>    
                                            }                         
                                        </IconContext.Provider> 
                                    </div>
                                </div>
                            
                            {/* Historical Data Graph Card */}
                            <Card text="green" /*style={{color: 'green' height: '25vh', width: '20vw'}}*/>
                                {/* Time Resolotion Buttons */}
                                <div style={{width: "100%", paddingTop: "3vh", display:"flex", justifyContent: "center", alignItems: "center"}}>
                                    Choose date range:
                                    <RangeButton onClick={() => changeGraphContentSize(5)} 
                                                active={displayDays === 5} disabled={displayDays === 5}>5 days</RangeButton>
                                    <RangeButton onClick={() => changeGraphContentSize(30)} 
                                                active={displayDays === 30} disabled={displayDays === 30}>1 month</RangeButton>
                                    <RangeButton onClick={() => changeGraphContentSize(180)} 
                                                active={displayDays === 180} disabled={displayDays === 180}>6 months</RangeButton>
                                    <RangeButton onClick={() => changeGraphContentSize(360)} 
                                                active={displayDays === 360} disabled={displayDays === 360}>1 year</RangeButton>
                                    <RangeButton onClick={() => changeGraphContentSize(0)} 
                                                active={displayDays === 0} disabled={displayDays === 0}>max</RangeButton>
                                </div>

                                <Card.Body>
                                        <ResponsiveContainer width="100%" height={300}>
                                            {/* The Graph */}
                                            <AreaChart data={displayDays === 0 ? graphData : graphData.slice(-displayDays)}>
                                                {/* Set the color */}
                                                <defs>
                                                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                                                        <stop offset="75%" stopColor={color} stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>

                                                <Area dataKey="price" stroke={color} fill="url(#color)"/>

                                                <XAxis 
                                                    dataKey="date"
                                                    style={{fontSize: '1rem'}}
                                                    tickLine={false}
                                                    tickCount={6}
                                                    // Foramt date 
                                                    tickFormatter={str => {
                                                        const date = parseISO(str/*.substr(0, 10)*/);
                                                        return format(date, "MMM, d");
                                                }}/>

                                                <YAxis 
                                                    dataKey="price" 
                                                    axisLine={false}
                                                    // Set Yaxis boundries
                                                    domain={getMinMax(graphData.slice(-displayDays))} 
                                                    tickLine={false} 
                                                    tickCount={6}
                                                    // Format price 
                                                    tickFormatter={number => `$${number}`} 
                                                />

                                                {/* Set tooltip */}
                                                <Tooltip content={<CustomTooltip />} />

                                                {/* Set grid */}
                                                <CartesianGrid opacity={0.5} vertical={false}/>
                                                
                                            </AreaChart>

                                        </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                            </>)}
                            </div>
                        </Col>


                        <Col sm="3" md="3" lg="3">
                            
                            <div class="height: 100%">
                                
                                
                                <Card  style={{height: '100%', /*fontSize: "1.2rem",*/ display: 'flex', verticalAlign: 'bottom'}}>
                                    <Card.Body>
                                        <Card.Title>Model Predictions</Card.Title>
                                        
                                            <Card.Text>
                                                {/* <b>Regression:</b><br/>
                                                <IconContext.Provider value={{color:'orange'}} >
                                                    <HiIcons.HiCurrencyDollar size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                {regression}<br/><br/> */}
    
                                                <b>Classification:</b><br/>
                                                <IconContext.Provider value={{color:'green'}} >
                                                    <HiIcons.HiArrowCircleUp size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Uptrend: {classification.new ? classification.new[2] : "---"}%<br/>

                                                <IconContext.Provider value={{color:'#374052'}} >
                                                    <GrIcons.GrStatusGoodSmall size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Static: {classification.new ? classification.new[1] : "---"}% <br/>

                                                <IconContext.Provider value={{color:'red'}} >
                                                    <HiIcons.HiArrowCircleDown size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Downtrend: {classification.new ? classification.new[0] : "---"}%<br/>
                                                
                                            </Card.Text>

                                            <Card.Text>
                                                {/* <b>Regression:</b><br/>
                                                <IconContext.Provider value={{color:'orange'}} >
                                                    <HiIcons.HiCurrencyDollar size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                {regression}<br/><br/> */}

                                                <b>Previous Classification:</b><br/>
                                                <IconContext.Provider value={{color:'green'}} >
                                                    <HiIcons.HiArrowCircleUp size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Uptrend: {classification.prev ? classification.prev[2] : "---"}%<br/>

                                                <IconContext.Provider value={{color:'#374052'}} >
                                                    <GrIcons.GrStatusGoodSmall size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Static: {classification.prev ? classification.prev[1] : "---"}% <br/>

                                                <IconContext.Provider value={{color:'red'}} >
                                                    <HiIcons.HiArrowCircleDown size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                                </IconContext.Provider>
                                                Downtrend: {classification.prev ? classification.prev[0] : "---"}%<br/>
                                                
                                            </Card.Text>

                                            <Card.Title>Technical Indicators</Card.Title>

                                            <Card.Text>
                                                RSI(14): {ta.RSI ? ta.RSI : "---"}<br/>
                                                STOCH(9,6): {ta.STOCH ? ta.STOCH : "---"}<br/>
                                                STOCHRSI(14): {ta.STOCHRSI ? ta.STOCHRSI : "---"}<br/>
                                                MACD(12,26): {ta.MACD ? ta.MACD : "---"}<br/>
                                                ADX(14): {ta.ADX ? ta.ADX : "---"}<br/>
                                                Williams %R: {ta.WILLIAMS_R ? ta.WILLIAMS_R : "---"}<br/>
                                                CCI(14): {ta.CCI ? ta.CCI : "---"}<br/>
                                                ATR(14): {ta.ATR ? ta.ATR : "---"}<br/>

                                                
                                            </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                    

                </Container>
            </StocksWrap>


           
            

 
        </>
    )
}
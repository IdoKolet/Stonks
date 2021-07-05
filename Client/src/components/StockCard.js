/*  File name: StockView.js
*   Extended stock data page (component)
*/
import React from 'react'

import { Card } from "react-bootstrap"
import { Link } from 'react-router-dom'

import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { format, parseISO } from 'date-fns'
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

import * as AiIcons from 'react-icons/ai'
import * as HiIcons from 'react-icons/hi'
import { IconContext } from 'react-icons/lib'


export default function StockCard(props) {
    // Fire base function from AuthContext
    const { addToFavorites, removeFromFavorites, inFavList } = useAuth()
    
    const data = props.data;
    console.log(props.symbol);

    // Change in price and matched color
    const weekChange = [(data[4].price - data[0].price).toFixed(2), (((data[4].price / data[0].price) - 1) * 100).toFixed(2)];
    const dayChange = [(data[4].price - data[3].price).toFixed(2), (((data[4].price / data[3].price) - 1) * 100).toFixed(2)];
    
    const weekColor = weekChange[0] > 0 ? 'green' : 'red';
    const dayColor = dayChange[0] > 0 ? 'green' : 'red';

    // Star state
    const [starClicked, setStarClicked] =  useState(inFavList(props.symbol));
    
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

        // Round the values
        min = Math.floor(min)
        max = Math.ceil(max)
        
        return [min, max];
    }


    return (
        <>
            
            <Card text="green" >
                <Card.Body>
                    <div>
                        {/* Title and link to tha page */}
                        <Card.Title>
                        <Link to={"/stock/" + props.symbol} style={{color: "#374052"}}>
                            {props.symbol}
                        </Link>
                        </Card.Title>
                        
                        {/* Star button */}
                        <div style={{cursor: "pointer", position: "absolute", right: "1.5vw", top: "2vh"}}>   
                            <IconContext.Provider value={{color:'#e8ba2e'}}>
                                {starClicked 
                                    ? <AiIcons.AiFillStar size={'1.8rem'} onClick={() => {setStarClicked(false); removeFromFavorites(props.symbol) }}/> 
                                    :  <AiIcons.AiOutlineStar size={'1.8rem'} onClick={() => {setStarClicked(true); addToFavorites(props.symbol) }}/>    
                                }
                            </IconContext.Provider>

                              
                            </div>
                        
                    </div>
                        <div style={{marginLeft: '-3.5em'}}>
                        
                        {/* Graph */}
                        <ResponsiveContainer width="100%" height={100}>
                            
                            <AreaChart data={props.data}>
                                <defs>
                                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={data[0].price < data[4].price ? 'green' : 'red'} stopOpacity={0.6} />
                                        <stop offset="80%" stopColor={data[0].price < data[4].price ? 'green' : 'red'} stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area dataKey="price" stroke={data[0].price < data[4].price ? 'green' : 'red'} 
                                fill={data[0].price < data[4].price ? '#a7d3a7' : '#fea9a9'} 
                                /*fill="url(#color)"*//>
                                <XAxis dataKey="date"
                                tickFormatter={str => {
                                    const date = parseISO(str);
                                    return format(date, "EEEEEE");}} tick={{fontSize: 12}}/>

                                <YAxis 
                                    dataKey="price" 
                                    axisLine={false}
                                    
                                    tick={false}
                                    domain={getMinMax((props.data) ? (props.data) : data)} 
                                tickLine={false}/>
                                    {/*<Line type='monotone' dataKey='price' /*stroke={this.props.stroke}*//* strokeWidth={2} dot={false}/>*/}
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>

                        {/* Change in stock price */}
                        <Card.Text>
                        <div  style={{color: "#374052"}}>
                            {data[4].price} USD <br/>
                        </div>
                        
                        <div style={{color: (dayColor)}}>
                            {dayChange[0] > 0 
                                ? <HiIcons.HiArrowCircleUp size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                                : <HiIcons.HiArrowCircleDown size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                            } 
                            Daily: {dayChange[0]} ({dayChange[1]})% <br/>
                        </div>
                        
                        <div style={{color: (weekColor)}}>
                        {weekChange[0] > 0 
                            ? <HiIcons.HiArrowCircleUp size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                            : <HiIcons.HiArrowCircleDown size={'1.2rem'} style={{marginRight: '0.5rem'}}/>
                        } 
                        Weekly: {weekChange[0]} ({weekChange[1]})%
                        </div>
                        </Card.Text>
                </Card.Body>
            </Card>
            
        
        </>
    );
}

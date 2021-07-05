/*  File name: SubMenu.js
*   Auxillery to sidebar
*/
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

// CSS styles
const SidebarLink = styled(Link)`
    display: flex;
    color: #e1e0fc;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    list-style: none;
    height: 60px;
    text-decoration: none;
    font-size: 1.1em;

    &:hover {
        background: #505c76;
        color: #e1e0fc;
        border-left: 4px solid #ff0000
        cursor: pointer;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 1em;
`;

const DropdownLink =  styled(Link)`
    background: #374052;
    height: 60px;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #f5f5f5;
    font-size: 1.1em;  

    &:hover {
        background: #505c76;
        color: #e1e0fc;
        border-left: 4px solid #632ce4
        cursor: pointer;
    }
`;


const SubMenu = ({ item, index }) => {
    return (
        <>
            {/* Main titles */}
            <SidebarLink to={item.path}>
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
            </SidebarLink>

            {/* Sub Titels */}
            {item.subNav && item.subNav.map(( item, index ) => {
                return (
                    <DropdownLink to={item.path} key={index}>
                        {item.icon}
                        <SidebarLabel>{item.title}</SidebarLabel>
                    </DropdownLink>
                )})
            }
            
        </>

    );
};

export default SubMenu



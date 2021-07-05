/*
    File: Sidebar.js
    menu component
 */
import React from 'react'
import { SidebarData } from './SidebarData'
import styled from 'styled-components'
import SubMenu from './SubMenu';
import logo from '../logo.png'
import * as ImIcons from 'react-icons/im'

// CSS styles
const SidebarNav = styled.nav`
    background: #374052; 
    width: 15vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
`;

const SidebarWrap = styled.div`
    width: 100%;
`;

const Image = styled.img`
    display: flex;
    padding: 20px;
    width: 100%;
    float: left;
    margin-right: 10px;
`;

// Generate Sidebar with data from SidebarDara file
const Sidebar = (props) => {
    return (
        <>
            <SidebarNav>
                
                <SidebarWrap>
                    <Image src={logo} />
                    {SidebarData.map((item, index) => {
                        return <SubMenu item={item} key={index} />;
                    })}
                    
                    {/* Exit button */}
                    <button class="btn" onClick={props.onClick} style={{height: "2.5em", margin: "25%", background: "#cc0000", color: "#e1e0fc"}}>
                        <ImIcons.ImExit /> Log Out
                    </button> 
                </SidebarWrap>
            </SidebarNav>
        </>
    )
}

export default Sidebar;


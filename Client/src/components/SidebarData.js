/*
    File: SidebarData.js
    Data for the Sidebar component
 */
import React from 'react'
import DashboardIcon from '@material-ui/icons/Dashboard'
import HomeIcon from '@material-ui/icons/Home'

import * as GiIcons from 'react-icons/gi'
import * as AiIcons from 'react-icons/ai'
import * as FcIcons from 'react-icons/fc'
import * as RiIcons from 'react-icons/ri'
import * as FaIcons from 'react-icons/fa'

import { IconContext } from 'react-icons/lib'

// Menu data - title, path and icon
export const SidebarData = [
    {
        title: "Dashboard",
        path: "/",
        icon:   <IconContext.Provider value={{color:'#d96914'}}>
                    <RiIcons.RiDashboardFill />
                </IconContext.Provider>
    },

    {
        title: "Favorites",
        path: "/favorites",
        icon:   <IconContext.Provider value={{color:'#e8ba2e'}}>
                    <AiIcons.AiFillStar />
                </IconContext.Provider>
    },

    {
        title: "Stocks",
        path: "/all",
        icon:   <IconContext.Provider value={{color:'#00ff00'}}>
                    <AiIcons.AiOutlineStock />
                </IconContext.Provider>,

        // subNav: [
        //     {
        //         title: "Technology",
        //         path: "/all#tech",
        //         icon:   <IconContext.Provider value={{color:'#0ac6ff'}}>
        //                     <GiIcons.GiComputing />
        //                 </IconContext.Provider>
        //     },
        
        //     {
        //         title: "Medical",
        //         path: "/all#med",
        //         icon: <FcIcons.FcBiotech />
        //     },

        //     {
        //         title: "Crypto",
        //         path: "/all#cryp",
        //         icon:   <IconContext.Provider value={{color:'#ffd700'}}>
        //                     <FaIcons.FaBitcoin />
        //                 </IconContext.Provider>
        //     },
        // ]
    },

    {
        title: "Reaserch",
        path: "/research",
        icon: <GiIcons.GiArchiveResearch />
    }
];

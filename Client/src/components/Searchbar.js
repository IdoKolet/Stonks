/*
    File: Searchbar.js
    searchbar component
 */
import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';

import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
 } from 'reactstrap';

// CSS styles
const Styles = styled.div`
    .navbar {
       background-color: #374052; 
       
    }
    
    a, .navbar-nav, .navbar-light .nav-link {
        color: #9FFFCB;
        height: 8vh;
        &:hover { color: white; }
    }
    
    .navbar-brand {
        font-size: 1.3em;
        color: #9FFFCB;
        &:hover { color: white; }
    }
    
    .form-center {
        position: absolute !important;
        left: 25%;
        right: 25%;
    }


`;

export const NavigationBar = (props) => (

  <Styles>
    <Navbar expand="lg">
      {/* Search line */}
      
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      {/* <Form className="form-center">
        <InputGroup className="w-50">
        
          <Input  placeholder="Stock Symbol..."/>
          <InputGroupAddon addonType="prepend" >
            <Button  class="btn" style={{background: "#d5a423", color: "#374052"}}>Search</Button>
          </InputGroupAddon>
        </InputGroup>
         
      </Form> */}
      {/* Diaplay user name */}
      <Navbar.Collapse id="basic-navbar-nav">
        
        <Nav className="ml-auto">
            <div style={{fontSize: "1.8em", height: "2.5em", marginTop: "0.25em", color: "#e1e0fc"}}>Welcome {(props.userName)}!</div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles>
)
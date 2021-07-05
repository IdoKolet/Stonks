/*
    File: Login.js
    Log in form page (component)
 */
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
//import './Login.css'
import styled from 'styled-components'
import logo from '../logo.png'
import * as BsIcons from 'react-icons/bs'
import * as HiIcons from 'react-icons/hi'




const Image = styled.img`
    display: flex;
    width: 60%;
    float: left;
    margin-top: 25%;
    margin-bottom: 10%;
`;

export default function Login() {
    // Email and password from the form.
    const emailRef = useRef()
    const passwordRef = useRef()
    // Login authontication function
    const { login, readFavorites } = useAuth()
    // Error and loading states (hooks)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [passwordShown, setPasswordShown] = useState(false);
    // Route history
    const history = useHistory()

    // Handle log in form submit event
    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        // Log in to firebase, get favorite list and move to dashboard
        login(emailRef.current.value, passwordRef.current.value)
        .then((userCredential) => {
            readFavorites()
            history.push("/")
        })
        .catch((error) => {
            // Set error
            console.log(error);
            console.log(error.code);
            console.log(typeof(error.code));
            switch(error.code){
                case "auth/user-not-found":
                    setError("Email or Password is Incorrect");
                    break;
                case "auth/wrong-password":
                    setError("Email or Password is Incorrect");
                    break;
                default:
                    //setError("Error - " + ((error.code).slice(5)).replaceAll("-", " "));
                    setError("Error - " + error.code);
            }

                
            });
        setLoading(false)
    }

    // Eye button functionallity
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    return (
        <>
        
            <div style={{background: '#f6f5f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh'}}>
            <Card style={{ width: '65%', height: '70%', borderRadius: '20px', border: '1px', boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)',  }}>
                
                <div style={{ backgroundColor: "#374052", height: '100%', borderRadius: '20px'}}>
                <Card.Body style={{backgroundColor: "#FFFFFF", width: "55%", height: 'inherit', float: 'left', borderRadius: '20px 0 0 20px'}}>
                    
                    <h1 className="text-center mb-4" style={{fontWeight: 'bold', fontSize: '3.5rem', marginTop: '2vh'}}>Log In</h1>
                    

                    { /* Call handle submit func when this form submitted, pass args through refs */}
                    <Form onSubmit={handleSubmit} >

                    { /* Display error (if there is) */}    
                    {error ? <Alert variant="danger">{error}</Alert> : <Alert variant="light" />}
                        {/* Email field */}
                        <Form.Group id="email">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <HiIcons.HiOutlineMail size={'1.2rem'} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                            </InputGroup>
                            
                        </Form.Group>

                        {/* Password field */}
                        <Form.Group id="password">

                            {/*<Form.Label>Password</Form.Label>*/}
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <BsIcons.BsShieldLockFill size={'1.2rem'} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control id="rabbi" type={passwordShown ? "text" : "password"} placeholder="Password" ref={passwordRef} required />
                                
                                {/* Eye button */}
                                <button onClick={togglePasswordVisiblity} type="button" style={{border: '0', background: '#FFFFFF'}}>
                                    {passwordShown ? <BsIcons.BsEyeFill size={'1.2rem'} /> : <BsIcons.BsEyeSlashFill size={'1.2rem'} /> }
                                </button>
                            </InputGroup>
                        </Form.Group>

                        <div className="w-100 text-center mt-4 mb-4">
                            <Link to="/forgot-password">Forgot your password?</Link>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                        {/* Use loading to suspend the button action until the login try completed. */}
                        <Button disabled={loading} className="w-50" type="submit" 
                                style={{background: '#374052', border: '0', borderRadius: '5px', minWidth: '8vw', minHeight: '7vh', fontSize: '1.5rem'}}>
                            Log In</Button>
                        </div>
                    </Form>
                    
                    
                </Card.Body>
                <div style={{ display: 'flex', /*justifyContent: 'center',*/ alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                    <Image src={logo} />
                    <div style={{color:'#FFFFFF', textAlign: 'center', fontSize: '1.3rem'}}>New user to Stonks? <br/>Need an account?</div>
                    <Link to={'/signup'}>
                        <Button className="w-100" style={{background: '#d5a423', border: '0', borderRadius: '5px', minWidth: '8vw', minHeight: '7vh', fontSize: '1.4rem', marginTop: '15%', padding: '0.5em'}}>
                            Create an Account</Button>
                    </Link>
                </div>
                
                </div>
            </Card>

            </div>
            
        </>

    )
}


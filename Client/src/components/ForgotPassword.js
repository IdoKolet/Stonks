/*
    File: ForgotPassword.js
    Forgot password form page (component)
 */
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

import styled from 'styled-components'
import logo from '../logo.png'
import * as HiIcons from 'react-icons/hi'

const Image = styled.img`
    display: flex;
    width: 60%;
    float: left;
    margin-top: 25%;
    margin-bottom: 10%;
`;


export default function ForgotPassword() {
    // Email from the form.
    const emailRef = useRef()
    // Reset password function
    const { resetPassword } = useAuth()
    // Error, loading ans message states (hooks)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Handle forgot password form submit event
    async function handleSubmit(e) {
        e.preventDefault()

        // Try to reset password, if success - send mail to user, else - display an error.
        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check yout inbox for further instructions")
        } catch {
            setError("Failed to Reset Password")
        }
        setLoading(false)
    }

    return (
        <>
            
            <div style={{background: '#f6f5f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh'}}>
            <Card style={{ width: '65%', height: '75%', borderRadius: '20px', border: '1px', boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)',  }}>
                
                <div style={{ backgroundColor: "#374052", height: '100%', borderRadius: '20px'}}>
                <Card.Body style={{backgroundColor: "#FFFFFF", width: "55%", height: 'inherit', float: 'right', borderRadius: '0 20px 20px 0'}}>
                    
                    <h1 className="text-center mb-4" style={{fontWeight: 'bold', fontSize: '3.2rem', marginTop: '10vh'}}>Reset Password</h1>
                    

                    { /* Call handle submit func when this form submitted, pass args through refs */}
                    <Form onSubmit={handleSubmit} >

                    { /* Display error or othe message */}
                    {error ? <Alert variant="danger">{error}</Alert> : <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Fill in your email address and check your inbox for reset link</p>}
                    {message ? <Alert variant="success">{message}</Alert> : <Alert variant="light" />}

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

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '7%'}}>
                        {/* Use loading to suspend the button action until the login try completed. */}
                        <Button disabled={loading} className="w-50" type="submit" 
                                style={{background: '#374052', border: '0', borderRadius: '5px', minWidth: '8vw', minHeight: '7vh', fontSize: '1.5rem'}}>
                            Reset Password</Button>
                        </div>
                    </Form>
                    
                    
                </Card.Body>
                <div style={{ display: 'flex',  alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                    <Image src={logo} />
                    <div style={{color:'#FFFFFF', textAlign: 'center', fontSize: '1.3rem'}}>Remember your password?</div>
                        <Link to={'/login'}>
                            <Button className="w-100" style={{background: '#d5a423', border: '0', borderRadius: '5px', minWidth: '8vw', minHeight: '7vh', fontSize: '1.4rem', marginTop: '15%', padding: '0.5em'}}>
                                Log In</Button>
                        </Link>
                    </div>
                
                </div>
            </Card>

            </div>
        </>

    )
}
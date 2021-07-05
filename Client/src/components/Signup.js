/*
    File: Signup.js
    Sign up form page (component)
 */
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import styled from 'styled-components'
import logo from '../logo.png'
import * as BsIcons from 'react-icons/bs'
import * as HiIcons from 'react-icons/hi'

// CSS style
const Image = styled.img`
    display: flex;
    width: 60%;
    float: left;
    margin-top: 25%;
    margin-bottom: 10%;
`;

export default function Signup() {
    // Email, password and password confirm from the form.
    const firstRef = useRef()
    const lastRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    // Signup authontication function
    const { signup, setUserName } = useAuth()
    // Error and loading states (hooks)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Eye button state
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfShown, setPasswordConfShown] = useState(false);
    // Route history
    const history = useHistory()


    // Handle sign up form submit event
    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        setLoading(true)

        // Validate that the password is same as the confirm password
        // And the password contains at least 6 chars, otherwise - error.
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError("Passwords do not match")
        } else if (passwordRef.current.value.length < 6) {
            setError("Password must be at least 6 charcters length")
        }else{
            // If password is more then 6 chars send it to fire base for check
            await signup(emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // If user created set it user name
                setUserName(firstRef.current.value + " " + lastRef.current.value)
                .then((resp) => {
                    // if Username set initiate favorites list and move to dashboard
                    console.log(resp)
                    localStorage.setItem("favorites", JSON.stringify([]));
                    history.push("/")
                })
                .catch((error) => {
                    console.log(error)
                });
                
            })
            .catch((error) => {
                // Set errors
                console.log(error.code);
                console.log(typeof(error.code));
                switch(error.code){
                    case "auth/email-already-in-use":
                        setError("Email Address is Already Used");
                        break;
                    case "auth/invalid-email":
                        setError("Invalid Email Address");
                        break;
                    case "auth/weak-password":
                        setError("Password is Too Weak");
                        break;
                    default:
                        setError("Error - " + ((error.code).slice(5)).replaceAll("-", " "));
                }
                
            });
        }
        setLoading(false)
    }

    // Eye button functionallity
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    // Eye button functionallity
    const togglePasswordConfVisiblity = () => {
        setPasswordConfShown(passwordConfShown ? false : true);
    };

    return (
        <>
            <div style={{background: '#f6f5f7', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh'}}>
            <Card style={{ width: '65%', height: '75%', borderRadius: '20px', border: '1px', boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)',  }}>
                
                <div style={{ backgroundColor: "#374052", height: '100%', borderRadius: '20px'}}>
                <Card.Body style={{backgroundColor: "#FFFFFF", width: "55%", height: 'inherit', float: 'right', borderRadius: '0 20px 20px 0'}}>
                    
                    <h1 className="text-center mb-4" style={{fontWeight: 'bold', fontSize: '3.2rem', marginTop: '1vh'}}>Sign Up</h1>

                    { /* Call handle submit func when this form submitted, pass args through refs */}
                    <Form onSubmit={handleSubmit} >

                    { /* Display error (if there is) */}
                    {error ? <Alert variant="danger">{error}</Alert> : <Alert variant="light" />}
                        <Form.Group id="email">
                            {/* Name field */}
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <BsIcons.BsFillPersonFill size={'1.2rem'} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip id="button-tooltip">First name  must be at least 2 characters</Tooltip>}
                                >
                                <Form.Control type="text" placeholder="First Name" ref={firstRef} required />
                                </OverlayTrigger>
                                <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip id="button-tooltip">Last name must be at least 2 characters</Tooltip>}
                                >
                                <Form.Control type="text" placeholder="Last Name" ref={lastRef} required />
                                </OverlayTrigger>
                            </InputGroup>
                            
                        </Form.Group>

                        <Form.Group id="email">
                            {/* Email field*/}
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip id="button-tooltip">Format xxx@xxx.xx</Tooltip>}
                            >
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <HiIcons.HiOutlineMail size={'1.2rem'} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                            </InputGroup>
                            </OverlayTrigger>
                            
                        </Form.Group>


                        <Form.Group id="password">

                            {/* Password field */}
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip id="button-tooltip">Password must contain at least 6 characters.
                                1 upper case, 1 lowercase and 1 special characters</Tooltip>}
                            >
                            <InputGroup>
                                <InputGroup.Prepend >
                                    <InputGroup.Text >
                                        <BsIcons.BsShieldLockFill size={'1.2rem'}/>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type={passwordShown ? "text" : "password"} placeholder="Password" ref={passwordRef} required />
                                
                                <button onClick={togglePasswordVisiblity} type="button" style={{border: '0', background: '#FFFFFF'}}>
                                    {passwordShown ? <BsIcons.BsEyeFill size={'1.2rem'} /> : <BsIcons.BsEyeSlashFill size={'1.2rem'} /> }
                                </button>
                            </InputGroup>
                            </OverlayTrigger>
                            
                        </Form.Group>

                        <Form.Group id="password-conf">

                            {/* Confirm password field */}
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip id="button-tooltip">Confirm password must be identical to your original password</Tooltip>}
                            >
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <BsIcons.BsShieldLockFill size={'1.2rem'} />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type={passwordConfShown ? "text" : "password"} placeholder="Password Confirmation" ref={passwordConfirmRef} required />

                                
                                <button onClick={togglePasswordConfVisiblity} type="button" style={{border: '0', background: '#FFFFFF'}}>
                                    {passwordConfShown ? <BsIcons.BsEyeFill size={'1.2rem'} /> : <BsIcons.BsEyeSlashFill size={'1.2rem'} /> }
                                </button>
                            </InputGroup>
                            </OverlayTrigger>
                        </Form.Group>

                        
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '7%'}}>
                        {/* Use loading to suspend the button action until the login try completed. */}
                        <Button disabled={loading} className="w-50" type="submit" 
                                style={{background: '#374052', border: '0', borderRadius: '5px', minWidth: '8vw', minHeight: '7vh', fontSize: '1.5rem'}}>
                            Sign Up</Button>
                        </div>
                    </Form>
                    
                    
                </Card.Body>
                <div style={{ display: 'flex', /*justifyContent: 'center',*/ alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                    <Image src={logo} />
                    <div style={{color:'#FFFFFF', textAlign: 'center', fontSize: '1.3rem'}}>Already have an account?</div>
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
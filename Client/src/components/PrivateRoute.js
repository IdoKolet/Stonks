/*
    File: PrivateRoute.js
    The blueprint for all private routes in the application. 
    If the user is logged in, go on and display the component in question;
    otherwise (it is null), redirect the user to sign-in page.
 */
import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth()

    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? <Component {...props}/> : <Redirect to="/login"/>
            }}
        ></Route>

    )
}

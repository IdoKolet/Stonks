/*
    File: App.js
    The main file of the client - the App component.
    Exposses the encapsulated components by routing.
 */

import React from "react"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"

// Import components 
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import Favorites from "./Favorites"
import AllStocks from "./AllStocks"
import Login from "./Login"
import StockView from './StockView'
import ForgotPassword from "./ForgotPassword"
import PrivateRoute from "./PrivateRoute"
import Research from "./Research"

// Routes to all the pages in the website
function App() { 
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* These routes can be accsessed only if the user is logged in */}
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/favorites" component={Favorites} />
          <PrivateRoute exact path="/all" component={AllStocks} />
          <PrivateRoute exact path="/research" component={Research} />
          <PrivateRoute path="/stock/:symbol" component={StockView} />

          {/* These routes can be accsessed by not logged in user */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>

  )
}

export default App;

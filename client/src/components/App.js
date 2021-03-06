import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CustomerForm from './CustomerForm'
import Customers from './Customers'
import LoginForm from './LoginForm'
import Logout from './Logout'
import MovieForm from './MovieForm'
import Movies from './Movies'
import NavBar from './NavBar'
import ProtectedRoute from './common/ProtectedRoute'
import NotFound from './NotFound'
import RegisterForm from './RegisterForm'
import RentalForm from './RentalForm'
import Rentals from './Rentals'
import auth from '../services/authService'

class App extends Component {
  state = {}

  componentDidMount() {
    const user = auth.getCurrentUser()
    this.setState({ user })
  }

  render() {
    const { user } = this.state

    return (
      <React.Fragment>
        <NavBar user={user} />
        <main className="container py-4">
          <Switch>
            <ProtectedRoute path="/customers/:id" component={CustomerForm} />
            <Route
              path="/customers"
              render={props => <Customers {...props} user={user} />}
            />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route
              path="/movies"
              render={props => <Movies {...props} user={user} />}
            />
            <Route path="/register" component={RegisterForm} />
            <ProtectedRoute path="/rentals/:id" component={RentalForm} />
            <Route
              path="/rentals"
              render={props => <Rentals {...props} user={user} />}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect exact from="/" to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    )
  }
}

export default App

import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Customers from './Customers'
import LoginForm from './LoginForm'
import Logout from './Logout'
import MovieForm from './MovieForm'
import Movies from './Movies'
import NavBar from './NavBar'
import NotFound from './NotFound'
import RegisterForm from './RegisterForm'
import Rentals from './Rentals'
import auth from '../services/authService'

class App extends Component {
  state = {}

  componentDidMount() {
    const user = auth.getCurrentUser()
    this.setState({ user })
  }

  render() {
    return (
      <React.Fragment>
        <NavBar user={this.state.user} />
        <main className="container py-4">
          <Switch>
            <Route path="/customers" component={Customers} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/movies/:id" component={MovieForm} />
            <Route path="/movies" component={Movies} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/rentals" component={Rentals} />
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

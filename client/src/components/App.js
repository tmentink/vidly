import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Customers from './Customers'
import MovieForm from './MovieForm'
import Movies from './Movies'
import NavBar from './NavBar'
import NotFound from './NotFound'
import Rentals from './Rentals'

class App extends Component {
  state = {}

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container py-4">
          <Switch>
            <Route path="/customers" component={Customers} />
            <Route path="/movies/:id" component={MovieForm} />
            <Route path="/movies" component={Movies} />
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

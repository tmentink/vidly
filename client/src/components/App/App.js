import React, { Component } from 'react'
import { getCustomers } from '../../services/customerService'

class App extends Component {
  state = {
    customers: [],
  }

  async componentDidMount() {
    const { data } = await getCustomers()
    this.setState({
      customers: data
    })
  }

  render() {
    const customers = this.state.customers.map((c) => {
      return <li key={c._id}>{c.name}</li>
    })
    
    return (
      <div>
        <p>{customers}</p>
      </div>
    )
  }
}

export default App

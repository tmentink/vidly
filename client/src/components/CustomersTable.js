import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from './common/Table'
import auth from '../services/authService'

class CustomersTable extends Component {
  columns = [
    {
      path: 'name',
      label: 'Name',
      content: customer => (
        <Link to={`/customers/${customer._id}`}>{customer.name}</Link>
      ),
    },
    { path: 'phone', label: 'Phone' },
    {
      path: 'isGold',
      label: 'Gold Member',
      content: ({ isGold }) => (
        <i className={`fa fa-lg ${isGold ? 'fa-star text-warning' : ''}`} />
      ),
    },
  ]

  deleteColumn = {
    key: 'Delete',
    content: customer => (
      <i
        className="fa fa-lg fa-times text-danger"
        onClick={() => this.props.onDelete(customer)}
      />
    ),
  }

  constructor() {
    super()

    const user = auth.getCurrentUser()
    if (user && user.isAdmin) this.columns.push(this.deleteColumn)
  }

  render() {
    const { customers, onSort, sortColumn } = this.props
    if (customers.length === 0) return null

    return (
      <Table
        columns={this.columns}
        data={customers}
        onSort={onSort}
        sortColumn={sortColumn}
      />
    )
  }
}

export default CustomersTable

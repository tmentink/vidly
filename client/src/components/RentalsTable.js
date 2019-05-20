import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from './common/Table'

class RentalsTable extends Component {
  columns = [
    {
      path: 'movie.title',
      label: 'Movie',
      content: rental =>
        rental.dateReturned != null ? (
          rental.movie.title
        ) : (
          <Link to={`/rentals/${rental._id}`}>{rental.movie.title}</Link>
        ),
    },
    { path: 'customer.name', label: 'Customer' },
    {
      path: 'dateOut',
      label: 'Rented on',
      content: rental => new Date(rental.dateOut).toLocaleDateString(),
    },
    {
      path: 'dateReturned',
      label: 'Returned on',
      content: rental =>
        rental.dateReturned != null
          ? new Date(rental.dateReturned).toLocaleDateString()
          : '-',
    },
  ]

  render() {
    const { rentals, onSort, sortColumn } = this.props
    if (rentals.length === 0) return null

    return (
      <Table
        columns={this.columns}
        data={rentals}
        onSort={onSort}
        sortColumn={sortColumn}
      />
    )
  }
}

export default RentalsTable

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Like from './common/Like'
import Table from './common/Table'
import auth from '../services/authService'

class MoviesTable extends Component {
  columns = [
    {
      path: 'title',
      label: 'Title',
      content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link>,
    },
    { path: 'genre.name', label: 'Genre' },
    { path: 'numberInStock', label: 'Stock' },
    { path: 'dailyRentalRate', label: 'Rate' },
    {
      key: 'Like',
      content: movie => (
        <Like liked={movie.liked} onClick={() => this.props.onLike(movie)} />
      ),
    },
  ]

  deleteColumn = {
    key: 'Delete',
    content: movie => (
      <i
        className="fa fa-lg fa-times text-danger"
        onClick={() => this.props.onDelete(movie)}
      />
    ),
  }

  constructor() {
    super()

    const user = auth.getCurrentUser()
    if (user && user.isAdmin) this.columns.push(this.deleteColumn)
  }

  render() {
    const { movies, onSort, sortColumn } = this.props
    if (movies.length === 0) return null

    return (
      <Table
        columns={this.columns}
        data={movies}
        onSort={onSort}
        sortColumn={sortColumn}
      />
    )
  }
}

export default MoviesTable

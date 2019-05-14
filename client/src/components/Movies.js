import React, { Component } from 'react'
import { getMovies } from '../services/movieService'

class Movies extends Component {
  state = {
    movies: [],
  }

  async componentDidMount() {
    const { data } = await getMovies()

    this.setState({
      movies: data,
    })
  }

  getCountText() {
    const count = this.state.movies.length
    return count > 0
      ? `Showing ${count} movies in the database`
      : 'There are no movies in the database'
  }

  getTable() {
    const count = this.state.movies.length
    if (count === 0) return null

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Stock</th>
            <th>Rate</th>
            <th />
          </tr>
        </thead>
        <tbody>{this.getTableRows()}</tbody>
      </table>
    )
  }

  getTableRows() {
    return this.state.movies.map(m => {
      return (
        <tr key={m._id}>
          <td>{m.title}</td>
          <td>{m.genre.name}</td>
          <td>{m.numberInStock}</td>
          <td>{m.dailyRentalRate}</td>
          <td>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={e => this.handleDeleteMovie(m, e)}
            >
              Delete
            </button>
          </td>
        </tr>
      )
    })
  }

  handleDeleteMovie(movie, e) {
    this.setState(prev => ({
      movies: prev.movies.filter(x => x._id !== movie._id),
    }))
  }

  render() {
    return (
      <div className="p-4">
        <p className="mb-3">{this.getCountText()}</p>
        {this.getTable()}
      </div>
    )
  }
}

export default Movies

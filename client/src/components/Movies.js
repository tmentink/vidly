import React, { Component } from 'react'
import Like from './common/Like'
import Pagination from './common/Pagination'
import { getMovies } from '../services/movieService'
import { paginate } from '../utils/paginate'

class Movies extends Component {
  state = {
    currentPage: 1,
    movies: [],
    pageSize: 4,
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
            <th />
          </tr>
        </thead>
        <tbody>{this.getTableRows()}</tbody>
      </table>
    )
  }

  getTableRows() {
    const movies = paginate(
      this.state.movies,
      this.state.currentPage,
      this.state.pageSize
    )

    return movies.map(m => {
      return (
        <tr key={m._id}>
          <td>{m.title}</td>
          <td>{m.genre.name}</td>
          <td>{m.numberInStock}</td>
          <td>{m.dailyRentalRate}</td>
          <td>
            <Like
              liked={m.liked}
              onClick={e => {
                this.handleLike(m, e)
              }}
            />
          </td>
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

  handleDeleteMovie = movie => {
    this.setState(prev => ({
      movies: prev.movies.filter(x => x._id !== movie._id),
    }))
  }

  handleLike = movie => {
    const movies = [...this.state.movies]
    const index = movies.indexOf(movie)
    movies[index] = { ...movies[index] }
    movies[index].liked = !movies[index].liked
    this.setState({ movies })
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
  }

  render() {
    const { currentPage, movies, pageSize } = this.state

    return (
      <div className="p-4">
        <p className="mb-3">{this.getCountText()}</p>
        {this.getTable()}
        <Pagination
          currentPage={currentPage}
          itemsCount={movies.length}
          onPageChange={this.handlePageChange}
          pageSize={pageSize}
        />
      </div>
    )
  }
}

export default Movies

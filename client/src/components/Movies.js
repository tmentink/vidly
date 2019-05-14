import React, { Component } from 'react'
import Like from './common/Like'
import ListGroup from './common/ListGroup'
import Pagination from './common/Pagination'
import { getGenres } from '../services/genreService'
import { getMovies } from '../services/movieService'
import { paginate } from '../utils/paginate'

class Movies extends Component {
  state = {
    currentPage: 1,
    genres: [],
    movies: [],
    pageSize: 4,
    selectedGenre: null,
  }

  async componentDidMount() {
    const { data: genres } = await getGenres()
    const { data: movies } = await getMovies()

    this.setState({
      genres: [{ name: 'All genres', _id: null }, ...genres],
      movies,
    })
  }

  getCountText() {
    const count = this.getFilteredMovies().length
    return count > 0
      ? `Showing ${count} movies in the database`
      : 'There are no movies in the database'
  }

  getFilteredMovies() {
    const { movies, selectedGenre } = this.state
    return selectedGenre && selectedGenre._id
      ? movies.filter(m => m.genre._id === selectedGenre._id)
      : movies
  }

  getTable() {
    const count = this.getFilteredMovies().length
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
    const { currentPage, pageSize } = this.state

    const movies = paginate(this.getFilteredMovies(), currentPage, pageSize)

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

  handleGenreSelect = genre => {
    this.setState({ currentPage: 1, selectedGenre: genre })
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
    const { currentPage, genres, pageSize, selectedGenre } = this.state

    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-md-3">
            <ListGroup
              items={genres}
              onItemSelect={this.handleGenreSelect}
              selectedItem={selectedGenre}
            />
          </div>
          <div className="col-md-9">
            <p className="mb-3 mt-3 mt-md-0">{this.getCountText()}</p>
            {this.getTable()}
            <Pagination
              currentPage={currentPage}
              itemsCount={this.getFilteredMovies().length}
              onPageChange={this.handlePageChange}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Movies

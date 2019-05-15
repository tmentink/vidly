import React, { Component } from 'react'
import ListGroup from './common/ListGroup'
import MoviesTable from './MoviesTable'
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

  getFilteredMovies() {
    const { movies, selectedGenre } = this.state
    return selectedGenre && selectedGenre._id
      ? movies.filter(m => m.genre._id === selectedGenre._id)
      : movies
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
    const filtered = this.getFilteredMovies()
    const movies = paginate(filtered, currentPage, pageSize)

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
            <p className="mb-3 mt-3 mt-md-0">
              Showing {filtered.length} movies in the database
            </p>
            <MoviesTable
              movies={movies}
              onDelete={this.handleDeleteMovie}
              onLike={this.handleLike}
            />
            <Pagination
              currentPage={currentPage}
              itemsCount={filtered.length}
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

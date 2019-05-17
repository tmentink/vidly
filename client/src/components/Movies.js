import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ListGroup from './common/ListGroup'
import MoviesTable from './MoviesTable'
import Pagination from './common/Pagination'
import SearchBox from './common/SearchBox'
import { getGenres } from '../services/genreService'
import { getMovies } from '../services/movieService'
import { paginate } from '../utils/paginate'
import _ from 'lodash'

class Movies extends Component {
  state = {
    currentPage: 1,
    genres: [],
    movies: [],
    pageSize: 4,
    searchQuery: '',
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' },
  }

  async componentDidMount() {
    const { data: genres } = await getGenres()
    const { data: movies } = await getMovies()

    this.setState({
      genres: [{ name: 'All genres', _id: '' }, ...genres],
      movies,
    })
  }

  getFilteredMovies() {
    const { movies, searchQuery, selectedGenre } = this.state

    if (searchQuery)
      return movies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      )

    return selectedGenre && selectedGenre._id
      ? movies.filter(m => m.genre._id === selectedGenre._id)
      : movies
  }

  getSortedMovies = movies => {
    const { sortColumn } = this.state
    return _.orderBy(movies, [sortColumn.path], [sortColumn.order])
  }

  handleDelete = movie => {
    this.setState(prev => ({
      movies: prev.movies.filter(x => x._id !== movie._id),
    }))
  }

  handleGenreSelect = genre => {
    this.setState({ currentPage: 1, searchQuery: '', selectedGenre: genre })
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

  handleSearch = query => {
    this.setState({ currentPage: 1, searchQuery: query, selectedGenre: null })
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }

  render() {
    const {
      currentPage,
      genres,
      pageSize,
      searchQuery,
      selectedGenre,
      sortColumn,
    } = this.state

    const filtered = this.getFilteredMovies()
    const sorted = this.getSortedMovies(filtered)
    const movies = paginate(sorted, currentPage, pageSize)

    return (
      <div className="row">
        <div className="col-md-3">
          <ListGroup
            items={genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={selectedGenre}
          />
        </div>
        <div className="col-md-9">
          <div className="d-flex my-3 mt-md-0">
            <p className="m-0 align-self-end">
              Showing {filtered.length} movies in the database
            </p>
            <Link to="/movies/new" className="btn btn-primary ml-auto">
              New Movie
            </Link>
          </div>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <Pagination
            currentPage={currentPage}
            itemsCount={filtered.length}
            onPageChange={this.handlePageChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    )
  }
}

export default Movies

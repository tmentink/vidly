import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'
import { getGenres } from '../services/genreService'
import { getMovie, saveMovie } from '../services/movieService'

class MovieForm extends Form {
  state = {
    data: {
      title: '',
      genreId: '',
      numberInStock: '',
      dailyRentalRate: '',
    },
    genres: [],
    errors: {},
  }

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label('Title'),
    genreId: Joi.string()
      .required()
      .label('Genre'),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required()
      .label('Number in Stock'),
    dailyRentalRate: Joi.number()
      .required()
      .min(1)
      .max(10)
      .label('Rate'),
  }

  async componentDidMount() {
    await this.populateGenres()
    await this.populateMovie()
  }

  doSubmit = async () => {
    await saveMovie(this.state.data)
    this.props.history.push('/movies')
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    }
  }

  async populateGenres() {
    const { data: genres } = await getGenres()
    this.setState({ genres })
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id
      if (movieId === 'new') return

      const { data: movie } = await getMovie(movieId)
      this.setState({ data: this.mapToViewModel(movie) })
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found')
    }
  }

  render() {
    const { genres } = this.state

    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput({
            label: 'Title',
            name: 'title',
          })}
          {this.renderSelect({
            label: 'Genre',
            name: 'genreId',
            options: genres,
          })}
          {this.renderInput({
            label: 'Number in Stock',
            name: 'numberInStock',
            type: 'number',
          })}
          {this.renderInput({
            label: 'Rate',
            name: 'dailyRentalRate',
            type: 'number',
          })}
          {this.renderSubmitButton({ label: 'Save' })}
        </form>
      </div>
    )
  }
}

export default MovieForm

import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'
import { getCustomers } from '../services/customerService'
import { getMovies } from '../services/movieService'
import { getRental, saveRental, returnRental } from '../services/rentalService'

class RentalForm extends Form {
  state = {
    customers: [],
    data: {
      customerId: '',
      movieId: '',
      dailyRentalRate: '',
      dateOut: '',
    },

    movies: [],
    errors: {},
  }

  schema = {
    _id: Joi.string(),
    customerId: Joi.string()
      .required()
      .label('Customer'),
    movieId: Joi.string()
      .required()
      .label('Movie'),
    dailyRentalRate: Joi.number().label('Daily rate'),
    dateOut: Joi.date().label('Rented on'),
  }

  async componentDidMount() {
    await this.populateCustomers()
    await this.populateMovies()
    await this.populateRental()
  }

  doSubmit = async () => {
    const data = { ...this.state.data }
    const isReturn = data._id != null

    delete data._id
    delete data.dailyRentalRate
    delete data.dateOut

    if (isReturn) await returnRental(data)
    else await saveRental(data)

    this.props.history.push('/rentals')
  }

  mapToViewModel(rental) {
    return {
      _id: rental._id,
      customerId: rental.customer._id,
      movieId: rental.movie._id,
      dailyRentalRate: rental.movie.dailyRentalRate,
      dateOut: new Date(rental.dateOut).toLocaleDateString(),
    }
  }

  async populateCustomers() {
    const { data: customers } = await getCustomers()
    this.setState({ customers })
  }

  async populateMovies() {
    const { data: movies } = await getMovies()
    this.setState({ movies })
  }

  async populateRental() {
    try {
      const rentalId = this.props.match.params.id
      if (rentalId === 'new') return

      const { data: rental } = await getRental(rentalId)
      this.setState({ data: this.mapToViewModel(rental) })
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found')
    }
  }

  render() {
    const { customers, data, movies } = this.state
    const isReturn = data._id != null

    return (
      <div>
        <h1>Rental Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect({
            disabled: isReturn ? 'disabled' : '',
            label: 'Customer',
            name: 'customerId',
            options: customers,
          })}
          {this.renderSelect({
            disabled: isReturn ? 'disabled' : '',
            label: 'Movie',
            name: 'movieId',
            options: movies,
            textProperty: 'title',
          })}
          {isReturn &&
            this.renderInput({
              label: 'Daily rate',
              name: 'dailyRentalRate',
              disabled: 'disabled',
            })}
          {isReturn &&
            this.renderInput({
              label: 'Rented on',
              name: 'dateOut',
              disabled: 'disabled',
            })}
          {this.renderSubmitButton({ label: isReturn ? 'Return' : 'Save' })}
        </form>
      </div>
    )
  }
}

export default RentalForm

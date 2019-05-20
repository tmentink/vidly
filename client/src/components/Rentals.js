import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import RentalsTable from './RentalsTable'
import Pagination from './common/Pagination'
import SearchBox from './common/SearchBox'
import { getRentals, returnRental } from '../services/rentalService'
import { paginate } from '../utils/paginate'
import _ from 'lodash'
import fuzzy from 'fuzzysort'

class Rentals extends Component {
  state = {
    currentPage: 1,
    rentals: [],
    pageSize: 4,
    searchQuery: '',
    sortColumn: { path: 'name', order: 'asc' },
  }

  async componentDidMount() {
    const { data: rentals } = await getRentals()

    this.setState({ rentals })
  }

  getFilteredRentals() {
    const { rentals, searchQuery } = this.state

    if (searchQuery) {
      const opts = { allowTypo: false, key: 'movie.title' }
      const results = fuzzy.go(searchQuery, rentals, opts)
      return results.map(r => r.obj)
    }

    return rentals
  }

  getSortedRentals = rentals => {
    const { sortColumn } = this.state
    return _.orderBy(rentals, [sortColumn.path], [sortColumn.order])
  }

  handleErrors({ ex, messages }) {
    const message = messages[ex.response.status]
    if (message) alert(message)
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
  }

  handleReturn = rental => {
    const originalRentals = this.state.rentals
    const rentals = originalRentals.filter(x => x._id !== rental._id)
    this.setState({ rentals })

    const messages = {
      404: 'The rental has already been returned',
    }

    returnRental(rentals._id).catch(ex => {
      this.handleErrors({ ex, messages })
      this.setState({ rentals: originalRentals })
    })
  }

  handleSearch = query => {
    this.setState({ currentPage: 1, searchQuery: query })
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }

  render() {
    const { currentPage, pageSize, searchQuery, sortColumn } = this.state
    const { user } = this.props
    const filtered = this.getFilteredRentals()
    const sorted = this.getSortedRentals(filtered)
    const rentals = paginate(sorted, currentPage, pageSize)

    return (
      <div>
        <div className="d-flex my-3 mt-md-0">
          <p className="m-0 align-self-end">
            Showing {filtered.length} rentals in the database
          </p>
          {user && (
            <Link to="/rentals/new" className="btn btn-primary ml-auto">
              New Rental
            </Link>
          )}
        </div>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <RentalsTable
          onReturn={this.handleReturn}
          onSort={this.handleSort}
          rentals={rentals}
          sortColumn={sortColumn}
        />
        <Pagination
          currentPage={currentPage}
          itemsCount={filtered.length}
          onPageChange={this.handlePageChange}
          pageSize={pageSize}
        />
      </div>
    )
  }
}

export default Rentals

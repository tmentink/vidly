import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import CustomersTable from './CustomersTable'
import Pagination from './common/Pagination'
import SearchBox from './common/SearchBox'
import { deleteCustomer, getCustomers } from '../services/customerService'
import { paginate } from '../utils/paginate'
import _ from 'lodash'
import fuzzy from 'fuzzysort'

class Customers extends Component {
  state = {
    currentPage: 1,
    customers: [],
    pageSize: 4,
    searchQuery: '',
    sortColumn: { path: 'name', order: 'asc' },
  }

  async componentDidMount() {
    const { data: customers } = await getCustomers()

    this.setState({ customers })
  }

  getFilteredCustomers() {
    const { customers, searchQuery } = this.state

    if (searchQuery) {
      const opts = { allowTypo: false, key: 'name' }
      const results = fuzzy.go(searchQuery, customers, opts)
      return results.map(r => r.obj)
    }

    return customers
  }

  getSortedCustomers = customers => {
    const { sortColumn } = this.state
    return _.orderBy(customers, [sortColumn.path], [sortColumn.order])
  }

  handleDelete = customer => {
    const originalCustomers = this.state.customers
    const customers = originalCustomers.filter(x => x._id !== customer._id)
    this.setState({ customers })

    const messages = {
      404: 'The customer has already been deleted',
    }

    deleteCustomer(customer._id).catch(ex => {
      this.handleErrors({ ex, messages })
      this.setState({ customers: originalCustomers })
    })
  }

  handleErrors({ ex, messages }) {
    const message = messages[ex.response.status]
    if (message) alert(message)
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
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
    const filtered = this.getFilteredCustomers()
    const sorted = this.getSortedCustomers(filtered)
    const customers = paginate(sorted, currentPage, pageSize)

    return (
      <div>
        <div className="d-flex my-3 mt-md-0">
          <p className="m-0 align-self-end">
            Showing {filtered.length} customers in the database
          </p>
          {user && (
            <Link to="/customers/new" className="btn btn-primary ml-auto">
              New Customer
            </Link>
          )}
        </div>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <CustomersTable
          customers={customers}
          onDelete={this.handleDelete}
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
    )
  }
}

export default Customers

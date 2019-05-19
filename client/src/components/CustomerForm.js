import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'
import { getCustomer, saveCustomer } from '../services/customerService'

class CustomerForm extends Form {
  state = {
    data: {
      name: '',
      phone: '',
      isGold: '',
    },
    errors: {},
  }

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .min(1)
      .max(255)
      .label('Name'),
    phone: Joi.string()
      .min(10)
      .max(20)
      .required()
      .label('Phone'),
    isGold: Joi.boolean().label('Gold status'),
  }

  async componentDidMount() {
    await this.populateCustomer()
  }

  doSubmit = async () => {
    await saveCustomer(this.state.data)
    this.props.history.push('/customers')
  }

  mapToViewModel(customer) {
    return {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    }
  }

  async populateCustomer() {
    try {
      const customerId = this.props.match.params.id
      if (customerId === 'new') return

      const { data: customer } = await getCustomer(customerId)
      this.setState({ data: this.mapToViewModel(customer) })
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found')
    }
  }

  render() {
    return (
      <div>
        <h1>Customer Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput({
            label: 'Name',
            name: 'name',
          })}
          {this.renderInput({
            label: 'Phone',
            name: 'phone',
          })}
          {this.renderCheckbox({
            label: 'Gold Member',
            name: 'isGold',
          })}
          {this.renderSubmitButton({ label: 'Save' })}
        </form>
      </div>
    )
  }
}

export default CustomerForm

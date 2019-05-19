import React, { Component } from 'react'
import Joi from 'joi-browser'
import Checkbox from './Checkbox'
import Input from './Input'
import Select from './Select'

class Form extends Component {
  state = { data: {}, errors: {} }

  getInputErrors = input => {
    const errors = { ...this.state.errors }
    const errorMessage = this.validateProperty(input)
    if (errorMessage) errors[input.name] = errorMessage
    else delete errors[input.name]

    return errors
  }

  getInputValue = ({ checked, name, type, value }) => {
    const data = { ...this.state.data }
    data[name] = type === 'checkbox' ? checked : value

    return data
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = this.getInputErrors(input)
    const data = this.getInputValue(input)
    this.setState({ data, errors })
  }

  handleSubmit = e => {
    e.preventDefault()

    const errors = this.validate()
    this.setState({ errors: errors || {} })
    if (errors) return

    this.doSubmit()
  }

  renderCheckbox({ label, name }) {
    const { data, errors } = this.state

    return (
      <Checkbox
        error={errors[name]}
        label={label}
        name={name}
        onChange={this.handleChange}
        checked={data[name]}
      />
    )
  }

  renderInput({ label, name, type = 'text' }) {
    const { data, errors } = this.state

    return (
      <Input
        error={errors[name]}
        label={label}
        name={name}
        onChange={this.handleChange}
        type={type}
        value={data[name]}
      />
    )
  }

  renderSelect({ label, name, options }) {
    const { data, errors } = this.state

    return (
      <Select
        error={errors[name]}
        label={label}
        name={name}
        onChange={this.handleChange}
        options={options}
        value={data[name]}
      />
    )
  }

  renderSubmitButton({ label }) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    )
  }

  validate = () => {
    const options = { abortEarly: false }
    const { error } = Joi.validate(this.state.data, this.schema, options)
    if (!error) return null

    const errors = {}
    for (const item of error.details) errors[item.path[0]] = item.message
    return errors
  }

  validateProperty = ({ checked, name, type, value }) => {
    const obj = type === 'checkbox' ? { [name]: checked } : { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema)

    return error ? error.details[0].message : null
  }
}

export default Form

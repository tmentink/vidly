import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'
import auth from '../services/authService'
import { register } from '../services/userService'

class RegisterForm extends Form {
  state = {
    data: { email: '', name: '', password: '' },
    errors: {},
  }

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label('Email'),
    name: Joi.string()
      .min(3)
      .required()
      .label('Name'),
    password: Joi.string()
      .min(10)
      .required()
      .label('Password'),
  }

  doSubmit = async () => {
    try {
      const { email, name, password } = this.state.data
      const { headers } = await register({ email, name, password })
      auth.loginWithJwt(headers['x-auth-token'])
      window.location = '/'
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  handleErrors = ex => {
    if (ex.response && ex.response.status === 400) {
      const errors = { ...this.state.errors }
      errors.email = ex.response.data
      this.setState({ errors })
    }
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput({
            label: 'Name',
            name: 'name',
          })}
          {this.renderInput({
            label: 'Email',
            name: 'email',
          })}
          {this.renderInput({
            label: 'Password',
            name: 'password',
            type: 'password',
          })}
          {this.renderSubmitButton({ label: 'Register' })}
        </form>
      </div>
    )
  }
}

export default RegisterForm

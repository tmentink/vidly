import React from 'react'
import { Redirect } from 'react-router-dom'
import Joi from 'joi-browser'
import Form from './common/Form'
import auth from '../services/authService'

class LoginForm extends Form {
  state = {
    data: { email: '', password: '' },
    errors: {},
  }

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label('Email'),
    password: Joi.string()
      .min(10)
      .required()
      .label('Password'),
  }

  doSubmit = async () => {
    try {
      const { email, password } = this.state.data
      await auth.login({ email, password })

      const { state } = this.props.location
      window.location = state ? state.from.pathname : '/'
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  handleErrors = ex => {
    if (ex.response && ex.response.status === 400) {
      const errors = { ...this.state.errors }
      errors.password = ex.response.data
      this.setState({ errors })
    }
  }

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput({
            label: 'Email',
            name: 'email',
          })}
          {this.renderInput({
            label: 'Password',
            name: 'password',
            type: 'password',
          })}
          {this.renderSubmitButton({ label: 'Login' })}
        </form>
      </div>
    )
  }
}

export default LoginForm

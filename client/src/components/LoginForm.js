import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'

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
      .min(5)
      .required()
      .label('Password'),
  }

  doSubmit = () => {
    console.log('Submitted')
  }

  render() {
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

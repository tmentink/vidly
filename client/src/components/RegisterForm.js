import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'

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
        <h1>Register</h1>
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
          {this.renderInput({
            label: 'Name',
            name: 'name',
          })}
          {this.renderSubmitButton({ label: 'Register' })}
        </form>
      </div>
    )
  }
}

export default RegisterForm

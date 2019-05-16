import React from 'react'

const Input = ({ error, label, name, ...rest }) => {
  const invalid = error != null ? 'is-invalid' : ''

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        id={name}
        name={name}
        className={`form-control ${invalid}`}
      />
      {<div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Input

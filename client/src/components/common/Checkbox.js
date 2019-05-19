import React from 'react'

const Checkbox = ({ error, label, name, ...rest }) => {
  const invalid = error != null ? 'is-invalid' : ''

  return (
    <div className="form-group">
      <div className="form-check">
        <input
          {...rest}
          id={name}
          name={name}
          type="checkbox"
          className={`form-check-input ${invalid}`}
        />
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      </div>
    </div>
  )
}

export default Checkbox

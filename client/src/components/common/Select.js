import React from 'react'

const Select = ({ error, label, name, options, ...rest }) => {
  const invalid = error != null ? 'is-invalid' : ''

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        {...rest}
        className={`custom-select ${invalid}`}
        id={name}
        name={name}
      >
        {options.map(opt => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
      {<div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Select

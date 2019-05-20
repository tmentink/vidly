import React from 'react'

const Select = ({
  error,
  label,
  name,
  options,
  placeholder,
  textProperty,
  valueProperty,
  ...rest
}) => {
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
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt._id} value={opt[valueProperty]}>
            {opt[textProperty]}
          </option>
        ))}
      </select>
      {<div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Select

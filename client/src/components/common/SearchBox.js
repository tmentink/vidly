import React from 'react'

const SearchBox = ({ onChange, value }) => {
  return (
    <input
      className="form-control my-3"
      name="query"
      onChange={e => onChange(e.currentTarget.value)}
      placeholder="Search..."
      type="text"
      value={value}
    />
  )
}

export default SearchBox

import React from 'react'

const MovieForm = ({ history, match }) => {
  return (
    <div>
      <h1>Movie {match.params.id}</h1>
      <button
        className="btn btn-primary"
        onClick={() => history.push('/movies')}
      >
        Save
      </button>
    </div>
  )
}

export default MovieForm

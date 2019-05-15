import React from 'react'
import Like from './common/Like'

const MoviesTable = props => {
  const { movies, onDelete, onLike } = props
  if (movies.length === 0) return null

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Genre</th>
          <th>Stock</th>
          <th>Rate</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {movies.map(m => {
          return (
            <tr key={m._id}>
              <td>{m.title}</td>
              <td>{m.genre.name}</td>
              <td>{m.numberInStock}</td>
              <td>{m.dailyRentalRate}</td>
              <td>
                <Like
                  liked={m.liked}
                  onClick={() => {
                    onLike(m)
                  }}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    onDelete(m)
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MoviesTable

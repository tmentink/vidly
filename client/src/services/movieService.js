import http from './httpService'

export function deleteMovie(id) {
  return http.delete(`/movies/${id}`)
}

export function getMovie(id) {
  return http.get(`/movies/${id}`)
}

export function getMovies() {
  return http.get('/movies')
}

export function saveMovie(movie) {
  const { _id } = movie

  if (_id) {
    const body = { ...movie }
    delete body._id
    return http.put(`/movies/${_id}`, body)
  }

  return http.post('/movies', movie)
}

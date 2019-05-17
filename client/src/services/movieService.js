import http from './httpService'

export function createMovie(movie) {
  return http.post('/movies', movie)
}

export function deleteMovie(id) {
  return http.delete(`/movies/${id}`)
}

export function getMovie(id) {
  return http.get(`/movies/${id}`)
}

export function getMovies() {
  return http.get('/movies')
}

export function updateMovie(movie) {
  return http.put('/movies', movie)
}

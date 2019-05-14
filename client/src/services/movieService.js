import http from './httpService'

export function getMovies() {
  return http.get('/movies')
}

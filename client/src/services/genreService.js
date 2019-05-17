import http from './httpService'

export function createGenre(genre) {
  return http.post('/genres', genre)
}

export function deleteGenre(id) {
  return http.delete(`/genres/${id}`)
}

export function getGenre(id) {
  return http.get(`/genres/${id}`)
}

export function getGenres() {
  return http.get('/genres')
}

export function updateGenre(genre) {
  return http.put('/genres', genre)
}

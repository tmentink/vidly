import http from './httpService'

export function deleteGenre(id) {
  return http.delete(`/genres/${id}`)
}

export function getGenre(id) {
  return http.get(`/genres/${id}`)
}

export function getGenres() {
  return http.get('/genres')
}

export function saveGenre(genre) {
  const { _id } = genre

  if (_id) {
    const body = { ...genre }
    delete body._id
    return http.put(`/genres/${_id}`, body)
  }

  return http.post('/genres', genre)
}

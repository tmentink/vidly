import http from './httpService'

export function getRental(id) {
  return http.get(`/rentals/${id}`)
}

export function getRentals() {
  return http.get('/rentals')
}

export function returnRental(rental) {
  return http.post('/returns', rental)
}

export function saveRental(rental) {
  return http.post('/rentals', rental)
}

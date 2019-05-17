import http from './httpService'

export function createCustomer(customer) {
  return http.post('/customers', customer)
}

export function deleteCustomer(id) {
  return http.delete(`/customers/${id}`)
}

export function getCustomer(id) {
  return http.get(`/customers/${id}`)
}

export function getCustomers() {
  return http.get('/customers')
}

export function updateCustomer(customer) {
  return http.put('/customers', customer)
}

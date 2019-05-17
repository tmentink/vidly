import http from './httpService'

export function deleteCustomer(id) {
  return http.delete(`/customers/${id}`)
}

export function getCustomer(id) {
  return http.get(`/customers/${id}`)
}

export function getCustomers() {
  return http.get('/customers')
}

export function saveCustomer(customer) {
  const { _id } = customer

  if (_id) {
    const body = { ...customer }
    delete body._id
    return http.put(`/customers/${_id}`, body)
  }

  return http.post('/customers', customer)
}

import http from './httpService'

export function register({ email, name, password, isAdmin = false }) {
  return http.post('/users', {
    email,
    name,
    password,
    isAdmin,
  })
}

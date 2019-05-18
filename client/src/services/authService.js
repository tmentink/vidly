import http from './httpService'
import jwtDecode from 'jwt-decode'

const TOKEN_KEY = 'token'

http.setJwt(getJwt())

export function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    return jwtDecode(token)
  }

  return null
}

export function getJwt() {
  return localStorage.getItem(TOKEN_KEY)
}

export async function login({ email, password }) {
  const { data: jwt } = await http.post('/auth', { email, password })
  localStorage.setItem(TOKEN_KEY, jwt)
}

export function loginWithJwt(jwt) {
  localStorage.setItem(TOKEN_KEY, jwt)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export default {
  getCurrentUser,
  getJwt,
  login,
  loginWithJwt,
  logout,
}

// Simple localStorage-based auth + OTP (demo only)
const USERS_KEY = 'users'
const SESSION_KEY = 'session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function saveUser(user) {
  const users = readUsers()
  users[user.email] = user
  writeUsers(users)
}

export function getUser(email) {
  const users = readUsers()
  return users[email] || null
}

export function setPassword(email, password) {
  const users = readUsers()
  if (users[email]) {
    users[email].password = password
    writeUsers(users)
    return true
  }
  return false
}

export function login(email, password) {
  const user = getUser(email)
  if (user && user.password === password) {
    localStorage.setItem(SESSION_KEY, email)
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY)
}

// OTP helpers
function otpKey(email) {
  return `otp:${email}`
}

export function generateOtp(email, minutesValid = 5) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + minutesValid * 60 * 1000
  localStorage.setItem(otpKey(email), JSON.stringify({ code, expiresAt }))
  return code
}

export function verifyOtp(email, code) {
  try {
    const data = JSON.parse(localStorage.getItem(otpKey(email)))
    if (!data) return false
    if (Date.now() > data.expiresAt) return false
    return data.code === code
  } catch {
    return false
  }
}

export function clearOtp(email) {
  localStorage.removeItem(otpKey(email))
}

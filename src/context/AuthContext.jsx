import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Read from localStorage to persist mock session
    const storedUser = localStorage.getItem('dummyUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function signup({ email, password }) {
    setAuthError('')
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')

    const users = JSON.parse(localStorage.getItem('dummyUsers') || '{}')
    users[email] = password
    localStorage.setItem('dummyUsers', JSON.stringify(users))

    const newUser = { id: Date.now().toString(), email }
    localStorage.setItem('dummyUser', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  async function login({ email, password }) {
    setAuthError('')
    if (!password) throw new Error('Password is required.')

    const users = JSON.parse(localStorage.getItem('dummyUsers') || '{}')
    
    // Check credentials, or if they don't exist yet, auto-register for a seamless mock experience
    if (users[email]) {
      if (users[email] !== password) {
        setAuthError('Invalid email or password.')
        throw new Error('Invalid email or password.')
      }
    } else {
      users[email] = password
      localStorage.setItem('dummyUsers', JSON.stringify(users))
    }

    const loggedUser = { id: Date.now().toString(), email }
    localStorage.setItem('dummyUser', JSON.stringify(loggedUser))
    setUser(loggedUser)
    return loggedUser
  }

  async function logout() {
    setAuthError('')
    localStorage.removeItem('dummyUser')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, authError, login, signup, logout }),
    [user, loading, authError]
  )

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
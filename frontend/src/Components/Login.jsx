
import { useState } from 'react'
import { API_BASE_URL } from '../apiconfig'

const API_URL = `${API_BASE_URL}/api/auth/login`

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          result.message ||
          result.detail ||
          'Invalid username or password'
        )
      }

      if (!['ADMIN', 'EMPLOYEE'].includes(result.role)) {
        throw new Error('The server returned an invalid user role.')
      }

      if (result.role === 'EMPLOYEE' && !result.employee) {
        throw new Error('Employee details were not returned by the server.')
      }

      onLogin(result)

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-brand">
          <span className="login-brand-mark">E</span>
          <span>Employee<span className="login-brand-light">Management</span></span>
        </div>

        <div className="login-showcase-content">
          <p className="login-overline">EMPLOYEE MANAGEMENT SYSTEM</p>
          <h1>People operations,<br />made simpler.</h1>
          <p className="login-showcase-description">
            Keep employee records and department insights together in one clear workspace.
          </p>

          <div className="login-showcase-tags">
            <span>Employee records</span>
            <span>Department insights</span>
          </div>
        </div>

        <p className="login-showcase-footer">A clearer view of your workforce.</p>
        <div className="login-showcase-orb" aria-hidden="true" />
      </section>

      <section className="login-content">
        <div className="login-card">
          <div className="login-mobile-brand">
            <span className="login-brand-mark">E</span>
            <span>EMS<span className="login-brand-period">.</span></span>
          </div>

          <p className="login-overline">ACCOUNT ACCESS</p>
          <h2>Welcome back</h2>
          <p className="login-intro">Sign in to continue to your dashboard.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={event => {
                  setUsername(event.target.value)
                  setError('')
                }}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={event => {
                  setPassword(event.target.value)
                  setError('')
                }}
                required
              />
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in to dashboard'}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-demo-note">
            <span className="login-demo-indicator" aria-hidden="true">i</span>
            <p>
              Employee access: Employee ID / Employee ID
            </p>
          </div>
        </div>

        <p className="login-content-footer">Employee Management System</p>
      </section>
    </main>
  )
}

export default Login

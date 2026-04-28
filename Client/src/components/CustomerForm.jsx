import { useState } from 'react'
import PartyPopperIcon from '../assets/icons/party-popper.svg?react'
import ArrowRightIcon from '../assets/icons/arrow-right.svg?react'
import dotenv from 'dotenv'
dotenv.config()
import './CustomerForm.css'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1/customers';

function CustomerForm() {
  const [form, setForm] = useState({ name: '', email: '', dayOfBirth: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedName, setSubmittedName] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          dayOfBirth: form.dayOfBirth,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Error ${res.status}`)
      }

      setSubmittedName(form.name)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="cf-card" role="main">
      {/* Teal top accent bar */}
      <div className="cf-accent-bar" aria-hidden="true" />

      <div className="cf-body">
        {status === 'success' ? (
          <SuccessView name={submittedName} />
        ) : (
          <>
            {/* Header */}
            <div className="cf-header">
              <div className="cf-icon-wrap" aria-hidden="true">
                <PartyPopperIcon className="cf-icon" width={29} height={27} />
              </div>
              <h1 className="cf-title">Enter Your Details</h1>
              <p className="cf-subtitle">Please provide your information below.</p>
            </div>

            {/* Form */}
            <form className="cf-form" onSubmit={handleSubmit} noValidate>
              <div className="cf-field">
                <label className="cf-label" htmlFor="name">
                  Username
                </label>
                <input
                  className="cf-input"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. partyplanner99"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="cf-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="dayOfBirth">
                  Date of Birth
                </label>
                <input
                  className="cf-input cf-input--date"
                  id="dayOfBirth"
                  name="dayOfBirth"
                  type="date"
                  value={form.dayOfBirth}
                  onChange={handleChange}
                  required
                  aria-describedby="dob-hint"
                />
                <p className="cf-hint" id="dob-hint">
                  We use this to surprise you on your special day.
                </p>
              </div>

              {status === 'error' && (
                <div className="cf-error" role="alert">
                  {errorMsg}
                </div>
              )}

              <button
                className="cf-btn"
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <span className="cf-spinner" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Details
                    <ArrowRightIcon
                      className="cf-btn-icon"
                      width={12}
                      height={12}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function SuccessView({ name }) {
  return (
    <div className="cf-success" role="status">
      <div className="cf-success-emoji" aria-hidden="true">🎉</div>
      <h2 className="cf-success-title">You&apos;re on the list, {name}!</h2>
      <p className="cf-success-msg">
        We&apos;ll surprise you on your birthday. 🎂
      </p>
    </div>
  )
}

export default CustomerForm

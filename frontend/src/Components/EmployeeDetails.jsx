import { useState } from 'react'
import LogoutConfirmation from './LogoutConfirmation'

const formatJoiningDate = value => {
  if (!value) return value

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function EmployeeDetails({ employee, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!employee) {
    return (
      <main className="employee-portal">
        <section className="employee-profile-empty" role="alert">
          <h1>Profile unavailable</h1>
          <p>Your employee details could not be loaded. Please sign in again.</p>
          <button
            type="button"
            className="employee-portal-signout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Sign out
          </button>
          {showLogoutConfirm && (
            <LogoutConfirmation
              onCancel={() => setShowLogoutConfirm(false)}
              onConfirm={onLogout}
            />
          )}
        </section>
      </main>
    )
  }

  const employeeName = employee.employeeName || 'Employee'
  const salaryValue = Number(employee.salary)
  const salaryText =
    employee.salary === null ||
    employee.salary === undefined ||
    employee.salary === '' ||
    !Number.isFinite(salaryValue)
      ? 'Not provided'
      : `₹${salaryValue.toLocaleString('en-IN')}`
  const initials = employeeName
    .split(/\s+/)
    .slice(0, 2)
    .map(namePart => namePart.charAt(0))
    .join('')
    .toUpperCase()

  const details = [
    { label: 'Full name', value: employeeName },
    { label: 'Email address', value: employee.email },
    { label: 'Mobile number', value: employee.mobileNumber },
    { label: 'Department', value: employee.department },
    { label: 'Designation', value: employee.designation },
    { label: 'Salary', value: salaryText },
    { label: 'Joining date', value: formatJoiningDate(employee.joiningDate) }
  ]

  return (
    <main className="employee-portal">
      <header className="employee-portal-header">
        <div className="employee-portal-brand">
          <span className="employee-portal-brand-mark">E</span>
          <span>
            Employee
            <small>Management Portal</small>
          </span>
        </div>
        <button
          type="button"
          className="employee-portal-signout"
          onClick={() => setShowLogoutConfirm(true)}
        >
          Sign out
        </button>
      </header>

      <section className="employee-portal-content">
        <div className="employee-portal-welcome">
          <div>
            <p className="employee-portal-overline">EMPLOYEE PORTAL</p>
            <h1>Welcome, {employeeName}</h1>
            <p className="employee-portal-subtitle">
              Here are the details associated with your employee profile.
            </p>
          </div>
          <div className="employee-portal-avatar" aria-hidden="true">
            {initials}
          </div>
        </div>

        <section className="employee-profile-card" aria-labelledby="employee-profile-title">
          <div className="employee-profile-heading">
            <div>
              <h2 id="employee-profile-title">My employee details</h2>
              <p>Your information currently stored in the employee database.</p>
            </div>
            <div className="employee-profile-id">
              <span>EMPLOYEE ID</span>
              <strong>{employee.employeeId}</strong>
            </div>
          </div>

          <div className="employee-info-grid">
            {details.map(detail => (
              <div className="employee-info-item" key={detail.label}>
                <span>{detail.label}</span>
                <strong>
                  {detail.value === null ||
                  detail.value === undefined ||
                  detail.value === ''
                    ? 'Not provided'
                    : detail.value}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <p className="employee-portal-footnote">
          For changes to your employee information, please contact your administrator.
        </p>
      </section>
      {showLogoutConfirm && (
        <LogoutConfirmation
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={onLogout}
        />
      )}
    </main>
  )
}

export default EmployeeDetails
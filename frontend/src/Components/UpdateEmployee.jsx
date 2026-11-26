
import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../apiconfig'

const API_URL = `${API_BASE_URL}/api/employees`

function UpdateEmployee({ employee, onEmployeeUpdated, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    department: 'IT',
    designation: '',
    salary: '',
    joiningDate: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const joiningDateRef = useRef(null)

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.employeeName || '',
        email: employee.email || '',
        mobile: employee.mobileNumber || '',
        department: employee.department || 'IT',
        designation: employee.designation || '',
        salary: employee.salary ?? '',
        joiningDate: employee.joiningDate || ''
      })
    }
  }, [employee])

  const handleChange = (e) => {
    setForm(currentForm => ({
      ...currentForm,
      [e.target.name]: e.target.value
    }))
    setError('')
    setNotice('')
  }

  const openJoiningDatePicker = () => {
    const dateInput = joiningDateRef.current
    if (!dateInput) return

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker()
    } else {
      dateInput.focus()
      dateInput.click()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    const employeeData = {
      employeeName: form.name.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobile.trim(),
      department: form.department,
      designation: form.designation.trim(),
      salary: form.salary === '' ? null : Number(form.salary),
      joiningDate: form.joiningDate || null
    }

    const originalEmployeeData = {
      employeeName: (employee.employeeName || '').trim(),
      email: (employee.email || '').trim(),
      mobileNumber: (employee.mobileNumber || '').trim(),
      department: employee.department || 'IT',
      designation: (employee.designation || '').trim(),
      salary:
        employee.salary === '' ||
        employee.salary === null ||
        employee.salary === undefined
          ? null
          : Number(employee.salary),
      joiningDate: employee.joiningDate || null
    }

    const hasChanges = Object.keys(employeeData).some(
      key => employeeData[key] !== originalEmployeeData[key]
    )

    if (!hasChanges) {
      setNotice('Nothing to update.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/${employee.employeeId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData)
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          result.message ||
          Object.values(result).join(', ') ||
          'Unable to update employee'
        )
      }

      onEmployeeUpdated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="employee-form">
      <div className="form-header">
        <div>
          <h2>Update Employee</h2>
          <p>Edit the employee information below.</p>
        </div>
      </div>

      <div className="employee-id-display">
        <span>Employee ID</span>
        <strong>{employee.employeeId}</strong>
      </div>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-info" role="status">{notice}</div>}

      <form onSubmit={handleSubmit}>
        <div className="employee-form-grid">
          <div className="form-group">
            <label>Employee Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              maxLength="15"
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="FINANCE">Finance</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              maxLength="30"
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="joining-date">Joining Date</label>
            <div className={`date-input-control${form.joiningDate ? ' has-date' : ''}`}>
              <input
                ref={joiningDateRef}
                id="joining-date"
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
              />
              {!form.joiningDate && (
                <span className="date-input-placeholder" aria-hidden="true">
                  Select a date...
                </span>
              )}
              <button
                type="button"
                className="date-picker-btn"
                aria-label="Choose joining date"
                onClick={openJoiningDatePicker}
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="5" width="14" height="12" rx="2" />
                  <path d="M6 3.5v3M14 3.5v3M3.5 8.5h13" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="employee-form-actions">
          <button
            type="button"
            className="form-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateEmployee

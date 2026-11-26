
import { useState, useEffect } from 'react'
import './App.css'

import AddEmployee from './Components/AddEmployee'
import UpdateEmployee from './Components/UpdateEmployee'
import DeleteEmployee from './Components/DeleteEmployee'
import Login from './Components/Login'
import EmployeeDetails from './Components/EmployeeDetails'
import { API_BASE_URL } from './apiconfig'

const API_URL = `${API_BASE_URL}/api/employees`
const DEPARTMENTS = [
  { code: 'IT', label: 'IT Department' },
  { code: 'HR', label: 'HR Department' },
  { code: 'FINANCE', label: 'Finance Department' },
  { code: 'PRODUCTION', label: 'Production Department' }
]

const getInitials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()

const formatDate = (value) => {
  if (!value) return 'Date not provided'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function App() {

  const [authUser, setAuthUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')

  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // GET ALL EMPLOYEES
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to fetch employees')
      }

      const data = await response.json()
      setEmployees(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authUser?.role === 'ADMIN') {
      fetchEmployees()
    }
  }, [authUser])

  useEffect(() => {
    if (!message) return

    const timeoutId = window.setTimeout(() => setMessage(''), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [message])

  // SEARCH AND FILTER
  const filteredEmployees = employees.filter(employee =>
    (
      (employee.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (employee.email || '').toLowerCase().includes(search.toLowerCase())
    ) &&
    (
      department === 'All' ||
      (employee.department || '').toUpperCase() === department
    )
  )

  const departmentStats = DEPARTMENTS.map(item => ({
    ...item,
    count: employees.filter(
      employee => (employee.department || '').toUpperCase() === item.code
    ).length
  }))

  const recentEmployees = [...employees]
    .sort((first, second) => {
      const firstDate = Date.parse(first.joiningDate || '') || 0
      const secondDate = Date.parse(second.joiningDate || '') || 0
      return secondDate - firstDate
    })
    .slice(0, 4)

  // OPEN ADD EMPLOYEE
  const openAddForm = () => {
    setEditingEmployee(null)
    setMessage('')
    setError('')
    setShowForm(true)
  }

  // OPEN UPDATE EMPLOYEE
  const openEditForm = (employee) => {
    setEditingEmployee(employee)
    setMessage('')
    setError('')
    setShowForm(true)
  }

  // AFTER ADD
  const handleEmployeeAdded = async () => {
    setShowForm(false)
    setActiveView('employees')
    setMessage('Employee added successfully.')
    await fetchEmployees()
  }

  // AFTER UPDATE
  const handleEmployeeUpdated = async () => {
    setShowForm(false)
    setEditingEmployee(null)
    setActiveView('employees')
    setMessage('Employee updated successfully.')
    await fetchEmployees()
  }

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false)
    setEditingEmployee(null)
    setError('')
  }

  // AFTER DELETE
  const handleEmployeeDeleted = async () => {
    setActiveView('employees')
    setMessage('Employee deleted successfully.')
    await fetchEmployees()
  }

  const handleLogout = () => {
    setAuthUser(null)
    setEmployees([])
    setMessage('')
    setError('')
  }

  if (!authUser) {
    return <Login onLogin={setAuthUser} />
  }

  if (authUser.role === 'EMPLOYEE') {
    return (
      <EmployeeDetails
        employee={authUser.employee}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2>EMS<span>.</span></h2>

        <p className="menu-title">MENU</p>

        <button
          type="button"
          className={`menu ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
          aria-current={activeView === 'dashboard' ? 'page' : undefined}
        >
          ▦ &nbsp; Dashboard
        </button>

        <button
          type="button"
          className={`menu ${activeView === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveView('employees')}
          aria-current={activeView === 'employees' ? 'page' : undefined}
        >
          ♙ &nbsp; Employees
        </button>

        <button
          type="button"
          className={`menu ${activeView === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveView('departments')}
          aria-current={activeView === 'departments' ? 'page' : undefined}
        >
          ▤ &nbsp; Departments
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* HEADER */}
        <header className="topbar">

          <div>
            <h2>
              {activeView === 'dashboard'
                ? 'Employee Management'
                : activeView === 'employees'
                  ? 'Employee Directory'
                  : 'Department Overview'}
            </h2>
            <p>
              {activeView === 'dashboard'
                ? 'Manage your workforce from one clear overview'
                : activeView === 'employees'
                  ? 'View and manage your employee records'
                  : 'Explore employee distribution by department'}
            </p>
          </div>

          <div className="topbar-user">
            <div className="profile">Admin</div>
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>

        </header>

        <section className="content">

          {/* PAGE TITLE */}
          <div className="welcome">


            {activeView === 'dashboard' && (
              <button
                type="button"
                className="dashboard-manage-btn"
                onClick={() => setActiveView('employees')}
              >
                Manage employees
                <span aria-hidden="true">→</span>
              </button>
            )}

          </div>

          {/* SUCCESS AND ERROR MESSAGES */}
          {message && (
            <div className="success-toast" role="status" aria-live="polite">
              <span className="success-toast-icon" aria-hidden="true">✓</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* DASHBOARD SUMMARY */}
          {activeView === 'dashboard' && (
            <div className="stats">

            <div className="stat-card">
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
            </div>

            {departmentStats.map(item => (
              <div className="stat-card" key={item.code}>
                <p>{item.label}</p>
                <h2>{item.count}</h2>
              </div>
            ))}

          </div>
          )}

          {activeView === 'dashboard' && (
            <div className="dashboard-panels">
              <section className="dashboard-panel department-overview">
                <div className="dashboard-panel-heading">
                  <div>
                    <p className="dashboard-panel-kicker">TEAM BREAKDOWN</p>
                    <h2>Department overview</h2>
                    <p>See how your team is distributed.</p>
                  </div>
                  <span className="dashboard-panel-icon" aria-hidden="true">▤</span>
                </div>

                <div className="department-overview-list">
                  {departmentStats.map(item => {
                    const percentage = employees.length
                      ? Math.round((item.count / employees.length) * 100)
                      : 0

                    return (
                      <div
                        className={`department-overview-item department-${item.code.toLowerCase()}`}
                        key={item.code}
                      >
                        <div className="department-overview-label">
                          <span>{item.label.replace(' Department', '')}</span>
                          <strong>{item.count}</strong>
                        </div>
                        <div
                          className="department-progress"
                          role="progressbar"
                          aria-label={`${item.label} share`}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <span style={{ width: `${percentage}%` }} />
                        </div>
                        <small>{percentage}% of employees</small>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="dashboard-panel recent-joiners">
                <div className="dashboard-panel-heading">
                  <div>
                    <p className="dashboard-panel-kicker">LATEST ADDITIONS</p>
                    <h2>Recent employees</h2>
                    <p>Your newest team members.</p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-text-btn"
                    onClick={() => setActiveView('employees')}
                  >
                    View all <span aria-hidden="true">→</span>
                  </button>
                </div>

                {loading && employees.length === 0 && (
                  <p className="dashboard-empty-state">Loading employee records...</p>
                )}

                {!loading && recentEmployees.length > 0 && (
                  <div className="recent-employee-list">
                    {recentEmployees.map(employee => (
                      <div className="recent-employee-item" key={employee.employeeId}>
                        <span className="recent-employee-avatar" aria-hidden="true">
                          {getInitials(employee.employeeName)}
                        </span>
                        <div className="recent-employee-info">
                          <strong>{employee.employeeName || 'Unnamed employee'}</strong>
                          <span>
                            {[employee.department, employee.designation]
                              .filter(Boolean)
                              .join(' · ') || 'Employee'}
                          </span>
                        </div>
                        <time dateTime={employee.joiningDate || undefined}>
                          {formatDate(employee.joiningDate)}
                        </time>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && recentEmployees.length === 0 && (
                  <div className="dashboard-empty-state">
                    <p>No employee records yet.</p>
                    <button
                      type="button"
                      className="dashboard-text-btn"
                      onClick={() => setActiveView('employees')}
                    >
                      Go to Employees <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* EMPLOYEE LIST */}
          {activeView === 'employees' && (
          <div className="table-card">

            <div className="table-heading">

              <div>
                <h2>Employee List</h2>
                <p>View and manage employee details</p>
              </div>

              <div className="employee-table-tools">
                {/* SEARCH AND FILTER */}
                <div className="filters">

                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />

                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map(item => (
                      <option value={item.code} key={item.code}>
                        {item.label.replace(' Department', '')}
                      </option>
                    ))}
                  </select>

                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={openAddForm}
                >
                  + Add Employee
                </button>
              </div>

            </div>

            {/* EMPLOYEE DETAILS */}
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Joining Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {loading && employees.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty">
                        Loading employees...
                      </td>
                    </tr>
                  )}

                  {!loading && filteredEmployees.map(employee => (

                    <tr key={employee.employeeId}>

                      <td>
                        <strong>{employee.employeeName}</strong>
                        <small>{employee.email}</small>
                        <small>{employee.employeeId}</small>
                      </td>

                      <td>{employee.mobileNumber}</td>

                      <td>
                        <span className="department-tag">
                          {employee.department}
                        </span>
                      </td>

                      <td>{employee.designation}</td>

                      <td>
                        ₹{Number(employee.salary).toLocaleString('en-IN')}
                      </td>

                      <td>{employee.joiningDate}</td>

                      <td>

                        {/* UPDATE COMPONENT */}
                        <button
                          className="edit-btn"
                          onClick={() => openEditForm(employee)}
                        >
                          Edit
                        </button>

                        {/* DELETE COMPONENT */}
                        <DeleteEmployee
                          employee={employee}
                          onEmployeeDeleted={handleEmployeeDeleted}
                        />

                      </td>

                    </tr>

                  ))}

                  {!loading && filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty">
                        No employees found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            <p className="record-count">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>

          </div>
          )}

          {activeView === 'departments' && (
            <div className="department-directory-grid">
              {departmentStats.map(item => (
                <article
                  className={`department-directory-card department-${item.code.toLowerCase()}`}
                  key={item.code}
                >
                  <div className="department-directory-heading">
                    <span className="department-directory-mark" aria-hidden="true">
                      {item.code.slice(0, 1)}
                    </span>
                    <div>
                      <h2>{item.label}</h2>
                      <p>
                        {item.count} {item.count === 1 ? 'employee' : 'employees'}
                      </p>
                    </div>
                  </div>
                  <div className="department-directory-count">
                    <span>Team size</span>
                    <strong>{item.count}</strong>
                  </div>
                  <button
                    type="button"
                    className="department-view-btn"
                    onClick={() => {
                      setDepartment(item.code)
                      setActiveView('employees')
                    }}
                  >
                    View employees <span aria-hidden="true">→</span>
                  </button>
                </article>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* ADD / UPDATE MODAL */}
      {showForm && (

        <div className="modal-overlay" onClick={closeForm}>

          <div className="modal" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              aria-label="Close employee form"
              onClick={closeForm}
            >
              ×
            </button>

            {editingEmployee ? (

              <UpdateEmployee
                employee={editingEmployee}
                onEmployeeUpdated={handleEmployeeUpdated}
                onCancel={closeForm}
              />

            ) : (
              <AddEmployee
                onEmployeeAdded={handleEmployeeAdded}
                onCancel={closeForm}
              />

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default App

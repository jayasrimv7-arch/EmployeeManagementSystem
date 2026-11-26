import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { API_BASE_URL } from '../apiconfig'

const API_URL = `${API_BASE_URL}/api/employees`

function DeleteEmployee({ employee, onEmployeeDeleted }) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!showConfirmation) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !deleting) {
        setShowConfirmation(false)
        setError('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showConfirmation, deleting])

  const closeConfirmation = () => {
    if (deleting) return
    setShowConfirmation(false)
    setError('')
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/${employee.employeeId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || 'Unable to delete employee')
      }

      setShowConfirmation(false)
      await onEmployeeDeleted?.(employee.employeeId)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to delete employee')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="delete-btn"
        onClick={() => {
          setError('')
          setShowConfirmation(true)
        }}
        title={`Delete ${employee.employeeName}`}
      >
        Delete
      </button>

      {showConfirmation && createPortal(
        <div
          className="delete-confirm-overlay"
          onClick={closeConfirmation}
        >
          <div
            className="delete-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-description"
            onClick={event => event.stopPropagation()}
          >
            <div className="delete-confirm-icon" aria-hidden="true">!</div>
            <h2 id="delete-confirm-title">Delete employee?</h2>
            <p id="delete-confirm-description">
              This will permanently remove <strong>{employee.employeeName}</strong> from your employee records.
              This action cannot be undone.
            </p>

            {error && <p className="delete-confirm-error" role="alert">{error}</p>}

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="delete-confirm-cancel"
                onClick={closeConfirmation}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-submit"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete employee'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default DeleteEmployee

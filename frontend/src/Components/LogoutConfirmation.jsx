function LogoutConfirmation({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <section
        className="modal logout-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        onClick={event => event.stopPropagation()}
      >
        <h2 id="logout-confirm-title">Sign out?</h2>
        <p>Do you want to sign out?</p>
        <div className="employee-form-actions">
          <button type="button" className="form-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="form-submit-btn" onClick={onConfirm}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}

export default LogoutConfirmation

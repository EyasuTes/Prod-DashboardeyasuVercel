import React, { useState } from 'react'
import { CCol, CFormCheck, CRow } from '@coreui/react'

const DepartmentsListPage = () => {
  const [ShowAddData, setShowAddData] = useState(false)

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-2 mt-2">Delete Account Request</h3>
        <p>Please fill the Form Below for Making the Delete Account Request.</p>
      </CCol>
      <CCol xs={6}>
        <div className="card">
          <div className="card-body">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setShowAddData(
                  'We received your Request for the Account Delation, It will be procees and update you via email.',
                )
              }}
            >
              <div className="form-group">
                <p>Please enter Any comment, if You want to Add</p>
                <textarea name="comments" className="form-control"></textarea>
              </div>
              <div className="form-group">
                <CFormCheck
                  required
                  name="is"
                  id="isConfirm"
                  label="I confirm to Sent Account Deletion Request"
                />
              </div>
              <div className="text-info m-2">{ShowAddData}</div>
              <div className="form-group">
                <button type="submit" className="btn btn-danger btn-lg text-white">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </CCol>
    </CRow>
  )
}

export default DepartmentsListPage

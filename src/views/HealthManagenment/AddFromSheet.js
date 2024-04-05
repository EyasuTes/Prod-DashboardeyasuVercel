import React from 'react'
import { CCard, CCardBody, CCol, CRow, CFormInput } from '@coreui/react'

const AddFromSheet = () => {
  return (
    <CRow>
      <CCol lg={12}>
        <h3 className="mb-4">Add From Sheet</h3>
      </CCol>
      <CCol lg={12}>
        <CCard className="mb-4 p-4">
          <CCardBody>
            <CRow className="mb-4">
              <CCol lg={6}>
                <CFormInput type="file" label="Import From Sheet" />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddFromSheet

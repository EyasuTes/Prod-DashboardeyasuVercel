import React from 'react'

import { CCol, CRow, CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const TemperatureForm = () => {
  return (
    <>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="date" label="Date" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="time" label="Time" />
        </CCol>
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Select Period">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="Temperature" placeholder="Enter Temperature" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Tool" placeholder="Lorem Ipsum" />
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol lg={8}>
          <CFormTextarea
            rows={3}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={12}>
          <CButton color="primary" className="me-3 px-4">
            Save
          </CButton>
          <CButton color="dark" variant="outline" className="px-4">
            Cancel
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default TemperatureForm

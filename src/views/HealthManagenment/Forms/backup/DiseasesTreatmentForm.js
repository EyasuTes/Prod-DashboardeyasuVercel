import React from 'react'

import { CCol, CRow, CButton, CFormInput, CFormTextarea } from '@coreui/react'

const DiseasesTreatmentForm = () => {
  return (
    <>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="Disease" placeholder="Lorem Ipsum" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Symptoms" placeholder="Lorem Ipsum" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={3}>
          <CFormInput type="date" label="Observation Date" />
        </CCol>
        <CCol lg={3}>
          <CFormInput type="time" label="Observation Time" />
        </CCol>
        <CCol lg={3}>
          <CFormInput type="time" label="&nbsp;" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="Treatment" placeholder="2 cc Subcut (S/C)" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Description" placeholder="Half a vial (S/C)" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={3}>
          <CFormInput type="date" label="Treatment Date" />
        </CCol>
        <CCol lg={3}>
          <CFormInput type="time" label="Treatment Time" />
        </CCol>
        <CCol lg={3}>
          <CFormInput type="time" label="&nbsp;" />
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

export default DiseasesTreatmentForm

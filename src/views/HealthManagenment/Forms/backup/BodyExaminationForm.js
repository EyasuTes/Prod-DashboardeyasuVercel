import React from 'react'

import { CCol, CRow, CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const BodyExaminationForm = () => {
  return (
    <>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="date" label="Date" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="time" label="Time" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="General Body Condition">
            <option>Select Body Condition</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Skin Condition">
            <option>Select Skin Condition</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Eyes Condition">
            <option>Select Eyes Condition</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Nose Condition">
            <option>Select Nose Condition</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Mucous Membranes Condition">
            <option>Select Mucous Membranes Condition</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
            label="Comments"
            placeholder="Write any observed comment"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="Heart Rate" placeholder="Enter Heart Rate / BPM" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput
            type="text"
            label="Ruminal Movement"
            placeholder="Enter Ruminal Movement / Per Minute"
          />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput
            type="text"
            label="Respiratory Rate"
            placeholder="Enter Respiratory Rate / Per Minute"
          />
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Body Examination">
            <option>Select Body Examination</option>
            <option>One</option>
            <option>Two</option>
            <option>Three</option>
          </CFormSelect>
        </CCol>
        <CCol lg={6}>
          <CFormTextarea
            rows={1}
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

export default BodyExaminationForm

import React, { useState } from 'react'

import CIcon from '@coreui/icons-react'
import { cilClock, cilPlus } from '@coreui/icons'
import {
  CCol,
  CRow,
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CNavLink,
} from '@coreui/react'
import VaccinationsImport from './VaccinationsImport'

const VaccinationsForm = () => {
  const [isImport, setisImport] = useState(false)
  return (
    <>
      <div className="mb-4" style={{ display: isImport ? '' : 'none' }}>
        <VaccinationsImport />
      </div>
      <CRow className="mb-4" style={{ display: isImport ? 'none' : '' }}>
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Select Vaccination">
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
          </CFormSelect>
        </CCol>
        <CCol lg={4}>
          <CFormSelect id="inputState" label="&nbsp;">
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
          </CFormSelect>
        </CCol>
        <CCol lg={4} className="text-center">
          <CButton color="primary" variant="outline" shape="rounded-pill">
            <CIcon icon={cilPlus} />
          </CButton>
          <p className="mb-0">Add More</p>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="date" label="Vaccine Date" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="time" label="Vaccine Start & End Time" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="time" label="&nbsp;" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormSelect id="inputState" label="Specify Dose">
            <option>2 cc Subcut (S/C)</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
          </CFormSelect>
        </CCol>
        <CCol lg={4}>
          <CFormSelect id="inputState" label="&nbsp;">
            <option>Half a vial (S/C)</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
            <option>Lorem Ipsum</option>
          </CFormSelect>
        </CCol>
        <CCol lg={4} className="text-center">
          <CButton color="primary" variant="outline" shape="rounded-pill">
            <CIcon icon={cilPlus} />
          </CButton>
          <p className="mb-0">Add More</p>
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol lg={12}>
          <CFormTextarea
            rows={3}
            label="Specify Dose"
            placeholder="2 cc Subcut (S/C)"
          ></CFormTextarea>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={6}>
          <CButton color="primary" className="me-3 px-4">
            Save
          </CButton>
          <CButton color="dark" variant="outline" className="px-4">
            Cancel
          </CButton>
        </CCol>
        <CCol lg={6} className="mt-lg-0 mt-4 d-lg-flex justify-content-end">
          <div className="me-lg-4 me-0">
            <CNavLink href="#">
              <CIcon icon={cilPlus} size="lg" /> &nbsp; Add More
            </CNavLink>
          </div>
          <div className="mt-lg-0 mt-2">
            <CNavLink href="#">
              <CIcon icon={cilClock} size="lg" /> &nbsp; Set Reminder
            </CNavLink>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default VaccinationsForm

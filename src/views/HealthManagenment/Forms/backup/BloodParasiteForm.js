import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'

import {
  CCol,
  CRow,
  CButton,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const BloodParasiteForm = () => {
  return (
    <>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            <b>Import</b>
          </CButton>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="date" label="Date" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Clinic" placeholder="Lorem Ipsum" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Animal Type" placeholder="Camel" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="Doctor" placeholder="Lorem Ipsum" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="Contact" placeholder="+971 01245 15412" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <h4>RESULT</h4>
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol lg={12}>
          <CTable striped responsive className="text-center">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">S.NO.</CTableHeaderCell>
                <CTableHeaderCell scope="col">Animal ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">ANAPLASMA</CTableHeaderCell>
                <CTableHeaderCell scope="col">THEILERIA</CTableHeaderCell>
                <CTableHeaderCell scope="col">BABESIA</CTableHeaderCell>
                <CTableHeaderCell scope="col">TRYPANO</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>1</CTableDataCell>
                <CTableDataCell>12345</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>2</CTableDataCell>
                <CTableDataCell>12346</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>3</CTableDataCell>
                <CTableDataCell>12347</CTableDataCell>
                <CTableDataCell>SEEN</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>4</CTableDataCell>
                <CTableDataCell>12348</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>5</CTableDataCell>
                <CTableDataCell>12349</CTableDataCell>
                <CTableDataCell>SEEN</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>6</CTableDataCell>
                <CTableDataCell>12350</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>7</CTableDataCell>
                <CTableDataCell>12351</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
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

export default BloodParasiteForm

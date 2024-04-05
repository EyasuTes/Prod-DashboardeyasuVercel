import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'

import {
  CCol,
  CRow,
  CButton,
  CFormInput,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const HaematoBioForm = () => {
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
          <h4>HAEMATOLOGY</h4>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <CTable striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Particular</CTableHeaderCell>
                <CTableHeaderCell scope="col">Result</CTableHeaderCell>
                <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                <CTableHeaderCell scope="col">Normal Range</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>WBC</CTableDataCell>
                <CTableDataCell>18.4</CTableDataCell>
                <CTableDataCell>110-3/L</CTableDataCell>
                <CTableDataCell>8.0 - 16.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>RBC</CTableDataCell>
                <CTableDataCell>12.6</CTableDataCell>
                <CTableDataCell>10-6/L</CTableDataCell>
                <CTableDataCell>7.0 - 11.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>HGB</CTableDataCell>
                <CTableDataCell>16.0</CTableDataCell>
                <CTableDataCell>G/L</CTableDataCell>
                <CTableDataCell>11.0 - 16.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>HCT - PCV</CTableDataCell>
                <CTableDataCell>33.8</CTableDataCell>
                <CTableDataCell>%</CTableDataCell>
                <CTableDataCell>25.0 - 33.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCV</CTableDataCell>
                <CTableDataCell>26.8</CTableDataCell>
                <CTableDataCell>fL</CTableDataCell>
                <CTableDataCell>26.0 - 35.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCH</CTableDataCell>
                <CTableDataCell>12.7</CTableDataCell>
                <CTableDataCell>pg</CTableDataCell>
                <CTableDataCell>12.5 - 17.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCHO</CTableDataCell>
                <CTableDataCell>47.3</CTableDataCell>
                <CTableDataCell>g/dl</CTableDataCell>
                <CTableDataCell>40.0 - 50.0</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <h4>BIOCHEMISTRY</h4>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <CTable striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Particular</CTableHeaderCell>
                <CTableHeaderCell scope="col">Result</CTableHeaderCell>
                <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                <CTableHeaderCell scope="col">Normal Range</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>WBC</CTableDataCell>
                <CTableDataCell>18.4</CTableDataCell>
                <CTableDataCell>110-3/L</CTableDataCell>
                <CTableDataCell>8.0 - 16.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>RBC</CTableDataCell>
                <CTableDataCell>12.6</CTableDataCell>
                <CTableDataCell>10-6/L</CTableDataCell>
                <CTableDataCell>7.0 - 11.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>HGB</CTableDataCell>
                <CTableDataCell>16.0</CTableDataCell>
                <CTableDataCell>G/L</CTableDataCell>
                <CTableDataCell>11.0 - 16.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>HCT - PCV</CTableDataCell>
                <CTableDataCell>33.8</CTableDataCell>
                <CTableDataCell>%</CTableDataCell>
                <CTableDataCell>25.0 - 33.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCV</CTableDataCell>
                <CTableDataCell>26.8</CTableDataCell>
                <CTableDataCell>fL</CTableDataCell>
                <CTableDataCell>26.0 - 35.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCH</CTableDataCell>
                <CTableDataCell>12.7</CTableDataCell>
                <CTableDataCell>pg</CTableDataCell>
                <CTableDataCell>12.5 - 17.0</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>MCHO</CTableDataCell>
                <CTableDataCell>47.3</CTableDataCell>
                <CTableDataCell>g/dl</CTableDataCell>
                <CTableDataCell>40.0 - 50.0</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <h5>PARASITOLOGY</h5>
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={4}>
          <CFormInput type="text" label="NAMETODE" placeholder="Lorem" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="CESTODE" placeholder="Lorem" />
        </CCol>
        <CCol lg={4}>
          <CFormInput type="text" label="E.C." placeholder="Lorem" />
        </CCol>
      </CRow>
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol lg={6}>
          <h5 className="mb-4">DIAGNOSTIC</h5>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
          ></CFormTextarea>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
          ></CFormTextarea>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
          ></CFormTextarea>
        </CCol>
        <CCol lg={6}>
          <h5 className="mb-4">TREATMENT</h5>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
          ></CFormTextarea>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
          ></CFormTextarea>
          <CFormTextarea
            rows={2}
            className="mb-4"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla gravida ornare. Praesent dignissim lorem sed sapien viverra volutpat."
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

export default HaematoBioForm

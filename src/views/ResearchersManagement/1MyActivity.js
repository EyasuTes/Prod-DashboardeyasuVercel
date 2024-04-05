import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilFilter, cilSave, cilSortDescending } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CBadge,
  CPagination,
  CPaginationItem,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { NODEAPIURL, showdatetimein } from '../../config'
import AddWorkers from '../WorkersManagement/AddWorkers'

const MyActivity = () => {
  let keyword = ''
  const [ForEmpID, setForEmpID] = useState(0)
  const [ResetPassword, setResetPassword] = useState(false)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowAddWorkers, setShowAddWorkers] = useState(false)

  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkerslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkerslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchWorkersList()
  }, [])

  let AddForm = ''
  if (ShowAddWorkers) {
    AddForm = (
      <AddWorkers
        ForEmpID={ForEmpID}
        setShowAddWorkers={setShowAddWorkers}
        FilterWorkersList={FilterWorkersList}
        ResetPassword={ResetPassword}
      />
    )
  }

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <h3 className="mb-4">My Activity</h3>
      </CCol>
      <CCol lg={7} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CForm className="mb-lg-5 mb-4">
          <CFormInput
            type="text"
            placeholder="Search Here"
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              keyword = e.target.value
              FilterWorkersList()
            }}
          />
        </CForm>
      </CCol>
      <CCol lg={5} className="mb-lg-0 mb-5" style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CButton color="primary" className="me-3">
          <CIcon icon={cilSortDescending} />
        </CButton>
        <CButton color="primary" className="me-3">
          <CIcon icon={cilFilter} />
        </CButton>
        <CButton
          color="primary"
          className="me-3"
          onClick={() => {
            setForEmpID('new')
            setResetPassword(false)
            setShowAddWorkers(true)
          }}
        >
          <CIcon icon={cilCloudUpload} />
        </CButton>
        <CButton color="primary" variant="outline">
          <CIcon icon={cilSave} className="me-2" />
          Export
        </CButton>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable striped responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assign To</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Highlighted</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.emp_id}>
                    <CTableDataCell>
                      <CFormCheck id="flexCheckDefault" />
                    </CTableDataCell>
                    <CTableDataCell>{singi.mobile}</CTableDataCell>
                    <CTableDataCell>Lorem Ipsum </CTableDataCell>
                    <CTableDataCell style={{ width: '20%' }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt.
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{showdatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>{showdatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>In Progress</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">Yes</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CPagination align="end" aria-label="Page navigation example">
          <CPaginationItem>Previous</CPaginationItem>
          <CPaginationItem>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem>Next</CPaginationItem>
        </CPagination>
      </CCol>
    </CRow>
  )
}

export default MyActivity

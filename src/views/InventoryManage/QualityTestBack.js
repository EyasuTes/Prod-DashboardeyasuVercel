import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilSave, cilSortDescending } from '@coreui/icons'
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
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { NODEAPIURL, showdatetimein } from '../../config'
import AddWorkers from '../WorkersManagement/AddWorkers'

const QualityTest = () => {
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

  const updateWorkersStatus = async (emp_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateWorkersStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status,
          emp_id,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        FilterWorkersList(resJson.data)
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
        <h3 className="mb-4">Quality Test</h3>
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
                  <CTableHeaderCell scope="col">Inventory Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Test Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Result Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.emp_id}>
                    <CTableDataCell>
                      <CFormCheck id="flexCheckDefault" />
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{singi.email}</CTableDataCell>
                    <CTableDataCell>{singi.emp_id}</CTableDataCell>
                    <CTableDataCell>{singi.mobile}</CTableDataCell>
                    <CTableDataCell>{showdatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      <CNav variant="pills">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle className={singi.status === 1 ? '' : 'bg-danger'}>
                            {singi.status === 1 ? 'Active' : 'Inactive'}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              href="#"
                              onClick={(e) => {
                                setForEmpID(singi.emp_id)
                                setResetPassword(false)
                                setShowAddWorkers(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            {/* <CDropdownItem href="#">Reset Password</CDropdownItem> */}
                            <CDropdownItem
                              href="#"
                              onClick={(e) => {
                                setForEmpID(singi.emp_id)
                                setShowAddWorkers(true)
                                setResetPassword(true)
                              }}
                            >
                              Reset Password
                            </CDropdownItem>
                            <CDropdownItem href="#">Activity</CDropdownItem>
                            {/* <CDropdownItem href="#">Delete</CDropdownItem> */}
                            <CDropdownItem
                              href="#"
                              onClick={(e) => {
                                updateWorkersStatus(singi.emp_id, singi.status === 1 ? 0 : 1)
                              }}
                            >
                              {singi.status === 1 ? 'De-activate' : 'Activate'}
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
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

export default QualityTest

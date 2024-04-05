import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilSave, cilSortAscending, cilSortDescending } from '@coreui/icons'
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
  // CFormCheck,
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  // CPagination,
  // CPaginationItem,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { NODEAPIURL, showdatetimein } from '../../config'
import AddWorkers from './AddWorkers'
// import { findByText } from '@testing-library/react'

let SortStatusType = 'ASC'
const WorkersList = () => {
  let keyword = ''
  const tableRef = useRef(null)
  const [ForEmpID, setForEmpID] = useState(0)
  const [ResetPassword, setResetPassword] = useState(false)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowAddWorkers, setShowAddWorkers] = useState(false)

  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkerslist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          new_status,
          emp_id,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
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
        <h3 className="mb-4">Manage Staff</h3>
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
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
            onClick={() => {
              SortStatusType = 'DESC'
              FilterWorkersList()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterWorkersList()
            }}
          />
        </CButton>
        {/* <CButton color="primary" className="me-3">
          <CIcon icon={cilFilter} />
        </CButton> */}
        <CButton
          color="primary"
          className="me-3"
          onClick={() => {
            setForEmpID('new')
            setResetPassword(false)
            setShowAddWorkers(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email Id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.emp_id}>
                    <CTableDataCell>{singi.emp_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{singi.mobile}</CTableDataCell>
                    <CTableDataCell>{singi.email}</CTableDataCell>
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
                              onClick={(e) => {
                                setForEmpID(singi.emp_id)
                                setShowAddWorkers(true)
                                setResetPassword(true)
                              }}
                            >
                              Reset Password
                            </CDropdownItem>
                            <CDropdownItem href="#/workers-activity">Activity</CDropdownItem>
                            {/* <CDropdownItem href="#">Delete</CDropdownItem> */}
                            <CDropdownItem
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
    </CRow>
  )
}

export default WorkersList

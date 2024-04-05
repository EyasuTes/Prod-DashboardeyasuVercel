import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'

import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeLetter,
  // cilDescription,
  // cilFilter,
  // cilPlus,
  cilSave,
  cilSortAscending,
  cilSortDescending,
} from '@coreui/icons'
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
  // CPagination,
  // CPaginationItem,
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CTableFoot,
} from '@coreui/react'
import {
  NODEAPIURL,
  // ShowBetweenTime,
  // showFulldatetimein,
  GetMondayDate,
  GetTodayDate,
  showFulldatetimein,
} from '../../config'
// import AddWorkers from './AddWorkers'

let emp_id = ''
let keyword = ''
let SortStatusType = 'DESC'
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()

const WorkersLeaveRequest = () => {
  const tableRef = useRef(null)
  // const [ForEmpID, setForEmpID] = useState(0)
  // const [ResetPassword, setResetPassword] = useState(false)
  const [WorkerListData, setWorkerListData] = useState([])
  // const [WorkerStatusData] = useState([])
  const [AttendanceListData, setAttendanceListData] = useState([])
  // const [EmpAttendanceStatus, setEmpAttendanceStatus] = useState([])

  const endWorkersSession = async (emp_id, token) => {
    // alert(emp_id)
    try {
      const res = await fetch(`${NODEAPIURL}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          emp_id,
          token,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      FetchAttendanceListData()
      if (res.status === 200) {
        console.log(resJson.message)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchWorkersList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/listWorkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        setWorkerListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchAttendanceListData = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getWorkerLoginLogData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          FilterFromDate,
          FilterToDate,
          emp_id,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterAttendanceListData = async () => {
    // alert(2)
    setAttendanceListData([])
    FetchWorkersList()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getWorkerLoginLogData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          FilterFromDate,
          FilterToDate,
          emp_id,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
        // alert(1)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    emp_id = ''
    keyword = ''
    SortStatusType = 'DESC'
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
    FetchAttendanceListData()
    FetchWorkersList()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-3 mt-3">Login Log</h3>
      </CCol>
      <CCol md={9}>
        <CForm className="mb-lg-4 mb-4">
          <CRow>
            <CCol md={3}>
              <label>From Date</label>
              <CFormInput
                type="date"
                value={FilterFromDate}
                placeholder="Enter Year"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  FilterFromDate = e.target.value
                  FilterAttendanceListData()
                }}
              />
            </CCol>
            <CCol md={3}>
              <label>To Date</label>
              <CFormInput
                type="date"
                min={FilterFromDate}
                defaultValue={FilterToDate}
                placeholder="Enter Year"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  FilterToDate = e.target.value
                  FilterAttendanceListData()
                }}
              />
            </CCol>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormSelect
                defaultValue={emp_id}
                onChange={(e) => {
                  emp_id = e.target.value
                  FilterAttendanceListData()
                }}
              >
                <option value="">All Workers</option>
                {WorkerListData.map((singi) => (
                  <option key={singi.emp_id} value={singi.emp_id}>
                    {singi.f_name} {singi.l_name} ({singi.email})
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormInput
                type="text"
                placeholder="Search Here"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  keyword = e.target.value
                  FilterAttendanceListData()
                }}
              />
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol md={3} className="mb-lg-0 mb-5">
        <label>&nbsp;</label>
        <br />
        <CButton color="primary" className="me-3">
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
            onClick={() => {
              SortStatusType = 'DESC'
              FilterAttendanceListData()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterAttendanceListData()
            }}
          />
        </CButton>
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Updated on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Device</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Action</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;
                      {singi.email}
                    </CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.startAt)}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.endAt)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.status === 1 ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure to End the User Login Sesssion? The user will be logout from his/ her Device.',
                              )
                            ) {
                              endWorkersSession(singi.emp_id, singi.token)
                            }
                          }}
                        >
                          Active
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-danger">Ended</button>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>{singi.device}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">Device</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Updated on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WorkersLeaveRequest

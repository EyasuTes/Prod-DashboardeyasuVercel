import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  // cilDescription,
  // cilFilter,
  // cilPencil,
  // cilPlus,
  cilSave,
  cilSortDescending,
  cilSortAscending,
  cilEnvelopeLetter,
  //   cilWarning,
  // cilMedicalCross,
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
} from '@coreui/react'
import {
  NODEAPIURL,
  // showdateYMDtoLocal,
  GetMondayDate,
  GetTodayDate,
  showFulldatetimein,
  // UPLOADSsURL,
  GetArrayFromJson,
} from '../../config'
// import { Link } from 'react-router-dom'
// import AddWorkers from './AddWorkers'

let SortStatusType = 'DESC'
let keyword = ''
let emp_id = ''
let FilterFromDate = '' // GetMondayDate()
let FilterToDate = '' // GetTodayDate()

const AnimalsLogsPage = () => {
  const tableRef = useRef(null)
  const [NotiEmpID, setNotiEmpID] = useState(0)
  const [FilterKeyword, setFilterKeyword] = useState(keyword)
  const [WorkersData, setWorkersData] = useState([])
  const [NotificationsData, setNotificationsData] = useState([])

  const FetchWorkers = async () => {
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
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setWorkersData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterNotifications = async () => {
    // alert(2)
    // setWorkedListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAnimalsLogs`, {
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
          SortStatusType,
          recordsPerPage: 10,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setNotificationsData(resJson.data)
        // alert(1)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchWorkers()
    let AllPermission = GetArrayFromJson(localStorage.getItem('AllPermission'))
    if (AllPermission && AllPermission.length > 0) {
      emp_id = AllPermission[0].emp_id ? AllPermission[0].emp_id : ''
      setNotiEmpID(emp_id)
    }
    SortStatusType = 'DESC'
    const TempFromDate = localStorage.getItem('FilterFromDate')
    if (TempFromDate && TempFromDate !== '') {
      FilterFromDate = TempFromDate
      localStorage.removeItem('FilterFromDate')
    } else {
      FilterFromDate = GetMondayDate()
    }
    const TempKeyword = localStorage.getItem('FilterKeyword')
    if (TempKeyword && TempKeyword !== '') {
      keyword = TempKeyword
      localStorage.removeItem('FilterKeyword')
    }
    setFilterKeyword(keyword)
    FilterToDate = GetTodayDate()
    FilterNotifications()
  }, [])

  return (
    <CRow>
      <CCol md={12}>
        <h3 className="mb-3 mt-2">Animal Logs</h3>
      </CCol>
      <CCol md={9}>
        <CForm className="mb-lg-3 mb-3">
          <CRow>
            <CCol md={3}>
              <label>From Date</label>
              <CFormInput
                type="date"
                defaultValue={FilterFromDate}
                placeholder="Enter Year"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  FilterFromDate = e.target.value
                  FilterNotifications()
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
                  FilterNotifications()
                }}
              />
            </CCol>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormInput
                type="text"
                value={FilterKeyword}
                placeholder="Search Here"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  keyword = e.target.value
                  setFilterKeyword(keyword)
                  FilterNotifications()
                }}
              />
            </CCol>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormSelect
                value={NotiEmpID}
                onChange={(e) => {
                  emp_id = e.target.value
                  setNotiEmpID(emp_id)
                  FilterNotifications()
                }}
              >
                <option value="0">All </option>
                {WorkersData.map((singi) => (
                  <option key={singi.emp_id} value={singi.emp_id}>
                    {singi.f_name} {singi.l_name} ({singi.email})
                  </option>
                ))}
              </CFormSelect>
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
              FilterNotifications()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterNotifications()
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
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action by</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action on</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {NotificationsData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>{singi.description}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;{singi.email}
                    </CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
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

export default AnimalsLogsPage

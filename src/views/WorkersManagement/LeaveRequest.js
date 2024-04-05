import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  // cilDescription,
  // cilFilter,
  cilPencil,
  // cilPlus,
  cilSave,
  cilSortDescending,
  cilSortAscending,
  cilMedicalCross,
  cilEnvelopeLetter,
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
  CFormSelect,
} from '@coreui/react'
import {
  NODEAPIURL,
  showdateYMDtoLocal,
  GetMondayDate,
  GetTodayDate,
  showFulldatetimein,
  TodaydateYMD,
  UPLOADSsURL,
} from '../../config'
// import AddWorkers from './AddWorkers'

let SortStatusType = 'DESC'
let keyword = ''
let LeaveStatus = ''
let FilterLeaveType = '0'
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()

const WorkersLeaveRequest = () => {
  const [ExcelFileName] = useState('Leave Request List')
  const tableRef = useRef(null)
  // const [ForEmpID, setForEmpID] = useState(0)
  // const [ResetPassword, setResetPassword] = useState(false)
  const [WorkedListData, setWorkedListData] = useState([])
  const [LeaveTypeData, setLeaveTypeData] = useState([])

  const FetchWorkersList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getLeaveslist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          FilterFromDate,
          FilterToDate,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      setLeaveTypeData(resJson.leave_type)
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
    // alert(2)
    // setWorkedListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getLeaveslist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          FilterFromDate,
          FilterToDate,
          FilterLeaveType,
          LeaveStatus,
          SortStatusType,
          recordsPerPage: 10,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
        // alert(1)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const [NewStatus, setNewStatus] = useState(0)
  const [RemarkAdmin, setRemarkAdmin] = useState('')
  const [RemarkId, setRemarkId] = useState(0)
  const [RemarkAdd, setRemarkAdd] = useState('none')
  const [RemarkAddPreMsg, setRemarkAddPreMsg] = useState('saf')

  const updateRemarkAdmin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateLeavesRemarkAdminNew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          RemarkId,
          RemarkAdmin,
          NewStatus,
          device: localStorage.getItem('DeviceDetails'),
          uType: localStorage.getItem('uType'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setRemarkAdd('none')
        FilterWorkersList()
        setRemarkAdmin('')
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // none
  const updateLeavesStatus = async (auto_id, new_status) => {
    if (new_status !== 0) {
      setNewStatus(new_status)
      setRemarkAdd('block')
      setRemarkAddPreMsg('')
      setRemarkId(auto_id)
    }
    if (new_status === 1) {
      setRemarkAddPreMsg('Any Remark for Approving the Leave')
    }
    if (new_status === 2) {
      setRemarkAddPreMsg('Any Remark for Rejecting the Leave')
    }
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateLeavesStatusNew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          new_status,
          auto_id,
          device: localStorage.getItem('DeviceDetails'),
          uType: localStorage.getItem('uType'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        FilterWorkersList()
        // resJson.data
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchWorkersList()
    LeaveStatus = ''
    keyword = ''
    SortStatusType = 'DESC'
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
    FilterLeaveType = '0'
  }, [])

  function CanUpdateRequest(for_emp_id) {
    let returnVale = 1
    if (Number(localStorage.getItem('emp_id')) === Number(for_emp_id)) {
      returnVale = 0
    }
    if (Number(localStorage.getItem('uType')) === 3) {
      returnVale = 1
    }
    return returnVale === 1
  }

  return (
    <CRow>
      <div className="ry_popup" style={{ display: RemarkAdd }}>
        <div
          style={{
            margin: '5% auto',
            maxWidth: '350px',
            background: '#ebedef',
            padding: '20px',
          }}
        >
          <div
            style={{
              textAlign: 'right',
              marginBottom: '10px',
            }}
          >
            <CIcon
              icon={cilMedicalCross}
              style={{
                color: 'red',
                transform: 'rotate(45deg)',
              }}
              onClick={(e) => {
                setRemarkAdd('none')
              }}
            />
          </div>
          <CForm
            className="mb-lg-5 mb-4"
            autoComplete="off"
            autofill="off"
            onSubmit={(e) => {
              updateRemarkAdmin(e)
            }}
          >
            <h6 className="mb-3 mt-4">{RemarkAddPreMsg}</h6>
            <CFormInput
              type="text"
              placeholder="Enter the Remark Here"
              value={RemarkAdmin}
              style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
              onChange={(e) => {
                setRemarkAdmin(e.target.value)
              }}
            />
            <div className="text-center">
              <CButton color="primary" type="submit" className="mt-4">
                Submit
              </CButton>
            </div>
          </CForm>
        </div>
      </div>
      {/* <CCol xs={12}>{AddForm}</CCol> */}
      <CCol md={12}>
        <h3 className="mb-3 mt-3">Leave Request</h3>
      </CCol>
      <CCol md={9}>
        <CForm className="mb-lg-4 mb-4">
          <CRow>
            <CCol md={2}>
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
                  FilterWorkersList()
                }}
              />
            </CCol>
            <CCol md={2}>
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
                  FilterWorkersList()
                }}
              />
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
                  FilterWorkersList()
                }}
              />
            </CCol>
            <CCol md={2}>
              <label>&nbsp;</label>
              <CFormSelect
                onChange={(e) => {
                  LeaveStatus = e.target.value
                  FilterWorkersList()
                }}
              >
                <option value="">Select Status</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
                <option value="3">Cancelled</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormSelect
                onChange={(e) => {
                  FilterLeaveType = e.target.value
                  FilterWorkersList()
                }}
              >
                <option value="0">Select Leave Type</option>
                {LeaveTypeData.map((singi) => (
                  <option key={singi.leave_type} value={singi.leave_type}>
                    {singi.leave_type}
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
        <DownloadTableExcel
          filename={ExcelFileName}
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Leave Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Request Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Supervisor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Admin</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{singi.leave_type}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.start_date)}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.end_date)}</CTableDataCell>
                    <CTableDataCell>{singi.reason}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.status === 0 ? 'Pending' : ''}
                      {singi.status === 1 ? 'Approved' : ''}
                      {singi.status === 2 ? 'Rejected' : ''}
                      {singi.status === 3 ? 'Cancelled' : ''}
                      {singi.status === 4 ? 'Supervisor Approved' : ''}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.SupVisorName !== null ? singi.SupVisorName : ''}
                    </CTableDataCell>
                    <CTableDataCell>{singi.aRemark1}</CTableDataCell>
                    <CTableDataCell>
                      {singi.AdminName !== null ? singi.AdminName : ''}
                    </CTableDataCell>
                    <CTableDataCell>{singi.aRemark}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Leave Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dates</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;
                      {singi.email}
                      <div className="text-danger" style={{ maxWidth: '200px' }}>
                        <b>Reason: </b>
                        {singi.reason}
                      </div>
                      {singi.attachment !== 0 &&
                      singi.attachment !== '' &&
                      singi.attachment !== '0' &&
                      singi.attachment !== null ? (
                        <div className="text-info" style={{ maxWidth: '200px' }}>
                          <b>Attachment: </b>
                          <a
                            href={`${UPLOADSsURL}${singi.attachment}`}
                            target="_BLANK"
                            className=""
                            rel="noreferrer"
                          >
                            {singi.attachmentName}
                          </a>
                        </div>
                      ) : (
                        ''
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <small className="alert p-1 alert-info d-block text-center">
                        {singi.leave_type}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '125px' }}>
                      {showdateYMDtoLocal(singi.start_date)}
                      <br />
                      to
                      <br />
                      {showdateYMDtoLocal(singi.end_date)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <small>Requested on {showFulldatetimein(singi.createdAt)}</small>
                      <CNav variant="pills">
                        <button
                          style={{
                            display: singi.status === 3 ? '' : 'none',
                            cursor: 'not-allowed',
                          }}
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                        >
                          Cancelled by Worker
                        </button>
                        <CDropdown
                          variant="nav-item"
                          style={{ display: singi.status === 3 ? 'none' : '' }}
                        >
                          <CDropdownToggle
                            className={`${singi.status === 0 ? 'bg-danger' : ''}
                            ${singi.status === 2 ? 'bg-warning' : ''} ${
                              singi.status === 4 ? 'bg-info' : ''
                            }`}
                          >
                            {singi.status === 0 ? 'Pending' : ''}
                            {singi.status === 1 ? 'Approved' : ''}
                            {singi.status === 2 ? 'Rejected' : ''}
                            {singi.status === 4 ? 'Supervisor Approved' : ''}
                            <CIcon
                              icon={cilPencil}
                              style={{
                                display: localStorage.getItem('uType') === '1' ? 'none' : '',
                                height:
                                  TodaydateYMD() > singi.start_date &&
                                  singi.status !== 0 &&
                                  singi.status !== 4
                                    ? '0'
                                    : '',
                              }}
                            />
                          </CDropdownToggle>
                          <CDropdownMenu
                            style={{
                              overflow: 'hidden',
                              opacity:
                                TodaydateYMD() > singi.start_date &&
                                singi.status !== 0 &&
                                singi.status !== 4
                                  ? '0.0'
                                  : '',
                              height:
                                TodaydateYMD() > singi.start_date &&
                                singi.status !== 0 &&
                                singi.status !== 4
                                  ? '0px'
                                  : '',
                              width:
                                TodaydateYMD() > singi.start_date &&
                                singi.status !== 0 &&
                                singi.status !== 4
                                  ? '0px'
                                  : '',
                              display: localStorage.getItem('uType') === '1' ? 'none' : '',
                            }}
                          >
                            {/* All Level Approval SuperVisor */}
                            <CDropdownItem
                              style={{
                                display:
                                  localStorage.getItem('uType') === '2' && singi.status === 4
                                    ? 'none'
                                    : '',
                              }}
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  updateLeavesStatus(singi.auto_id, singi.status !== 1 ? 1 : 0)
                                } else {
                                  alert(
                                    'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                  )
                                }
                              }}
                            >
                              {singi.status !== 1 ? 'Approve' : 'Pending'}
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  updateLeavesStatus(singi.auto_id, singi.status !== 2 ? 2 : 0)
                                } else {
                                  alert(
                                    'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                  )
                                }
                              }}
                            >
                              {singi.status !== 2 ? 'Reject' : 'Pending'}
                            </CDropdownItem>
                            {/* All Level Approval SuperVisor */}
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>

                      <div className="text-info" style={{ maxWidth: '270px' }}>
                        {singi.SupVisorName !== null ? <hr /> : ''}
                        {singi.SupVisorName !== null ? `by ${singi.SupVisorName}` : ''}
                        {singi.SupVisorEmail !== null ? ` (${singi.SupVisorEmail})` : ''}
                        {singi.aRemark1 && singi.aRemark1.trim() !== '' ? (
                          <div>
                            <b>Supervisor Remark: </b>
                            {singi.aRemark1}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>

                      <div className="text-success" style={{ maxWidth: '270px' }}>
                        {singi.AdminName !== null ? <hr /> : ''}
                        {singi.AdminName !== null ? `by ${singi.AdminName}` : ''}
                        {singi.AdminEmail !== null ? ` (${singi.AdminEmail})` : ''}
                        {singi.aRemark && singi.aRemark.trim() !== '' ? (
                          <div>
                            <b>Admin Remark: </b>
                            {singi.aRemark}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
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

export default WorkersLeaveRequest

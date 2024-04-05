import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import CIcon from '@coreui/icons-react'
import {
  cilSortAscending,
  cilPencil,
  cilSave,
  cilSortDescending,
  cilMedicalCross,
  cilEnvelopeLetter,
  cilFile,
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
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  // CPagination,
  // CPaginationItem,
  CForm,
  CFormInput,
  // CFormSelect,
  CButton,
  CFormSelect,
} from '@coreui/react'
import {
  NODEAPIURL,
  showdateYMD,
  ShowTimeAMorPM,
  showdateYMDtoLocal,
  showTimePunchExcpt,
  showFulldatetimein,
  GetMondayDate,
  GetTodayDate,
  GetValueFromJson,
  BASEWEBURL,
  UPLOADSsURL,
} from '../../config'
// import { _adapters } from 'chart.js'

let SortStatusType = 'DESC'
let keyword = ''
let FilterStatus = ''
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()

const MissedPunchs = () => {
  const [ExcelFileName] = useState('Punch Exception/ Remote Work List')
  const tableRef = useRef(null)
  const [uType, setuType] = useState(GetValueFromJson(localStorage.getItem('profile'), 'uType', 1))
  const [WorkedListData, setWorkedListData] = useState([])
  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getMissedPunchsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
          keyword,
          SortStatusType,
          FilterFromDate,
          FilterToDate,
          device: localStorage.getItem('DeviceDetails'),
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
    setWorkedListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getMissedPunchsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          recordsPerPage: 10,
          keyword,
          SortStatusType,
          FilterStatus,
          FilterFromDate,
          FilterToDate,
          device: localStorage.getItem('DeviceDetails'),
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
  const revokeRequestAdmin = async (auto_id, type, attd_auto_id, emp_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/revokeRequestAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          auto_id,
          type,
          emp_id,
          attd_auto_id,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          FilterWorkersList()
        } else {
          alert(resJson.message)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const revokeRemoteRequestAdmin = async (auto_id, type, emp_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/revokeRemoteRequestAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          auto_id,
          type,
          emp_id,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          FilterWorkersList()
        } else {
          alert(resJson.message)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateRecurringRequest = async (auto_id, status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateRecurringRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          auto_id,
          status,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
    } catch (err) {
      console.log(err)
    }
  }

  const updateMissedPunchStatus = async (auto_id, new_status) => {
    setRemarkAdmin('')
    if (new_status !== 0) {
      setNewStatus(new_status)
      setRemarkAdd('block')
      setRemarkAddPreMsg('')
      setRemarkId(auto_id)
    }
    if (new_status === 1) {
      setRemarkAddPreMsg('Any Remark for Approving the Request')
    }
    if (new_status === 2) {
      setRemarkAddPreMsg('Any Remark for Rejecting the Request')
    }
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateMissedPunchStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          new_status,
          auto_id,
          device: localStorage.getItem('DeviceDetails'),
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
  const [NewStatus, setNewStatus] = useState(0)
  const [RemarkAdmin, setRemarkAdmin] = useState('')
  const [RemarkAdmin4Type, setRemarkAdmin4Type] = useState('')
  const [RemarkId, setRemarkId] = useState(0)
  const [RemarkAdd, setRemarkAdd] = useState('none')
  const [RemarkAddPreMsg, setRemarkAddPreMsg] = useState('saf')

  const updateRemarkAdmin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateMissedPunchRemarkAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          RemarkId,
          RemarkAdmin,
          NewStatus,
          RemarkAdmin4Type,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setRemarkAdd('none')
        FilterWorkersList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    SortStatusType = 'DESC'
    keyword = ''
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
    FilterStatus = ''
    FetchWorkersList()
    setuType(GetValueFromJson(localStorage.getItem('profile'), 'uType', 1))
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
      <CCol xs={12}>
        <h3 className="mb-3 mt-3">Punch Exception/ Remote Work</h3>
      </CCol>
      <CCol lg={9}>
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
                min={FilterFromDate}
                type="date"
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
            <CCol md={2}>
              <label>&nbsp;</label>
              <CFormSelect
                onChange={(e) => {
                  FilterStatus = e.target.value
                  FilterWorkersList()
                }}
              >
                <option value="">Select Status</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
                <option value="3">Cancelled</option>
                <option value="4">Revoked</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
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
          </CRow>
        </CForm>
      </CCol>
      <CCol lg={3} className="mb-lg-0 mb-5">
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
            <CTable style={{ display: 'none' }} ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Punch-in</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Punch-out</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Request Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Supervisor/ Admin</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remakr</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>

                    <CTableDataCell>
                      {singi.type === 'in' ? (
                        <span className="alert p-1 alert-success">IN</span>
                      ) : (
                        ''
                      )}
                      {singi.type === 'out' ? (
                        <span className="alert p-1 alert-info">Out</span>
                      ) : (
                        ''
                      )}
                      {singi.type === 'remote' ? (
                        <span className="alert p-1 alert-warning">Remote</span>
                      ) : (
                        ''
                      )}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '125px' }}>
                      {singi.type !== 'out' ? showdateYMDtoLocal(singi.ForDate) : ''}
                      {singi.type === 'out' ? showdateYMDtoLocal(showdateYMD(singi.checkIn)) : ''}
                      &nbsp;
                      {singi.type !== 'out' ? ShowTimeAMorPM(singi.ForTime) : ''}
                      {singi.type === 'out' ? showTimePunchExcpt(singi.checkIn) : ''}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '125px' }}>
                      {singi.type === 'remote' ? showdateYMDtoLocal(singi.ForDateOut) : ''}
                      {singi.type === 'out' ? showdateYMDtoLocal(singi.ForDate) : ''}
                      {singi.type === 'in' ? 'NA' : ''}
                      &nbsp;
                      {singi.type === 'remote'
                        ? singi.ForTimeOut
                          ? ShowTimeAMorPM(singi.ForTimeOut)
                          : 'NA'
                        : ''}
                      {singi.type === 'out' ? ShowTimeAMorPM(singi.ForTime) : ''}
                      {singi.type === 'in' ? 'NA' : ''}
                    </CTableDataCell>
                    <CTableHeaderCell>{singi.reason}</CTableHeaderCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.status === 0 ? 'Pending' : ''}
                      {singi.status === 1 ? 'Approved' : ''}
                      {singi.status === 2 ? 'Rejected' : ''}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="text-info" style={{ maxWidth: '270px' }}>
                        {singi.AdminName !== null ? `by ${singi.AdminName}` : ''}
                        {singi.AdminEmail !== null ? ` (${singi.AdminEmail})` : ''}
                      </div>
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
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Map</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Punch-in</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Punch-out</CTableHeaderCell>
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
                      {singi.attachment && singi.attachment !== '' ? (
                        <>
                          <br />
                          <CIcon icon={cilFile} />
                          &nbsp;
                          <a
                            href={`${UPLOADSsURL}${singi.attachment}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {singi.attachmentName}
                          </a>
                        </>
                      ) : (
                        ''
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      {singi.type === 'in' ? (
                        <span className="alert p-1 alert-success">IN</span>
                      ) : (
                        ''
                      )}
                      {singi.type === 'out' ? (
                        <span className="alert p-1 alert-info">Out</span>
                      ) : (
                        ''
                      )}
                      {singi.type === 'remote' ? (
                        <span className="alert p-1 alert-warning">Remote</span>
                      ) : (
                        ''
                      )}
                      {Number(singi.isRecurring) !== 0 ? (
                        <>
                          <br />
                          <br />
                          <span className="alert p-1 alert-info">Recurring</span>
                        </>
                      ) : (
                        ''
                      )}
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
                            ${singi.status === 2 ? 'bg-warning' : ''}
                            ${singi.status === 4 ? 'bg-danger' : ''}`}
                          >
                            {singi.status === 0 ? 'Pending' : ''}
                            {singi.status === 1 ? 'Approved' : ''}
                            {singi.status === 2 ? 'Rejected' : ''}
                            {singi.status === 4 ? 'Revoked By Admin' : ''}
                            <CIcon
                              icon={cilPencil}
                              style={{
                                display: singi.status !== 0 ? 'None' : uType === 1 ? 'none' : '',
                              }}
                            />
                          </CDropdownToggle>
                          <CDropdownMenu
                            style={{
                              display: singi.status !== 0 ? 'None' : uType === 1 ? 'none' : '',
                            }}
                          >
                            <CDropdownItem
                              style={{
                                display: singi.status !== 0 ? 'None' : '',
                              }}
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  setRemarkAdmin4Type(singi.type)
                                  updateMissedPunchStatus(singi.auto_id, singi.status !== 1 ? 1 : 0)
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
                              style={{
                                display: singi.status !== 0 ? 'None' : '',
                              }}
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  setRemarkAdmin4Type(singi.type)
                                  updateMissedPunchStatus(singi.auto_id, singi.status !== 2 ? 2 : 0)
                                } else {
                                  alert(
                                    'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                  )
                                }
                              }}
                            >
                              {singi.status !== 2 ? 'Reject' : 'Pending'}
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display:
                                  singi.status === 0 && Number(singi.isRecurring) !== 0
                                    ? ''
                                    : 'none',
                              }}
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  setRemarkAdmin4Type(singi.type)
                                  updateMissedPunchStatus(singi.auto_id, 1)
                                  updateRecurringRequest(singi.isRecurring, 2)
                                } else {
                                  alert(
                                    'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                  )
                                }
                              }}
                            >
                              Approve now and Approve Future Request as well
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display:
                                  singi.status === 0 && Number(singi.isRecurring) !== 0
                                    ? ''
                                    : 'none',
                              }}
                              onClick={(e) => {
                                if (CanUpdateRequest(singi.emp_id)) {
                                  setRemarkAdmin4Type(singi.type)
                                  updateMissedPunchStatus(singi.auto_id, 2)
                                  updateRecurringRequest(singi.isRecurring, 3)
                                } else {
                                  alert(
                                    'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                  )
                                }
                              }}
                            >
                              Reject now and Reject Future Request as well
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                      {singi.status === 1 && (singi.type === 'in' || singi.type === 'out') ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-danger text-white mt-3"
                            title="Revoking this request Delete the Attedance Data related to this record."
                            onClick={(e) => {
                              if (CanUpdateRequest(singi.emp_id)) {
                                revokeRequestAdmin(
                                  singi.auto_id,
                                  singi.type,
                                  singi.attd_auto_id,
                                  singi.emp_id,
                                )
                              } else {
                                alert(
                                  'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                )
                              }
                            }}
                          >
                            Revoke This Request
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                      {singi.status === 1 && singi.type === 'remote' ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-danger text-white mt-3"
                            title="Revoking this request will not allow to user to checkout, Even If He/ She done checkin with this request."
                            onClick={(e) => {
                              if (CanUpdateRequest(singi.emp_id)) {
                                revokeRemoteRequestAdmin(singi.auto_id, singi.type, singi.emp_id)
                              } else {
                                alert(
                                  'You can not update your self Request, Please ask your supervisor or Admin to do so.',
                                )
                              }
                            }}
                          >
                            Revoke Remote Request
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                      <div className="text-info" style={{ maxWidth: '270px' }}>
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
                      <small>Updated on {showFulldatetimein(singi.updatedAt)}</small>
                    </CTableDataCell>

                    <CTableDataCell>
                      <h6>{singi.geoTitle}</h6>
                      <iframe
                        src={`${BASEWEBURL}/map.html?lat=${singi.uLat}&long=${singi.uLong}&radious=${singi.uRadious}`}
                        // src2={`https://maps.google.com/maps?q=${singi.uLat},${singi.uLong}&output=embed&z=14`}
                        title="Map"
                        style={{
                          width: '100%',
                          minHeight: '150px',
                          maxWidth: '280px',
                        }}
                      ></iframe>
                      <small>
                        <br />
                        <a
                          href={`${BASEWEBURL}/map.html?lat=${singi.uLat}&long=${singi.uLong}&radious=${singi.uRadious}`}
                          target="_BLANK"
                          rel="noreferrer"
                        >
                          View Full Map
                        </a>
                        <br />
                        <b>Lat: </b>
                        {singi.uLat}
                        <br />
                        <b>Long: </b>
                        {singi.uLong}
                        <br />
                        <b>Radius: </b>
                        {singi.uRadious}
                        Mt.
                      </small>
                    </CTableDataCell>

                    <CTableDataCell style={{ minWidth: '125px' }}>
                      {singi.type !== 'out' ? showdateYMDtoLocal(singi.ForDate) : ''}
                      {singi.type === 'out' ? showdateYMDtoLocal(showdateYMD(singi.checkIn)) : ''}
                      <br />
                      {singi.type !== 'out' ? ShowTimeAMorPM(singi.ForTime) : ''}
                      {singi.type === 'out' ? showTimePunchExcpt(singi.checkIn) : ''}
                    </CTableDataCell>

                    <CTableDataCell style={{ minWidth: '125px' }}>
                      {singi.type === 'remote' ? showdateYMDtoLocal(singi.ForDateOut) : ''}
                      {singi.type === 'out' ? showdateYMDtoLocal(singi.ForDate) : ''}
                      {singi.type === 'in' ? 'NA' : ''}
                      <br />
                      {singi.type === 'remote'
                        ? singi.ForTimeOut
                          ? ShowTimeAMorPM(singi.ForTimeOut)
                          : 'NA'
                        : ''}
                      {singi.type === 'out' ? ShowTimeAMorPM(singi.ForTime) : ''}
                      {singi.type === 'in' ? 'NA' : ''}
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

export default MissedPunchs

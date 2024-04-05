import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilPlus,
  cilSortDescending,
  cilSortAscending,
  cilEnvelopeLetter,
  cilMobile,
  cilUser,
  cilCalendar,
  cilSave,
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
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'
import { NODEAPIURL, showdatetimein } from '../../config'
import AddWorkers from '../WorkersManagement/AddWorkers'
import PermissionWorkers from './PermissionWorkersList'
import { Link } from 'react-router-dom'

let greenUser = 1
let orangeUser = 1
let redUser = 1
let keyword = ''
let dpt_id = ''
let status = ''
let uType = 0
let SortStatusType = 'ASC'
var AllEmpProfileStatus = {}

const RolesPermissions = () => {
  const [ExcelFileName] = useState('All Staff List')
  const tableRef = useRef(null)
  // const inputElement = React.useRef()
  const [ForEmpID, setForEmpID] = useState(0)
  const [EmpStatus, setEmpStatus] = useState(status)
  const [ResetPassword, setResetPassword] = useState(false)
  const [showEmpProfileStatus] = useState({})
  const [WorkedListData, setWorkedListData] = useState([])
  const [Departments, setDepartments] = useState([])
  const [ShowAddWorkers, setShowAddWorkers] = useState(false)
  const [ShowPermsWorkers, setShowPermsWorkers] = useState(false)

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
          showProfileStatus: 1,
          status,
          device: localStorage.getItem('DeviceDetails'),
          greenUser,
          orangeUser,
          redUser,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
        // AllWorkersProfileStatus(resJson.data)
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
          dpt_id,
          uType,
          status,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
          showProfileStatus: 1,
          greenUser,
          orangeUser,
          redUser,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setWorkedListData(resJson.data)
        // await AllWorkersProfileStatus(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchDepartments = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/department/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setDepartments(resJson.data)
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
        FilterWorkersList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateaProfileStatus = async (emp_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateaProfileStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status,
          emp_id,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        FilterWorkersList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function AllWorkersProfileStatus(allData) {
    allData.map(async (s) => {
      if (allData.length === Object.keys(AllEmpProfileStatus).length) {
        console.log('Already got the Profkle staits')
      } else {
        await getWorkersProfileStatus(s.emp_id, s.aProfileStatus, s.ProfileStatus)
      }
      return ''
    })
  }
  const getWorkersProfileStatus = async (emp_id, aProfileStatus, ProfileStatus) => {
    var returnValue = ProfileStatus
    // try {
    //   const res = await fetch(`${NODEAPIURL}/admin/getWorkersProfileStatus`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       emp_id,
    //       aProfileStatus,
    //       ProfileStatus,
    //     }),
    //   })
    //   const resJson = await res.json()
    //   if (res.status === 200 && resJson.profileStatus) {
    //     returnValue = resJson.profileStatus
    //     // setshowEmpProfileStatus({ ...showEmpProfileStatus, [emp_id]: resJson.profileStatus })
    //     AllEmpProfileStatus[emp_id] = resJson.profileStatus
    //     setshowEmpProfileStatus(AllEmpProfileStatus)
    //   } else {
    //     console.log(resJson.message)
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
    return returnValue
  }

  useEffect(() => {
    keyword = ''
    uType = 0
    dpt_id = ''
    status = ''
    SortStatusType = 'ASC'
    AllEmpProfileStatus = {}
    greenUser = 1
    orangeUser = 1
    redUser = 1
    FetchWorkersList()
    FetchDepartments()
    setTimeout(() => {
      setEmpStatus(1)
    }, 3786)
    // const intervalId = setInterval(() => {
    //   // AllWorkersProfileStatus([])
    //   // inputElement.click()
    // }, 3000)
    // return () => {
    //   clearInterval(intervalId)
    // }
  }, [])

  let AddForm = ''
  if (ShowAddWorkers && !ShowPermsWorkers) {
    AddForm = (
      <AddWorkers
        ForEmpID={ForEmpID}
        setShowAddWorkers={setShowAddWorkers}
        FilterWorkersList={FilterWorkersList}
        ResetPassword={ResetPassword}
      />
    )
  }

  let PermsForm = ''
  if (ShowPermsWorkers) {
    PermsForm = (
      <PermissionWorkers
        ForEmpID={ForEmpID}
        setShowPermsWorkers={setShowPermsWorkers}
        setShowAddWorkers={setShowAddWorkers}
        FilterWorkersList={FilterWorkersList}
        ResetPassword={ResetPassword}
      />
    )
  }

  function displayProfileOption(emp_id, value) {
    let returnValue = <span className="btn btn-sm bg-secondary text-white">NA</span>
    if (Number(value) === 3) {
      returnValue = <span className="btn btn-sm bg-danger text-white">Red</span>
    }
    if (Number(value) === 2) {
      returnValue = <span className="btn btn-sm bg-warning text-white">Orange</span>
    }
    if (Number(value) === 1) {
      returnValue = <span className="btn btn-sm bg-success text-white">Green</span>
    }
    // updateProfileStatus(emp_id, value)
    return returnValue
  }

  return (
    <CRow>
      <div
        className="d-none"
        // ref={inputElement}
        onClick={AllWorkersProfileStatus(WorkedListData)}
      >
        Get Updated Score
      </div>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12}>{PermsForm}</CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <h3 className="mb-4">User Roles and Permissions</h3>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CForm className="testRahul">
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
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CForm className="testRahul">
          <CFormSelect
            name="dpt_id"
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              dpt_id = e.target.value
              FilterWorkersList()
            }}
          >
            <option value="0">Select Department</option>
            {Departments.map((singi) => (
              <option key={singi.dpt_id} value={singi.dpt_id}>
                {singi.dept_name}
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CForm className="testRahul">
          <CFormSelect
            name="dpt_id"
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              uType = e.target.value
              FilterWorkersList()
            }}
          >
            <option value="0">Select Type</option>
            <option value="1">Staff</option>
            <option value="2">Supervisor</option>
            <option value="3">Admin</option>
          </CFormSelect>
        </CForm>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CForm className="testRahul">
          <CFormSelect
            name="status"
            defaultValue={status}
            value={EmpStatus}
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              status = e.target.value
              setEmpStatus(e.target.value)
              FilterWorkersList()
            }}
          >
            <option value="">Select Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </CFormSelect>
        </CForm>
      </CCol>
      <CCol
        lg={4}
        className="mb-lg-0 mb-5"
        style={{
          display: ShowAddWorkers ? 'none' : '',
          textAlign: 'right',
        }}
      >
        <CButton color="primary" className="me-2">
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
          <CButton color="danger" className="me-2 text-white">
            <CIcon icon={cilSave} className="me-1" />
            Export
          </CButton>
        </DownloadTableExcel>
        <CButton
          color="success"
          className="me-3 text-white"
          onClick={() => {
            setForEmpID('new')
            setResetPassword(false)
            setShowAddWorkers(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
      </CCol>
      <CCol md={12} className="mb-2 mt-2" style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CFormCheck
          name="status"
          checked={greenUser === 1 ? true : false}
          onChange={(e) => {
            if (e.target.checked) {
              greenUser = 1
            } else {
              greenUser = 0
            }
            FilterWorkersList()
          }}
        />
        &nbsp;Green Users&nbsp;&nbsp;
        <CFormCheck
          name="status"
          checked={orangeUser === 1 ? true : false}
          onChange={(e) => {
            if (e.target.checked) {
              orangeUser = 1
            } else {
              orangeUser = 0
            }
            FilterWorkersList()
          }}
        />
        &nbsp;Orange Users&nbsp;&nbsp;
        <CFormCheck
          name="status"
          checked={redUser === 1 ? true : false}
          onChange={(e) => {
            if (e.target.checked) {
              redUser = 1
            } else {
              redUser = 0
            }
            FilterWorkersList()
          }}
        />
        &nbsp;Red Users
        <b className="text-info" style={{ float: 'right' }}>
          {WorkedListData.length} Staffs
        </b>
        <div style={{ clear: 'both' }}></div>
        <div></div>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            {/* For the Download Table */}
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Profile Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.emp_id}>
                    <CTableDataCell>{singi.emp_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{singi.email}</CTableDataCell>
                    <CTableDataCell>
                      {singi.aProfileStatus === 0
                        ? displayProfileOption(0, singi.ProfileStatus)
                        : displayProfileOption(0, singi.aProfileStatus)}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {/* For the Download Table */}
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status Option1 </CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Department</CTableHeaderCell> */}
                  {/* <CTableHeaderCell scope="col">Role</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.emp_id}>
                    <CTableDataCell>{singi.emp_id}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilUser} />
                      &nbsp;
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;
                      {singi.email}
                      <br />
                      <CIcon icon={cilMobile} />
                      &nbsp;
                      {singi.mobile}
                      <br />
                      <CIcon icon={cilCalendar} title="Date of Birth" />
                      &nbsp;
                      {singi.dob}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link
                        to="/workers-notifications"
                        onClick={() => {
                          localStorage.setItem('FilterFromDate', '2023-01-01')
                          localStorage.setItem(
                            'FilterKeyword',
                            `${singi.f_name} ${singi.l_name} Profile Status Changed`,
                          )
                        }}
                      >
                        {singi.aProfileStatus === 0
                          ? showEmpProfileStatus && showEmpProfileStatus[singi.emp_id]
                            ? displayProfileOption(singi.emp_id, showEmpProfileStatus[singi.emp_id])
                            : displayProfileOption(singi.emp_id, singi.ProfileStatus)
                          : displayProfileOption(singi.emp_id, singi.aProfileStatus)}
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      {/* {singi.aProfileStatus}##{singi.ProfileStatus} */}
                      <select
                        className="form-control"
                        defaultValue={singi.aProfileStatus}
                        onClick={(e) => {
                          updateaProfileStatus(singi.emp_id, e.target.value)
                        }}
                      >
                        <option value="">Select Option for Profile Status</option>
                        <option value="1">Green</option>
                        <option value="2">Orange</option>
                        <option value="3">Red</option>
                        <option value="0">Automatic</option>
                      </select>
                    </CTableDataCell>
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
                                setShowPermsWorkers(true)
                              }}
                            >
                              Edit Permission
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                updateaProfileStatus(singi.emp_id, 1)
                              }}
                            >
                              Reset Profile Status
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                setForEmpID(singi.emp_id)
                                setResetPassword(false)
                                setShowAddWorkers(true)
                                setShowPermsWorkers(false)
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
                                setShowPermsWorkers(false)
                              }}
                            >
                              Reset Password
                            </CDropdownItem>
                            {/* <CDropdownItem href="#">Activity</CDropdownItem> */}
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
                      Created on {showdatetimein(singi.createdAt)}
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

export default RolesPermissions

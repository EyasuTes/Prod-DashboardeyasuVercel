import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import { Chart } from 'react-google-charts'
// import axios from 'axios'

import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilPlus,
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
  CNav,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormCheck,
} from '@coreui/react'
import {
  NODEAPIURL,
  // ShowBetweenTime,
  // showFulldatetimein,
  // AllMonthsName,
  GetMondayDate,
  GetTodayDate,
  // ShowTimeAMorPM,
  showdateYMDtoLocal,
  showFulldatetimein,
  GetValueFromJson,
  PrintaDiv,
  getDateObj2Ymd,
} from '../../config'
// import AddWorkers from './AddWorkers'
import UploadActivity from '../ResearchersManagement/UploadActivity'

let emp_id = ''
let Act_status = 0
let AssignType = 0
let keyword = ''
let FilterLeaveType = '0'
let SortStatusType = 'DESC'
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()
let profile = localStorage.getItem('profile')

let isProgrees = '1'
let isCompleted = '1'
let isHighlight = 'NA'
let isveryUrgent = 'NA'

const WorkersActivityList = () => {
  const [ExcelFileName, setExcelFileName] = useState('All Staff Activity List')
  // for the Activity Graph
  const [ReportDownloadTitle, setReportDownloadTitle] = useState('All Staff')
  const [ActivityGraphdata, setActivityGraphdata] = useState([['Actity Type', 'Total Activity']])
  const [ActivityGraphOptions, setActivityGraphOptions] = useState({
    title: 'Report Summary',
    is3D: true,
    colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
  })
  // for the Activity Graph
  // for Activity PopUp
  const [ActPopUpTitle, setActPopUpTitle] = useState('')
  const [ActPopUpDescription, setActPopUpDescription] = useState('')
  // for Activity PopUp
  const [ShowUploadActivity, setShowUploadActivity] = useState(false)
  const [isReportView, setisReportView] = useState(false)
  const [ForActId, setForActId] = useState(0)
  const tableRef = useRef(null)
  // const [ForEmpID, setForEmpID] = useState(0)
  // const [ResetPassword, setResetPassword] = useState(false)
  const [WorkerListData, setWorkerListData] = useState([])
  // const [WorkerStatusData] = useState([])
  const [AttendanceListData, setAttendanceListData] = useState([])
  // const [EmpAttendanceStatus, setEmpAttendanceStatus] = useState([])

  const FetchWorkersList = async () => {
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
      const res = await fetch(`${NODEAPIURL}/admin/getActivityListData`, {
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
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // for the Activity Graph
  // const CalculateGraph = async (allData, oldPending) => {
  //   var pen = 0
  //   var com = 0
  //   var high = 0
  //   allData.map((s) => {
  //     if (s.status && s.status === 3) {
  //       com += 1
  //     } else {
  //       pen += 1
  //     }
  //     if (s.highlight === 1) {
  //       high += 1
  //     }
  //     return ''
  //   })
  //   setActivityGraphOptions({
  //     title: `Report Summary of ${high} Highlighted out of Total ${
  //       allData.length + oldPending
  //     } Reports`,
  //     is3D: true,
  //     // colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
  //     colors: ['#ff914d', '#00bf63', '#ff5757'],
  //   })
  //   setActivityGraphdata([
  //     ['Actity Type', 'Total Activity'],
  //     [`In-Progress New (${pen})`, pen],
  //     [`Completed (${com})`, com],
  //     [`In-Progress Old (${oldPending})`, oldPending],
  //   ])
  // }
  // for the Activity Graph
  // const [ReportActivity, setReportActivity] = useState({
  //   pen: 0,
  //   com: 0,
  //   high: 'NA',
  //   penOld: 0,
  //   total: 'NA',
  // })
  const FilterAttendanceListData = async () => {
    FetchWorkersList()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getActivityListData`, {
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
          Act_status,
          AssignType,
          FilterLeaveType,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
          isProgrees,
          isCompleted,
          isHighlight,
          isveryUrgent,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
        setActivityGraphdata([['Actity Type', 'Total Activity']])
        if (resJson.data && resJson.data.length > 0 && resJson.ReportActivity) {
          // CalculateGraph(resJson.data, resJson.oldPending)
          // setReportActivity(resJson.ReportActivity)
          const high = resJson.ReportActivity.high ? resJson.ReportActivity.high : 0
          const total = resJson.ReportActivity.total ? resJson.ReportActivity.total : 0
          setActivityGraphOptions({
            title: `Report Summary of ${high} Highlighted out of Total ${total} Reports`,
            is3D: true,
            // colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
            colors: ['#ff914d', '#00bf63', '#ff5757'],
          })
          const pen = resJson.ReportActivity.pen ? resJson.ReportActivity.pen : 0
          const com = resJson.ReportActivity.com ? resJson.ReportActivity.com : 0
          const oldPending = resJson.ReportActivity.penOld ? resJson.ReportActivity.penOld : 0
          setActivityGraphdata([
            ['Actity Type', 'Total Activity'],
            [`In-Progress New (${pen})`, pen],
            [`Completed (${com})`, com],
            [`In-Progress Old (${oldPending})`, oldPending],
          ])
        }
        // alert(1)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // isReportView = 0
    emp_id = ''
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
    const DBUSERID = localStorage.getItem('DBUSERID')
    if (DBUSERID && DBUSERID !== '' && DBUSERID !== '0') {
      emp_id = DBUSERID
      localStorage.setItem('DBUSERID', 0)
    }
    const DBMONTH = localStorage.getItem('DBMONTH')
    const DBYEAR = localStorage.getItem('DBYEAR')
    if (DBMONTH && DBMONTH !== '' && DBMONTH !== '0') {
      FilterFromDate = getDateObj2Ymd(new Date(DBYEAR, Number(DBMONTH), 1))
      FilterToDate = getDateObj2Ymd(new Date(DBYEAR, Number(DBMONTH) + 1, 0))
      localStorage.setItem('DBMONTH', 0)
      localStorage.setItem('DBYEAR', 0)
    }
    keyword = ''
    Act_status = 0
    AssignType = 0
    FilterLeaveType = '0'
    SortStatusType = 'DESC'
    isProgrees = '1'
    isCompleted = '1'
    isHighlight = 'NA'
    FetchAttendanceListData()
    FetchWorkersList()
    profile = localStorage.getItem('profile')
    const notipagevalue = localStorage.getItem('notipagevalue')
    const notipage = localStorage.getItem('notipage')
    console.log(notipage)
    console.log(notipagevalue)
    if (
      notipage &&
      notipagevalue &&
      notipagevalue !== '' &&
      notipage !== '' &&
      (notipage === 'highlight' || notipage === 'notes')
    ) {
      setForActId(notipagevalue)
      setShowUploadActivity(true)
    }
  }, [])

  let AddForm = ''
  if (ShowUploadActivity) {
    AddForm = (
      <UploadActivity
        ForActId={ForActId}
        setShowUploadActivity={setShowUploadActivity}
        FilterListData={FilterAttendanceListData}
      />
    )
  }

  return (
    <CRow>
      <div
        style={{
          position: 'fixed',
          background: '#0f0f0fcc',
          padding: '20px',
          margin: 'auto',
          display: ActPopUpTitle === '' ? 'none' : '',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '888888',
        }}
        onClick={() => {
          setActPopUpTitle('')
          setActPopUpDescription('')
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          background: '#fff',
          padding: '20px',
          margin: 'auto',
          borderRadius: '20px',
          display: ActPopUpTitle === '' ? 'none' : '',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '999999',
          maxWidth: '50%',
          maxHeight: '50%',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setActPopUpTitle('')
              setActPopUpDescription('')
            }}
          >
            X
          </button>
        </div>
        <h3>{ActPopUpTitle}</h3>
        <hr />
        <p style={{ whiteSpace: 'pre-line' }}>
          <div dangerouslySetInnerHTML={{ __html: ActPopUpDescription }} />
          {/* {ActPopUpDescription} */}
        </p>
      </div>
      <CCol style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <h3 className="mb-3 mt-3">All Reports</h3>
      </CCol>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol md={8} style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <CForm className="mb-lg-1 mb-1">
          <CRow>
            <CCol className="p-1" md={2}>
              <label>From Date</label>
              <CFormInput
                type="date"
                value={FilterFromDate}
                placeholder="Enter From Date"
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
            <CCol className="p-1" md={2}>
              <label>To Date</label>
              <CFormInput
                type="date"
                min={FilterFromDate}
                value={FilterToDate}
                placeholder="Enter To Date"
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
            <CCol className="p-1" md={3}>
              <label>Select Staff</label>
              <CFormSelect
                value={emp_id}
                onChange={(e) => {
                  emp_id = e.target.value
                  const index = e.nativeEvent.target.selectedIndex
                  setReportDownloadTitle(e.nativeEvent.target[index].text)
                  FilterAttendanceListData()
                  setExcelFileName(`${e.nativeEvent.target[index].text} - Activity List`)
                }}
              >
                <option
                  value=""
                  style={{
                    display: GetValueFromJson(profile, 'uType', 1) === 1 ? 'none' : '',
                  }}
                >
                  All
                </option>
                <option value="ME" className="text-danger">
                  Assigned to Me
                </option>
                <option value="Created" className="text-success">
                  Created by Me
                </option>
                {WorkerListData.map((singi) => (
                  <option key={singi.emp_id} value={singi.emp_id}>
                    {singi.f_name} {singi.l_name}
                    {/* ({singi.email}) */}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol className="p-1" md={2}>
              <label>Assign Type</label>
              <CFormSelect
                name="AssignType"
                defaultValue={emp_id}
                onChange={(e) => {
                  AssignType = e.target.value
                  FilterAttendanceListData()
                }}
              >
                <option value="0">Any</option>
                <option value="1">Responsible only</option>
                <option value="2">Created By</option>
                <option value="3">Support only</option>
              </CFormSelect>
            </CCol>
            <CCol className="p-1" md={3}>
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
          <span
            className="text-info"
            style={{ cursor: 'pointer', display: isReportView ? 'none' : '' }}
            onClick={() => {
              if (isProgrees === '1') {
                isProgrees = `0`
              } else {
                isProgrees = `1`
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              value="1"
              style={{ marginRight: '5px' }}
              checked={isProgrees === '1' ? true : false}
            />
            In-Progress
          </span>

          <span
            className="text-success"
            style={{ cursor: 'pointer', display: isReportView ? 'none' : '' }}
            onClick={(e) => {
              if (isCompleted === '1') {
                isCompleted = `0`
              } else {
                isCompleted = `1`
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              className="ml-3"
              value="1"
              style={{ marginRight: '5px', marginLeft: '10px' }}
              checked={isCompleted === '1' ? true : false}
            />
            Completed
          </span>

          <span
            className="text-danger"
            style={{ cursor: 'pointer', display: isReportView ? 'none' : '' }}
            onClick={(e) => {
              if (isHighlight === '1') {
                isHighlight = `0`
              } else {
                isHighlight = `1`
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              className="ml-3"
              value="1"
              style={{ marginRight: '5px', marginLeft: '10px' }}
              checked={isHighlight === '1' ? true : false}
            />
            Highlighted
          </span>

          <b
            className="text-warning"
            style={{ cursor: 'pointer', display: isReportView ? 'none' : '' }}
            onClick={(e) => {
              if (isveryUrgent === '1') {
                isveryUrgent = `0`
              } else {
                isveryUrgent = `1`
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              className="ml-3"
              value="1"
              style={{ marginRight: '5px', marginLeft: '10px' }}
              checked={isveryUrgent === '1' ? true : false}
            />
            Very Urgent
          </b>
        </CForm>
      </CCol>
      <CCol md={4} className="mb-lg-2 mb-2" style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <label>&nbsp;</label>
        <br />
        <CButton color="primary" className="me-1" style={{ display: isReportView ? 'none' : '' }}>
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
        <CButton
          color="primary"
          className="me-1"
          onClick={() => {
            setForActId(0)
            setShowUploadActivity(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
        <DownloadTableExcel
          filename={ExcelFileName}
          sheet="users"
          currentTableRef={tableRef.current}
          style={{ display: isReportView ? 'none' : '' }}
        >
          <CButton
            color="primary"
            className="me-1"
            variant="outline"
            style={{ display: isReportView ? 'none' : '' }}
          >
            <CIcon icon={cilSave} className="me-1" />
            Export
          </CButton>
        </DownloadTableExcel>
        <CButton
          color={isReportView ? 'danger' : 'primary'}
          className={isReportView ? 'text-white me-1' : ''}
          onClick={() => {
            FilterAttendanceListData()
            setisReportView(!isReportView)
          }}
        >
          <span
            style={{
              display: isReportView ? '' : 'none',
            }}
          >
            List
          </span>
          <span
            style={{
              display: isReportView ? 'none' : '',
            }}
          >
            Report
          </span>
        </CButton>
        <button
          style={{ display: isReportView ? '' : 'none' }}
          className="btn btn-success text-white"
          onClick={() => {
            PrintaDiv('ActivityGraphChartReport', `Activity Report of ${ReportDownloadTitle}`)
          }}
        >
          Download
        </button>
      </CCol>

      <div style={{ textAlign: 'right', display: isReportView ? 'none' : '' }}>
        Total {AttendanceListData.length} Reports
      </div>

      <CCol
        id="ActivityGraphChartReport"
        className="mb-4"
        md={12}
        style={{ display: isReportView ? '' : 'none' }}
      >
        <Chart
          className=""
          chartType="PieChart"
          data={ActivityGraphdata}
          options={ActivityGraphOptions}
          width={'100%'}
          height={'500px'}
        />
      </CCol>

      <CCol xs={12} style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <CCard className="mb-4" style={{ display: isReportView ? 'none' : '' }}>
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Category</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Status</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assign to</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow
                    key={i}
                    style={{
                      background:
                        singi.veryUrgent === 1 ? '#ffd4d4' : singi.highlight === 1 ? '#dde0e3' : '',
                      border: '1px solid #000',
                    }}
                  >
                    <CTableDataCell>
                      {singi.act_id}
                      {singi.veryUrgent === 1 ? <b className="text-danger">!</b> : ''}
                    </CTableDataCell>

                    <CTableDataCell className={singi.veryUrgent === 1 ? 'text-danger' : ''}>
                      <b>{singi.subject}</b>
                    </CTableDataCell>

                    <CTableDataCell>
                      <small title={`Created on ${showFulldatetimein(singi.updatedAt)}`}>
                        {showFulldatetimein(singi.createdAt)}
                      </small>
                      <CNav
                        variant="pills"
                        title={`Last Updated on ${showFulldatetimein(singi.updatedAt)}`}
                      >
                        <CDropdown variant="nav-item">
                          <CDropdownToggle
                            className={`${singi.status === 1 ? 'bg-danger' : ''} ${
                              singi.status !== 3 ? 'bg-warning' : ''
                            } ${singi.status === 3 ? 'bg-success' : ''}`}
                          >
                            {/* {singi.status} */}
                            {singi.status === 2 ? 'In-Progress' : ''}
                            {singi.status === 1 ? 'Pending' : ''}
                            {singi.status === 3 ? 'Completed' : ''}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                setForActId(singi.act_id)
                                setShowUploadActivity(true)
                                // setShowAddWorkers(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                    </CTableDataCell>
                    {/* <CTableDataCell>{singi.category_title}</CTableDataCell> */}

                    <CTableDataCell style={{ maxWidth: '250px' }}>
                      <div
                        style={{
                          height: '60px',
                          lineHeight: '20px',
                          overflow: 'hidden',
                          marginBottom: '5px',
                        }}
                      >
                        {singi.description.trim() === '' ? (
                          'N/A'
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: singi.description }} />
                        )}
                      </div>
                      <button
                        type="button"
                        style={{
                          display: singi.description.trim() === '' ? 'none' : '',
                        }}
                        onClick={() => {
                          setActPopUpTitle(singi.subject)
                          setActPopUpDescription(singi.description)
                        }}
                      >
                        Read More
                      </button>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '170px' }}>
                      {/* {new Date('2014-04-03')} */}
                      {singi.startDate !== 'null' && singi.startDate !== ''
                        ? showdateYMDtoLocal(singi.startDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '170px' }}>
                      {singi.endDate !== 'null' && singi.endDate !== ''
                        ? showdateYMDtoLocal(singi.endDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {/* {singi.assignedTo === 0 ? 'NA' : singi.Assigned} */}
                        {singi.assingToIdList &&
                          singi.assingToIdList.length > 0 &&
                          singi.assingToIdList.map((emp) => (
                            <li key={emp.emp_id}>
                              {Number(emp.type) === 1 ? (
                                <span className="text-info" title="As Responsible">
                                  {emp.f_name} {emp.l_name}
                                </span>
                              ) : (
                                <span className="text-success" title="As Support">
                                  {emp.f_name} {emp.l_name}
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Category</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Status</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assign to</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
            {/* For Download Table Data will be here */}
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assign to</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow
                    key={i}
                    style={{
                      background: singi.highlight === 1 ? '#dde0e3' : '',
                    }}
                  >
                    <CTableDataCell>{singi.act_id}</CTableDataCell>
                    <CTableDataCell>{singi.subject}</CTableDataCell>
                    <CTableDataCell>
                      {singi.status !== 3 ? 'In-Progress' : ''}
                      {singi.status === 3 ? 'Completed' : ''}
                    </CTableDataCell>
                    <CTableDataCell>{singi.description}</CTableDataCell>
                    <CTableDataCell>
                      {singi.startDate !== 'null' && singi.startDate !== ''
                        ? showdateYMDtoLocal(singi.startDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '170px' }}>
                      {singi.endDate !== 'null' && singi.endDate !== ''
                        ? showdateYMDtoLocal(singi.endDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {singi.assingToIdList &&
                          singi.assingToIdList.length > 0 &&
                          singi.assingToIdList.map((emp) => (
                            <li key={emp.emp_id}>
                              {emp.f_name} {emp.l_name}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Owner</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assign to</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
            {/* For Download Table Data will be here */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WorkersActivityList

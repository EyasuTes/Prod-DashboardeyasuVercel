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
  ShowTimeAMorPM,
} from '../../config'
// import AddWorkers from './AddWorkers'
import UploadActivity from './ActivityUpload'

let ani_auto_id = ''
let Act_status = 0
let keyword = ''
let FilterLeaveType = '0'
let SortStatusType = 'DESC'
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()
let profile = localStorage.getItem('profile')

let ActType = { HighIntensity: 1, Jogging: 1, Walking: 1, Other: 1 }

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
  const [AnimalsListData, setAnimalsListData] = useState([])
  // const [WorkerStatusData] = useState([])
  const [AttendanceListData, setAttendanceListData] = useState([])
  const [DataType, setDataType] = useState([])

  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/getAnimals`, {
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
      if (res.status === 200 && resJson.AnimalsList && resJson.AnimalsList.length > 0) {
        setAnimalsListData(resJson.AnimalsList)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchAttendanceListData = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/getActivityListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          FilterFromDate,
          FilterToDate,
          ani_auto_id,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
        if (resJson.dataType && resJson.dataType.length > 0) {
          setDataType(resJson.dataType)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterAttendanceListData = async () => {
    // alert('cakked')
    setAttendanceListData([])
    FetchWorkersList()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/getActivityListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          FilterFromDate,
          FilterToDate,
          ani_auto_id,
          Act_status,
          FilterLeaveType,
          recordsPerPage: 10,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
          ActType,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setAttendanceListData(resJson.data)
        if (resJson.dataType && resJson.dataType.length > 0) {
          setDataType(resJson.dataType)
        }
        setActivityGraphdata([['Actity Type', 'Total Activity']])
        if (resJson.dataGraph && resJson.dataGraph.length > 0) {
          setActivityGraphOptions({
            title: "Animal's Acticity Reports",
            is3D: true,
            colors: ['#ff914d', '#00bf63', '#ff5757'],
          })
          let temp = []
          temp.push(['Actity Type', 'Total Activity'])
          resJson.dataGraph.map((s) => {
            temp.push([`${s.type} - Total ${s.total}`, s.total])
            return ''
          })
          setActivityGraphdata(temp)
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
    ani_auto_id = ''
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
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
    FilterLeaveType = '0'
    SortStatusType = 'DESC'
    ActType = { HighIntensity: 1, Jogging: 1, Walking: 1, Other: 1 }
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
        <p style={{ whiteSpace: 'pre-line' }}>{ActPopUpDescription}</p>
      </div>
      <CCol style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <h3 className="mb-3 mt-3">All Reports</h3>
      </CCol>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol md={8} style={{ display: ShowUploadActivity ? 'none' : '' }}>
        <CForm className="mb-lg-4 mb-4">
          <CRow>
            <CCol className="p-1" md={3}>
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
            <CCol className="p-1" md={3}>
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
              <label>&nbsp;</label>
              <CFormSelect
                value={ani_auto_id}
                onChange={(e) => {
                  ani_auto_id = e.target.value
                  const index = e.nativeEvent.target.selectedIndex
                  setReportDownloadTitle(e.nativeEvent.target[index].text)
                  FilterAttendanceListData()
                  setExcelFileName(`${e.nativeEvent.target[index].text} - Activity List`)
                }}
              >
                <option
                  value="0"
                  style={{
                    display: GetValueFromJson(profile, 'uType', 1) === 1 ? 'none' : '',
                  }}
                >
                  All Animals
                </option>
                {AnimalsListData.map((singi) => (
                  <option key={singi.auto_id} value={singi.auto_id}>
                    {`${singi.ani_id} Chip: ${singi.chip_no} (${singi.sex})`}
                  </option>
                ))}
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
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (ActType.Jogging === 1) {
                ActType.Jogging = 0
              } else {
                ActType.Jogging = 1
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              value="1"
              style={{ marginRight: '5px' }}
              checked={ActType.Jogging === 1 ? true : false}
            />
            Jogging
          </span>
          <span className="m-2"></span>
          <span
            className="text-info"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (ActType.Walking === 1) {
                ActType.Walking = 0
              } else {
                ActType.Walking = 1
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              value="1"
              style={{ marginRight: '5px' }}
              checked={ActType.Walking === 1 ? true : false}
            />
            Walking
          </span>
          <span className="m-2"></span>
          <span
            className="text-info"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (ActType.HighIntensity === 1) {
                ActType.HighIntensity = 0
              } else {
                ActType.HighIntensity = 1
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              value="1"
              style={{ marginRight: '5px' }}
              checked={ActType.HighIntensity === 1 ? true : false}
            />
            High Intensity
          </span>
          <span className="m-2 d-none"></span>
          <span
            className="text-info d-none"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (ActType.Other === 1) {
                ActType.Other = 0
              } else {
                ActType.Other = 1
              }
              FilterAttendanceListData()
            }}
          >
            <CFormCheck
              value="1"
              style={{ marginRight: '5px' }}
              checked={ActType.Other === 1 ? true : false}
            />
            Other
          </span>
        </CForm>
      </CCol>
      <CCol md={4} className="mb-lg-4 mb-4" style={{ display: ShowUploadActivity ? 'none' : '' }}>
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
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Comment</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assinged</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created by</CTableHeaderCell>
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
                    <CTableDataCell>{singi.ani_act_id}</CTableDataCell>

                    <CTableDataCell>
                      <ul>
                        {DataType.map((s) => (
                          <>
                            {s.ani_act_id === singi.ani_act_id ? (
                              <li key={`${s.ani_act_id}${s.type}`}>{s.type}</li>
                            ) : (
                              ''
                            )}
                          </>
                        ))}
                      </ul>
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
                          <CDropdownToggle>
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                setForActId(singi.ani_act_id)
                                setShowUploadActivity(true)
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
                        {singi.comment.trim() === '' ? 'N/A' : singi.comment}
                      </div>
                      <button
                        type="button"
                        style={{
                          display: singi.comment.trim() === '' ? 'none' : '',
                        }}
                        onClick={() => {
                          setActPopUpTitle(singi.subject)
                          setActPopUpDescription(singi.comment)
                        }}
                      >
                        Read More
                      </button>
                    </CTableDataCell>
                    <CTableDataCell style={{ minWidth: '170px' }}>
                      <table className="table tabl-bordered">
                        <tr>
                          <td>
                            <b>Start Date</b>
                          </td>
                          <td>
                            {singi.startDate !== 'null' && singi.startDate !== ''
                              ? showdateYMDtoLocal(singi.startDate)
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>End Date</b>
                          </td>
                          <td>
                            {singi.endDate !== 'null' && singi.endDate !== ''
                              ? showdateYMDtoLocal(singi.endDate)
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Start Time</b>
                          </td>
                          <td>
                            {singi.startTime !== 'null' && singi.startTime !== ''
                              ? ShowTimeAMorPM(singi.startTime)
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>End Time</b>
                          </td>
                          <td>
                            {singi.endTime !== 'null' && singi.endTime !== ''
                              ? ShowTimeAMorPM(singi.endTime)
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Distance</b>
                          </td>
                          <td>{singi.distance}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Distance Unit</b>
                          </td>
                          <td>{singi.distanceIN}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>End Time</b>
                          </td>
                          <td>
                            {singi.endTime !== 'null' && singi.endTime !== ''
                              ? ShowTimeAMorPM(singi.endTime)
                              : 'N/A'}
                          </td>
                        </tr>
                      </table>
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {singi.assingToIdList &&
                          singi.assingToIdList.length > 0 &&
                          singi.assingToIdList.map((singi) => (
                            <li key={singi.auto_id}>
                              {`${singi.ani_id} Chip: ${singi.chip_no} (${singi.sex})`}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assinged</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created by</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
            {/* For Download Table Data will be here */}
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Distance</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Duration Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assinged</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added By</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.ani_act_id}</CTableDataCell>
                    <CTableDataCell>
                      <b>{singi.type}</b>
                    </CTableDataCell>

                    <CTableDataCell style={{ maxWidth: '250px' }}>
                      <div>{singi.comment.trim() === '' ? 'N/A' : singi.comment}</div>
                    </CTableDataCell>
                    <CTableDataCell>{singi.distance}</CTableDataCell>
                    <CTableDataCell>{singi.distanceIN}</CTableDataCell>
                    <CTableDataCell>
                      {singi.startDate !== 'null' && singi.startDate !== ''
                        ? showdateYMDtoLocal(singi.startDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.endDate !== 'null' && singi.endDate !== ''
                        ? showdateYMDtoLocal(singi.endDate)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.startTime !== 'null' && singi.startTime !== ''
                        ? ShowTimeAMorPM(singi.startTime)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.endTime !== 'null' && singi.endTime !== ''
                        ? ShowTimeAMorPM(singi.endTime)
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {singi.assingToIdList &&
                          singi.assingToIdList.length > 0 &&
                          singi.assingToIdList.map((singi) => (
                            <li key={singi.auto_id}>
                              {`${singi.ani_id} Chip: ${singi.chip_no} (${singi.sex})`}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Distance</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Duration Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Assinged</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added By</CTableHeaderCell>
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

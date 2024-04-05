import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import { Chart } from 'react-google-charts'
// import axios from 'axios'

import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeLetter,
  cilList,
  // cilDescription,
  // cilFilter,
  // cilPlus,
  cilSave,
  // cilSortAscending,
  // cilSortDescending,
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
  GetSecondsBetweenTime,
  NODEAPIURL,
  ShowBetweenTime,
  showFulldatetimein,
  GetMondayDate,
  GetTodayDate,
  MapURLLatLong,
  getDistanceFromLatLonInKm,
  getDistanceDirect,
  ShowLoginLogTimeStamp,
  AllMonthsName,
  PrintaDiv,
  getWorkingDays,
} from '../../config'
// import AddWorkers from './AddWorkers'
let emp_id = ''
let keyword = ''
let FilterLeaveType = '0'
let SortStatusType = 'DESC'
let FilterFromDate = GetMondayDate()
let FilterToDate = GetTodayDate()
let ForMonth = new Date().getMonth()
let ForYear = new Date().getUTCFullYear()
let ForReport = 0

let showEmpDatesData = ''
let TotalSeconds = 0
let TotalWorkSeconds = 0
let TotalBreakSeconds = 0
let TotalWorksHours = []
let TotalBreaksHours = []

let ry = 0

let Week1TotalWorksHours = 0
let Week1EmpDateBreakTotal = 0

let Week2TotalWorksHours = 0
let Week2EmpDateBreakTotal = 0

let Week3TotalWorksHours = 0
let Week3EmpDateBreakTotal = 0

let Week4TotalWorksHours = 0
let Week4EmpDateBreakTotal = 0

let Week5TotalWorksHours = 0
let Week5EmpDateBreakTotal = 0

let BarChartData = [
  ['Week', 'Total Time', 'Total Working Time', 'Total Break Time'],
  ['Week 1', 0, 0, 0],
  ['Week 2', 0, 0, 0],
  ['Week 3', 0, 0, 0],
  ['Week 4', 0, 0, 0],
  ['Week 5', 0, 0, 0],
]

let BarChartOptions = {
  title: 'Attedance Report Summary',
  is3D: true,
  colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
}

const ShowWorkersAttendance = () => {
  const [ExcelFileName, setExcelFileName] = useState('All Staff Attendance List')
  // for the Attedance Pie Chart
  const [ReportDownloadTitle, setReportDownloadTitle] = useState('All Staff')
  const [AttedanceGraphdata, setAttedanceGraphdata] = useState([['Actity Type', 'Total Activity']])
  const [AttedanceGraphOptions, setAttedanceGraphOptions] = useState({
    title: 'Report Summary ',
    is3D: true,
    colors: ['#ff914d', '#00bf63', '#ff5757'],
  })
  // for the Attedance Pie Chart
  // let TotalSeconds = 0
  const tableRef = useRef(null)
  const [WorkerListData, setWorkerListData] = useState([])
  const [AttendanceListData, setAttendanceListData] = useState([])
  const [EmpDateTotal, setEmpDateTotal] = useState([])
  const [EmpDateBreakTotal, setEmpDateBreakTotal] = useState([])
  const [DetailView, setDetailView] = useState(0)
  // const HandleEmdDateTotal = (name, value) => {
  //   setEmpDateTotal({ ...EmpDateTotal, [name]: value })
  // }

  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/listWorkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ForAttendance: 1,
          FilterFromDate,
          FilterToDate,
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

  const CalculateGraph = async (
    Week1Data,
    Week2Data,
    Week3Data,
    Week4Data,
    Week5Data,
    Break1Data,
    Break2Data,
    Break3Data,
    Break4Data,
    Break5Data,
  ) => {
    Week1EmpDateBreakTotal = 0
    Week2EmpDateBreakTotal = 0
    Week3EmpDateBreakTotal = 0
    Week4EmpDateBreakTotal = 0
    Week5EmpDateBreakTotal = 0
    Week1TotalWorksHours = 0
    Week2TotalWorksHours = 0
    Week3TotalWorksHours = 0
    Week4TotalWorksHours = 0
    Week5TotalWorksHours = 0
    // for working hour calculation
    Week1Data.length > 0 &&
      Week1Data.map((s) => {
        Week1TotalWorksHours =
          Number(Week1TotalWorksHours) + Number(s.total) / Number(Week1Data.length)
        return ''
      })

    Week2Data.length > 0 &&
      Week2Data.map((s) => {
        Week2TotalWorksHours =
          Number(Week2TotalWorksHours) + Number(s.total) / Number(Week2Data.length)
        return ''
      })

    Week3Data.length > 0 &&
      Week3Data.map((s) => {
        Week3TotalWorksHours =
          Number(Week3TotalWorksHours) + Number(s.total) / Number(Week3Data.length)
        return ''
      })

    Week4Data.length > 0 &&
      Week4Data.map((s) => {
        Week4TotalWorksHours =
          Number(Week4TotalWorksHours) + Number(s.total) / Number(Week4Data.length)
        return ''
      })

    Week5Data.length > 0 &&
      Week5Data.map((s) => {
        Week5TotalWorksHours =
          Number(Week5TotalWorksHours) + Number(s.total) / Number(Week5Data.length)
        return ''
      })
    // for working hour calculation

    // for Break hour calculation
    Break1Data.length > 0 &&
      Break1Data.map((s) => {
        Week1EmpDateBreakTotal =
          Number(Week1EmpDateBreakTotal) + Number(s.total) / Number(Break1Data.length)
        return ''
      })

    Break2Data.length > 0 &&
      Break2Data.map((s) => {
        Week2EmpDateBreakTotal =
          Number(Week2EmpDateBreakTotal) + Number(s.total) / Number(Break2Data.length)
        return ''
      })

    Break3Data.length > 0 &&
      Break3Data.map((s) => {
        Week3EmpDateBreakTotal =
          Number(Week3EmpDateBreakTotal) + Number(s.total) / Number(Break3Data.length)
        return ''
      })

    Break4Data.length > 0 &&
      Break4Data.map((s) => {
        Week4EmpDateBreakTotal =
          Number(Week4EmpDateBreakTotal) + Number(s.total) / Number(Break4Data.length)
        return ''
      })

    Break5Data.length > 0 &&
      Break5Data.map((s) => {
        Week5EmpDateBreakTotal =
          Number(Week5EmpDateBreakTotal) + Number(s.total) / Number(Break5Data.length)
        return ''
      })
    // for Break hour calculation
    if (Week1Data.length > 1) {
      BarChartData = [['Week', 'Average Total Hour', 'Average Working Hour', 'Total Break Hour']]
    } else {
      BarChartData = [['Week', 'Total Hour', 'Total Working Hour', 'Total Break Hour']]
    }

    Week1TotalWorksHours = Week1TotalWorksHours / 3600
    Week2TotalWorksHours = Week2TotalWorksHours / 3600
    Week3TotalWorksHours = Week3TotalWorksHours / 3600
    Week4TotalWorksHours = Week4TotalWorksHours / 3600
    Week5TotalWorksHours = Week5TotalWorksHours / 3600

    Week1EmpDateBreakTotal = Week1EmpDateBreakTotal / 3600
    Week2EmpDateBreakTotal = Week2EmpDateBreakTotal / 3600
    Week3EmpDateBreakTotal = Week3EmpDateBreakTotal / 3600
    Week4EmpDateBreakTotal = Week4EmpDateBreakTotal / 3600
    Week5EmpDateBreakTotal = Week5EmpDateBreakTotal / 3600

    if (Week1Data.length > 0) {
      BarChartData.push([
        `Week 1 (1st to  7th) (${Week1TotalWorksHours.toFixed(0)} Woking Hours)`,
        Week1TotalWorksHours + Week1EmpDateBreakTotal,
        Week1TotalWorksHours,
        Week1EmpDateBreakTotal,
      ])
    }
    if (Week2Data.length > 0) {
      BarChartData.push([
        `Week 2 (8th to  14th) (${Week2TotalWorksHours.toFixed(0)} Woking Hours)`,
        Week2TotalWorksHours + Week2EmpDateBreakTotal,
        Week2TotalWorksHours,
        Week2EmpDateBreakTotal,
      ])
    }

    if (Week3Data.length > 0) {
      BarChartData.push([
        `Week 3 (15th to  21st) (${Week3TotalWorksHours.toFixed(0)} Woking Hours)`,
        Week3TotalWorksHours + Week3EmpDateBreakTotal,
        Week3TotalWorksHours,
        Week3EmpDateBreakTotal,
      ])
    }

    if (Week4Data.length > 0) {
      BarChartData.push([
        `Week 4 (22th to  28st) (${Week4TotalWorksHours.toFixed(0)} Woking Hours)`,
        Week4TotalWorksHours + Week4EmpDateBreakTotal,
        Week4TotalWorksHours,
        Week4EmpDateBreakTotal,
      ])
    }

    if (Week5Data.length > 0) {
      BarChartData.push([
        `Week 5 (29th to  31st) (${Week5TotalWorksHours.toFixed(0)} Woking Hours)`,
        Week5TotalWorksHours + Week5EmpDateBreakTotal,
        Week5TotalWorksHours,
        Week5EmpDateBreakTotal,
      ])
    }
    // FilterAttendanceListData()
  }

  const FilterAttendanceListData = async () => {
    // for the Attedance Pie Chart
    setAttedanceGraphdata([['Actity Type', 'Total Activity']])
    setAttedanceGraphOptions({
      title: 'Report Summary ',
      is3D: true,
      colors: ['#ff914d', '#00bf63', '#ff5757'],
    })
    // for the Attedance Pie Chart
    setAttendanceListData([])
    FetchWorkersList()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAttendanceListData`, {
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
          FilterLeaveType,
          recordsPerPage: 10,
          SortStatusType,
          ForReport,
          ForMonth,
          ForYear,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // console.log(resJson)
      let WorkingDays = 31
      let presentValue = 0
      if (res.status === 200) {
        // for the Pie Chart
        WorkingDays = getWorkingDays(ForYear, Number(ForMonth) + 1)
        presentValue =
          Number(resJson.AttedancePiedata.presence) +
          Number(resJson.AttedancePiedata.leave) +
          Number(resJson.AttedancePiedata.remote)
        let absentValue = 0
        if (Number(WorkingDays) > Number(presentValue)) {
          absentValue = Number(WorkingDays) - Number(presentValue)
        }
        if (
          resJson.AttedancePiedata &&
          resJson.AttedancePiedata &&
          resJson.AttedancePiedata &&
          resJson.AttedancePiedata &&
          emp_id !== ''
        ) {
          setAttedanceGraphdata([
            ['Type', 'Total'],
            [`Presence (${resJson.AttedancePiedata.presence})`, resJson.AttedancePiedata.presence],
            [`Leave (${resJson.AttedancePiedata.leave})`, resJson.AttedancePiedata.leave],
            [`Remote (${resJson.AttedancePiedata.remote})`, resJson.AttedancePiedata.remote],
            [`Absent (${absentValue})`, absentValue],
          ])
          setAttedanceGraphOptions({
            title: 'Report Summary ',
            is3D: true,
            colors: ['#00bf63', '#ff914d', '#ff5757', '#cc0000'],
          })
        }
        // for the Pie Chart
        setAttendanceListData(resJson.data)
        CalulateEmpWorkHours(resJson.data)
        CalculateGraph(
          resJson.Week1Data,
          resJson.Week2Data,
          resJson.Week3Data,
          resJson.Week4Data,
          resJson.Week5Data,

          resJson.Break1Data,
          resJson.Break2Data,
          resJson.Break3Data,
          resJson.Break4Data,
          resJson.Break5Data,
        )
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  function checkEmpDatesData(value, InDate) {
    const emp_id = value.emp_id
    var Return = DetailView
    const Index = `${emp_id}_${InDate}`
    if (showEmpDatesData !== Index) {
      showEmpDatesData = Index
      Return = 1
    }
    if (AttendanceListData.length < 3 && value.type !== 'break') {
      Return = 1
    }
    return Return
  }

  function CalulateEmpWorkHours(forData) {
    ry = 1
    TotalWorksHours = []
    TotalBreaksHours = []
    TotalSeconds = 0
    TotalBreakSeconds = 0
    TotalWorkSeconds = 0
    showEmpDatesData = ''
    forData.forEach((element) => {
      let Index = `${element.emp_id}_${element.forDate}`
      if (!TotalWorksHours[Index]) {
        TotalWorksHours[Index] = 0
      }
      if (!TotalBreaksHours[Index]) {
        TotalBreaksHours[Index] = 0
      }
      if (element.type === 'punch') {
        TotalWorksHours[Index] += GetSecondsBetweenTime(element.checkOut, element.checkIn)
        TotalSeconds += GetSecondsBetweenTime(element.checkOut, element.checkIn)
        TotalWorkSeconds += GetSecondsBetweenTime(element.checkOut, element.checkIn)
      }

      if (element.type === 'break') {
        // TotalWorksHours[Index] -= GetSecondsBetweenTime(element.checkOut, element.checkIn)
        TotalBreaksHours[Index] += GetSecondsBetweenTime(element.checkOut, element.checkIn)
        TotalSeconds += GetSecondsBetweenTime(element.checkOut, element.checkIn)
        TotalBreakSeconds += GetSecondsBetweenTime(element.checkOut, element.checkIn)
      }
    })

    setEmpDateTotal(TotalWorksHours)
    setEmpDateBreakTotal(TotalBreaksHours)
  }
  const [isReportView, setisReportView] = useState(false)

  useEffect(() => {
    ForYear = new Date().getUTCFullYear()
    ForMonth = new Date().getMonth()
    ForReport = 0
    const FetchAttendanceListData = async () => {
      try {
        const res = await fetch(`${NODEAPIURL}/admin/getAttendanceListData`, {
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
          CalulateEmpWorkHours(resJson.data)
        } else {
          console.log(resJson.message)
        }
      } catch (err) {
        console.log(err)
      }
    }
    showEmpDatesData = ''
    emp_id = ''
    keyword = ''
    FilterLeaveType = '0'
    SortStatusType = 'DESC'
    FilterFromDate = GetMondayDate()
    FilterToDate = GetTodayDate()
    FetchAttendanceListData()
    FetchWorkersList()
  }, [])

  return (
    <CRow callme={ry === 0 ? CalulateEmpWorkHours(AttendanceListData) : ''}>
      <CCol md={12}>
        <h3 className="mb-3 mt-3">Attendance</h3>
      </CCol>
      <CCol md={7}>
        <CForm className="mb-lg-4 mb-4">
          <CRow>
            <CCol md={3} className="p-1" style={{ display: isReportView ? '' : 'none' }}>
              <label>Select Month</label>
              <CFormSelect
                defaultValue={ForMonth}
                onChange={(e) => {
                  ForMonth = e.target.value
                  FilterAttendanceListData()
                }}
              >
                {AllMonthsName.map((singi, monthIndex) => (
                  <option key={singi} value={monthIndex}>
                    {singi}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3} className="p-1" style={{ display: isReportView ? '' : 'none' }}>
              <label>Year</label>
              <CFormInput
                type="year"
                placeholder="Enter Year"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                value={ForYear}
                onChange={(e) => {
                  ForYear = e.target.value
                  FilterAttendanceListData()
                }}
              />
            </CCol>
            <CCol md={3} className="p-1" style={{ display: isReportView ? 'none' : '' }}>
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
            <CCol md={3} className="p-1" style={{ display: isReportView ? 'none' : '' }}>
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
            <CCol className="p-1" md={3}>
              <label>&nbsp;</label>
              <CFormSelect
                defaultValue={emp_id}
                onChange={(e) => {
                  emp_id = e.target.value
                  const index = e.nativeEvent.target.selectedIndex
                  setReportDownloadTitle(e.nativeEvent.target[index].text)
                  FilterAttendanceListData()
                  setExcelFileName(`${e.nativeEvent.target[index].text} - Attendance List`)
                }}
              >
                <option value="">All Staff</option>
                {WorkerListData.map((singi) => (
                  <option key={singi.emp_id} value={singi.emp_id}>
                    {singi.f_name} {singi.l_name}
                    {/* ({singi.email}) */}
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
        </CForm>
      </CCol>
      <CCol md={5} className="mb-lg-0 mb-5 p-1">
        <label>&nbsp;</label>
        <br />
        {/* <CButton color="primary" className="me-1" style={{ display: isReportView ? 'none' : '' }}>
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
        </CButton> */}
        <span className="me-1" style={{ display: isReportView ? 'none' : '' }}>
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
        </span>
        <CButton
          style={{ display: isReportView ? 'none' : '' }}
          // variant={DetailView === 1 ? '' : ''}
          color={DetailView === 1 ? 'success' : 'danger'}
          className="text-white me-1"
          onClick={() => {
            setDetailView(DetailView === 1 ? 0 : 1)
            FilterAttendanceListData()
          }}
        >
          <CIcon icon={cilList} className="me-2" />
          <span
            style={{
              display: DetailView === 1 ? '' : 'none',
            }}
          >
            Summary
          </span>
          <span
            style={{
              display: DetailView === 1 ? 'none' : '',
            }}
          >
            Detailed
          </span>
        </CButton>
        <CButton
          color={isReportView ? 'danger' : 'primary'}
          className={isReportView ? 'text-white me-1' : ''}
          onClick={() => {
            ForReport = isReportView ? 0 : 1
            setisReportView(!isReportView)
            setTimeout(() => {
              FilterAttendanceListData()
            }, 500)
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
          style={{ display: emp_id !== '' && isReportView ? '' : 'none' }}
          className="btn btn-success text-white"
          onClick={() => {
            PrintaDiv('AttedanceGraphChartReport', `Attendance Report of ${ReportDownloadTitle}`)
          }}
        >
          Download
        </button>
      </CCol>

      <CCol className="mb-4" md={8} style={{ display: isReportView ? '' : 'none' }}></CCol>
      <CCol
        className="mb-4"
        id="AttedanceGraphChartReport"
        md={12}
        style={{ display: isReportView ? '' : 'none' }}
      >
        <div
          style={{
            padding: '0px',
            marginBottom: '30px',
            background: '#fff',
            display: emp_id !== '' ? '' : 'none',
          }}
        >
          <Chart
            className="sahifhsa safgh mb-4"
            chartType="PieChart"
            data={AttedanceGraphdata}
            options={AttedanceGraphOptions}
            width={'100%'}
            height={'300px'}
          />
        </div>
        <div style={{ padding: '30px', background: '#fff' }}>
          <Chart
            className="sahifhsa safgh mb-4"
            chartType="Bar"
            data={BarChartData}
            options={BarChartOptions}
            width={'100%'}
            height={'500px'}
          />
        </div>
      </CCol>

      <CCol xs={12} style={{ display: isReportView ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            {/* Export Template for the Attedance Reports */}
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Check-in</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Check-Out</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Break Time
                    <br />
                    <span title="Hours:Minutes:Seconds">(H:M:S)</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Work Time
                    <br />
                    <span title="Hours:Minutes:Seconds">(H:M:S)</span>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow
                    ind={singi.auto_id}
                    key={singi.auto_id}
                    style={{
                      background: DetailView === 1 && singi.type === 'break' ? '#cc000014' : '',
                      display:
                        checkEmpDatesData(singi, ShowLoginLogTimeStamp(singi.checkIn)) === 1
                          ? ''
                          : 'none',
                    }}
                  >
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.checkIn)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.checkOut === '0' ? 'NA' : showFulldatetimein(singi.checkOut)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {DetailView === 1 ? (
                        ''
                      ) : (
                        <>
                          {EmpDateBreakTotal[`${singi.emp_id}_${singi.forDate}`]
                            ? ShowBetweenTime(
                                EmpDateBreakTotal[`${singi.emp_id}_${singi.forDate}`],
                                0,
                              )
                            : 'NA'}
                        </>
                      )}
                      {DetailView === 1 && singi.type === 'break' ? (
                        <>{ShowBetweenTime(singi.checkOut, singi.checkIn)}</>
                      ) : (
                        ''
                      )}
                      {DetailView === 1 && singi.type !== 'break' ? '' : ''}
                    </CTableDataCell>
                    <CTableDataCell>
                      {DetailView === 1 ? (
                        ''
                      ) : (
                        <>
                          {EmpDateTotal[`${singi.emp_id}_${singi.forDate}`]
                            ? ShowBetweenTime(EmpDateTotal[`${singi.emp_id}_${singi.forDate}`], 0)
                            : 'NA'}
                        </>
                      )}
                      {DetailView === 1 && singi.type === 'punch' ? (
                        <>{ShowBetweenTime(singi.checkOut, singi.checkIn)}</>
                      ) : (
                        ''
                      )}
                      {DetailView === 1 && singi.type !== 'punch' ? 'NA' : ''}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell colSpan={6} scope="col" className="text-center">
                    <button className="btn btn-success text-white btn-lg">
                      Total Shift Hour: &nbsp;
                      {/* // t={TotalSeconds} */}
                      {ShowBetweenTime(TotalWorkSeconds, 0)}
                    </button>
                    &nbsp;&nbsp;
                    <button className="btn btn-info text-white btn-lg">
                      Total Work Hour: &nbsp;
                      {ShowBetweenTime(TotalWorkSeconds - TotalBreakSeconds, 0)}
                    </button>
                    &nbsp;&nbsp;
                    <button className="btn btn-danger text-white btn-lg">
                      Total Break Hour: &nbsp;
                      {ShowBetweenTime(TotalBreakSeconds, 0)}
                    </button>
                    {/* {ShowBetweenTime(7501, 0)} */}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
            {/* Export Template for the Attedance Reports */}
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Emp ID</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Check-in</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Check-Out</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Break Time
                    <br />
                    <span title="Hours:Minutes:Seconds">(H:M:S)</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Work Time
                    <br />
                    <span title="Hours:Minutes:Seconds">(H:M:S)</span>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AttendanceListData.map((singi, i) => (
                  <CTableRow
                    ind={singi.auto_id}
                    key={singi.auto_id}
                    style={{
                      background: DetailView === 1 && singi.type === 'break' ? '#cc000014' : '',
                      display:
                        checkEmpDatesData(singi, ShowLoginLogTimeStamp(singi.checkIn)) === 1
                          ? ''
                          : 'none',
                    }}
                  >
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;
                      {singi.email}
                    </CTableDataCell>
                    <CTableDataCell>
                      {showFulldatetimein(singi.checkIn)}
                      <br />
                      <b className="text-warning">Work Area:&nbsp;</b>
                      <a
                        target="_BLANK"
                        rel="noreferrer"
                        href={MapURLLatLong(singi.uLat, singi.uLong)}
                      >
                        View Map
                      </a>
                      &nbsp;({singi.checkInFrom})
                      <div
                        className="text-danger"
                        style={{
                          display: Number(singi.uLat) === 0 ? '' : 'none',
                        }}
                      >
                        {singi.remark}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.checkOut === '0' ? 'NA' : showFulldatetimein(singi.checkOut)}
                      <br />
                      <div
                        style={{
                          display: singi.checkOut === '0' ? 'none' : '',
                        }}
                      >
                        <b className="text-warning">Work Area:&nbsp;</b>
                        <a
                          target="_BLANK"
                          rel="noreferrer"
                          href={MapURLLatLong(singi.uLatOut, singi.uLongOut)}
                        >
                          View Map
                        </a>
                        &nbsp;({singi.checkOutFrom})
                        <div
                          style={{
                            display:
                              Number(singi.uLat) === 0 || Number(singi.uLatOut) === 0 ? 'none' : '',
                          }}
                        >
                          <b
                            title="Direct Distance between Check In and Out"
                            className="text-danger"
                          >
                            Direct Distance:&nbsp;
                          </b>
                          <a
                            title="Direct Distance between Check In and Out"
                            href={getDistanceDirect(
                              singi.uLat,
                              singi.uLong,
                              singi.uLatOut,
                              singi.uLongOut,
                            )}
                            target="_BLANK"
                            rel="noreferrer"
                          >
                            {getDistanceFromLatLonInKm(
                              singi.uLat,
                              singi.uLong,
                              singi.uLatOut,
                              singi.uLongOut,
                            )}
                          </a>
                        </div>
                        <div
                          className="text-danger"
                          style={{
                            display: Number(singi.uLatOut) === 0 ? '' : 'none',
                          }}
                        >
                          {singi.remark}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div
                        style={{
                          display: DetailView === 1 ? 'none' : '',
                        }}
                      >
                        {EmpDateBreakTotal[`${singi.emp_id}_${singi.forDate}`]
                          ? ShowBetweenTime(
                              EmpDateBreakTotal[`${singi.emp_id}_${singi.forDate}`],
                              0,
                            )
                          : 'NA'}
                      </div>
                      <div
                        style={{
                          display: DetailView === 1 && singi.type === 'break' ? '' : 'none',
                        }}
                      >
                        {ShowBetweenTime(singi.checkOut, singi.checkIn)}
                      </div>
                      <div
                        style={{
                          display: DetailView === 1 && singi.type !== 'break' ? '' : 'none',
                        }}
                      >
                        NA
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div
                        style={{
                          display: DetailView === 1 ? 'none' : '',
                        }}
                      >
                        {EmpDateTotal[`${singi.emp_id}_${singi.forDate}`]
                          ? ShowBetweenTime(EmpDateTotal[`${singi.emp_id}_${singi.forDate}`], 0)
                          : 'NA'}
                      </div>
                      <div
                        style={{
                          display: DetailView === 1 && singi.type === 'punch' ? '' : 'none',
                        }}
                      >
                        {ShowBetweenTime(singi.checkOut, singi.checkIn)}
                      </div>
                      <div
                        style={{
                          display: DetailView === 1 && singi.type !== 'punch' ? '' : 'none',
                        }}
                      >
                        NA
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell colSpan={6} scope="col" className="text-center">
                    <button className="btn btn-success text-white btn-lg">
                      Total Shift Hour: &nbsp;
                      {console.log(TotalSeconds)}
                      {ShowBetweenTime(TotalWorkSeconds, 0)}
                    </button>
                    &nbsp;&nbsp;
                    <button className="btn btn-info text-white btn-lg">
                      Total Work Hour: &nbsp;
                      {ShowBetweenTime(TotalWorkSeconds - TotalBreakSeconds, 0)}
                    </button>
                    &nbsp;&nbsp;
                    <button className="btn btn-danger text-white btn-lg">
                      Total Break Hour: &nbsp;
                      {ShowBetweenTime(TotalBreakSeconds, 0)}
                    </button>
                    {/* {ShowBetweenTime(7501, 0)} */}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ShowWorkersAttendance

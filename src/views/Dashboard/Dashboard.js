import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { Chart } from 'react-google-charts'
// for the Calender
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
// for the Calender
import {
  cilBell,
  cilCloudDownload,
  cilEnvelopeClosed,
  cilEnvelopeLetter,
  cilIndustry,
  cilMap,
  cilMobile,
  cilPlus,
  // cilSave,
  cilUser,
  cilWarning,
  cilWindowMinimize,
} from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CImage,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CCardHeader,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTable,
  CTableHead,
  CFormCheck,
  // CTableFoot,
} from '@coreui/react'
import {
  NODEAPIURL,
  UPLOADSsURL,
  DoUploadURL,
  AllMonthsName,
  showFulldatetimein,
  ShowBetweenTime,
  GetArrayFromJson,
  ShowLoginLogTimeStamp,
  getWorkingDays,
  BASEWEBURL,
  ShowTimeAMorPM,
  showdateYMDtoLocal,
  PrintaDiv,
} from '../../config'
import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'

let emp_id = ''
let IsWeek1 = true
let IsWeek2 = true
let IsWeek3 = true
let IsWeek4 = true
let IsWeek5 = true
let showEmpDatesData = ''

const MyDashboard = () => {
  const [TotalWork, setTotalWork] = useState(0)
  const [TotalBreak, setTotalBreak] = useState(0)

  const [TotalWork1, setTotalWork1] = useState(0)
  const [TotalBreak1, setTotalBreak1] = useState(0)

  const [TotalWork2, setTotalWork2] = useState(0)
  const [TotalBreak2, setTotalBreak2] = useState(0)

  const [TotalWork3, setTotalWork3] = useState(0)
  const [TotalBreak3, setTotalBreak3] = useState(0)

  const [TotalWork4, setTotalWork4] = useState(0)
  const [TotalBreak4, setTotalBreak4] = useState(0)

  const [TotalWork5, setTotalWork5] = useState(0)
  const [TotalBreak5, setTotalBreak5] = useState(0)

  const [AttedanceListdata, setAttedanceListdata] = useState([[]])
  const [EmpAttedanceListdata, setEmpAttedanceListdata] = useState([[]])

  const DetailView = 1
  function checkEmpDatesData(value, InDate) {
    const emp_id = value.emp_id
    var Return = DetailView
    const Index = `${emp_id}_${InDate}`
    if (showEmpDatesData !== Index) {
      showEmpDatesData = Index
      Return = 1
    }
    if (EmpAttedanceListdata.length < 3 && value.type !== 'break') {
      Return = 1
    }
    return Return
  }
  const [AttedanceGraphdata, setAttedanceGraphdata] = useState([['Actity Type', 'Total Activity']])
  const [AttedanceGraphOptions, setAttedanceGraphOptions] = useState({
    title: 'Report Summary ',
    is3D: true,
    colors: ['#ff914d', '#00bf63', '#ff5757'],
  })

  function clearGraphData() {
    setTotalWork(0)
    setTotalBreak(0)
    setTotalWork1(0)
    setTotalBreak1(0)
    setTotalWork2(0)
    setTotalBreak2(0)
    setTotalWork3(0)
    setTotalBreak3(0)
    setTotalWork4(0)
    setTotalBreak4(0)
    setTotalWork5(0)
    setTotalBreak5(0)
    setBarChartData([
      ['Week', 'Shift Hour', 'Work Hour', 'Break Hour'],
      ['Week 1', 0, 0, 0],
      ['Week 2', 0, 0, 0],
      ['Week 3', 0, 0, 0],
      ['Week 4', 0, 0, 0],
      ['Week 5', 0, 0, 0],
    ])
    setActivityGraphdata([['Actity Type', 'Total Activity']])
    setAttedanceGraphdata([['Actity Type', 'Total Activity']])
  }
  // const [ReportDownloadTitle, setReportDownloadTitle] = useState('All Staff')
  // const [HighReport, setHighReport] = useState(0)
  // const [TotalReport, setTotalReport] = useState(0)
  const [NotificationsData, setNotificationsData] = useState([])
  const [WorkerListData, setWorkerListData] = useState([])

  const [ActivityMonth, setActivityMonth] = useState(0)
  const [ActivityYear, setActivityYear] = useState(0)
  const [AttedanceMonth, setAttedanceMonth] = useState('')
  const [AttedanceYear, setAttedanceYear] = useState(0)
  // for Actity Graph Data
  const [ActivityGraphdata, setActivityGraphdata] = useState([['Actity Type', 'Total Activity']])
  const [ActivityGraphOptions, setActivityGraphOptions] = useState({
    title: 'Report Summary ',
    is3D: true,
    colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
  })
  // for Actity Graph Data
  // for the Today Attedance Graph
  const [TodayAttedanceGraphData, setTodayAttedanceGraphData] = useState([['type', 'Total']])
  const [TodayAttedanceGraphOptions] = useState({
    title: 'Type',
    is3D: true,
    colors: ['#00bf63', '#ff914d', '#ff5757', '#666161'],
  })
  // for the Today Attedance Graph

  // for User Profile Status Graph Data
  const [EmpProfileStatusGraphdata, setEmpProfileStatusGraphdata] = useState([
    ['User type', 'Total'],
  ])
  const [EmpProfileStatusGraphOptions] = useState({
    title: 'User Type',
    is3D: false,
    colors: ['#00bf63', '#ff914d', '#ff5757', '#666161'],
  })
  // for User Profile Status Graph Data
  // for the Notifications
  function MakeLinkNoti(page, pagevalue) {
    if (page === 'highlight' || page === 'notes') {
      return '/workers-activity'
    }
    if (page === 'request' && pagevalue === 'geofencing') {
      return '/geo-fencing-list'
    }
    if (page === 'request' && pagevalue === 'leave') {
      return '/workers-leave-request'
    }
    if (page === 'request' && pagevalue === 'punch') {
      return '/workers-missed-punchs'
    }
    return ''
  }

  const FetchNotifications = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/getNotifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          DESC: 'DESC',
          mineOnly: 1,
          limit: 10,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setNotificationsData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // for the Notifications

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
          SortStatusType: 1,
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

  const [BarChartData, setBarChartData] = useState([
    ['Week', 'Shift Hour', 'Work Hour', 'Break Hour'],
    ['Week 1', 0, 0, 0],
    ['Week 2', 0, 0, 0],
    ['Week 3', 0, 0, 0],
    ['Week 4', 0, 0, 0],
    ['Week 5', 0, 0, 0],
  ])

  const [BarChartOptions] = useState({
    title: 'Attendance Report Summary',
    is3D: true,
    colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
  })

  const [ProfileData, setProfileData] = useState({
    device: localStorage.getItem('DeviceDetails'),
    f_name: '',
    l_name: '',
    email: '',
    mobile: '',
    dob: '',
    image: '',
    emgcontact_name: '',
    emgcontact_relation: '',
    emgcontact_mobile: '',
    address: '',
  })
  const HandleFormData = (name, value) => {
    setProfileData({ ...ProfileData, [name]: value })
  }

  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }

  const updateProfile = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/user/updateprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ProfileData),
      })
      const resJson = await res.json()
      console.log(resJson)
      FetchProfile()
    } catch (err) {
      console.log(err)
    }
  }

  const [StaffWithNoActivity, setStaffWithNoActivity] = useState([])
  const getStaffWithNoActivity = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getStaffWithNoActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: '',
      })
      const resJson = await res.json()
      console.log(resJson)
      if (resJson.data && resJson.data.length > 0) {
        setStaffWithNoActivity(resJson.data)
      }
      // Today Attedance
      let temp = []

      temp.push(['type', 'Total'])

      if (resJson.EmpTodayStatus) {
        if (resJson.EmpTodayStatus.present) {
          temp.push([`Present (${resJson.EmpTodayStatus.present})`, resJson.EmpTodayStatus.present])
        }

        if (resJson.EmpTodayStatus.leave) {
          temp.push([`Leave (${resJson.EmpTodayStatus.leave})`, resJson.EmpTodayStatus.leave])
        }

        if (resJson.EmpTodayStatus.remote) {
          temp.push([`Remote (${resJson.EmpTodayStatus.remote})`, resJson.EmpTodayStatus.remote])
        }

        if (resJson.EmpTodayStatus.absent) {
          temp.push([`Absent (${resJson.EmpTodayStatus.absent})`, resJson.EmpTodayStatus.absent])
        }
      }

      resJson.EmpTodayStatus.absent =
        Number(resJson.EmpTodayStatus.total) -
        Number(resJson.EmpTodayStatus.present) -
        Number(resJson.EmpTodayStatus.leave) -
        Number(resJson.EmpTodayStatus.remote)
      temp.push([`Absent (${resJson.EmpTodayStatus.absent})`, resJson.EmpTodayStatus.absent])
      setTodayAttedanceGraphData(temp)
      // Today Attedance
    } catch (err) {
      console.log(err)
    }
  }

  const uploadProfileImage = async (e, file, fileName) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      }
      const res = await fetch(DoUploadURL, requestOptions)
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          ProfileData.image = resJson.data.name
          HandleFormData('image', resJson.data.name)
          document.getElementById('ChangeImageHere').src = resJson.data.name
          updateProfile()
        } else {
          alert(resJson.message)
        }
        console.log(resJson.message)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchProfile = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: localStorage.getItem('token'),
          profile: 1,
          token: Date.now(),
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.status === 1 && resJson.profile) {
        setProfileData({
          device: localStorage.getItem('DeviceDetails'),
          f_name: resJson.profile.f_name,
          l_name: resJson.profile.l_name,
          email: resJson.profile.email,
          mobile: resJson.profile.mobile,
          dob: resJson.profile.dob,
          address: resJson.profile.address,
          image: resJson.profile.image,
          emgcontact_name: resJson.emgcontact.name ? resJson.emgcontact.name : '',
          emgcontact_relation: resJson.emgcontact.relation ? resJson.emgcontact.relation : '',
          emgcontact_mobile: resJson.emgcontact.mobile ? resJson.emgcontact.mobile : '',
        })
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchActivityGraphData = async (month, year) => {
    setActivityGraphOptions({
      title: `Report Summary`,
      is3D: false,
      colors: ['#fb5d5d', '#70cc00', '#0f0f0f', '#cc0000', '#3b6c09'],
    })
    const tmp = new Date()
    let ForMonth = Number(tmp.getMonth()) + 1
    let ForYear = Number(tmp.getUTCFullYear())
    if (month !== 0) {
      ForMonth = month
      ForYear = year
    } else {
      setActivityMonth(ForMonth)
      setActivityYear(ForYear)
    }
    const FilterFromDate = `${ForYear}-${ForMonth}-01`
    let FilterToDate = `${ForYear}-${ForMonth}-31`
    if (
      ForMonth !== 1 &&
      ForMonth !== 3 &&
      ForMonth !== 5 &&
      ForMonth !== 7 &&
      ForMonth !== 8 &&
      ForMonth !== 10 &&
      ForMonth !== 12
    ) {
      FilterToDate = `${ForYear}-${ForMonth}-30`
    }
    if (ForMonth === 2) {
      FilterToDate = `${ForYear}-${ForMonth}-28`
    }
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getActivityListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword: '',
          FilterFromDate,
          FilterToDate,
          emp_id,
          dashboard: 1,
          Act_status: 0,
          recordsPerPage: 10,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.data && resJson.data.length > 0 && resJson.ReportActivity) {
          // CalculateGraph(resJson.data, resJson.oldPending)
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
        const temp = []
        temp.push(['User Type', 'Total'])
        if (resJson.EmpProfileStatus && resJson.EmpProfileStatus.green) {
          temp.push([`Green (${resJson.EmpProfileStatus.green})`, resJson.EmpProfileStatus.green])
        }
        if (resJson.EmpProfileStatus && resJson.EmpProfileStatus.orange) {
          temp.push([
            `Orange (${resJson.EmpProfileStatus.orange})`,
            resJson.EmpProfileStatus.orange,
          ])
        }
        if (resJson.EmpProfileStatus && resJson.EmpProfileStatus.red) {
          temp.push([`Red (${resJson.EmpProfileStatus.red})`, resJson.EmpProfileStatus.red])
        }
        // temp.push([`No Activity Today (${StaffWithNoActivity.length})`, StaffWithNoActivity.length])
        setEmpProfileStatusGraphdata(temp)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // for the Activity Graph

  // for the Attendance Graph
  const CalculateAttedanceGraph = async (
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
    let Week1EmpDateBreakTotal = 0
    let Week2EmpDateBreakTotal = 0
    let Week3EmpDateBreakTotal = 0
    let Week4EmpDateBreakTotal = 0
    let Week5EmpDateBreakTotal = 0
    let Week1TotalWorksHours = 0
    let Week2TotalWorksHours = 0
    let Week3TotalWorksHours = 0
    let Week4TotalWorksHours = 0
    let Week5TotalWorksHours = 0
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
    let TempBarChartData = []
    if (Week1Data.length > 1) {
      TempBarChartData = [['Week', 'Average Shift Hour', 'Average Work Hour', 'Total Break Hour']]
    } else {
      TempBarChartData = [['Week', 'Shift Hour', 'Work Hour', 'Break Hour']]
    }
    setTotalBreak1(Week1EmpDateBreakTotal)
    setTotalBreak2(Week2EmpDateBreakTotal)
    setTotalBreak3(Week3EmpDateBreakTotal)
    setTotalBreak4(Week4EmpDateBreakTotal)
    setTotalBreak5(Week5EmpDateBreakTotal)

    setTotalBreak(
      (IsWeek1 ? Week1EmpDateBreakTotal : 0) +
        (IsWeek2 ? Week2EmpDateBreakTotal : 0) +
        (IsWeek3 ? Week3EmpDateBreakTotal : 0) +
        (IsWeek4 ? Week3EmpDateBreakTotal : 0) +
        (IsWeek5 ? Week5EmpDateBreakTotal : 0),
    )

    setTotalWork1(Week1TotalWorksHours)
    setTotalWork2(Week2TotalWorksHours)
    setTotalWork3(Week3TotalWorksHours)
    setTotalWork4(Week4TotalWorksHours)
    setTotalWork5(Week5TotalWorksHours)

    setTotalWork(
      (IsWeek1 ? Week1TotalWorksHours : 0) +
        (IsWeek2 ? Week2TotalWorksHours : 0) +
        (IsWeek3 ? Week3TotalWorksHours : 0) +
        (IsWeek4 ? Week4TotalWorksHours : 0) +
        (IsWeek5 ? Week5TotalWorksHours : 0),
    )
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

    if (Week1Data.length > 0 && IsWeek1) {
      TempBarChartData.push([
        'Week 1 (1st to  7th)',
        Week1TotalWorksHours,
        Week1TotalWorksHours - Week1EmpDateBreakTotal,
        Week1EmpDateBreakTotal,
      ])
    }
    if (Week2Data.length > 0 && IsWeek2) {
      TempBarChartData.push([
        'Week 2 (8th to  14th)',
        Week2TotalWorksHours,
        Week2TotalWorksHours - Week2EmpDateBreakTotal,
        Week2EmpDateBreakTotal,
      ])
    }

    if (Week3Data.length > 0 && IsWeek3) {
      TempBarChartData.push([
        'Week 3 (15th to  21st)',
        Week3TotalWorksHours,
        Week3TotalWorksHours - Week3EmpDateBreakTotal,
        Week3EmpDateBreakTotal,
      ])
    }

    if (Week4Data.length > 0 && IsWeek4) {
      TempBarChartData.push([
        'Week 4 (22th to  28st)',
        Week4TotalWorksHours,
        Week4TotalWorksHours - Week4EmpDateBreakTotal,
        Week4EmpDateBreakTotal,
      ])
    }

    if (Week5Data.length > 0 && IsWeek5) {
      TempBarChartData.push([
        'Week 5 (From 29th)',
        Week5TotalWorksHours,
        Week5TotalWorksHours - Week5EmpDateBreakTotal,
        Week5EmpDateBreakTotal,
      ])
    }
    setBarChartData(TempBarChartData)
    // FilterAttendanceListData()
  }

  const FilterAttendanceListData = async (month, year) => {
    const tmp = new Date()
    let ForMonth = Number(tmp.getMonth())
    let ForYear = Number(tmp.getUTCFullYear())
    if (month !== '') {
      ForMonth = month
      ForYear = year
    } else {
      setAttedanceMonth(ForMonth)
      setAttedanceYear(ForYear)
    }
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAttendanceListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword: '',
          emp_id,
          dashboard: 1,
          FilterLeaveType: '',
          recordsPerPage: 10,
          // SortStatusType,
          ForReport: 1,
          ForMonth,
          ForYear,
          device: localStorage.getItem('DeviceDetails'),
          IsWeek1,
          IsWeek2,
          IsWeek3,
          IsWeek4,
          IsWeek5,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.data && resJson.data.length > 0 && emp_id !== '') {
          setAttedanceListdata(resJson.data)
        } else {
          setAttedanceListdata([])
        }
        if (resJson.dataList && resJson.dataList.length > 0 && emp_id !== '') {
          setEmpAttedanceListdata(resJson.dataList)
        } else {
          setEmpAttedanceListdata([])
        }
        let WorkingDays = 31
        let presentValue = 0
        if (resJson.AttedancePiedata && emp_id !== '') {
          WorkingDays = getWorkingDays(ForYear, Number(ForMonth) + 1)
          presentValue =
            Number(resJson.AttedancePiedata.presence) +
            Number(resJson.AttedancePiedata.leave) +
            Number(resJson.AttedancePiedata.remote)
          let absentValue = 0
          if (Number(WorkingDays) > Number(presentValue)) {
            absentValue = Number(WorkingDays) - Number(presentValue)
          }
          setAttedanceGraphdata([
            ['Type', 'Total'],
            [`Presence (${resJson.AttedancePiedata.presence})`, resJson.AttedancePiedata.presence],
            [`Leave (${resJson.AttedancePiedata.leave})`, resJson.AttedancePiedata.leave],
            [`Remote (${resJson.AttedancePiedata.remote})`, resJson.AttedancePiedata.remote],
            [`Absent (${absentValue})`, absentValue],
          ])
          setAttedanceGraphOptions({
            title: 'Attendance Summary ',
            is3D: true,
            colors: ['#00bf63', '#ff914d', '#ff5757', '#cc0000'],
          })
        }
        CalculateAttedanceGraph(
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
  // for Break hour calculation

  // for the Calender
  const localizer = momentLocalizer(moment)
  const test = [
    {
      id: 1,
      title: 'Loading',
      end: '2023-08-07',
      start: '2023-08-08',
      description: 'Loading',
    },
  ]
  const [events, setEvents] = useState(test)
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/fetchEvents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: '',
      })
      const resJson = await res.json()
      console.log(resJson)
      if (resJson.data && resJson.data.length > 0) {
        setEvents(resJson.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // show more details
  const [selectedEventAnimals, setselectedEventAnimals] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    fetchAnimalonEvents(event)
  }
  const fetchAnimalonEvents = async (event) => {
    try {
      const res = await fetch(`${NODEAPIURL}/fetchAnimalonEvents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(event),
      })
      const resJson = await res.json()
      if (resJson.data && resJson.data.length > 0) {
        setselectedEventAnimals(resJson.data)
      } else {
        setselectedEventAnimals([])
      }
    } catch (err) {
      console.log(err)
    }
  }
  // Function to clear the selected event details
  const clearSelectedEvent = () => {
    setSelectedEvent(null)
  }
  // show more details
  function ShowDayInput(day, defaultValue) {
    const returnValue = (
      <>
        <CFormCheck label={day} className="me-2" checked={defaultValue === 1} />
      </>
    )
    return returnValue
  }
  // for the calender

  // for the red green and orange users
  const [ProfileStatusUsers, setProfileStatusUsers] = useState([])
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkerslist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword: '',
          dpt_id: '',
          uType: '0',
          status: '',
          SortStatusType: 'ASC',
          showProfileStatus: 1,
          greenUser: 1,
          orangeUser: 1,
          redUser: 1,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (resJson.data && resJson.data.length > 0) {
        setProfileStatusUsers(resJson.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  let redUser = 1
  let OrangeUser = 1
  let greenUser = 1
  // for the red green and orange users

  // for the Today Attedance
  const [ShowAttedanceDate, setShowAttedanceDate] = useState('')
  const [ShowTodayAttedance, setShowTodayAttedance] = useState(0)
  const [PresentEmp, setPresentEmp] = useState([])
  const [LeaveEmp, setLeaveEmp] = useState([])
  const [RemoteEmp, setRemoteEmp] = useState([])
  const [AbsentEmp, setAbsentEmp] = useState([])

  const fetchTodayUser = async () => {
    setShowTodayAttedance(true)
    try {
      const res = await fetch(`${NODEAPIURL}/attendance/fetchTodayUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword: '',
          dpt_id: '',
          uType: '0',
          status: '',
          SortStatusType: 'ASC',
          showProfileStatus: 1,
          greenUser: 1,
          orangeUser: 1,
          redUser: 1,
        }),
      })
      const resJson = await res.json()
      setShowAttedanceDate(resJson.today)
      if (resJson.PresentEmp && resJson.PresentEmp.length > 0) {
        setPresentEmp(resJson.PresentEmp)
      }
      if (resJson.LeaveEmp && resJson.LeaveEmp.length > 0) {
        setLeaveEmp(resJson.LeaveEmp)
      }
      if (resJson.RemoteEmp && resJson.RemoteEmp.length > 0) {
        setRemoteEmp(resJson.RemoteEmp)
      }
      if (resJson.AbsentEmp && resJson.AbsentEmp.length > 0) {
        setAbsentEmp(resJson.AbsentEmp)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // for the Today Attedance

  useEffect(() => {
    IsWeek1 = true
    IsWeek2 = true
    IsWeek3 = true
    IsWeek4 = true
    IsWeek5 = true
    getStaffWithNoActivity()
    let AllPermission = GetArrayFromJson(localStorage.getItem('AllPermission'))
    if (AllPermission && AllPermission.length > 0) {
      emp_id = AllPermission[0].emp_id ? AllPermission[0].emp_id : ''
    }
    localStorage.setItem('ReportOfEmp', '')
    FetchWorkersList()
    FetchProfile()
    setTimeout(() => {
      document.getElementById('GetActivityData').click()
      // document.getElementById('GetActivityData').click()
    }, 786)
    FetchNotifications()
    fetchEvents()
  }, [])

  const [IsNotifiedAdmin, setIsNotifiedAdmin] = useState(false)
  const [NotifiedAdmin, setnNotifiedAdmin] = useState({ adminData: [], message: '' })
  async function sendEmailNotify2Admin() {
    setIsNotifiedAdmin(true)
    try {
      const res = await fetch(`${NODEAPIURL}/UpdatetoAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({}),
      })
      const resJson = await res.json()
      setnNotifiedAdmin(resJson)
      setIsNotifiedAdmin(false)
    } catch (err) {
      console.log(err)
    }
    return 1
  }

  return (
    <div id="ReportDatahere">
      {/* for the Today Attedance */}
      <div className="ry_popup_bg" style={{ display: ShowTodayAttedance ? '' : 'none' }}>
        <div
          style={{
            padding: '10px',
            position: 'fixed',
            top: '0px',
            right: '0px',
            zIndex: 999999,
          }}
          className="dontPrint"
        >
          <button
            type="button"
            className="btn btn-info text-white me-3"
            onClick={() => {
              PrintaDiv('TodayAttedanceDiv', '')
            }}
          >
            <CIcon className="text-white" icon={cilCloudDownload} />
          </button>

          <button
            type="button"
            className="btn btn-danger text-white"
            icon={cilWindowMinimize}
            onClick={() => {
              setShowTodayAttedance(false)
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className="ry_popup_content"
        id="TodayAttedanceDiv"
        style={{
          display: ShowTodayAttedance ? '' : 'none',
          maxWidth: '75%',
          maxHeight: '75%',
        }}
      >
        <h4 className="text-center text-dark">
          Today Attedance on {showdateYMDtoLocal(ShowAttedanceDate)}
        </h4>
        <h5 className="text-success">Present</h5>
        <div className="row">
          {PresentEmp.map((s, i) => (
            <div className="col-md-3" key={s.emp_id}>
              ({i + 1}) {s.f_name} {s.l_name}
            </div>
          ))}
        </div>
        <hr />
        <h5 className="text-info">Remote</h5>
        <div className="row">
          {RemoteEmp.map((s, i) => (
            <div className="col-md-3" key={s.emp_id}>
              ({i + 1}) {s.f_name} {s.l_name}
            </div>
          ))}
        </div>
        <hr />
        <h5 className="text-warning">On Leave</h5>
        <div className="row">
          {LeaveEmp.map((s, i) => (
            <div className="col-md-3" key={s.emp_id}>
              ({i + 1}) {s.f_name} {s.l_name}
            </div>
          ))}
        </div>
        <hr />
        <h5 className="text-danger">Absent</h5>
        <div className="row">
          {AbsentEmp.map((s, i) => (
            <div className="col-md-3" key={s.emp_id}>
              ({i + 1}) {s.f_name} {s.l_name}
            </div>
          ))}
        </div>
      </div>
      {/* for the Today Attedance*/}

      {/* for the red green and orange users */}
      <div className="ry_popup_bg" style={{ display: ProfileStatusUsers.length > 0 ? '' : 'none' }}>
        <div
          style={{
            padding: '10px',
            position: 'fixed',
            top: '0px',
            right: '0px',
            zIndex: 999999,
          }}
          className="dontPrint"
        >
          <button
            type="button"
            className="btn btn-info text-white me-3"
            onClick={() => {
              PrintaDiv('TodayUserStatus', '')
            }}
          >
            <CIcon className="text-white" icon={cilCloudDownload} />
          </button>

          <button
            type="button"
            className="btn btn-danger text-white"
            icon={cilWindowMinimize}
            onClick={() => {
              setProfileStatusUsers([])
              setIsNotifiedAdmin(false)
              setnNotifiedAdmin({ adminData: [], message: '' })
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        id="TodayUserStatus"
        className="ry_popup_content"
        style={{
          display: ProfileStatusUsers.length > 0 ? '' : 'none',
          maxWidth: '75%',
          maxHeight: '75%',
        }}
      >
        <h3 className="text-danger">Red Users</h3>
        <div className="row">
          {ProfileStatusUsers.map((s) => (
            <>
              {s.ProfileStatus === 3 ? (
                <div className="col-md-3" key={s.emp_id}>
                  ({redUser++}) {s.f_name} {s.l_name}
                </div>
              ) : (
                ''
              )}
            </>
          ))}
        </div>
        <hr />
        <h3 className="text-warning">Orange Users</h3>
        <div className="row">
          {ProfileStatusUsers.map((s) => (
            <>
              {s.ProfileStatus === 2 ? (
                <div className="col-md-3" key={s.emp_id}>
                  ({OrangeUser++}) {s.f_name} {s.l_name}
                </div>
              ) : (
                ''
              )}
            </>
          ))}
        </div>
        <hr />
        <h3 className="text-success">Green Users</h3>
        <div className="row">
          {ProfileStatusUsers.map((s) => (
            <>
              {s.ProfileStatus === 1 ? (
                <div className="col-md-3" key={s.emp_id}>
                  ({greenUser++}) {s.f_name} {s.l_name}
                </div>
              ) : (
                ''
              )}
            </>
          ))}
        </div>
        <div className="mt-3">
          {NotifiedAdmin.adminData && NotifiedAdmin.adminData.length > 0 ? (
            <>
              <hr />
              <b>You have notified to below User:</b>
              <br />
              <ul>
                {NotifiedAdmin.adminData.map((s) => (
                  <li key={s.emp_id}>
                    {s.f_name} {s.l_name} ({s.email})
                  </li>
                ))}
              </ul>
              <b>Below Message Sent:</b>
              <div className="mt-3 mb-3" style={{ border: '1px solid #dedede', padding: '10px' }}>
                <div dangerouslySetInnerHTML={{ __html: NotifiedAdmin.message }} />
              </div>
            </>
          ) : (
            ''
          )}
          {IsNotifiedAdmin ? (
            <div className="text-center">
              <img src={`${BASEWEBURL}/loader.gif`} alt="" style={{ maxWidth: '50px' }} />
              <p className="text-danger mt-3">Please wait, we are sending email.</p>
            </div>
          ) : (
            <div className="text-center">
              <buttton
                type="button"
                className="btn btn-lg text-white btn-danger"
                onClick={() => {
                  sendEmailNotify2Admin()
                }}
              >
                Send Email Notification to Admin
              </buttton>
            </div>
          )}
        </div>
      </div>
      {/* for the red green and orange users */}

      <CButton
        className="mt-4 d-none dontPrint"
        id="GetActivityData"
        onClick={() => {
          FilterAttendanceListData('', 0)
          FetchActivityGraphData(0, 0)
        }}
      >
        Get Reports Data
      </CButton>

      <CRow className="mt-4">
        <CCol
          className="dontPrint"
          md={4}
          style={{ display: localStorage.getItem('uType') === '3' ? 'none' : 'none' }}
        >
          <div className="text-center p-1">
            <div>
              <div style={{ position: 'relative' }} className="mb-1">
                <CImage
                  src={
                    ProfileData.image && ProfileData.image.trim() !== ''
                      ? `${UPLOADSsURL}${ProfileData.image}`
                      : ''
                  }
                  className="border border-primary rounded-circle"
                  style={{
                    maxWidth: '100%',
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={() => {
                    document.getElementById('ChangeImageHere').click()
                  }}
                />
                <div
                  style={{
                    display: isHovering ? '' : 'none',
                    position: 'absolute',
                    bottom: '10px',
                    right: '0px',
                    left: '0px',
                    textAlign: 'center',
                    color: '#fff',
                    background1: '#0000009e',
                  }}
                >
                  Change Image
                </div>
              </div>
              <CCardTitle>
                {ProfileData.f_name}
                &nbsp;
                {ProfileData.l_name}
              </CCardTitle>
              <CCardSubtitle className="d-none mb-3 text-medium-emphasis">
                This image will display as your profile
              </CCardSubtitle>
              <CCardText className="mb-1 text-left">
                <CIcon icon={cilEnvelopeClosed} size="lg" className="me-2" />
                {ProfileData.email}
              </CCardText>
              <CCardText className="mb-3 text-left">
                <CIcon icon={cilMobile} size="lg" className="me-2" />
                {ProfileData.mobile}
              </CCardText>
              <CFormInput
                type="file"
                id="ChangeImageHere"
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  uploadProfileImage(e, e.target.files[0], e.target.files[0].name)
                }}
              />
            </div>
          </div>
        </CCol>

        <CCol
          className="dontPrint"
          md={4}
          style={{ display: localStorage.getItem('uType') === '3' ? '' : 'none' }}
          onClick={() => {
            fetchTodayUser()
            // window.location.href = `${BASEWEBURL}/#/workers-attendance`
          }}
        >
          <div>
            <div>
              <h6 className="text-info">Today Attedance</h6>
              <Chart
                className=""
                chartType="PieChart"
                data={TodayAttedanceGraphData}
                options={TodayAttedanceGraphOptions}
                width={'100%'}
                height={'250px'}
              />
            </div>
          </div>
        </CCol>

        <CCol
          className="dontPrint"
          md={4}
          style={{ display: localStorage.getItem('uType') === '3' ? '' : 'none' }}
          onClick={() => {
            fetchUsers()
            // window.location.href = `${BASEWEBURL}/#/user-roles-and-permissions`
          }}
        >
          <div>
            <div>
              <h6 className="text-info">User Status</h6>
              <Chart
                className=""
                chartType="PieChart"
                data={EmpProfileStatusGraphdata}
                options={EmpProfileStatusGraphOptions}
                width={'100%'}
                height={'250px'}
              />
            </div>
          </div>
        </CCol>
        <CCol
          className="dontPrint"
          md={4}
          style={{ display: localStorage.getItem('uType') === '3' ? '' : 'none' }}
        >
          <div>
            <div>
              <h6 className="text-danger">
                {StaffWithNoActivity.length}
                &nbsp;Staff with No Activity Today
              </h6>
              <ul
                style={{
                  maxHeight: '250px',
                  overflow: 'auto',
                  background: '#F5F4F5',
                }}
              >
                {StaffWithNoActivity.map((s) => (
                  <li key={s.emp_id}>
                    {s.f_name} {s.l_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CCol>

        <CRow className="mb-4 mb-4 dontPrint">
          <CCol md={3}>
            <select
              className="form-control"
              value={emp_id}
              onChange={(e) => {
                emp_id = e.target.value
                clearGraphData()
                const index = e.nativeEvent.target.selectedIndex
                FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                FetchActivityGraphData(ActivityMonth, ActivityYear)
                localStorage.setItem('ReportOfEmp', e.nativeEvent.target[index].text)
                document.title = `Report of ${e.nativeEvent.target[index].text} ${
                  AllMonthsName[ActivityMonth - 1]
                } ${ActivityYear}`
              }}
            >
              <option value="">All Staff</option>
              {WorkerListData.map((singi) => (
                <option key={singi.emp_id} value={singi.emp_id}>
                  {singi.f_name} {singi.l_name} ({singi.email})
                </option>
              ))}
            </select>
          </CCol>
          <CCol md={3}>
            <select
              name="ActivityMonth"
              value={ActivityMonth}
              className="form-control"
              onChange={(e) => {
                clearGraphData()
                setActivityMonth(e.target.value)
                setAttedanceMonth(Number(e.target.value) - 1)
                FilterAttendanceListData(Number(e.target.value) - 1, AttedanceYear)
                FetchActivityGraphData(e.target.value, ActivityYear)
                document.title = `Report of ${localStorage.getItem('ReportOfEmp')} ${
                  AllMonthsName[e.target.value - 1]
                } ${ActivityYear}`
              }}
              style={{ minWidth: 'fit-content' }}
            >
              <option value="0">Select Month</option>
              {AllMonthsName.map((s, i) => (
                <option key={s} value={Number(i) + 1}>
                  {s}
                </option>
              ))}
            </select>
          </CCol>
          <CCol md={3}>
            <input
              name="ActivityYear"
              value={ActivityYear}
              className="form-control"
              onChange={(e) => {
                clearGraphData()
                setActivityYear(e.target.value)
                setAttedanceYear(e.target.value)
                FilterAttendanceListData(AttedanceMonth, e.target.value)
                FetchActivityGraphData(ActivityMonth, e.target.value)
                document.title = `Report of ${localStorage.getItem('ReportOfEmp')} ${
                  AllMonthsName[AttedanceMonth - 1]
                } ${e.target.value}`
              }}
              style={{ minWidth: 'fit-content' }}
            />
          </CCol>
          <CCol md={3} className="dontPrint">
            <button
              type="button"
              className="btn btn-info text-white"
              onClick={() => {
                window.print()
              }}
            >
              Download
            </button>
          </CCol>
        </CRow>

        <CCol md={6} className="pdfPrint-50">
          <div>
            <div>
              <h5 className="text-info">Attendance Summary</h5>
              <CCol md={12}>
                <Chart
                  className="sahifhsa safgh mb-4"
                  chartType="PieChart"
                  data={AttedanceGraphdata}
                  options={AttedanceGraphOptions}
                  width={'100%'}
                  height={'250px'}
                />
              </CCol>
            </div>
          </div>
        </CCol>

        <CCol
          md={6}
          className="pdfPrint-50"
          onClick={() => {
            localStorage.setItem('DBUSERID', emp_id)
            localStorage.setItem('DBMONTH', AttedanceMonth)
            localStorage.setItem('DBYEAR', AttedanceYear)
            window.location.href = `${BASEWEBURL}/#/workers-activity`
          }}
        >
          <div>
            <div>
              <h5 className="text-info">
                Activity Report &nbsp;
                <Link to="/upload-activity" className="btn dontPrint btn-sm btn-danger text-white">
                  <CIcon icon={cilPlus} />
                  Report
                </Link>
              </h5>
              <CCol md={12}>
                <Chart
                  className=""
                  chartType="PieChart"
                  data={ActivityGraphdata}
                  options={ActivityGraphOptions}
                  width={'100%'}
                  height={'250px'}
                />
              </CCol>
            </div>
          </div>
        </CCol>

        <div style={{ clear: 'both' }}></div>
        <div style={{ clear: 'both' }} className="m-2"></div>
        <CCol md={12}>
          <h5 className="text-info">Attendance Report</h5>
          <div className="text-center" style={{ padding: '30px', background: '#fff' }}>
            <Chart
              className="sahifhsa safgh mb-4"
              chartType="Bar"
              data={BarChartData}
              options={BarChartOptions}
              width={'100%'}
              height={'450px'}
            />
            <div
              className="p-2 fontReport"
              style={{ textAlign: 'left', float: 'left', minWidth: '33%' }}
            >
              {IsWeek1}
              <CFormCheck
                checked={IsWeek1}
                label="Week 1"
                id="label01"
                onChange={(e) => {
                  IsWeek1 = e.target.checked
                  FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                }}
              />
              {/* &nbsp;&nbsp;<b>Week 1</b> */}
              <div style={{ display: IsWeek1 ? '' : 'none' }}>
                <span className="text-success">Shift: {ShowBetweenTime(TotalWork1, 0)}</span>
                <span className="text-primary">
                  &nbsp;Work: {ShowBetweenTime(TotalWork1 - TotalBreak1, 0)}
                </span>
                <span className="text-danger">&nbsp;Break: {ShowBetweenTime(TotalBreak1, 0)}</span>
              </div>
            </div>
            <div
              className="p-2 fontReport"
              style={{ textAlign: 'left', float: 'left', minWidth: '33%' }}
            >
              <CFormCheck
                checked={IsWeek2}
                label="Week 2"
                id="label02"
                onChange={(e) => {
                  IsWeek2 = e.target.checked
                  FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                }}
              />
              {/* &nbsp;&nbsp;<b>Week 2</b> */}
              <div style={{ display: IsWeek2 ? '' : 'none' }}>
                <span className="text-success">Shift: {ShowBetweenTime(TotalWork2, 0)}</span>
                <span className="text-primary">
                  &nbsp;Work: {ShowBetweenTime(TotalWork2 - TotalBreak2, 0)}
                </span>
                <span className="text-danger">&nbsp;Break: {ShowBetweenTime(TotalBreak2, 0)}</span>
              </div>
            </div>
            <div
              className="p-2 fontReport"
              style={{ textAlign: 'left', float: 'left', minWidth: '33%' }}
            >
              <CFormCheck
                checked={IsWeek3}
                label="Week 3"
                id="label03"
                onChange={(e) => {
                  IsWeek3 = e.target.checked
                  FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                }}
              />
              {/* &nbsp;&nbsp;<b>Week 3</b> */}
              <div style={{ display: IsWeek3 ? '' : 'none' }}>
                <span className="text-success">Shift: {ShowBetweenTime(TotalWork3, 0)}</span>
                <span className="text-primary">
                  &nbsp;Work: {ShowBetweenTime(TotalWork3 - TotalBreak3, 0)}
                </span>
                <span className="text-danger">&nbsp;Break: {ShowBetweenTime(TotalBreak3, 0)}</span>
              </div>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div
              className="p-2 fontReport"
              style={{ textAlign: 'left', float: 'left', minWidth: '33%' }}
            >
              <CFormCheck
                checked={IsWeek4}
                label="Week 4"
                id="label04"
                onChange={(e) => {
                  IsWeek4 = e.target.checked
                  FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                }}
              />
              {/* &nbsp;&nbsp;<b>Week 4</b> */}
              <div style={{ display: IsWeek4 ? '' : 'none' }}>
                <span className="text-success">Shift: {ShowBetweenTime(TotalWork4, 0)}</span>
                <span className="text-primary">
                  &nbsp;Work: {ShowBetweenTime(TotalWork4 - TotalBreak4, 0)}
                </span>
                <span className="text-danger">&nbsp;Break: {ShowBetweenTime(TotalBreak4, 0)}</span>
              </div>
            </div>
            <div
              className="p-2 fontReport"
              style={{ textAlign: 'left', float: 'left', minWidth: '33%' }}
            >
              <CFormCheck
                checked={IsWeek5}
                label="Week 5"
                id="label05"
                onChange={(e) => {
                  IsWeek5 = e.target.checked
                  FilterAttendanceListData(AttedanceMonth, AttedanceYear)
                }}
              />
              {/* &nbsp;&nbsp;<b>Week 5</b> */}
              <div style={{ display: IsWeek5 ? '' : 'none' }}>
                <span className="text-success">Shift: {ShowBetweenTime(TotalWork5, 0)}</span>
                <span className="text-primary">
                  &nbsp;Work: {ShowBetweenTime(TotalWork5 - TotalBreak5, 0)}
                </span>
                <span className="text-danger">&nbsp;Break: {ShowBetweenTime(TotalBreak5, 0)}</span>
              </div>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div style={{ textAlign: 'left' }}>
              <br />
              <button className="btn btn-success text-white btn-sm">
                Total Shift Hour: &nbsp;
                {ShowBetweenTime(TotalWork, 0)}
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-info text-white btn-sm">
                Total Work Hour: &nbsp;
                {ShowBetweenTime(TotalWork - TotalBreak, 0)}
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-danger text-white btn-sm">
                Total Break Hour: &nbsp;
                {ShowBetweenTime(TotalBreak, 0)}
              </button>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>

          {/* Export Template for the Attendance Reports */}
          <CTable style={{ display: 'none' }}>
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
              {AttedanceListdata.map((singi, i) => (
                <CTableRow
                  ind={singi.auto_id}
                  key={singi.auto_id}
                  style={{
                    background: singi.type === 'break' ? '#cc000014' : '',
                  }}
                >
                  <CTableDataCell>{singi.auto_id}</CTableDataCell>
                  <CTableDataCell>
                    {singi.f_name} {singi.l_name}
                  </CTableDataCell>
                  <CTableDataCell>{showFulldatetimein(singi.checkIn)}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {/* Export Template for the Attedance Reports */}
        </CCol>

        <div style={{ clear: 'both', pageBreakAfter: 'always' }} className="m-2"></div>
        <CCol md={12}>
          <h5 className="text-info">Attendance Data</h5>
          <div style={{ padding: '20px 10px', background: '#fff' }}>
            {/* Export Template for the Attedance Reports */}
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  {/* <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
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
                {EmpAttedanceListdata.map((singi, i) => (
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
                    {/* <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell> */}
                    <CTableDataCell>{singi.type === 'break' ? 'Break' : 'Punch'}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.checkIn)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.checkOut === '0' ? 'NA' : showFulldatetimein(singi.checkOut)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {/* {DetailView === 1 ? (
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
                      )} */}
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
                          {/* {EmpDateTotal[`${singi.emp_id}_${singi.forDate}`]
                            ? ShowBetweenTime(EmpDateTotal[`${singi.emp_id}_${singi.forDate}`], 0)
                            : 'NA'} */}
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
            </CTable>
            {/* Export Template for the Attedance Reports */}
          </div>
        </CCol>

        <CCol md={9} className="d-none">
          <CCard className="bg-white text-white mb-4 p-4">
            <CCardBody>
              <CRow>
                <CCol lg={6}>
                  <CCard className="bg-primary text-white mb-4 p-4">
                    <CCardBody>
                      <CRow>
                        <CCol xs={3}>
                          <CIcon icon={cilUser} customClassName="nav-icon" />
                        </CCol>
                        <CCol xs={9}>
                          <CCardTitle style={{ marginBottom: '15px' }}>
                            Livestock Managenment
                          </CCardTitle>
                          <CCardText>
                            <CButton color="light" size="sm" href="#/animals-list">
                              View Detail
                            </CButton>
                          </CCardText>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                  <CCard className="bg-success text-white mb-4 p-4">
                    <CCardBody>
                      <CRow>
                        <CCol xs={3}>
                          <CIcon icon={cilBell} customClassName="nav-icon" />
                        </CCol>
                        <CCol xs={9}>
                          <CCardTitle style={{ marginBottom: '15px' }}>
                            Livestock Health Managenment
                          </CCardTitle>
                          <CCardText>
                            <CButton color="light" size="sm" href="#/add-health-checkup">
                              View Detail
                            </CButton>
                          </CCardText>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol lg={6}>
                  <CCard className="bg-danger text-white mb-4 p-4">
                    <CCardBody>
                      <CRow>
                        <CCol xs={3}>
                          <CIcon icon={cilIndustry} customClassName="nav-icon" />
                        </CCol>
                        <CCol xs={9}>
                          <CCardTitle style={{ marginBottom: '15px' }}>
                            Workers Management
                          </CCardTitle>
                          <CCardText>
                            <CButton color="light" size="sm" href="#/workers-activity">
                              View Detail
                            </CButton>
                          </CCardText>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                  <CCard className="bg-warning text-white mb-4 p-4">
                    <CCardBody>
                      <CRow>
                        <CCol xs={3}>
                          <CIcon icon={cilMap} customClassName="nav-icon" />
                        </CCol>
                        <CCol xs={9}>
                          <CCardTitle style={{ marginBottom: '15px' }}>
                            Geo Fencing Management
                          </CCardTitle>
                          <CCardText>
                            <CButton color="light" size="sm" href="#/geo-fencing-list">
                              View Detail
                            </CButton>
                          </CCardText>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            margin: 'auto',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
            zIndex: 999999,
            minWidth: '250px',
            maxWidth: '50%',
            height: 'max-content',
            background: '#fff',
            border: '1px solid blue',
            padding: '20px',
          }}
        >
          <p>
            <b>Title:</b>
            <br />
            {selectedEvent.subTitle}
            <hr />
            <b>Description</b>
            <br />
            {selectedEvent.description}
            <hr />
            {selectedEventAnimals.length > 0 ? (
              <>
                <b>For The Animal:</b>
                <br />
                <div className="row">
                  {selectedEventAnimals.map((anis) => (
                    <div className="col-md-4" key={anis.auto_id}>
                      <span className="text-warning">Animal ID: {anis.ani_id}</span>
                      <br />
                      <small>
                        Chip: {anis.chip_no} | Gender: {anis.sex}
                      </small>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            ) : (
              ''
            )}
            <b>Created By: </b>
            <span className="text-info">
              {selectedEvent.f_name} {selectedEvent.l_name}
            </span>
            <hr />
            <b>From Date: </b>
            <span className="text-success">{selectedEvent.start}</span>
            &nbsp;&nbsp;&nbsp;
            {selectedEvent.endDate && selectedEvent.endDate !== '0' ? (
              <>
                <b>To Date: </b>
                <b className="text-danger">{selectedEvent.endDate}</b>
              </>
            ) : (
              <>
                <b className="text-danger">No End Date</b>
              </>
            )}
            &nbsp;&nbsp;&nbsp;
            <b>Send Time: </b>
            <span className="text-warning">
              {ShowTimeAMorPM(`${selectedEvent.sendHour}:${selectedEvent.sendMin}`)}
            </span>
            <hr />
            <div className="d-flex">
              {ShowDayInput('Monday', selectedEvent.MondayInp)}
              {ShowDayInput('Tuesday', selectedEvent.TuesdayInp)}
              {ShowDayInput('Wednesday', selectedEvent.WednesdayInp)}
              {ShowDayInput('Thursday', selectedEvent.ThursdayInp)}
              {ShowDayInput('Friday', selectedEvent.FridayInp)}
              {ShowDayInput('Saturday', selectedEvent.SaturdayInp)}
              {ShowDayInput('Sunday', selectedEvent.SundayInp)}
            </div>
          </p>
          <center>
            <button className="btn btn-danger text-white" onClick={clearSelectedEvent}>
              Close
            </button>
          </center>
        </div>
      )}
      <div
        className="mt-4 bg-white dontPrint"
        style={{ height: '500px', padding: '30px', minHeight: '400px' }}
      >
        <Link to="/scheduling" style={{ textDecoration: 'none' }}>
          <h3 className="text-info">Scheduled Notification</h3>
        </Link>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          views={['month', 'agenda']} // , 'week', 'day'
          defaultView="agenda"
          onSelectEvent={handleSelectEvent}
        />
      </div>

      <CRow className="mt-4 dontPrint">
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <h4>Notifications</h4>
            </CCardHeader>
            <CCardBody>
              <CTable hover bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">User</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sent At</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Staus</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {NotificationsData.map((singi) => (
                    <CTableRow key={singi.auto_id}>
                      <CTableDataCell>{singi.auto_id}</CTableDataCell>
                      <CTableDataCell>
                        {singi.f_name} {singi.l_name}
                        <br />
                        <CIcon icon={cilEnvelopeLetter} />
                        &nbsp;{singi.email}
                      </CTableDataCell>
                      <CTableDataCell>{showFulldatetimein(singi.sentAt)}</CTableDataCell>
                      <CTableDataCell>
                        {MakeLinkNoti(singi.page, singi.pagevalue) !== '' ? (
                          <Link
                            to={MakeLinkNoti(singi.page, singi.pagevalue)}
                            onClick={() => {
                              localStorage.setItem('notipagevalue', singi.pagevalue)
                              localStorage.setItem('notipage', singi.page)
                            }}
                          >
                            {singi.title}
                          </Link>
                        ) : (
                          singi.title
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{singi.description}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={MakeLinkNoti(singi.page, singi.pagevalue)}
                          onClick={() => {
                            localStorage.setItem('notipagevalue', singi.pagevalue)
                            localStorage.setItem('notipage', singi.page)
                          }}
                        >
                          {singi.status === 0 ? (
                            <button type="button" className="btn btn-warning">
                              <CIcon icon={cilWarning} />
                            </button>
                          ) : (
                            ''
                          )}
                          {singi.status === 1 ? (
                            <button type="button" className="btn btn-success">
                              Approved
                            </button>
                          ) : (
                            ''
                          )}
                          {singi.status === 2 ? (
                            <button type="button" className="btn btn-danger">
                              Rejected
                            </button>
                          ) : (
                            ''
                          )}
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default MyDashboard

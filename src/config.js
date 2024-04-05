export function GetValueFromJson(jsonvalue, index, defaultValue) {
  var sendValue = {}
  try {
    sendValue = JSON.parse(jsonvalue)
    sendValue = sendValue[index] ? sendValue[index] : ''
    if (sendValue === '') {
      sendValue = defaultValue
    }
  } catch (e) {
    console.log(e)
    return defaultValue
  }
  return sendValue
}

export function PrintaDiv(divID, title) {
  const content = document.getElementById(divID)
  let pri
  if (document.getElementById(`${divID}Iframe`)) {
    pri = document.getElementById(`${divID}Iframe`).contentWindow
  } else {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('title', title)
    iframe.setAttribute('id', `${divID}Iframe`)
    iframe.setAttribute('style', 'height: 0px; width: 0px; position: absolute;')
    document.body.appendChild(iframe)
    pri = iframe.contentWindow
  }
  pri.document.open()
  pri.document.write(
    `<h1 style="text-align: center;">${title}</h1> <br /><hr /> ${content.innerHTML}`,
  )
  pri.document.close()
  pri.focus()
  pri.print()
}

export function GetArrayFromJson(jsonvalue) {
  var sendValue = []
  try {
    sendValue = JSON.parse(jsonvalue)
    if (sendValue) {
      // sendValue = sendValue
    } else {
      sendValue = []
    }
  } catch (e) {
    sendValue = []
    console.log(e)
    return []
  }
  return sendValue
}

// export const BASEWEBURL = 'https://demo3.sjainventures.com/frc/administrator'
export const BASEWEBURL1 = 'https://frcadmin.sjain.io'
export const BASEWEBURL2 = 'http://localhost:3000'
export const BASEWEBURL3 = 'https://reactjs.indiahelppoint.in/'

export const BASEWEBURL = BASEWEBURL3

export const UPLOADSsURL = 'https://frcadmin.sjain.io/uploads/'
export const DoUploadURL = 'https://frcadmin.sjain.io/uploads/index.php'

export const NODEAPIURL = 'http://139.59.176.130:3000'

export const NodeUPLOADSsURL = 'http://139.59.176.130:3000/showfile/'
export const DoNodeUploadURL = `${NODEAPIURL}/uploadAnyFile`
export const NodeUploadBasePhyPath = '/home/azureuser/frcsj/uploads/'

export const AllMonthsName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function MapURLLatLong(Lat, Long) {
  return `https://www.google.com/maps/place?q=${Lat},${Long}`
}
export function getDistanceDirect(lat1, lon1, lat2, lon2) {
  return `https://www.google.com/maps/dir/${lat1},${lon1}/${lat2},${lon2}`
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371 * 1000
  // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1)
  // deg2rad below
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  // Distance in meter
  if (Number(d) > 1000) {
    d = `${(d / 1000).toFixed(2)} KM`
  } else {
    d = `${d.toFixed(2)} Mt`
  }
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export function ShowLoginLogTimeStamp(timestamp) {
  const tmp = new Date(Number(timestamp) * 1000)
  return `${tmp.getDate()} ${AllMonthsName[tmp.getMonth()]}, ${tmp.getUTCFullYear()}`
}

export function showdatetimein(timestamp) {
  // var t = new Date(1970, 0, 1)
  // t.setSeconds(timestamp)
  const tmp = new Date(Number(timestamp) * 1000)
  return `${tmp.getDate()} ${AllMonthsName[tmp.getMonth()]}, ${tmp.getUTCFullYear()}`
}

export function showdateYMD(timestamp) {
  // var t = new Date(1970, 0, 1)
  // t.setSeconds(timestamp)
  const tmp = new Date(Number(timestamp) * 1000)
  var month = tmp.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  var date = tmp.getDate()
  if (date < 10) {
    date = `0${date}`
  }
  return `${tmp.getUTCFullYear()}-${month}-${date}`
}

export function TodaydateYMD() {
  const tmp = new Date()
  var month = tmp.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  var date = tmp.getDate()
  if (date < 10) {
    date = `0${date}`
  }
  return `${tmp.getUTCFullYear()}-${month}-${date}`
}

export function getDateObj2Ymd(dateObj) {
  const tmp = new Date(dateObj)
  var month = tmp.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  var date = tmp.getDate()
  if (date < 10) {
    date = `0${date}`
  }
  return `${tmp.getUTCFullYear()}-${month}-${date}`
}

export function showdateYMDtoLocal(datewillbe) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const tmp = new Date(datewillbe)
  return `${tmp.getDate()} ${AllMonthsName[tmp.getMonth()]}, ${tmp.getUTCFullYear()} (${
    days[tmp.getDay()]
  })`
}

export function showTimePunchExcpt(timestamp) {
  const tmp = new Date(Number(timestamp) * 1000)
  var minutes = tmp.getMinutes()
  var hours = tmp.getHours()
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  var AmPm = 'am'
  if (hours > 11) {
    AmPm = 'pm'
  }
  if (hours > 12) {
    hours = hours - 12
  }
  if (hours < 10) {
    hours = `0${hours}`
  }
  return `${hours}:${minutes} ${AmPm}`
}

export function ShowTimeAMorPM(time) {
  let hours = Number(time.slice(0, 2))
  var minutes = Number(time.slice(3, 5))
  var AmPm = 'am'
  if (hours > 11) {
    AmPm = 'pm'
  }
  if (hours > 12) {
    hours = hours - 12
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (hours < 10) {
    hours = `0${hours}`
  }
  return `${hours}:${minutes} ${AmPm}`
}

export function showFulldatetimein(timestamp) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const tmp = new Date(Number(timestamp) * 1000)
  var minutes = tmp.getMinutes()
  var hours = tmp.getHours()
  const dayName = days[tmp.getDay()]
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  var AmPm = 'am'
  if (hours > 11) {
    AmPm = 'pm'
  }
  if (hours > 12) {
    hours = hours - 12
  }
  if (hours < 10) {
    hours = `0${hours}`
  }
  return `${tmp.getDate()} ${
    AllMonthsName[tmp.getMonth()]
  }, ${tmp.getUTCFullYear()} (${hours}:${minutes} ${AmPm}) - ${dayName}`
}

export function ShowBetweenTime(ToSeconds, FromSeconds) {
  FromSeconds = Number(FromSeconds)
  ToSeconds = Number(ToSeconds)
  if (ToSeconds === 0) {
    return 'N/A'
  }
  var seconds = Math.floor(ToSeconds - FromSeconds)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  // var days = Math.floor(hours / 24)
  // hours = hours - days * 24
  minutes = minutes - hours * 60
  seconds = seconds - hours * 60 * 60 - minutes * 60
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (hours < 10) {
    hours = `0${hours}`
  }
  return `${hours}:${minutes}:${seconds}`
}
export function GetSecondsBetweenTime(ToSeconds, FromSeconds) {
  FromSeconds = Number(FromSeconds)
  ToSeconds = Number(ToSeconds)
  if (ToSeconds === 0) {
    return 0
  }
  return Math.floor(ToSeconds - FromSeconds)
}
export function GetMondayDate() {
  const date = new Date()
  var day = date.getDay() || 7
  if (day !== 1) {
    date.setHours(-24 * (day - 1))
  }
  let month = date.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  let theDate = date.getDate()
  if (theDate < 10) {
    theDate = `0${theDate}`
  }
  const year = date.getFullYear()
  // const yearUTC = date.getUTCFullYear() // Problem with this Fuction form the Javascript
  // console.log(`date : ${date}`)
  // console.log(`year : ${year}`)
  // console.log(`yearUTC : ${yearUTC}`)
  // return `2023-${month}-${theDate}`
  return `${year}-${month}-${theDate}`
}

export function GetTodayDate() {
  const date = new Date()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  let theDate = date.getDate()
  if (theDate < 10) {
    theDate = `0${theDate}`
  }
  return `${date.getUTCFullYear()}-${month}-${theDate}`
  // return date
}

export const monthArray = [
  { title: 'January', id: 0 },
  { title: 'February', id: 1 },
  { title: 'March', id: 2 },
  { title: 'April', id: 3 },
  { title: 'May', id: 4 },
  { title: 'June', id: 5 },
  { title: 'July', id: 6 },
  { title: 'August', id: 7 },
  { title: 'September', id: 8 },
  { title: 'October', id: 9 },
  { title: 'November', id: 10 },
  { title: 'December', id: 11 },
]

export function getWorkingDays(year, month) {
  let tempToday = 0
  const startDate = new Date(year, month - 1, 1)
  let endDate = new Date(year, month, 0)
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() + 1
  if (Number(todayYear) === Number(year) && Number(month) === Number(todayMonth)) {
    endDate = today
    tempToday = 1
    // endDate = new Date(year, month, 21)
  }

  let workingDays = 0

  // Loop through each day in the month
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    // Check if the day is not a weekend (Saturday or Sunday)
    if (Number(date.getDay()) !== 0 && Number(date.getDay()) !== 6) {
      workingDays++
    }
  }
  // console.log(` workingDays : ${workingDays}`)
  return workingDays - tempToday
}
export const reportTitleLength = 10
export const reportTitleAlphaLength = 5
export const reportDescriptionLength = 50
export const reportDescriptionAlphaLength = 30

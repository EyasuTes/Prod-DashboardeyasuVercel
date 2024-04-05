import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
// import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'
import { cilPlus } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CForm,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { BASEWEBURL, NODEAPIURL } from '../../config'
import ListDefaultData from './DefaultGeoFencingList'
import GoogleMap from './GoogleMap'

// let mapReference = null
let uLat = localStorage.getItem('uLat') ? Number(localStorage.getItem('uLat')) : 0
let uLong = localStorage.getItem('uLong') ? Number(localStorage.getItem('uLong')) : 0
let uRadious = localStorage.getItem('uRadious')
uRadious = uRadious ? uRadious : 200
/*
  https://www.npmjs.com/package/google-map-react
  https://stackoverflow.com/questions/51495060/google-maps-react-get-marker-position-on-drag-end
  https://github.com/fullstackreact/google-maps-react/issues/39
*/

const DefineLocation = ({ ForID }) => {
  const navigate = useNavigate()
  const [SearchEmployee, SetSearchEmployee] = useState('')
  // https://stackoverflow.com/questions/46387375/reactjs-get-latitude-on-click-and-show-it-in-input
  const [ShowList, setShowList] = useState(0)
  const [HaveDates, setHaveDates] = useState(0)
  const [ToAllUsers, setToAllUsers] = useState(1)
  const [StartDate, setStartDate] = useState('')
  const [EndDate, setEndDate] = useState('')
  const [Title, setTitle] = useState('')
  const [Lat, setLat] = useState(0)
  const [Long, setLong] = useState(0)
  const [Radious, setRadious] = useState(uRadious)
  const [BreakAllowed, setBreakAllowed] = useState(0)
  const [restrictGeo, setrestrictGeo] = useState(0)
  const [typeGeo, settypeGeo] = useState(0)
  const [ListUsers, setListUsers] = useState([])
  let HandleListUsers = (index, name, value) => {
    ListUsers[index][name] = value
    // setListUsers({ ...ListUsers, [name]: value })
  }
  const [AddFormData, setAddFormData] = useState({
    auto_id: ForID === 'new' ? 0 : ForID,
    title: '',
    emp_id: 0,
    uLat: Lat,
    uLong: Long,
    uRadious: Radious,
    StartDate,
    EndDate,
    ListUsers,
    ToAllUsers,
    break_allowed: BreakAllowed,
    restrictGeo,
    typeGeo,
  })
  // let HandleForm = (e) => {
  //   setAddFormData({ ...AddFormData, [e.target.name]: e.target.value })
  // }
  let updateHandleForm = (e) => {
    setAddFormData({
      auto_id: ForID === 'new' ? 0 : ForID,
      title: Title,
      emp_id: 0,
      uLat: Lat,
      uLong: Long,
      uRadious: Radious,
      StartDate,
      EndDate,
      HaveDates,
      ListUsers,
      ToAllUsers,
      break_allowed: BreakAllowed,
      restrictGeo,
      typeGeo,
    })
  }
  // const [defaultZoomRY, setdefaultZoomRY] = useState(100);
  const [defaultCenter, setdefaultCenter] = useState({
    center: {
      lat: uLat ? Number(uLat) : 1,
      lng: uLong ? Number(uLong) : 1,
    },
    zoom: 15,
  })

  const getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation

    if (location) {
      location.getCurrentPosition(
        (position) => {
          let check = localStorage.getItem('uLat')
          if (check === '' || check === null) {
            setLat(position.coords.latitude)
            setLong(position.coords.longitude)
            localStorage.setItem('uLat', position.coords.latitude)
            localStorage.setItem('uLong', position.coords.longitude)
            setdefaultCenter({
              center: {
                lat: uLat ? Number(position.coords.latitude) : 1,
                lng: uLong ? Number(position.coords.longitude) : 1,
              },
              zoom: 15,
            })
          }
        },
        (error) => {
          alert('Please enable your location or Drag the Map Pointer to set Location.')
          setLat(0)
          setLong(0)
        },
      )
    }
  }

  const changeMarkerPosition = (e) => {
    setLat(e.lat)
    setLong(e.lng)
  }

  // here 2
  const [ShowGoogleMap, setShowGoogleMap] = useState(
    <GoogleMap
      Lat={Lat ? Number(Lat) : 0}
      Long={Long ? Number(Long) : 0}
      Radious={Radious}
      changeMarkerPosition={changeMarkerPosition}
      defaultCenter={defaultCenter}
    />,
  )
  function updateGoogleMap() {
    setShowGoogleMap(
      <GoogleMap
        Lat={Lat ? Number(Lat) : 0}
        Long={Long ? Number(Long) : 0}
        Radious={Radious}
        changeMarkerPosition={changeMarkerPosition}
        defaultCenter={defaultCenter}
      />,
    )
  }

  // here 1

  // save to Database Function will be Here
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  const SubmitData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/createGeoFencing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AddFormData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            navigate('/geo-fencing-default')
          }, 450)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }
  // save to Database Function will be Here
  var ListData = ''
  if (ShowList === 1) {
    ListData = <ListDefaultData />
  }

  const listWorkers = async (e) => {
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/listWorkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ a: 0, device: localStorage.getItem('DeviceDetails') }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.data.length > 0) {
          setListUsers(resJson.data)
        }
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    uLat = localStorage.getItem('uLat')
    uLong = localStorage.getItem('uLong')
    setLat(uLat)
    setLong(uLong)
    uRadious = localStorage.getItem('uRadious')
    setShowList(0)
    getMyLocation()
    listWorkers()
  }, [])

  return (
    <>
      <div style={{ display: ShowList === 1 ? '' : 'none' }}>{ListData}</div>
      <div style={{ display: ShowList === 1 ? 'none' : '' }}>
        <CRow>
          <CCol lg={6}>
            <h3 className="mb-4">Define Location</h3>
          </CCol>
          <CCol lg={6} className="mb-4 d-none text-lg-end">
            <CButton color="primary" className="me-3">
              <CIcon icon={cilPlus} />
            </CButton>
            Add Field
          </CCol>
        </CRow>
        <CRow>
          <CCol lg={12}>
            <CCard className="mb-4 p-3">
              <CCardBody>
                <CForm
                  className="hello"
                  autoComplete="off"
                  autofill="off"
                  onSubmit={(e) => {
                    SubmitData(e)
                  }}
                >
                  <CRow className="mb-4">
                    <CCol md={6}>
                      {ShowGoogleMap}
                      <small>
                        Lat: <b>{Lat}</b>
                        &nbsp;Long: <b>{Long}</b>
                      </small>
                    </CCol>
                    <CCol md={6}>
                      <iframe
                        title="Map"
                        src={`${BASEWEBURL}/map.html?lat=${Lat}&long=${Long}&radious=${Radious}`}
                        style={{
                          width: '100%',
                          minHeight: '400px',
                        }}
                      ></iframe>
                      <small>
                        Lat: <b>{Lat}</b>
                        &nbsp;Long: <b>{Long}</b>
                      </small>
                      &nbsp;
                      <a
                        target="_FULLMAP"
                        rel="noreferrer"
                        href={`${BASEWEBURL}/map.html?lat=${Lat}&long=${Long}&radious=${Radious}`}
                      >
                        <small>Full Map</small>
                      </a>
                    </CCol>
                  </CRow>
                  <CRow className="mb-4">
                    <CCol lg={6}>
                      <CFormInput
                        name="uLat"
                        type="number"
                        required={true}
                        label="Latitude"
                        placeholder="Enter Latitude"
                        value={Lat}
                        // value={AddFormData.ani_id}
                        onChange={(e) => {
                          setLat(e.target.value)
                          localStorage.setItem('uLat', e.target.value)
                          updateGoogleMap()
                        }}
                      />
                    </CCol>
                    <CCol lg={6}>
                      <CFormInput
                        name="uLong"
                        required={true}
                        type="number"
                        label="Longitude"
                        placeholder="Enter Longitude"
                        value={Long}
                        onChange={(e) => {
                          setLong(e.target.value)
                          localStorage.setItem('uLong', e.target.value)
                          updateGoogleMap()
                        }}
                      />
                    </CCol>
                    <CCol lg={5} className="mt-3">
                      <CFormInput
                        min={1}
                        name="title"
                        required={true}
                        type="text"
                        label="Title"
                        placeholder="Enter Title"
                        value={Title}
                        onChange={(e) => {
                          setTitle(e.target.value)
                        }}
                      />
                    </CCol>
                    <CCol className="mt-3 d-none" md={2}>
                      <CFormSelect
                        name="typeGeo"
                        value={typeGeo}
                        label="Type"
                        onChange={(e) => {
                          settypeGeo(e.target.value)
                        }}
                      >
                        <option value="1">Office</option>
                        <option value="2">Home</option>
                        <option value="3">Remote</option>
                      </CFormSelect>
                    </CCol>
                    <CCol
                      className="mt-3"
                      md={3}
                      title="Restrict Location can be Punch in and out from the Same Location only."
                    >
                      <CFormSelect
                        name="restrictGeo"
                        value={restrictGeo}
                        label="Type"
                        onChange={(e) => {
                          setrestrictGeo(e.target.value)
                        }}
                      >
                        <option value="0">Workplace</option>
                        <option value="1">Home/ Remote</option>
                      </CFormSelect>
                    </CCol>
                    <CCol className="mt-3" md={2}>
                      <CFormSelect
                        name="break_allowed"
                        value={BreakAllowed}
                        onChange={(e) => {
                          setBreakAllowed(e.target.value)
                        }}
                        label="Break Allowed"
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </CFormSelect>
                    </CCol>
                    <CCol lg={2} className="mt-3">
                      <CFormInput
                        min={1}
                        max={99999999999}
                        name="uRadious"
                        required={true}
                        type="number"
                        label="Radius"
                        placeholder="Enter Radius"
                        value={Radious}
                        onChange={(e) => {
                          localStorage.setItem('uRadious', e.target.value)
                          setRadious(e.target.value)
                          updateGoogleMap()
                        }}
                      />
                    </CCol>
                    <CCol lg={12} className="mt-3">
                      <CFormCheck
                        name="empID"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHaveDates(1)
                          } else {
                            setHaveDates(0)
                          }
                        }}
                      />
                      &nbsp;
                      <b
                        className="text-success"
                        style={{ display: HaveDates === 1 ? 'none' : '' }}
                      >
                        Have Start and End Date
                      </b>
                      <b className="text-danger" style={{ display: HaveDates === 1 ? '' : 'none' }}>
                        No Start and End Date
                      </b>
                    </CCol>
                    <CCol
                      lg={6}
                      className="mt-3"
                      style={{ display: HaveDates === 1 ? '' : 'none' }}
                    >
                      <CFormInput
                        min={1}
                        name="StartDate"
                        type="date"
                        label="Start Date"
                        value={StartDate}
                        onChange={(e) => {
                          setStartDate(e.target.value)
                        }}
                      />
                    </CCol>
                    <CCol
                      lg={6}
                      className="mt-3"
                      style={{ display: HaveDates === 1 ? '' : 'none' }}
                    >
                      <CFormInput
                        min={1}
                        name="EndDate"
                        type="date"
                        label="End Date"
                        value={EndDate}
                        onChange={(e) => {
                          setEndDate(e.target.value)
                        }}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol lg={12} className="mt-3">
                      <CFormCheck
                        name="empID"
                        checked={ToAllUsers === 0 ? true : false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setToAllUsers(0)
                          } else {
                            setToAllUsers(1)
                          }
                        }}
                      />
                      <b className="text-danger">&nbsp;For Selected Users below &nbsp;</b>
                      <CFormCheck
                        name="empID"
                        checked={ToAllUsers === 1 ? true : false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setToAllUsers(1)
                          } else {
                            setToAllUsers(0)
                          }
                        }}
                      />
                      <b className="text-success">&nbsp;For All Users</b>
                      <div
                        style={{
                          display: ToAllUsers === 1 ? 'none' : '',
                          float: 'right',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Search Employee"
                          onChange={(e) => {
                            SetSearchEmployee(e.target.value)
                          }}
                          style={{
                            marginLeft: '10px',
                            height: '20px',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </CCol>
                    <hr className="mt-3" style={{ display: ToAllUsers === 1 ? 'none' : '' }} />
                    <div
                      className="row col-md-12"
                      style={{ display: ToAllUsers === 1 ? 'none' : '' }}
                    >
                      {ListUsers.map((user, index) => (
                        <CCol
                          lg={6}
                          key={user.emp_id}
                          style={{
                            display:
                              SearchEmployee !== ''
                                ? user.f_name
                                    .toLowerCase()
                                    .includes(SearchEmployee.toLowerCase()) ||
                                  user.l_name
                                    .toLowerCase()
                                    .includes(SearchEmployee.toLowerCase()) ||
                                  user.email.toLowerCase().includes(SearchEmployee.toLowerCase())
                                  ? ''
                                  : 'none'
                                : '',
                          }}
                        >
                          <CFormCheck
                            name="empID"
                            onChange={(e) => {
                              if (e.target.checked) {
                                HandleListUsers(index, 'status', 2)
                              } else {
                                HandleListUsers(index, 'status', 1)
                              }
                            }}
                          />
                          &nbsp;
                          {user.f_name} {user.l_name} ({user.email})
                        </CCol>
                      ))}
                    </div>
                  </CRow>
                  <CRow className="mt-2">
                    <CCol lg={12} className="text-center">
                      <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                        {AjaxMsg}
                      </div>
                      <CButton
                        color="primary"
                        type="submit"
                        className="me-3 px-4"
                        onClick={(e) => {
                          updateHandleForm(e)
                        }}
                      >
                        Save
                      </CButton>
                      <Link to="/geo-fencing-default">
                        <CButton color="dark" variant="outline" className="px-4">
                          Cancel
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  )
}

DefineLocation.propTypes = {
  ForID: PropTypes.any,
}

export default DefineLocation

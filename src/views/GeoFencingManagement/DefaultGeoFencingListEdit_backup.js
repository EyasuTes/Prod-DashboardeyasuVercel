import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  // CFormSelect,
} from '@coreui/react'
import { BASEWEBURL, NODEAPIURL } from '../../config'
import GoogleMap from './GoogleMap'

const AddWorkerForm = ({ RequestedID, setShowEdit, FilterDataList }) => {
  // for Selected Employee
  const [ListUsers, setListUsers] = useState([])
  const [ToAllUsers, setToAllUsers] = useState(1)
  const [HaveDates, setHaveDates] = useState(0)
  let HandleListUsers = (index, name, value) => {
    ListUsers[index][name] = value
    // setListUsers({ ...ListUsers, [name]: value })
  }
  // for Selected Employee
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [WorkedAddData, setWorkedAddData] = useState({
    auto_id: RequestedID,
    title: 'Loading',
    start_date: '',
    end_date: '',
    start_time: '',
    uLat: localStorage.getItem('uLat'),
    uLong: localStorage.getItem('uLong'),
    end_time: '',
    uRadious: 100,
    ListUsers,
    ToAllUsers,
  })

  const [Lat, setLat] = useState(WorkedAddData.uLat)
  const [Long, setLong] = useState(WorkedAddData.uLong)
  const [defaultCenter] = useState({
    center: {
      lat: Lat ? Number(Lat) : 1,
      lng: Long ? Number(Long) : 1,
    },
    zoom: 15,
  })
  const changeMarkerPosition = (e) => {
    setLat(e.lat)
    setLong(e.lng)
  }

  const [ShowGoogleMap] = useState(
    <GoogleMap
      Lat={Lat}
      Long={Long}
      Radious={WorkedAddData.uRadious}
      changeMarkerPosition={changeMarkerPosition}
      defaultCenter={defaultCenter}
    />,
  )

  const HandleForm = (name, value) => {
    setWorkedAddData({ ...WorkedAddData, [name]: value })
  }

  const SubmitWorkersData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/UpdateEmployeeGeo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(WorkedAddData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FilterDataList()
            setShowEdit(false)
          }, 786)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const FetchWorkersDetails = async (auto_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getEmployeeGeo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auto_id,
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.data.length > 0) {
          setWorkedAddData(resJson.data[0])
          setLat(resJson.data[0].uLat)
          setLong(resJson.data[0].uLong)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
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
    FetchWorkersDetails(RequestedID)
    listWorkers()
  }, [RequestedID])

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-4">
          #{RequestedID}&nbsp; Update Worker Geo Fencing {WorkedAddData.title}
        </h3>
      </CCol>
      <CCol xs={12}>
        {ShowGoogleMap}
        <CCard className="mb-4">
          <CCardBody>
            <CForm
              className="hello"
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitWorkersData(e)
              }}
            >
              <CRow>
                <CCol md={6}>
                  <div className="p-1">
                    <label>Title</label>
                    <CFormInput
                      type="text"
                      required
                      name="title"
                      value={WorkedAddData.title}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Title"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <label>Radious</label>
                    <CFormInput
                      type="number"
                      min={1}
                      max={500}
                      required
                      name="uRadious"
                      value={WorkedAddData.uRadious}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Radious"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol lg={6}>
                  <CFormInput
                    name="uLat"
                    type="text"
                    required={true}
                    label="Lattitude"
                    placeholder="Enter Lattitude"
                    value={Lat}
                    // value={AddFormData.ani_id}
                    onChange={(e) => {
                      HandleForm(e.target.name, e.target.value)
                      setLat(e.target.value)
                      localStorage.setItem('uLat', e.target.value)
                    }}
                  />
                </CCol>
                <CCol lg={6}>
                  <CFormInput
                    name="uLong"
                    required={true}
                    type="text"
                    label="Longitude"
                    placeholder="Enter Longitude"
                    value={Long}
                    onChange={(e) => {
                      HandleForm(e.target.name, e.target.value)
                      setLong(e.target.value)
                      localStorage.setItem('uLong', e.target.value)
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol md={6}>
                  <div className="p-1">
                    <label>Start Date</label>
                    <CFormInput
                      type="date"
                      name="start_date"
                      value={WorkedAddData.start_date}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select Start Date"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <label>End Date</label>
                    <CFormInput
                      type="date"
                      name="end_date"
                      value={WorkedAddData.end_date}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select End Date"
                    />
                  </div>
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
                </CCol>
                <hr className="mt-3" style={{ display: ToAllUsers === 1 ? 'none' : '' }} />
                {ListUsers.map((user, index) => (
                  <CCol
                    lg={6}
                    key={user.emp_id}
                    style={{ display: ToAllUsers === 1 ? 'none' : '' }}
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
              </CRow>

              <div className="p-1 mt-4">
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CButton
                  type="submit"
                  color="primary"
                  className="mr-4"
                  style={{ marginRight: '20px' }}
                >
                  Save
                </CButton>
                <CButton
                  type="button"
                  color="light"
                  onClick={() => {
                    setShowEdit(false)
                  }}
                >
                  Cancel
                </CButton>
              </div>
              <iframe
                className="mt-4"
                title="Map"
                src={`${BASEWEBURL}/map.html?lat=${Lat}&long=${Long}&radious=${WorkedAddData.uRadious}`}
                style={{
                  width: '100%',
                  minHeight: '400px',
                }}
              ></iframe>
              <a
                target="_FULLMAP"
                rel="noreferrer"
                href={`${BASEWEBURL}/map.html?lat=${WorkedAddData.uLat}&long=${WorkedAddData.uLong}&radious=${WorkedAddData.uRadious}`}
              >
                View Full Map
              </a>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

AddWorkerForm.propTypes = {
  RequestedID: PropTypes.any,
  setShowEdit: PropTypes.any,
  FilterDataList: PropTypes.any,
}

export default AddWorkerForm

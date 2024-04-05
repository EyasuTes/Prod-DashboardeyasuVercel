import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'
// import CIcon from '@coreui/icons-react'
// import { cilFilter, cilPlus, cilSave, cilSortDescending } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  // CFormSelect,
} from '@coreui/react'
import { BASEWEBURL, NODEAPIURL } from '../../config'
import GoogleMap from './GoogleMap'

const AddWorkerForm = ({ RequestedID, setShowEdit, FilterDataList }) => {
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [WorkedAddData, setWorkedAddData] = useState({
    auto_id: RequestedID,
    title: 'Loading',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    break_allowed: 0,
    restrictGeo: 0,
    typeGeo: 1,
    uLat: localStorage.getItem('uLat'),
    uLong: localStorage.getItem('uLong'),
    uRadious: 10,
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
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchWorkersDetails(RequestedID)
  }, [RequestedID])

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-4">
          #{RequestedID}&nbsp; Update Worker Geo Fencing {WorkedAddData.title}
        </h3>
      </CCol>
      <CCol xs={12}>
        <CRow>
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
              src={`${BASEWEBURL}/map.html?lat=${Lat}&long=${Long}&radious=${WorkedAddData.uRadious}`}
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
              href={`${BASEWEBURL}/map.html?lat=${Lat}&long=${Long}&radious=${WorkedAddData.uRadious}`}
            >
              <small>Full Map</small>
            </a>
          </CCol>
        </CRow>

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
                      requiredry
                      name="title"
                      value={WorkedAddData.title}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Title"
                    />
                  </div>
                </CCol>
                <CCol
                  md={4}
                  title="Restrict Location can be Punch in and out from the Same Location only."
                >
                  <div className="p-1">
                    <label>Type</label>
                    <CFormSelect
                      type="date"
                      requiredry
                      name="restrictGeo"
                      value={WorkedAddData.restrictGeo}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="0">Workplace</option>
                      <option value="1">Home/ Remote</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={2} className="d-none">
                  <div className="p-1">
                    <label>Type</label>
                    <CFormSelect
                      name="typeGeo"
                      value={WorkedAddData.typeGeo}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="1">Office</option>
                      <option value="2">Home</option>
                      <option value="3">Remote</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={2}>
                  <div className="p-1">
                    <label>Radius</label>
                    <CFormInput
                      type="number"
                      min={1}
                      max={99999999999}
                      requiredry
                      name="uRadious"
                      value={WorkedAddData.uRadious}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Radius"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
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
                    type="number"
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
                <CCol md={4}>
                  <div className="p-1">
                    <label>Start Date</label>
                    <CFormInput
                      type="date"
                      requiredry
                      name="start_date"
                      value={WorkedAddData.start_date}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select Start Date"
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>End Date</label>
                    <CFormInput
                      type="date"
                      requiredry
                      name="end_date"
                      value={WorkedAddData.end_date}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select End Date"
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Break Allowed</label>
                    <CFormSelect
                      type="date"
                      requiredry
                      name="break_allowed"
                      value={WorkedAddData.break_allowed}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow className="mt-3">
                <CCol md={6}>
                  <div className="p-1">
                    <label>Start Time</label>
                    <CFormInput
                      type="time"
                      requiredry
                      name="start_time"
                      value={WorkedAddData.start_time}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select Start Time"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <label>End Time</label>
                    <CFormInput
                      type="time"
                      requiredry
                      name="end_time"
                      value={WorkedAddData.end_time}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Select End Time"
                    />
                  </div>
                </CCol>
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

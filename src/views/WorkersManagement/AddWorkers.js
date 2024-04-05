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
  CImage,
} from '@coreui/react'
import { DoUploadURL, NODEAPIURL, UPLOADSsURL } from '../../config'
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'

const AddWorkerForm = ({ ForEmpID, setShowAddWorkers, FilterWorkersList, ResetPassword }) => {
  // for Addon Fields
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData for_form="worker" data_id={ForEmpID} returnData={setAddonsFieldData} />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // for Addon Fields
  const [Relations, setRelations] = useState([])
  const [Department, setDepartment] = useState([])
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [WorkedAddData, setWorkedAddData] = useState({
    emp_id: ForEmpID === 'new' ? 0 : ForEmpID,
    f_name: '',
    l_name: '',
    address: '',
    dob: '',
    email: '',
    mobile: '+971',
    password: '',
    address_lat: '',
    address_long: '',
    conpassword: '',
    AddonsFieldData: AddonsFieldData,
  })
  const [EmgContact, setEmgContact] = useState({
    emp_id: ForEmpID === 'new' ? 0 : ForEmpID,
    name: '',
    mobile: '',
    relation: '',
  })

  const HandleForm = (name, value) => {
    setWorkedAddData({ ...WorkedAddData, [name]: value })
  }

  const HandleEmgContact = (e) => {
    setEmgContact({ ...EmgContact, [e.target.name]: e.target.value })
  }
  const emgcontactUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/emgcontactUpdate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(EmgContact),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          console.log(resJson)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const SubmitWorkersData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/addworkersdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(WorkedAddData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        emgcontactUpdate(e)
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FilterWorkersList()
            setShowAddWorkers(false)
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

  const FetchWorkersDetails = async (emp_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkersDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emp_id: emp_id,
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedAddData(resJson.data)
        if (resJson.emgcontact) {
          setEmgContact(resJson.emgcontact)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchlistRelations = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/user/listRelations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sjain: 'ventures',
          recordsPerPage: 100,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setRelations(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const FetchDepartment = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/department/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'asc',
          status: 1,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && resJson.data.length > 0) {
        setDepartment(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    //document.title = 'Add Worker'
    FetchDepartment()
    if (ForEmpID !== 'new') {
      FetchWorkersDetails(ForEmpID)
    }
    FetchlistRelations()
  }, [ForEmpID])

  // for the Profile Image Update
  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
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
          HandleForm('image', resJson.data.name)
          document.getElementById('ChangeImageHere').src = resJson.data.name
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
  // for the Profile Image Update

  return (
    <CRow>
      {/* for Addon Fields */}
      <div style={{ display: ListAddonsFields ? '' : 'none' }}>
        <div
          className="ry_popup_bg"
          onClick={() => {
            setListAddonsFields(false)
            setShowListAddonsFieldData(
              <ListAddonsFieldData
                for_form="worker"
                data_id={ForEmpID}
                returnData={setAddonsFieldData}
              />,
            )
          }}
        ></div>
        <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
          {ListAddonsFields ? <ListAddonsFieldPage for_form="worker" /> : ''}
        </div>
      </div>
      {/* for Addon Fields */}
      <CCol xs={12}>
        <h3 className="mt-1 mb-3">
          {ForEmpID !== 'new' ? `Update Account of ${WorkedAddData.f_name}` : 'Add New Worker'}
          <div
            style={{
              float: 'right',
              display: Number(localStorage.getItem('uType')) === 3 ? '' : 'none',
            }}
          >
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setListAddonsFields(true)
                setShowListAddonsFieldData('')
              }}
            >
              Add Field
            </button>
          </div>
          <div style={{ clear: 'both' }}></div>
        </h3>
      </CCol>
      <CCol xs={12}>
        <CForm
          className="hello"
          autoComplete="off"
          autofill="off"
          onSubmit={(e) => {
            SubmitWorkersData(e)
          }}
        >
          <CCard className={ResetPassword ? 'd-none' : ''}>
            <CCardBody>
              <h5 className="text-success">Personal Details</h5>
              <CRow>
                <CCol md={8}>
                  <div className="p-1">
                    <label>First Name</label>
                    <CFormInput
                      type="text"
                      requiredry
                      name="f_name"
                      value={WorkedAddData.f_name}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div className="p-1">
                    <label>Last Name</label>
                    <CFormInput
                      type="text"
                      requiredry
                      name="l_name"
                      value={WorkedAddData.l_name}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Last Name"
                    />
                  </div>
                  <div className="p-1">
                    <label>Date of Birth</label>
                    <CFormInput
                      type="date"
                      requiredry
                      name="dob"
                      value={WorkedAddData.dob}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter DOB"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div
                    style={{ position: 'relative', maxWidth: 'max-content', width: '100%' }}
                    className="mb-0"
                  >
                    <CImage
                      src={
                        WorkedAddData.image && WorkedAddData.image.trim() !== ''
                          ? `${UPLOADSsURL}${WorkedAddData.image}`
                          : ''
                      }
                      className=""
                      style={{
                        maxWidth: '100%',
                        border: '1px solid #f5f5f5',
                        maxHeight: '205px',
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
                        background: '#0000009e',
                      }}
                    >
                      Change Image
                    </div>
                  </div>
                  <CFormInput
                    type="file"
                    id="ChangeImageHere"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => {
                      uploadProfileImage(e, e.target.files[0], e.target.files[0].name)
                    }}
                  />
                  {/* <CButton
                    className="d-block"
                    onClick={() => {
                      document.getElementById('ChangeImageHere').click()
                    }}
                  >
                    Change Image
                  </CButton> */}
                </CCol>
              </CRow>

              {/* <CRow className={ResetPassword ? 'd-none' : 'mt-2'}>
                
              </CRow> */}
            </CCardBody>
          </CCard>
          <CCard className={ResetPassword ? 'd-none' : 'mt-3'}>
            <CCardBody>
              <h5 className="text-warning">Communication Details</h5>
              <CRow>
                <CCol md={6}>
                  <div className="p-1">
                    <label>Address</label>
                    <CFormInput
                      type="text"
                      name="address"
                      value={WorkedAddData.address}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Address"
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="p-1">
                    <label>Address Latitude</label>
                    <CFormInput
                      type="text"
                      name="address_lat"
                      value={WorkedAddData.address_lat !== null ? WorkedAddData.address_lat : ''}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Address Latitude"
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="p-1">
                    <label>Address Longitude</label>
                    <CFormInput
                      type="text"
                      name="address_long"
                      value={WorkedAddData.address_long}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Address Longitude"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-1">
                    <label>Email ID</label>
                    <CFormInput
                      type="email"
                      requiredry
                      name="email"
                      value={WorkedAddData.email}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value.toLowerCase())
                      }}
                      placeholder="Enter Email ID"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <label>Mobile</label>
                    <CFormInput
                      type="text"
                      required
                      name="mobile"
                      value={WorkedAddData.mobile}
                      onChange={(e) => {
                        let PhoneNunber = e.target.value
                        PhoneNunber = PhoneNunber.replace(' ', '', PhoneNunber)
                        PhoneNunber = PhoneNunber.replace('-', '', PhoneNunber)
                        PhoneNunber = PhoneNunber.replace(/[a-zA-Z]/g, '')
                        const uaeNumberRegex = /^((\+971)|(00971)|(0))(5[0-9]{8})$/
                        if (uaeNumberRegex.test(PhoneNunber)) {
                          WorkedAddData.mobileValid = ''
                        } else {
                          WorkedAddData.mobileValid = 'Please enter a valid UAE phone number!'
                          HandleForm('mobileValid', 'Please enter a valid UAE phone number!')
                          console.log('Please enter a valid UAE phone number!')
                        }
                        HandleForm(e.target.name, PhoneNunber)
                      }}
                      placeholder="Enter Mobile No."
                    />
                    <span className="text-danger">{WorkedAddData.mobileValid}</span>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className={ResetPassword ? 'mt-3' : 'mt-3'}>
            <CCardBody>
              <h5 className="text-info">Login Details</h5>
              <CRow className="mt-2">
                <CCol md={6}>
                  <div className="p-1">
                    <label>Password</label>
                    <CFormInput
                      type="password"
                      requiredry
                      name="password"
                      autoComplete="new-password"
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Password"
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <label>Confirm Password</label>
                    <CFormInput
                      type="password"
                      requiredry
                      autoComplete="new-password"
                      name="conpassword"
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Confirm Password"
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className={ResetPassword ? 'd-none' : 'mt-3'}>
            <CCardBody>
              <h5 className="text-warning">Other Details</h5>
              <CRow>
                <CCol md={3}>
                  <div className="p-1">
                    <label>Shift Hours</label>
                    <CFormInput
                      type="number"
                      require
                      value={WorkedAddData.shiftHours}
                      name="shiftHours"
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Shift Hours"
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="p-1">
                    <label>Weekly Hours</label>
                    <CFormInput
                      type="number"
                      require
                      value={WorkedAddData.weeklyHours}
                      name="weeklyHours"
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Weekly Hours"
                    />
                  </div>
                </CCol>
                <CCol md={4} className="d-none">
                  <div className="p-1">
                    <label>Department</label>
                    <CFormSelect
                      require
                      value={WorkedAddData.dpt_id}
                      name="dpt_id"
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Confirm Password"
                    >
                      <option value="0">Select</option>
                      {Department.map((item) => (
                        <option key={item.dpt_id} value={item.dpt_id}>
                          {item.dept_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard
            className={ResetPassword ? 'd-none' : 'mt-3'}
            style={{ display: ForEmpID === 'new' ? 'none' : '' }}
          >
            <CCardBody>
              <div style={{ display: ForEmpID === 'new' ? 'none' : '' }}>
                <h5 className="text-danger">Emergency Contact</h5>
                <CRow>
                  <CCol md={12}>
                    <div className="p-1">
                      <label>Name</label>
                      <CFormInput
                        type="text"
                        requiredry
                        name="name"
                        value={EmgContact.name}
                        onChange={(e) => {
                          HandleEmgContact(e)
                        }}
                        placeholder="Enter Email ID"
                      />
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <div className="p-1">
                      <label>Mobile</label>
                      <CFormInput
                        type="text"
                        requiredry
                        name="mobile"
                        value={EmgContact.mobile}
                        onChange={(e) => {
                          HandleEmgContact(e)
                        }}
                        placeholder="Enter Mobile No."
                      />
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <div className="p-1">
                      <label>Relation</label>
                      <CFormSelect
                        name="relation"
                        value={EmgContact.relation}
                        onChange={(e) => {
                          HandleEmgContact(e)
                        }}
                      >
                        <option value="">Select Relation</option>
                        {Relations.map((singi) => (
                          <option key={singi.rel_id} value={singi.rel_id}>
                            {singi.rel_title}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
          {/* {AddonsFieldData.length} */}
          <div className="mt-3 mb-5" style={{ display: AddonsFieldData.length < 1 ? '' : '' }}>
            <CCard>
              <CCardBody>
                {ShowListAddonsFieldData}
                <div className="text-center mt-5">
                  <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                    {AjaxMsg}
                  </div>
                  <CButton
                    type="submit"
                    color="primary"
                    className="mr-4"
                    style={{ marginRight: '20px' }}
                    onClick={() => {
                      HandleForm('AddonsFieldData', AddonsFieldData)
                    }}
                  >
                    Save
                  </CButton>
                  <CButton
                    type="button"
                    color="light"
                    onClick={() => {
                      setShowAddWorkers(false)
                    }}
                  >
                    Cancel
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </CForm>
      </CCol>
    </CRow>
  )
}

AddWorkerForm.propTypes = {
  ForEmpID: PropTypes.any,
  setShowAddWorkers: PropTypes.any,
  FilterWorkersList: PropTypes.any,
  ResetPassword: PropTypes.any,
}

export default AddWorkerForm

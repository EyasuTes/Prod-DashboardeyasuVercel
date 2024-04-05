import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilMobile, cilSave } from '@coreui/icons'
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
  CFormSelect,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'
import { NODEAPIURL, UPLOADSsURL, DoUploadURL } from '../../config'

// import avtImg1 from 'src/assets/images/workers/1.jpg' sdjbgf

const ProfileManagement = () => {
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
  const [Msg, setMsg] = useState('')
  const [ListRelations, setListRelations] = useState([])
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
      setMsg(resJson.message)
      FetchProfile()
    } catch (err) {
      console.log(err)
    }
  }
  const FetchlistRelations = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/user/listRelations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ device: localStorage.getItem('DeviceDetails') }),
      })
      const resJson = await res.json()
      if (resJson.status === 1 && resJson.data && resJson.data.length > 0) {
        setListRelations(resJson.data)
      }
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

  useEffect(() => {
    FetchProfile()
    FetchlistRelations()
  }, [])
  return (
    <>
      <CRow>
        <CCol className="print-only-content" lg={12}>
          <h1>&nbsp;</h1>
          <CTable hover bordered responsive>
            <CTableBody>
              {ProfileData.image && ProfileData.image.trim() !== '' ? (
                <>
                  <CTableRow>
                    <CTableDataCell colSpan={2}>
                      <h3>Profile Photo</h3>
                      <CImage
                        src={`${UPLOADSsURL}${ProfileData.image}`}
                        style={{
                          maxWidth: '100%',
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                </>
              ) : (
                ''
              )}
              <CTableRow>
                <CTableDataCell>Name</CTableDataCell>
                <CTableDataCell>
                  {ProfileData.f_name}
                  &nbsp;
                  {ProfileData.l_name}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell>Email</CTableDataCell>
                <CTableDataCell>{ProfileData.email}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell>Mobile</CTableDataCell>
                <CTableDataCell>{ProfileData.mobile}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell>DOB</CTableDataCell>
                <CTableDataCell>{ProfileData.dob}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell>Address</CTableDataCell>
                <CTableDataCell>{ProfileData.address}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell colSpan={2}>
                  <h3>Emergency Contacts</h3>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Name</CTableDataCell>
                <CTableDataCell>{ProfileData.emgcontact_name}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Relation</CTableDataCell>
                <CTableDataCell>
                  {ListRelations.map((sing) => (
                    <span key={sing.rel_id}>
                      {sing.rel_id === ProfileData.emgcontact_relation ? sing.rel_title : ''}
                    </span>
                  ))}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Mobile</CTableDataCell>
                <CTableDataCell>{ProfileData.emgcontact_mobile}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
        <CCol className="dontPrint" lg={12}>
          <h3 className="mb-3 mt-2">
            My Profile
            <button
              type="button"
              style={{ float: 'right' }}
              className="btn btn-warning text-white"
              onClick={() => {
                window.print()
              }}
            >
              Export Profile
            </button>
          </h3>
        </CCol>
        <CCol lg={6} className="mb-4 dontPrint text-lg-end d-none">
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </CCol>
      </CRow>
      <CRow className="dontPrint">
        <CCol md={3}>
          <CCard className="text-center mb-4 p-3">
            <CCardBody>
              <div style={{ position: 'relative' }} className="mb-3">
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
              <CCardSubtitle className="mb-3 text-medium-emphasis">
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
              <CButton
                className="mt-4"
                onClick={() => {
                  document.getElementById('ChangeImageHere').click()
                }}
              >
                Change Image
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={9}>
          <CCard className="mb-4 p-3">
            <CCardBody>
              <CRow className="mb-4">
                <CCol md={6}>
                  <h5 className="mb-4">Personal Details</h5>
                  <CFormInput
                    type="date"
                    label="DOB"
                    value={ProfileData.dob ? ProfileData.dob : ''}
                    name="dob"
                    onChange={(e) => {
                      HandleFormData(e.target.name, e.target.value)
                    }}
                  />
                  <div className="mt-2"></div>
                  <CFormTextarea
                    type="text"
                    label="Address"
                    placeholder="Enter Address"
                    value={ProfileData.address ? ProfileData.address : ''}
                    name="address"
                    onChange={(e) => {
                      HandleFormData(e.target.name, e.target.value)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <h5 className="mb-4">Emergency Contacts</h5>
                  <CFormInput
                    type="text"
                    label="Name"
                    placeholder="Enter Name"
                    name="emgcontact_name"
                    value={ProfileData.emgcontact_name}
                    onChange={(e) => {
                      HandleFormData(e.target.name, e.target.value)
                    }}
                  />
                  <div className="mt-2"></div>
                  <CFormSelect
                    label="Relation"
                    name="emgcontact_relation"
                    value={ProfileData.emgcontact_relation}
                    onChange={(e) => {
                      HandleFormData(e.target.name, e.target.value)
                    }}
                  >
                    <option value="0">Select Relation</option>
                    {ListRelations.map((sing) => (
                      <option value={sing.rel_id} key={sing.rel_id}>
                        {sing.rel_title}
                      </option>
                    ))}
                  </CFormSelect>
                  <div className="mt-2"></div>
                  <CFormInput
                    type="number"
                    label="Mobile"
                    placeholder="Enter Mobile"
                    name="emgcontact_mobile"
                    value={ProfileData.emgcontact_mobile}
                    onChange={(e) => {
                      HandleFormData(e.target.name, e.target.value)
                    }}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol lg={12}>{Msg}</CCol>
                <CCol lg={12}>
                  <CButton
                    color="primary"
                    className="me-3 px-4"
                    onClick={(e) => {
                      updateProfile()
                    }}
                  >
                    Update Profile
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ProfileManagement

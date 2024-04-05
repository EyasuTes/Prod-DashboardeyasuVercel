import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
  CButton,
  //   CCard,
  //   CCardBody,
  //   CCardGroup,
  CCol,
  // CContainer,
  CForm,
  CFormInput,
  CRow,
  //   CImage,
} from '@coreui/react'

import { NODEAPIURL } from '../../config'

// import Logo from '../../assets/images/logo.png'
// import loginImg from '../../assets/images/login-img.svg'

const Login = ({ setShowChangePsw, ShowChangePsw }) => {
  const [FieldType, setFieldType] = useState('password')
  //   const dispatch = useDispatch()
  /* eslint-disable no-unused-vars */
  const IsLogin2 = useSelector((state) => state.IsLogin2)
  /* eslint-enable no-unused-vars */
  const [AjaxResClass, setAjaxResClass] = useState('alert-danger')
  const [AjaxRes, setAjaxRes] = useState('')
  const [LoginDetails, setLoginDetails] = useState({
    password: '',
    newpassword: '',
    confirmpassword: '',
    device: localStorage.getItem('DeviceDetails'),
  })

  function handleFormData(name, value) {
    setLoginDetails({ ...LoginDetails, [name]: value })
  }

  const LoginMeHere = async (e) => {
    setAjaxResClass('alert-danger')
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/ChangePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(LoginDetails),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxResClass('alert-success')
          setTimeout(() => {
            setShowChangePsw(!ShowChangePsw)
          }, 2500)
        }
        setAjaxRes(resJson.message)
        setTimeout(() => {
          setAjaxRes('')
        }, 2500)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div className="">
        <CForm
          onSubmit={(e) => {
            LoginMeHere(e)
          }}
        >
          {/* <h5 className="mb-3">Change Password</h5> */}
          <CRow>
            <CCol xs={12} className="mb-3 text-success">
              <CFormInput
                type={FieldType}
                name="password"
                size="sm"
                label="Current Login Password"
                placeholder="Enter Current Login Password"
                onChange={(e) => {
                  handleFormData(e.target.name, e.target.value)
                }}
              />
            </CCol>

            <CCol xs={6} className="mb-3 text-warning">
              <CFormInput
                name="newpassword"
                type={FieldType}
                label="New Password"
                size="sm"
                placeholder="Enter New Password"
                onChange={(e) => {
                  handleFormData(e.target.name, e.target.value)
                }}
              />
            </CCol>

            <CCol xs={6} className="mb-3 text-danger">
              <CFormInput
                name="confirmpassword"
                type={FieldType}
                size="sm"
                label="Confirm New Password"
                placeholder="Confirm New Password"
                onChange={(e) => {
                  handleFormData(e.target.name, e.target.value)
                }}
              />
            </CCol>

            <CCol xs={12} className="mt-3">
              <div className={`hideifempty alert ${AjaxResClass}`}>{AjaxRes}</div>
              <div className="text-center">
                <CButton
                  type="button"
                  color={FieldType === 'text' ? 'success' : 'danger'}
                  className="text-white me-2"
                  size="sm"
                  onClick={(e) => {
                    setFieldType(FieldType === 'password' ? 'text' : 'password')
                  }}
                >
                  {FieldType === 'password' ? 'Show Password' : 'Hide Password'}
                </CButton>
                <CButton
                  type="submit"
                  color="info"
                  className="text-white"
                  size="sm"
                  onClick={() => {
                    handleFormData('device', localStorage.getItem('DeviceDetails'))
                  }}
                >
                  Change Password
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}
Login.propTypes = {
  setShowChangePsw: PropTypes.any,
  ShowChangePsw: PropTypes.any,
}
export default Login

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CImage,
} from '@coreui/react'

import { BASEWEBURL, NODEAPIURL } from '../../config'

import Logo from '../../assets/images/logo.png'
import loginImg from '../../assets/images/login-img.svg'

const Login = ({ setIsLogin }) => {
  const [LoginNeed, setLoginNeed] = useState(localStorage.getItem('LoginNeed'))
  const dispatch = useDispatch()
  /* eslint-disable no-unused-vars */
  const IsLogin2 = useSelector((state) => state.IsLogin2)
  /* eslint-enable no-unused-vars */
  const [ForgotPassword, setForgotPassword] = useState(false)
  const [AjaxResClass, setAjaxResClass] = useState('alert-danger')
  const [AjaxRes, setAjaxRes] = useState('')
  const [LoginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
    email: '',
    CreatePassword: '',
    ConPassword: '',
    newPassword: 0,
    otp: '',
    device: localStorage.getItem('DeviceDetails'),
  })
  function handleFormData(name, value) {
    setLoginDetails({ ...LoginDetails, [name]: value })
  }
  const LoginMeHere = async (e) => {
    setAjaxResClass('alert-danger')
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LoginDetails),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          localStorage.setItem('token', resJson.token)
          localStorage.setItem('permission', JSON.stringify(resJson.permission))
          if (resJson.AllPermission && resJson.AllPermission.length > 0) {
            localStorage.setItem('permi_title', resJson.AllPermission[0].title)
            localStorage.setItem('permi_id', resJson.AllPermission[0].permi_id)
            // alert(resJson.AllPermission[0])
            localStorage.setItem('emp_id', resJson.AllPermission[0].emp_id)
            localStorage.setItem('dept_name', resJson.AllPermission[0].dept_name)
            localStorage.setItem('uType', resJson.AllPermission[0].uType)
          }
          localStorage.setItem('AllPermission', JSON.stringify(resJson.AllPermission))
          localStorage.setItem('profile', JSON.stringify(resJson.data))
          setAjaxResClass('alert-success')
          setTimeout(() => {
            setIsLogin(1)
            dispatch({ type: 'set', IsLogin2: 1 })
          }, 3500)
          // console.log(BASEWEBURL)
          window.location.href = `${BASEWEBURL}`
        }
        setAjaxRes(resJson.message)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const PasswordMeHere = async (e) => {
    setAjaxResClass('alert-danger')
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LoginDetails),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxResClass('alert-success')
          setLoginDetails({
            username: LoginDetails.email,
            password: '',
            TimeStamp: resJson.TimeStamp,
            email: '',
            CreatePassword: '',
            ConPassword: '',
            newPassword: 1,
            otp: '',
            device: localStorage.getItem('DeviceDetails'),
          })
        }
        setAjaxRes(resJson.message)
      } else {
        setAjaxRes(resJson.message)
      }
    } catch (err) {
      setAjaxRes(err)
    }
  }

  const NewPasswordMeHere = async (e) => {
    setAjaxResClass('alert-danger')
    setAjaxRes('Processing Request...')
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/NewPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LoginDetails),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxResClass('alert-success')
          setLoginDetails({
            username: LoginDetails.email,
            password: '',
            email: '',
            CreatePassword: '',
            ConPassword: '',
            newPassword: 0,
            otp: '',
            device: localStorage.getItem('DeviceDetails'),
          })
          setTimeout(() => {
            window.location.href = `${BASEWEBURL}`
          }, 3500)
        }
        setAjaxRes(resJson.message)
      } else {
        setAjaxRes(resJson.message)
      }
    } catch (err) {
      setAjaxRes(err)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('aa')
      setLoginNeed(localStorage.getItem('LoginNeed'))
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-login min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={7}>
            <CCardGroup>
              <CCard>
                <CCardBody>
                  <div className="text-center mb-5">
                    <CImage src={Logo} />
                  </div>
                  <div className="loginBox">
                    <CForm
                      onSubmit={(e) => {
                        LoginMeHere(e)
                      }}
                      style={{ display: ForgotPassword ? 'none' : '' }}
                    >
                      <h1 className="mb-4">Login</h1>
                      {Number(LoginNeed) === 1 ? (
                        <p className="text-danger">Please Login to Make the Request</p>
                      ) : (
                        ''
                      )}
                      <CRow>
                        <CCol xs={12} className="mb-3">
                          <CFormInput
                            type="email"
                            name="username"
                            size="lg"
                            placeholder="Username"
                            onChange={(e) => {
                              handleFormData(e.target.name, e.target.value)
                            }}
                          />
                        </CCol>
                        <CCol xs={12} className="mb-3">
                          <CFormInput
                            name="password"
                            type="password"
                            size="lg"
                            placeholder="Password"
                            onChange={(e) => {
                              handleFormData(e.target.name, e.target.value)
                            }}
                          />
                        </CCol>
                        <CCol xs={12}>
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={(e) => {
                              setForgotPassword(!ForgotPassword)
                            }}
                          >
                            Forgot password?
                          </CButton>
                        </CCol>
                        <CCol xs={12}>
                          <div className={`hideifempty alert ${AjaxResClass}`}>{AjaxRes}</div>
                          <div className="d-grid">
                            <CButton
                              type="submit"
                              color="primary"
                              size="lg"
                              onClick={(e) => {
                                handleFormData('device', localStorage.getItem('DeviceDetails'))
                              }}
                            >
                              Login
                            </CButton>
                          </div>
                        </CCol>
                      </CRow>
                    </CForm>

                    <CForm
                      onSubmit={(e) => {
                        if (LoginDetails.newPassword === 1) {
                          NewPasswordMeHere(e)
                        } else {
                          PasswordMeHere(e)
                        }
                      }}
                      style={{ display: ForgotPassword ? '' : 'none' }}
                    >
                      <h3 className="mb-4">Forgot Password</h3>
                      {LoginDetails.newPassword !== 1 ? (
                        <CRow>
                          <p>Enter Your email to received OTP to Reset Your Password</p>
                          <CCol xs={12} className="mb-3">
                            <CFormInput
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              onChange={(e) => {
                                handleFormData(e.target.name, e.target.value)
                              }}
                            />
                          </CCol>
                        </CRow>
                      ) : (
                        ''
                      )}
                      <CRow>
                        <CCol xs={12}>
                          {LoginDetails.newPassword === 1 ? (
                            <>
                              <CFormInput
                                type="number"
                                name="otp"
                                className="mb-3"
                                placeholder="Enter OTP from EMail"
                                onChange={(e) => {
                                  handleFormData(e.target.name, e.target.value)
                                }}
                              />
                              <CFormInput
                                type="password"
                                name="CreatePassword"
                                className="mb-3"
                                placeholder="Enter New Password"
                                onChange={(e) => {
                                  handleFormData(e.target.name, e.target.value)
                                }}
                              />
                              <CFormInput
                                type="password"
                                name="ConPassword"
                                className="mb-3"
                                placeholder="Confirm New Password"
                                onChange={(e) => {
                                  handleFormData(e.target.name, e.target.value)
                                }}
                              />
                            </>
                          ) : (
                            ''
                          )}
                          <div className={`hideifempty alert ${AjaxResClass}`}>{AjaxRes}</div>
                          <div className="d-grid">
                            <CButton
                              className="mb-4"
                              type="submit"
                              color="primary"
                              size="lg"
                              onClick={(e) => {
                                handleFormData('device', localStorage.getItem('DeviceDetails'))
                              }}
                            >
                              Submit
                            </CButton>
                          </div>
                        </CCol>
                        <CCol xs={12}>
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={(e) => {
                              setForgotPassword(!ForgotPassword)
                            }}
                          >
                            Back to Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </div>
                </CCardBody>
              </CCard>
              <CCard>
                <CCardBody className="text-center">
                  <div>
                    <CImage src={loginImg} width={600} />
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
Login.propTypes = {
  setIsLogin: PropTypes.any,
}
export default Login

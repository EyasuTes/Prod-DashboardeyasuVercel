import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Login from '../views/Pages/Login'
import { NODEAPIURL, GetArrayFromJson, BASEWEBURL } from '../config'
import ChangePassword from '../views/Pages/ChangePassword'

var AllPermission = GetArrayFromJson(localStorage.getItem('AllPermission'))

const DefaultLayout = () => {
  const IsLogin2 = useSelector((state) => state.IsLogin2)

  const [ShowChangePsw, setShowChangePsw] = useState(false)
  const [IsLogin, setIsLogin] = useState(0)

  const CheckAdminLogin = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/CheckLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: localStorage.getItem('token'),
          permi_id: localStorage.getItem('permi_id'),
          token: Date.now(),
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // console.log(resJson)
      if (res.status === 200) {
        setIsLogin(resJson.islogin)
        localStorage.setItem('permission', JSON.stringify(resJson.permission))
        if (resJson.data.emp_id) {
          localStorage.setItem('emp_id', resJson.data.emp_id)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const SwitchAccount = async (dpt_id, uType) => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/switchaccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          dpt_id,
          uType,
          token: Date.now(),
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        window.location.href = BASEWEBURL
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    AllPermission = GetArrayFromJson(localStorage.getItem('AllPermission'))
    if (AllPermission.length > 0) {
      // console.log(AllPermission.length)
      // console.log(AllPermission)
    } else {
      localStorage.setItem('token', 0)
    }
    CheckAdminLogin()
    const interval = setInterval(() => {
      CheckAdminLogin()
    }, 30000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <button
        style={{ display: 'none' }}
        id="ShowChangePswBtn"
        type="button"
        onClick={() => {
          setShowChangePsw(true)
        }}
      ></button>
      <div
        style={{
          position: 'fixed',
          background: '#0f0f0fcc',
          padding: '20px',
          margin: 'auto',
          display: ShowChangePsw ? '' : 'none',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '888888',
        }}
        onClick={() => {
          setShowChangePsw(false)
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          background: '#fff',
          padding: '20px',
          margin: 'auto',
          borderRadius: '20px',
          display: ShowChangePsw ? '' : 'none',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '999999',
          maxWidth: '50%',
          maxHeight: '50%',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              setShowChangePsw(false)
            }}
          >
            X
          </button>
        </div>
        <ChangePassword setShowChangePsw={setShowChangePsw} ShowChangePsw={ShowChangePsw} />
      </div>
      {IsLogin === 1 && IsLogin2 !== 0 ? '' : <Login setIsLogin={setIsLogin} />}
      {IsLogin === 1 && IsLogin2 !== 0 ? (
        <>
          <div
            id="SwitchUserRole"
            style={{
              position: 'fixed',
              display: 'none',
              zIndex: 999999,
              top: '0px',
              bottom: '0px',
              left: '0px',
              right: '0px',
              textAlign: 'center',
              background: '#000000e6',
              paddingTop: '10%',
            }}
          >
            <div
              style={{
                background: '#f5f5f5',
                display: 'inline-block',
                padding: '20px',
              }}
            >
              {AllPermission.map((singi) => (
                <div key={singi.permi_id}>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                    }}
                    className={`btn btn-lg text-white d-block mb-3 ${
                      singi.uType === 1 ? 'btn-success' : ''
                    } ${singi.uType === 2 ? 'btn-info' : ''} ${
                      singi.uType === 3 ? 'btn-danger' : ''
                    }`}
                    onClick={() => {
                      localStorage.setItem('permi_title', singi.title)
                      localStorage.setItem('dept_id', singi.dpt_id)
                      localStorage.setItem('permi_id', singi.permi_id)
                      localStorage.setItem('dept_name', singi.dept_name)
                      localStorage.setItem('uType', singi.uType)
                      let profile = GetArrayFromJson(localStorage.getItem('profile'))
                      profile.dpt_id = singi.dpt_id
                      profile.uType = singi.uType
                      localStorage.setItem('permission', JSON.stringify(singi))
                      localStorage.setItem('profile', JSON.stringify(profile))
                      document.getElementById('SwitchUserRole').style.display = 'none'
                      SwitchAccount(singi.dpt_id, singi.uType)
                    }}
                  >
                    {`User ${singi.title} For Department ${singi.dept_name} as Type ${
                      singi.uType === 1 ? 'Staff' : ''
                    } ${singi.uType === 2 ? 'Supervisor' : ''} ${singi.uType === 3 ? 'Admin' : ''}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader />
            <div className="body flex-grow-1 px-3">
              <AppContent />
            </div>
            <AppFooter />
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default DefaultLayout

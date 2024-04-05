import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CAvatar,
  // CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  // cilBell,
  // cilCreditCard,
  // cilCommentSquare,
  // cilEnvelopeOpen,
  // cilFile,
  cilLockLocked,
  cilLockUnlocked,
  cilSettings,
  // cilSettings,
  // cilTask,
  cilUser,
  // cilCog,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// import avatar8 from './../../assets/images/workers/1.jpg'
import Logo from './../../assets/images/logo.png'
import { GetValueFromJson, NODEAPIURL } from '../../config'
// import ChangePassword from '../../views/Pages/ChangePassword'

let profile = localStorage.getItem('profile')
let DeviceDetails = localStorage.getItem('DeviceDetails')
let Authorization = localStorage.getItem('token')

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const IsLogin2 = useSelector((state) => state.IsLogin2)

  const LogoutMeHere = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Authorization}`,
        },
        body: JSON.stringify({
          device: DeviceDetails,
          token: Date.now(),
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    profile = localStorage.getItem('profile')
    DeviceDetails = localStorage.getItem('DeviceDetails')
    Authorization = localStorage.getItem('token')
  }, [])

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          {GetValueFromJson(profile, 'f_name', 'NA')}
          &nbsp;{GetValueFromJson(profile, 'l_name', '')}
          &nbsp;
          {localStorage.getItem('permi_title') !== 'Role' ? (
            <span>{`(${localStorage.getItem('permi_title')})`}</span>
          ) : (
            localStorage.getItem('permi_title')
          )}
          <CAvatar src={GetValueFromJson(profile, 'image', Logo)} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light d-none fw-semibold py-2">Account</CDropdownHeader>
          <CDropdownItem
            onClick={() => {
              document.getElementById('SwitchUserRole').style.display = 'block'
            }}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Switch Account
          </CDropdownItem>
          <CDropdownItem href="/#/profile-management">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem
            onClick={() => {
              // setShowChangePsw(true)
              document.getElementById('ShowChangePswBtn').click()
            }}
          >
            <CIcon icon={cilLockUnlocked} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem
            onClick={() => {
              dispatch({ type: 'set', IsLogin2: 0 })
              localStorage.setItem('token', 'logOut')
              localStorage.setItem('permi_id', 0)
              LogoutMeHere()
            }}
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown

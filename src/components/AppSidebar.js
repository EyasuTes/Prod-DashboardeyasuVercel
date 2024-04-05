import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CForm,
  CFormInput,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import Logo from 'src/assets/images/logo.png'
import LogoSmall from 'src/assets/images/logo-icon.png'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <a href="/">
          <img src={Logo} className="sidebar-brand-full RYBrandLogo" alt="FRC" />
          <img src={LogoSmall} className="sidebar-brand-narrow" alt="FRC" />
        </a>
      </CSidebarBrand>
      <CForm className="d-none">
        <CFormInput type="text" placeholder="Search" />
      </CForm>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        // onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

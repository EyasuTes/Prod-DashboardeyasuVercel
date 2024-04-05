import React from 'react'
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CRow, CButton } from '@coreui/react'

const Page404 = () => {
  return (
    <div className="bg-login min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={7}>
            <CCardGroup>
              <CCard>
                <CCardBody>
                  <h1 style={{ fontSize: '300px' }}>404</h1>
                  <h2 style={{ fontSize: '50px', marginBottom: '50px' }}>oops... page not found</h2>
                  <CButton color="primary" size="lg" href="/">
                    Back to Dashboard
                  </CButton>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404

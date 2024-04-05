import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
import {
  CAvatar,
  CButton,
  CCard,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CImage,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUser,
  cilBell,
  cilIndustry,
  cilMap,
  cilEnvelopeClosed,
  cilMobile,
} from '@coreui/icons'

import avtImg1 from 'src/assets/images/workers/1.jpg'
import avatar2 from 'src/assets/images/workers/2.jpg'
import avatar3 from 'src/assets/images/workers/3.jpg'
import avatar4 from 'src/assets/images/workers/4.jpg'
import avatar5 from 'src/assets/images/workers/5.jpg'
import avatar6 from 'src/assets/images/workers/6.jpg'
import avatar7 from 'src/assets/images/workers/7.jpg'

import { BASEWEBURL, GetValueFromJson } from '../../config'

let profile = localStorage.getItem('profile')
const Dashboard = () => {
  useEffect(() => {
    localStorage.setItem('uRadious', 200)
    profile = localStorage.getItem('profile')
    if (GetValueFromJson(profile, 'uType', 1) === 1) {
      window.location.href = `${BASEWEBURL}/#/upload-activity`
    }
  }, [])

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const tableExample = [
    {
      avatar: { src: avatar7, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      buttonValue: 'Approved',
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      buttonValue: 'Approved',
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      buttonValue: 'Approved',
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      buttonValue: 'Approved',
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      buttonValue: 'Approved',
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      buttonValue: 'Approved',
      activity: 'Last week',
    },
  ]

  return (
    <>
      <CRow>
        <CCol lg={12}>
          <h3 className="mb-5">Dashboard</h3>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={3}>
          <CCard className="text-center mb-4 p-3">
            <CCardBody>
              <CImage src={avtImg1} className="border border-primary rounded-circle mb-3" />
              <CCardTitle>Alicesaf Moran</CCardTitle>
              <CCardSubtitle className="mb-3 text-medium-emphasis">Lorem Ipsum</CCardSubtitle>
              <div className="dividerOne"></div>
              <CCardText className="text-start">
                <CIcon icon={cilEnvelopeClosed} size="lg" className="me-2" />
                Lorem.Ipsum@example.com
              </CCardText>
              <CCardText className="text-start">
                <CIcon icon={cilMobile} size="lg" className="me-2" />
                +971 12345 1234
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="bg-primary text-white mb-4 p-4">
            <CCardBody>
              <CRow>
                <CCol xs={3}>
                  <CIcon icon={cilUser} customClassName="nav-icon" />
                </CCol>
                <CCol xs={9}>
                  <CCardTitle style={{ marginBottom: '15px' }}>Livestock Managenment</CCardTitle>
                  <CCardText>
                    <CButton color="light" size="sm" href="#/animals-list">
                      View Detail
                    </CButton>
                  </CCardText>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className="bg-success text-white mb-4 p-4">
            <CCardBody>
              <CRow>
                <CCol xs={3}>
                  <CIcon icon={cilBell} customClassName="nav-icon" />
                </CCol>
                <CCol xs={9}>
                  <CCardTitle style={{ marginBottom: '15px' }}>
                    Livestock Health Managenment
                  </CCardTitle>
                  <CCardText>
                    <CButton color="light" size="sm" href="#/add-health-checkup">
                      View Detail
                    </CButton>
                  </CCardText>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="bg-danger text-white mb-4 p-4">
            <CCardBody>
              <CRow>
                <CCol xs={3}>
                  <CIcon icon={cilIndustry} customClassName="nav-icon" />
                </CCol>
                <CCol xs={9}>
                  <CCardTitle style={{ marginBottom: '15px' }}>Workers Management</CCardTitle>
                  <CCardText>
                    <CButton color="light" size="sm" href="#/workers-activity">
                      View Detail
                    </CButton>
                  </CCardText>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard className="bg-warning text-white mb-4 p-4">
            <CCardBody>
              <CRow>
                <CCol xs={3}>
                  <CIcon icon={cilMap} customClassName="nav-icon" />
                </CCol>
                <CCol xs={9}>
                  <CCardTitle style={{ marginBottom: '15px' }}>Geo Fencing Management</CCardTitle>
                  <CCardText>
                    <CButton color="light" size="sm" href="#/geo-fencing-list">
                      View Detail
                    </CButton>
                  </CCardText>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={6}>
          <CCard className="mb-4 p-3">
            <CCardBody>
              <CChart
                style={{ margin: '5px 0px' }}
                type="bar"
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ],
                  datasets: [
                    {
                      label: 'FRC Commits',
                      backgroundColor: '#5367F9',
                      data: [40, 20, 10, 30, 60, 40, 50, 70, 40, 30, 80, 50],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={6}>
          <CCard className="mb-4 p-3">
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-info py-1 px-3">
                    <div className="text-medium-emphasis small">Present Workers</div>
                    <div className="fs-5 fw-semibold">9,123</div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Absent Workers</div>
                    <div className="fs-5 fw-semibold">22,643</div>
                  </div>
                </CCol>
              </CRow>
              <hr className="mt-0" />
              {progressGroupExample1.map((item, index) => (
                <div className="progress-group" key={index} style={{ marginBottom: '12px' }}>
                  <div className="progress-group-prepend">
                    <span className="text-medium-emphasis small">{item.title}</span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="info" value={item.value1} />
                    <CProgress thin color="danger" value={item.value2} />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <h4>Workers List</h4>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Leave Request</CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className="float-end">
                            <small className="text-medium-emphasis">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton size="sm" color="success">
                          {item.buttonValue}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

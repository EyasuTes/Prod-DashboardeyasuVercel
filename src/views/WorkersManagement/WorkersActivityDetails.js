import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilFilter, cilPencil, cilSave, cilSortDescending } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
  CButton,
  CImage,
  CProgress,
} from '@coreui/react'

import avtImg1 from 'src/assets/images/workers/1.jpg'

import { CChart } from '@coreui/react-chartjs'

import { NODEAPIURL } from '../../config'
// import AddWorkers from './AddWorkers'

const WorkersActivityDetails = ({ ForEmpID, setShowAddWorkers }) => {
  let keyword = ''
  // const [ForEmpID, setForEmpID] = useState(ForThisEmpID)
  // const [ResetPassword, setResetPassword] = useState(false)
  const [WorkedListData, setWorkedListData] = useState([])

  const FetchWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getLeaveslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterWorkersList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkerslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setWorkedListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateWorkersStatus = async (emp_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateWorkersStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status,
          emp_id,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        FilterWorkersList(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchWorkersList()
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

  return (
    <>
      <CRow>
        <CCol xs={6}>
          <h3 className="mb-5">John Activity</h3>
        </CCol>
        <CCol xs={6} className="text-end">
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={3}>
          <CCard className="text-center mb-4 p-3">
            <CCardBody>
              <CImage src={avtImg1} className="border border-primary rounded-circle mb-3" />
              <CCardTitle>Lorem Ipsum</CCardTitle>
              <CCardSubtitle className="mb-3 text-medium-emphasis">Lorem Worker</CCardSubtitle>
              <div className="dividerOne"></div>
              <CCardText className="text-start">
                <p>Status: Good</p>
                <p>Email: Lorem.Ipsum@example.com</p>
                <p className="mb-0">Mobile: +971 12345 1234</p>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={5}>
          <CCard className="mb-4 p-3">
            <CCardBody>
              <CChart
                style={{ margin: '28px 0px' }}
                type="bar"
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'FRC Commits',
                      backgroundColor: '#5367F9',
                      data: [40, 20, 10, 30, 60, 40, 50],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="mb-4 p-2">
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-info py-1 px-3">
                    <div className="text-medium-emphasis small">New Clients</div>
                    <div className="fs-5 fw-semibold">9,123</div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                    <div className="text-medium-emphasis small">Recurring Clients</div>
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
      <CRow className="mb-4">
        <CCol lg={12}>
          <div className="dividerOne"></div>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg={6}>
          <h3 className="mb-4">Activity</h3>
        </CCol>
        <CCol lg={6} className="text-end">
          <CButton color="primary" className="me-3">
            <CIcon icon={cilSortDescending} />
          </CButton>
          <CButton color="primary" className="me-3">
            <CIcon icon={cilFilter} />
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilCalendar} />
          </CButton>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Request ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Activity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {WorkedListData.map((singi) => (
                    <CTableRow key={singi.emp_id}>
                      <CTableDataCell>{singi.auto_id}</CTableDataCell>
                      <CTableDataCell>{singi.start_date}</CTableDataCell>
                      <CTableDataCell>{singi.end_date}</CTableDataCell>
                      <CTableDataCell>{singi.email}</CTableDataCell>
                      <CTableDataCell>
                        <CNav variant="pills">
                          <CDropdown variant="nav-item">
                            <CDropdownToggle className={singi.status === 1 ? '' : 'bg-danger'}>
                              {singi.status === 1 ? 'Active' : 'Inactive'}
                              <CIcon icon={cilPencil} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                href="#"
                                onClick={(e) => {
                                  updateWorkersStatus(singi.emp_id, singi.status === 1 ? 0 : 1)
                                }}
                              >
                                {singi.status === 1 ? 'De-activate' : 'Activate'}
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CNav>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          <CPagination align="end" aria-label="Page navigation example">
            <CPaginationItem>Previous</CPaginationItem>
            <CPaginationItem>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem>Next</CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </>
  )
}

WorkersActivityDetails.propTypes = {
  ForEmpID: PropTypes.any,
  setShowAddWorkers: PropTypes.any,
}

export default WorkersActivityDetails

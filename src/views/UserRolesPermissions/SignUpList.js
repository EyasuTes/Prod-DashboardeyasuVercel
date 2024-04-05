import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilSave, cilSortAscending, cilSortDescending } from '@coreui/icons'
import {
  CCard,
  CCardBody,
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
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
} from '@coreui/react'
import { NODEAPIURL, showFulldatetimein } from '../../config'

let SortStatusType = 'DESC'
let Act_status = ''
const DepartmentsListPage = () => {
  let keyword = ''
  const tableRef = useRef(null)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowAddData] = useState(false)

  const FetchDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/getSignupList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
          SortStatusType,
          Act_status: 1,
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

  const FilterDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/getSignupList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
          Act_status,
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

  const updateDataStatus = async (id, status) => {
    let message = 'Are you sure to Delete the Request ?'
    if (Number(status) === 2) {
      message = 'Are you sure to Create the Employee Account for the Request ?'
    }
    if (window.confirm(message)) {
      confirmupdateDataStatus(id, status)
    }
  }

  const confirmupdateDataStatus = async (id, status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/updateSignupStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, id }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        alert(resJson.message)
        FilterDataList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    SortStatusType = 'DESC'
    Act_status = 1
    FetchDataList()
  }, [])

  return (
    <CRow>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <h3 className="mb-3 mt-2">New Account Request</h3>
        {/* <p>
          The Signup List is only for the iOS App, No Action to be done Here. Its Just for the
          Records.
        </p> */}
      </CCol>
      <CCol lg={5} style={{ display: ShowAddData ? 'none' : '' }}>
        <CForm className="mb-lg-2 mb-2">
          <CFormInput
            type="text"
            placeholder="Search Here"
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              keyword = e.target.value
              FilterDataList()
            }}
          />
        </CForm>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddData ? 'none' : 'none' }}>
        <CForm className="mb-lg-2 mb-2">
          <CFormSelect
            type="text"
            placeholder="Search Here"
            value={Act_status}
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              Act_status = e.target.value
              FilterDataList()
            }}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </CFormSelect>
        </CForm>
      </CCol>
      <CCol lg={6} className="mb-lg-3 mb-2" style={{ display: ShowAddData ? 'none' : '' }}>
        <CButton color="primary" className="me-2">
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
            onClick={() => {
              SortStatusType = 'DESC'
              FilterDataList()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterDataList()
            }}
          />
        </CButton>

        <DownloadTableExcel
          filename="Sign Up List"
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-1" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.id}>
                    <CTableDataCell>{singi.id}</CTableDataCell>
                    <CTableDataCell>{singi.name}</CTableDataCell>
                    <CTableDataCell>{singi.lname}</CTableDataCell>
                    <CTableDataCell>{singi.email}</CTableDataCell>
                    <CTableDataCell>{singi.mobile}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      <CNav variant="pills">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle className={singi.status === 1 ? '' : 'bg-danger'}>
                            {singi.status === 1 ? 'New' : 'Deleteed'}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                updateDataStatus(singi.id, 2)
                              }}
                            >
                              Create Acccount
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                updateDataStatus(singi.id, 0)
                              }}
                            >
                              Delete Request
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CTable className="d-none" ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.id}>
                    <CTableDataCell>{singi.id}</CTableDataCell>
                    <CTableDataCell>{singi.name}</CTableDataCell>
                    <CTableDataCell>{singi.lname}</CTableDataCell>
                    <CTableDataCell>{singi.email}</CTableDataCell>
                    <CTableDataCell>{singi.mobile}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DepartmentsListPage

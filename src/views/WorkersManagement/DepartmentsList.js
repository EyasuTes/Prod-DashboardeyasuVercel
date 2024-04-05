import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilSave, cilSortAscending, cilSortDescending } from '@coreui/icons'
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
  // CFormCheck,
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  // CPagination,
  // CPaginationItem,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { NODEAPIURL, showdatetimein } from '../../config'
import DepartmentCreate from './DepartmentCreate'
// import { findByText } from '@testing-library/react'

let SortStatusType = 'ASC'
const DepartmentsListPage = () => {
  let keyword = ''
  const tableRef = useRef(null)
  const [ForDataID, setForDataID] = useState(0)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowAddData, setShowAddData] = useState(false)

  const FetchDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/department/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
          SortStatusType,
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
      const res = await fetch(`${NODEAPIURL}/admin/department/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
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

  const updateDataStatus = async (DataID, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/department/udpateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: new_status,
          dpt_id: DataID,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        FilterDataList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    SortStatusType = 'ASC'
    FetchDataList()
  }, [])

  let AddForm = ''
  if (ShowAddData) {
    AddForm = (
      <DepartmentCreate
        ForDataID={ForDataID}
        setShowAddData={setShowAddData}
        FilterDataList={FilterDataList}
      />
    )
  }

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <h3 className="mb-4">Manage Departments</h3>
      </CCol>
      <CCol lg={7} style={{ display: ShowAddData ? 'none' : '' }}>
        <CForm className="mb-lg-5 mb-4">
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
      <CCol lg={5} className="mb-lg-0 mb-5" style={{ display: ShowAddData ? 'none' : '' }}>
        <CButton color="primary" className="me-3">
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
        {/* <CButton color="primary" className="me-3">
          <CIcon icon={cilFilter} />
        </CButton> */}
        <CButton
          color="primary"
          className="me-3"
          onClick={() => {
            setForDataID('new')
            setShowAddData(true)
            // FilterDataList(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.dpt_id}>
                    <CTableDataCell>{singi.dpt_id}</CTableDataCell>
                    <CTableDataCell>{singi.dept_name}</CTableDataCell>
                    <CTableDataCell>{showdatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      <CNav variant="pills">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle className={singi.status === 1 ? '' : 'bg-danger'}>
                            {singi.status === 1 ? 'Active' : 'Inactive'}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                setForDataID(singi.dpt_id)
                                setShowAddData(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                updateDataStatus(singi.dpt_id, singi.status === 1 ? 0 : 1)
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
      {/* <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CPagination align="end" aria-label="Page navigation example">
          <CPaginationItem>Previous</CPaginationItem>
          <CPaginationItem>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem>Next</CPaginationItem>
        </CPagination>
      </CCol> */}
    </CRow>
  )
}

export default DepartmentsListPage

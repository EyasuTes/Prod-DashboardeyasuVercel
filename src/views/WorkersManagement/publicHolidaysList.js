import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
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
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
  CButton,
  CTableFoot,
} from '@coreui/react'
import { NODEAPIURL, showFulldatetimein, showdateYMDtoLocal } from '../../config'
import PublicHolidaysCreate from './publicHolidaysCreate'

let SortStatusType = 'ASC'
let keyword = ''
let fromDate = ''
let toDate = ''
const DepartmentsListPage = () => {
  const tableRef = useRef(null)
  const [ForDataID, setForDataID] = useState(0)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowAddData, setShowAddData] = useState(false)

  const FilterDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/publicHolidays/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
          fromDate,
          toDate,
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
      const res = await fetch(`${NODEAPIURL}/admin/publicHolidays/udpateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: new_status,
          pholi_id: DataID,
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

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    SortStatusType = 'ASC'
    keyword = ''
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    fromDate = formatDate(firstDayOfMonth)
    toDate = formatDate(lastDayOfMonth)
    FilterDataList()
  }, [])

  let AddForm = ''
  if (ShowAddData) {
    AddForm = (
      <PublicHolidaysCreate
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
        <h3 className="mb-3">Manage Public Holidays</h3>
      </CCol>
      <CCol lg={3} style={{ display: ShowAddData ? 'none' : '' }}>
        <CFormInput
          type="text"
          placeholder="Search Here"
          onChange={(e) => {
            keyword = e.target.value
            FilterDataList()
          }}
          label="Search By"
        />
      </CCol>
      <CCol lg={3} style={{ display: ShowAddData ? 'none' : '' }}>
        <CFormInput
          type="date"
          value={fromDate}
          onChange={(e) => {
            fromDate = e.target.value
            FilterDataList()
          }}
          label="From Date"
        />
      </CCol>
      <CCol lg={3} style={{ display: ShowAddData ? 'none' : '' }}>
        <CFormInput
          type="date"
          value={toDate}
          onChange={(e) => {
            toDate = e.target.value
            FilterDataList()
          }}
          label="To Date"
        />
      </CCol>
      <CCol lg={3} className="mb-lg-4 mb-4" style={{ display: ShowAddData ? 'none' : '' }}>
        <label className="form-label">&nbsp;</label>
        <br />
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
        <CButton
          color="primary"
          className="me-3"
          onClick={() => {
            if (Number(localStorage.getItem('uType')) === 3) {
              setForDataID('new')
              setShowAddData(true)
            } else {
              alert('Only Admin Can Create Holidays.')
            }
            // FilterDataList(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
        <DownloadTableExcel
          filename="Public Holidays List"
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <CCard className="mb-3">
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.pholi_id}>
                    <CTableDataCell>{singi.pholi_id}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.fromDate)}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.toDate)}</CTableDataCell>
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
                                if (Number(localStorage.getItem('uType')) === 3) {
                                  setForDataID(singi.pholi_id)
                                  setShowAddData(true)
                                } else {
                                  alert('Only Admin Can Update Holidays.')
                                }
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                if (Number(localStorage.getItem('uType')) === 3) {
                                  updateDataStatus(singi.pholi_id, singi.status === 1 ? 0 : 1)
                                } else {
                                  alert('Only Admin Can Update Status of the Holidays.')
                                }
                              }}
                            >
                              {singi.status === 1 ? 'De-activate' : 'Activate'}
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                      <small className="text-info">
                        Created by {singi.createdBy} on {showFulldatetimein(singi.createdAt)}
                      </small>
                      <br />
                      {singi.updatedAt !== singi.createdAt ? (
                        <small className="text-danger">
                          Updated by {singi.updatedBy} on {showFulldatetimein(singi.updatedAt)}
                        </small>
                      ) : (
                        ''
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>

            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">From Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">To Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Updated Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Updated By</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.pholi_id}>
                    <CTableDataCell>{singi.pholi_id}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.fromDate)}</CTableDataCell>
                    <CTableDataCell>{showdateYMDtoLocal(singi.toDate)}</CTableDataCell>
                    <CTableDataCell>{singi.status === 1 ? 'Active' : 'Inactive'}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>{singi.createdBy}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.updatedAt)}</CTableDataCell>
                    <CTableDataCell>{singi.updatedBy}</CTableDataCell>
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

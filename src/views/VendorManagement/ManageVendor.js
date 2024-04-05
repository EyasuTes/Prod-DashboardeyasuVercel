import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import {
  // cilEnvelopeLetter,
  // cilMobile,
  cilPencil,
  cilPlus,
  cilSave,
  cilSortAscending,
  cilSortDescending,
  // cilUser,
} from '@coreui/icons'
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
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CTableFoot,
  CNav,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
} from '@coreui/react'
import { NODEAPIURL, showFulldatetimein } from '../../config'
import AddVendor from './AddVendor'

let Act_status = 1
let keyword = ''
let SortStatusType = 'DESC'

const VendorListDataPage = () => {
  const [ShowAddData, setShowAddData] = useState(false)
  const [ForDataID, setForDataID] = useState(0)
  const tableRef = useRef(null)
  const [ListData, setListData] = useState([])

  const vendorUpdateStatus = async (e, ven_id, new_status) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ven_id, new_status }),
      })
      const resJson = await res.json()
      console.log(resJson)
      FilterDataList()
    } catch (err) {
      alert(err)
    }
  }

  const FetchDataList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/getListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          Act_status: 1,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterDataList = async () => {
    setListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/getListData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          Act_status,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    keyword = ''
    Act_status = 1
    SortStatusType = 'DESC'
    FetchDataList()
  }, [])

  let AddForm = ''
  if (ShowAddData) {
    AddForm = (
      <AddVendor
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
        <h3 className="mb-4">Manage Vendor</h3>
      </CCol>
      <CCol md={9} style={{ display: ShowAddData ? 'none' : '' }}>
        <CForm className="mb-lg-5 mb-4">
          <CRow>
            <CCol md={8}>
              <label>&nbsp;</label>
              <CFormInput
                type="text"
                placeholder="Search Here"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  keyword = e.target.value
                  FilterDataList()
                }}
              />
            </CCol>
            <CCol md={4}>
              <label>Status</label>
              <CFormSelect
                value={Act_status}
                onChange={(e) => {
                  Act_status = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol md={3} className="mb-lg-0 mb-5" style={{ display: ShowAddData ? 'none' : '' }}>
        <label>&nbsp;</label>
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
            setForDataID(0)
            setShowAddData(true)
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
                  <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Company</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Permit Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.ven_id}</CTableDataCell>
                    <CTableDataCell>{singi.name}</CTableDataCell>
                    <CTableDataCell>
                      <a href={`mailto:${singi.email}`}>{singi.email}</a>
                    </CTableDataCell>
                    <CTableDataCell>
                      <a href={`tel:${singi.mobile}`}>{singi.mobile}</a>
                    </CTableDataCell>
                    <CTableDataCell style={{ maxWidth: '170px' }}>{singi.company}</CTableDataCell>
                    <CTableDataCell>
                      {singi.permit_no.trim() !== '' ? ` ${singi.permit_no}` : 'NA'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <small>Created on {showFulldatetimein(singi.createdAt)}</small>
                      <CNav variant="pills">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle
                            className={`${singi.status === 0 ? 'bg-danger' : ''} ${
                              singi.status === 3 ? 'bg-warning' : ''
                            } ${singi.status === 1 ? 'bg-success' : ''}`}
                          >
                            {singi.status === 0 ? 'Inactive' : ''}
                            {singi.status === 1 ? 'Active' : ''}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                setForDataID(singi.ven_id)
                                setShowAddData(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                vendorUpdateStatus(e, singi.ven_id, singi.status === 1 ? 0 : 1)
                              }}
                            >
                              {singi.status === 0 ? 'Activate' : ''}
                              {singi.status === 1 ? 'De-Activate' : ''}
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Company</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Permit Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default VendorListDataPage

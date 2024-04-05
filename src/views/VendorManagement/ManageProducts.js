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
import AddProduct from './AddProduct'
import { Link } from 'react-router-dom'

let Act_status = 1
let keyword = ''
let SortStatusType = 'DESC'

const ProductListDataPage = () => {
  const [ShowAddData, setShowAddData] = useState(false)
  const [ForDataID, setForDataID] = useState(0)
  const tableRef = useRef(null)
  const [ListData, setListData] = useState([])

  const productUpdateStatus = async (e, prd_id, new_status) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd_id, new_status }),
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
      const res = await fetch(`${NODEAPIURL}/admin/product/getListData`, {
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
      const res = await fetch(`${NODEAPIURL}/admin/product/getListData`, {
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
  const [PrdCatiData, setPrdCatiData] = useState([])
  const getPrdCatiData = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdCatiData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setPrdCatiData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  const [PrdUnitsData, setPrdUnitsData] = useState([])
  const getPrdUnitsData = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdUnitsData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setPrdUnitsData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    keyword = ''
    Act_status = 1
    SortStatusType = 'DESC'
    FetchDataList()
    getPrdCatiData()
    getPrdUnitsData()
  }, [])

  let AddForm = ''
  if (ShowAddData) {
    AddForm = (
      <AddProduct
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
        <h3 className="mb-0">Manage product</h3>
      </CCol>
      <CCol md={6} style={{ display: ShowAddData ? 'none' : '' }}>
        <CForm className="mb-lg-3 mb-3">
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
      <CCol md={6} className="mb-lg-3 mb-3" style={{ display: ShowAddData ? 'none' : '' }}>
        <label>&nbsp;</label>
        <br />
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
        <DownloadTableExcel
          filename="Inventory Product Data"
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
        <span className="me-2"></span>
        <Link to="/inventory" className="btn btn-success text-white">
          Inventory
        </Link>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddData ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cat No/ Ref No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.prd_id}</CTableDataCell>
                    <CTableDataCell>{singi.cat_no}</CTableDataCell>
                    <CTableDataCell>{singi.brand}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>
                      {PrdCatiData.map((s) => (
                        <span
                          key={s.cat_id}
                          style={{
                            display: Number(s.cat_id) === Number(singi.category) ? '' : 'none',
                          }}
                        >
                          {s.title}
                        </span>
                      ))}
                    </CTableDataCell>
                    <CTableDataCell>
                      {PrdUnitsData.map((s) => (
                        <span
                          key={s.cat_id}
                          style={{
                            display: Number(s.unit_id) === Number(singi.unit) ? '' : 'none',
                          }}
                        >
                          {s.title}
                        </span>
                      ))}
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
                                setForDataID(singi.prd_id)
                                setShowAddData(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                productUpdateStatus(e, singi.prd_id, singi.status === 1 ? 0 : 1)
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
                  <CTableHeaderCell scope="col">Cat No/ Ref No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
            <CTable style={{ display: 'none' }} ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cat No/ Ref No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.prd_id}</CTableDataCell>
                    <CTableDataCell>{singi.cat_no}</CTableDataCell>
                    <CTableDataCell>{singi.brand}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>
                      {PrdCatiData.map((s) => (
                        <span key={s.cat_id}>
                          {Number(s.cat_id) === Number(singi.category) ? s.title : ''}
                        </span>
                      ))}
                    </CTableDataCell>
                    <CTableDataCell>
                      {PrdUnitsData.map((s) => (
                        <span key={s.cat_id}>
                          {Number(s.unit_id) === Number(singi.unit) ? s.title : ''}
                        </span>
                      ))}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cat No/ Ref No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                </CTableRow>
              </CTableFoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductListDataPage

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeLetter,
  // cilEnvelopeClosed,
  // cilMobile,
  // cilEnvelopeLetter,
  // cilMobile,
  // cilPencil,
  cilSave,
  cilSortAscending,
  cilSortDescending,
  // cilUser,
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
  // CNav,
  // CDropdown,
  // CDropdownMenu,
  // CDropdownItem,
  // CDropdownToggle,
} from '@coreui/react'
import { NODEAPIURL, showFulldatetimein } from '../../config'

let Act_status = 0
let keyword = ''
let SortStatusType = 'DESC'

const ProductsInventaryPage = ({ ForDataID, ForData, setShowUploadBill }) => {
  const tableRef = useRef(null)
  const [ShowUploadBill] = useState(false)
  const [ListData, setListData] = useState([])
  const [ListDataIn, setListDataIn] = useState([])

  const FetchDataList = async (ForDataID) => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/viewProductUsages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          prd_id: ForDataID,
          Act_status: 1,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200 && resJson.dataIn && resJson.dataIn.length > 0) {
        setListDataIn(resJson.dataIn)
      }
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
      const res = await fetch(`${NODEAPIURL}/admin/product/viewProductUsages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          prd_id: ForDataID,
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
    FetchDataList(ForDataID)
  }, [ForDataID])

  return (
    <CRow>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <h3 className="mb-2">{ForData.title}</h3>
      </CCol>
      <CCol md={7} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <CForm className="mb-lg-2 mb-2">
          <CRow>
            <CCol md={7}>
              <CFormInput
                type="text"
                placeholder="Search Here"
                // style={{ borderRadius: '5px' }}
                onChange={(e) => {
                  keyword = e.target.value
                  FilterDataList()
                }}
              />
            </CCol>
            <CCol md={4} className="d-none">
              <CFormSelect
                value={Act_status}
                onChange={(e) => {
                  Act_status = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                {/* <option value="0">Pending</option> */}
                <option value="1">Active Product</option>
                <option value="0">Inactive Product</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol md={5} className="mb-lg-0 mb-5" style={{ display: ShowUploadBill ? 'none' : '' }}>
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
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
        <CButton
          color="warning"
          className="text-white"
          style={{
            marginLeft: '20px',
          }}
          onClick={() => {
            setShowUploadBill(false)
          }}
        >
          Back
        </CButton>
      </CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <h3>Consumption/ External Data</h3>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.quantity}</CTableDataCell>
                    <CTableDataCell>{singi.remark}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      <CIcon icon={cilEnvelopeLetter} />
                      &nbsp;
                      {singi.email}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <h3>Delivery Data</h3>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added on</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added Using</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListDataIn.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.quantity}</CTableDataCell>
                    <CTableDataCell>{singi.remark}</CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.createdAt)}</CTableDataCell>
                    <CTableDataCell>
                      {singi.ib_id === 0 ? 'direct' : `PO #${singi.ib_id}`}
                    </CTableDataCell>
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

ProductsInventaryPage.propTypes = {
  ForData: PropTypes.any,
  ForDataID: PropTypes.any,
  setShowUploadBill: PropTypes.any,
}

export default ProductsInventaryPage

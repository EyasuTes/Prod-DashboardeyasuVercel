import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeClosed,
  cilMobile,
  cilPen,
  // cilEnvelopeLetter,
  // cilMobile,
  cilPencil,
  cilPlus,
  cilSave,
  cilSortAscending,
  cilSortDescending,
  cilUser,
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
import AddBilltoICR from './AddBilltoICR'
import AddDeliverytoBill from './AddDeliverytoBill'

let Act_status = ''
let keyword = ''
let SortStatusType = 'DESC'

const VendorListDataPage = () => {
  const tableRef = useRef(null)
  const [ShowUploadBill, setShowUploadBill] = useState(false)
  const [ShowDelivery, setShowDelivery] = useState(false)
  const [ListData, setListData] = useState([])
  const [ForDataID, setForDataID] = useState(0)

  const POUpdateStatus = async (e, ib_id, new_status) => {
    let allGood = 0
    const uType = localStorage.getItem('uType')
    if (uType !== '2') {
      allGood = 0
    }
    e.preventDefault()
    if (allGood === 1) {
      const a_remark = prompt('Enter Admin Remark')
      if (a_remark !== null) {
        try {
          const res = await fetch(`${NODEAPIURL}/admin/inventory/POUpdateStatus`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              ib_id,
              new_status,
              a_remark,
              device: localStorage.getItem('DeviceDetails'),
            }),
          })
          const resJson = await res.json()
          console.log(resJson)
          FilterDataList()
        } catch (err) {
          alert(err)
        }
      }
    } else {
      alert('Only Admin can Approve or Reject.')
    }
  }

  const FetchDataList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getBillsList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          Act_status: '',
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
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getBillsList`, {
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
    Act_status = ''
    SortStatusType = 'DESC'
    FetchDataList()
  }, [])

  let AddForm = ''
  if (ShowUploadBill) {
    AddForm = (
      <AddBilltoICR
        ForDataID={ForDataID}
        setShowUploadBill={setShowUploadBill}
        FilterDataList={FilterDataList}
      />
    )
  }
  if (ShowDelivery) {
    AddForm = (
      <AddDeliverytoBill
        ForDataID={ForDataID}
        setShowDelivery={setShowDelivery}
        FilterDataList={FilterDataList}
      />
    )
  }

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : ShowDelivery ? 'none' : '' }}>
        <h3 className="mb-1 mt-1">PO List</h3>
      </CCol>
      <CCol md={9} style={{ display: ShowUploadBill ? 'none' : ShowDelivery ? 'none' : '' }}>
        <CForm className="mb-lg-4 mb-4">
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
            <CCol md={4} className="d-none">
              <label>Status</label>
              <CFormSelect
                value={Act_status}
                onChange={(e) => {
                  Act_status = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                <option value="1">Pending</option>
                <option value="2">Approved</option>
                <option value="3">Rejected</option>
                <option value="4">Completed</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol
        md={3}
        className="mb-lg-0 mb-5"
        style={{ display: ShowUploadBill ? 'none' : ShowDelivery ? 'none' : '' }}
      >
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
          color="success"
          className="me-3 text-white"
          onClick={() => {
            setForDataID(0)
            setShowUploadBill(true)
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
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : ShowDelivery ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Delivery</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Order</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.ib_id}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilUser} /> {singi.v_name}
                      <div style={{ display: singi.v_email === '' ? 'none' : '' }}>
                        <CIcon icon={cilEnvelopeClosed} />
                        &nbsp;
                        <a href={`mailto:${singi.v_email}`}>{singi.v_email}</a>
                      </div>
                      <br />
                      <CIcon icon={cilMobile} />
                      &nbsp;
                      <a href={`tel:${singi.v_mobile}`}>{singi.v_mobile}</a>
                      <br />
                      <b>{singi.v_company}</b>
                      {singi.permit_no.trim() !== '' ? (
                        <>
                          <br />
                          {`Permist No.:  ${singi.permit_no}`}
                        </>
                      ) : (
                        'NA'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilUser} /> {singi.emp_name}
                      <br />
                      <CIcon icon={cilEnvelopeClosed} />
                      &nbsp;
                      <a href={`mailto:${singi.emp_email}`}>{singi.emp_email}</a>
                    </CTableDataCell>
                    <CTableDataCell className="text-left text-info">
                      {singi.e_remark}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        title={`Last Updated on ${showFulldatetimein(singi.updateAt)}`}
                        color="success"
                        className="text-white"
                        onClick={(e) => {
                          setForDataID(singi.ib_id)
                          setShowDelivery(true)
                        }}
                      >
                        Add Delivery
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CNav variant="pills" className="d-none">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle
                            className={`${singi.status === 2 ? 'bg-info' : ''} ${
                              singi.status === 3 ? 'bg-danger' : ''
                            } ${singi.status === 1 ? 'bg-warning' : ''} ${
                              singi.status === 4 ? 'bg-info' : ''
                            }`}
                          >
                            {singi.status === 1 ? 'Pending' : ''}
                            {singi.status === 2 ? 'Approved' : ''}
                            {singi.status === 3 ? 'Rejected' : ''}
                            {singi.status === 4 ? 'Completed' : ''}
                            <CIcon
                              icon={cilPencil}
                              style={{
                                display: singi.status === 4 || singi.status === 3 ? 'none' : '',
                              }}
                            />
                          </CDropdownToggle>
                          <CDropdownMenu
                            style={{
                              display: singi.status === 4 || singi.status === 3 ? 'none' : '',
                            }}
                          >
                            <CDropdownItem
                              style={{
                                display: singi.status === 1 ? '' : 'none',
                              }}
                              onClick={(e) => {
                                POUpdateStatus(e, singi.ib_id, 2)
                              }}
                            >
                              Approve
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display: singi.status === 1 ? '' : 'none',
                              }}
                              onClick={(e) => {
                                POUpdateStatus(e, singi.ib_id, 3)
                              }}
                            >
                              Reject
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display: singi.status === 2 ? '' : 'none',
                              }}
                              onClick={(e) => {
                                setForDataID(singi.ib_id)
                                setShowUploadBill(true)
                              }}
                            >
                              Upload Bills
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                      <CButton
                        title={`Last Updated on ${showFulldatetimein(singi.updateAt)}`}
                        colr="info"
                        onClick={(e) => {
                          setForDataID(singi.ib_id)
                          setShowUploadBill(true)
                        }}
                      >
                        <CIcon icon={cilPen} />
                      </CButton>
                      {singi.a_remark ? (
                        <div className="text-info">Admin Remark: {singi.a_remark}</div>
                      ) : (
                        ''
                      )}
                      <br />
                      <small>Created on {showFulldatetimein(singi.createdAt)}</small>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <CTableFoot>
                <CTableRow>
                  {/* <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Company</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Permit Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell> */}
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

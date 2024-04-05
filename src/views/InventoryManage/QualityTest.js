import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeClosed,
  cilMobile,
  // cilEnvelopeLetter,
  // cilMobile,
  cilPencil,
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
  CNav,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
} from '@coreui/react'
import { NODEAPIURL, showFulldatetimein } from '../../config'
import AddTestingtoBill from './AddTestingtoBill'

let Act_status = 0
let keyword = ''
let SortStatusType = 'DESC'

const VendorListDataPage = () => {
  const tableRef = useRef(null)
  const [ShowUploadBill, setShowUploadBill] = useState(false)
  const [ListData, setListData] = useState([])
  const [Testingdata, setTestingdata] = useState([])
  const [ForDataID, setForDataID] = useState(0)

  const FetchDataList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getQualityTestRequestList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'hello',
          Qul_status: 0,
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
      if (res.status === 200 && resJson.Testingdata && resJson.Testingdata.length > 0) {
        // console.log(resJson.Testingdata)
        setTestingdata(resJson.Testingdata)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterDataList = async () => {
    setListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getQualityTestRequestList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          Qul_status: Act_status,
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
      if (res.status === 200 && resJson.Testingdata && resJson.Testingdata.length > 0) {
        setTestingdata(resJson.Testingdata)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    keyword = ''
    Act_status = 0
    SortStatusType = 'DESC'
    FetchDataList()
  }, [])

  let AddForm = ''
  if (ShowUploadBill) {
    AddForm = (
      <AddTestingtoBill
        ForDataID={ForDataID}
        setShowUploadBill={setShowUploadBill}
        FilterDataList={FilterDataList}
      />
    )
  }

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <h3 className="mb-4">Quality Test</h3>
      </CCol>
      <CCol md={9} style={{ display: ShowUploadBill ? 'none' : '' }}>
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
                <option value="0">Pending</option>
                <option value="1">Passed</option>
                <option value="2">Failed</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol md={3} className="mb-lg-0 mb-5" style={{ display: ShowUploadBill ? 'none' : '' }}>
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
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Vendor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created By</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Testing Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.ib_id}</CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilUser} /> {singi.v_name}
                      <br />
                      <CIcon icon={cilEnvelopeClosed} />
                      &nbsp;
                      <a href={`mailto:${singi.v_email}`}>{singi.v_email}</a>
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
                    <CTableDataCell className="text-center">
                      {Testingdata &&
                        Testingdata.length > 0 &&
                        Testingdata.map((s) => (
                          <div
                            key={`${s.lb_id}_${s.testing}`}
                            style={{
                              display: Number(singi.ib_id) === Number(s.ib_id) ? '' : 'none',
                            }}
                          >
                            {s.testing === 0 ? (
                              <div className="text-warning">{s.total} Pending</div>
                            ) : (
                              ''
                            )}
                            {s.testing === 1 ? (
                              <div className="text-success">{s.total} Passed</div>
                            ) : (
                              ''
                            )}
                            {s.testing === 2 ? (
                              <div className="text-danger">{s.total} Failed</div>
                            ) : (
                              ''
                            )}
                          </div>
                        ))}
                    </CTableDataCell>
                    <CTableDataCell>
                      <small>Created on {showFulldatetimein(singi.createdAt)}</small>
                      <br />
                      <button
                        className="btn btn-info text-white"
                        onClick={(e) => {
                          setForDataID(singi.ib_id)
                          setShowUploadBill(true)
                        }}
                      >
                        Update Testing Results
                      </button>
                      <CNav variant="pills" className="d-none">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle
                            className={`${singi.status === 2 ? 'bg-success' : ''} ${
                              singi.status === 3 ? 'bg-danger' : ''
                            } ${singi.status === 1 ? 'bg-warning' : ''} ${
                              singi.status === 4 ? 'bg-info' : ''
                            }`}
                          >
                            Update Testing Results
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
                              onClick={(e) => {
                                setForDataID(singi.icr_id)
                                setShowUploadBill(true)
                              }}
                            >
                              Update Testing Results
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                      {singi.a_remark !== '' ? (
                        <div className="text-info">Admin Remark: {singi.a_remark}</div>
                      ) : (
                        ''
                      )}
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

export default VendorListDataPage

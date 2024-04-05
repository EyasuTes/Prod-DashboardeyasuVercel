import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import CIcon from '@coreui/icons-react'
import { cilSortAscending, cilPencil, cilSave, cilSortDescending } from '@coreui/icons'
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
  CFormSelect,
} from '@coreui/react'
import { BASEWEBURL, NODEAPIURL, showFulldatetimein, ShowTimeAMorPM } from '../../config'
import GeoFencingListEdit from './GeoFencingListEdit'

let SortStatusType = 'DESC'
let FilterStatus = ''
let keyword = ''

const GeoFencingList = () => {
  const tableRef = useRef(null)
  const [WorkedListData, setWorkedListData] = useState([])
  const [ShowEdit, setShowEdit] = useState(false)
  const [RequestedID, setRequestedID] = useState(0)
  const [ListDataClass, setListDataClass] = useState('d-none')

  const FilterDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getGeoFenclist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          FilterStatus,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      setListDataClass('')
      if (res.status === 200) {
        setWorkedListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      setListDataClass('')
      console.log(err)
    }
  }

  const updateGeoFencStatus = async (auto_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateGeoFencStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status,
          auto_id,
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
    SortStatusType = 'DESC'
    keyword = ''
    FilterStatus = 0
    FilterDataList()
  }, [])

  let GeoFencingListEditForm = ''
  if (ShowEdit) {
    GeoFencingListEditForm = (
      <GeoFencingListEdit
        RequestedID={RequestedID}
        setShowEdit={setShowEdit}
        FilterDataList={FilterDataList}
      />
    )
  }

  return (
    <CRow className={ListDataClass}>
      <CCol xs={12} style={{ display: ShowEdit ? '' : 'none' }}>
        {GeoFencingListEditForm}
      </CCol>
      <CCol xs={12} style={{ display: ShowEdit ? 'none' : '' }}>
        <h3 className="mb-2">Requested Geo Fencing</h3>
      </CCol>
      <CCol lg={5} style={{ display: ShowEdit ? 'none' : '' }}>
        <CFormInput
          className="mb-lg-3 mb-3"
          type="text"
          placeholder="Search Here"
          onChange={(e) => {
            keyword = e.target.value
            FilterDataList()
          }}
        />
      </CCol>
      <CCol lg={3} style={{ display: ShowEdit ? 'none' : '' }}>
        <CFormSelect
          className="mb-lg-3 mb-3"
          value={FilterStatus}
          onChange={(e) => {
            FilterStatus = e.target.value
            FilterDataList()
          }}
        >
          <option value="">Select Status</option>
          <option value="0">Pending</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
          <option value="3">Cancelled by Worker</option>
        </CFormSelect>
      </CCol>
      <CCol lg={4} className="mb-lg-3 mb-3" style={{ display: ShowEdit ? 'none' : '' }}>
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
        <DownloadTableExcel
          filename="Requested Geo Fencing"
          sheet="users"
          currentTableRef={tableRef.current}
        >
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowEdit ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <div
              className="alert alert-danger"
              style={{ display: WorkedListData.length === 0 ? '' : 'none' }}
            >
              There is no data here.
            </div>
            <CTable
              hover
              bordered
              responsive
              style={{
                display: WorkedListData.length === 0 || WorkedListData.length === '0' ? 'none' : '',
              }}
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Map</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Worker</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>
                      {Number(singi.outOfOffice) === 1 ? (
                        <>
                          <b className="text-danger">Out of Office</b>
                        </>
                      ) : (
                        ''
                      )}
                      <h6>{singi.title}</h6>
                      <iframe
                        src={`${BASEWEBURL}/map.html?lat=${singi.uLat}&long=${singi.uLong}&radious=${singi.uRadious}`}
                        // src2={`https://maps.google.com/maps?q=${singi.uLat},${singi.uLong}&output=embed&z=14`}
                        title="Map"
                        style={{
                          width: '100%',
                          minHeight: '150px',
                          maxWidth: '280px',
                        }}
                      ></iframe>
                      <br />
                      <a
                        target="_FULLMAP"
                        rel="noreferrer"
                        href={`${BASEWEBURL}/map.html?lat=${singi.uLat}&long=${singi.uLong}&radious=${singi.uRadious}`}
                      >
                        View Full Map
                      </a>
                      <br />
                      <b>Lat:</b>
                      {singi.uLat}
                      <br />
                      <b>Long:</b>
                      {singi.uLong}
                      <br />
                      <b>Radius:</b>
                      {singi.uRadious} Mt.
                      <CRow className="mt-2 d-none">
                        <CCol lg={6}>
                          <CFormInput
                            type="text"
                            label="Lattitude"
                            value={singi.uLat}
                            className="bg-primary text-white"
                          />
                        </CCol>
                        <CCol lg={6}>
                          <CFormInput
                            type="text"
                            label="Longitude"
                            value={singi.uLong}
                            className="bg-primary text-white"
                          />
                        </CCol>
                      </CRow>
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                      <br />
                      {singi.email}
                      <br />
                      {singi.mobile}
                    </CTableDataCell>
                    <CTableDataCell>{singi.start_date}</CTableDataCell>
                    <CTableDataCell>{singi.end_date}</CTableDataCell>
                    <CTableDataCell>{ShowTimeAMorPM(singi.start_time)}</CTableDataCell>
                    <CTableDataCell>{ShowTimeAMorPM(singi.end_time)}</CTableDataCell>
                    <CTableDataCell>
                      <CNav variant="pills">
                        <button
                          style={{
                            display: singi.status === 3 ? '' : 'none',
                            cursor: 'not-allowed',
                          }}
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                        >
                          Cancelled by Worker
                        </button>
                        <CDropdown
                          variant="nav-item"
                          style={{ display: singi.status === 3 ? 'none' : '' }}
                        >
                          <CDropdownToggle
                            className={`${singi.status === 0 ? 'bg-danger' : ''}
                            ${singi.status === 2 ? 'bg-warning' : ''}`}
                          >
                            {singi.status === 0 ? 'Pending' : ''}
                            {singi.status === 1 ? 'Approved' : ''}
                            {singi.status === 2 ? 'Rejected' : ''}
                            <CIcon icon={cilPencil} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={(e) => {
                                localStorage.setItem('uRadious', singi.uRadious)
                                localStorage.setItem('uLat', singi.uLat)
                                localStorage.setItem('uLong', singi.uLong)
                                setShowEdit(true)
                                setRequestedID(singi.auto_id)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display: singi.status === 10 ? 'None' : '',
                              }}
                              onClick={(e) => {
                                updateGeoFencStatus(singi.auto_id, singi.status !== 1 ? 1 : 0)
                              }}
                            >
                              {singi.status !== 1 ? 'Approve' : 'Pending'}
                            </CDropdownItem>
                            <CDropdownItem
                              style={{
                                display: singi.status === 20 ? 'None' : '',
                              }}
                              onClick={(e) => {
                                updateGeoFencStatus(singi.auto_id, singi.status !== 2 ? 2 : 0)
                              }}
                            >
                              {singi.status !== 2 ? 'Reject' : 'Pending'}
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                      <small>Requested on {showFulldatetimein(singi.added)}</small>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Lat</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Long</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Radius</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Staff</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Request Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {WorkedListData.map((singi) => (
                  <CTableRow key={singi.auto_id}>
                    <CTableDataCell>{singi.auto_id}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>{singi.uLat}</CTableDataCell>
                    <CTableDataCell>{singi.uLong}</CTableDataCell>
                    <CTableDataCell>{singi.uRadious} Mt.</CTableDataCell>
                    <CTableDataCell>
                      {singi.status === 0 ? 'Pending' : ''}
                      {singi.status === 1 ? 'Active' : ''}
                      {singi.status === 2 ? 'Inactive' : ''}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.start_date !== '0' ? singi.start_date : 'NA'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.end_date !== '0' ? singi.end_date : 'NA'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {singi.f_name} {singi.l_name}
                    </CTableDataCell>
                    <CTableDataCell>{showFulldatetimein(singi.added)}</CTableDataCell>
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

export default GeoFencingList

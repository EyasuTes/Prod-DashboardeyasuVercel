import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilSave, cilSortDescending, cilSortAscending } from '@coreui/icons'
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
import { NODEAPIURL } from '../../config'
import AddAnimals from './AddAnimals'
import { Link } from 'react-router-dom'

let SortStatusType = 'DESC'
let keyword = ''
let keywordType = ''
let birthYear = localStorage.getItem('SortBirthYear')
let birthMonth = ''

const AnimalsList = () => {
  const tableRef = useRef(null)
  let IndexTable = 'auto_id'
  const [ForID, setForID] = useState(0)
  const [ResetPassword, setResetPassword] = useState(false)
  const [ListData, setListData] = useState([])
  const [ShowAddWorkers, setShowAddWorkers] = useState(false)

  function deleteAnimalData(DeleteID, autoId) {
    const ConDeleteID = prompt('Enter Animal ID to Confirm !', '')
    if (ConDeleteID && ConDeleteID !== null) {
      if (ConDeleteID.trim() === DeleteID) {
        ConfirmDeleteAnimalData(ConDeleteID, autoId)
      } else {
        alert('Please Enter Correct Animal ID, which you want to delete.')
        deleteAnimalData(DeleteID, autoId)
      }
    }
  }
  const ConfirmDeleteAnimalData = async (animalId, autoId) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/deleteAnimalData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          token: 'deleteAnimal',
          animalId,
          autoId,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      FilterAnimalsList()
    } catch (err) {
      console.log(err)
    }
  }

  const FilterAnimalsList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
          keywordType,
          birthYear,
          birthMonth,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateanimalsStatus = async (auto_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateanimalsStatus`, {
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
        FilterAnimalsList(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [BirthYears, setBirthYears] = useState([])
  const getAnimalsBirthYear = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAnimalsBirthYear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setBirthYears(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    SortStatusType = 'DESC'
    keywordType = ''
    keyword = ''
    birthYear = localStorage.getItem('SortBirthYear')
    if (!birthYear) {
      birthYear = ''
    }
    birthMonth = ''
    FilterAnimalsList()
    getAnimalsBirthYear()
  }, [])

  let AddForm = ''
  if (ShowAddWorkers) {
    AddForm = (
      <AddAnimals
        ForID={ForID}
        setShowAddWorkers={setShowAddWorkers}
        FilterWorkersList={FilterAnimalsList}
        ResetPassword={ResetPassword}
      />
    )
  }

  const AllMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <h3 className="mb-3 mt-0">Animal List (Total: {ListData.length})</h3>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <div className="mb-lg-4 mb-4">
          <CFormInput
            type="text"
            placeholder="Search Here"
            onChange={(e) => {
              keyword = e.target.value
              FilterAnimalsList()
            }}
          />
        </div>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <div className="mb-lg-4 mb-4">
          <CFormSelect
            type="text"
            placeholder="Search Here"
            onChange={(e) => {
              keywordType = e.target.value
              FilterAnimalsList()
            }}
          >
            <option value="">Search by Any</option>
            <option value="ani_id">Animal ID</option>
            <option value="doner_id">Donar ID</option>
            <option value="doner_breed">Donor Breed</option>
            <option value="father">Father</option>
            <option value="category">Category</option>
            <option value="dob">Date of Birth</option>
            <option value="chip_no">Microchip Number</option>
            <option value="breed">Breed</option>
            <option value="sex">Gender</option>
            <option value="recipt_no">Recipient Number</option>
            <option value="move_date">Move Date</option>
          </CFormSelect>
        </div>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <div className="mb-lg-4 mb-4">
          <CFormSelect
            value={birthYear}
            onChange={(e) => {
              birthYear = e.target.value
              FilterAnimalsList()
            }}
          >
            <option value="">Sort by All Year</option>
            {BirthYears.map((S) => (
              <option key={S.birthYear} value={S.birthYear}>
                {S.birthYear}
              </option>
            ))}
          </CFormSelect>
        </div>
      </CCol>
      <CCol lg={2} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <div className="mb-lg-4 mb-4">
          <CFormSelect
            value={birthMonth}
            onChange={(e) => {
              birthMonth = e.target.value
              FilterAnimalsList()
            }}
          >
            <option value="">Sort by All Month</option>
            {AllMonths.map((v, i) => (
              <option key={i} value={i}>
                {v}
              </option>
            ))}
          </CFormSelect>
        </div>
      </CCol>
      <CCol lg={4} className="mb-lg-4 mb-4" style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CButton color="primary" className="me-1">
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
            onClick={() => {
              SortStatusType = 'DESC'
              FilterAnimalsList()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterAnimalsList()
            }}
          />
        </CButton>
        <CButton
          color="primary"
          className="me-1"
          onClick={() => {
            setForID('new')
            setResetPassword(false)
            setShowAddWorkers(true)
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
        <span className="me-1">
          <DownloadTableExcel
            filename="Animal List"
            sheet="users"
            currentTableRef={tableRef.current}
          >
            <CButton color="primary" variant="outline">
              <CIcon icon={cilSave} className="me-2" />
              Export
            </CButton>
          </DownloadTableExcel>
        </span>
        <Link to="/add-from-sheet">
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-1" />
            Import
          </CButton>
        </Link>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddWorkers ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Animal ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Microchip Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Breed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Donor ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Donor Breed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Father</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Recipient Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Move Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi) => (
                  <CTableRow key={singi[IndexTable]}>
                    {console.log(singi)}
                    <CTableDataCell>{singi.ani_id}</CTableDataCell>
                    <CTableDataCell>{singi.chip_no}</CTableDataCell>
                    <CTableDataCell>{singi.breed}</CTableDataCell>
                    <CTableDataCell>{singi.dob}</CTableDataCell>
                    <CTableDataCell>{singi.sex}</CTableDataCell>
                    <CTableDataCell>{singi.doner_id}</CTableDataCell>
                    <CTableDataCell>{singi.doner_breed}</CTableDataCell>
                    <CTableDataCell>{singi.father}</CTableDataCell>
                    <CTableDataCell>{singi.category}</CTableDataCell>
                    <CTableDataCell>{singi.recipt_no}</CTableDataCell>
                    <CTableDataCell>{singi.move_date}</CTableDataCell>
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
                                setForID(singi[IndexTable])
                                setResetPassword(false)
                                setShowAddWorkers(true)
                              }}
                            >
                              Edit
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={(e) => {
                                updateanimalsStatus(singi[IndexTable], singi.status === 1 ? 0 : 1)
                              }}
                            >
                              {singi.status === 1 ? 'De-activate' : 'Activate'}
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => {
                                deleteAnimalData(singi.ani_id, singi.auto_id)
                              }}
                            >
                              Delete
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CTable ref={tableRef} style={{ display: 'none' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Animal ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Microchip Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Breed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Donor ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Donor Breed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Father</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Recipient Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Move Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi) => (
                  <CTableRow key={singi[IndexTable]}>
                    {console.log(singi)}
                    <CTableDataCell>{singi.ani_id}</CTableDataCell>
                    <CTableDataCell>{singi.chip_no}</CTableDataCell>
                    <CTableDataCell>{singi.breed}</CTableDataCell>
                    <CTableDataCell>{singi.dob}</CTableDataCell>
                    <CTableDataCell>{singi.sex}</CTableDataCell>
                    <CTableDataCell>{singi.doner_id}</CTableDataCell>
                    <CTableDataCell>{singi.doner_breed}</CTableDataCell>
                    <CTableDataCell>{singi.father}</CTableDataCell>
                    <CTableDataCell>{singi.category}</CTableDataCell>
                    <CTableDataCell>{singi.recipt_no}</CTableDataCell>
                    <CTableDataCell>{singi.move_date}</CTableDataCell>
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

export default AnimalsList

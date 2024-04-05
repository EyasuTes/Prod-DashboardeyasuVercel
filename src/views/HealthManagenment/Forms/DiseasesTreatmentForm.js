import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { DownloadTableExcel } from 'react-export-table-to-excel'
// import axios from 'axios'
import CIcon from '@coreui/icons-react'
import {
  // cilFilter,
  // cilPencil,
  cilPlus,
  cilTrash,
  cilSave,
  cilSortDescending,
  cilSortAscending,
  cilPencil,
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
} from '@coreui/react'
import {
  NODEAPIURL,
  NodeUPLOADSsURL,
  showFulldatetimein,
  NodeUploadBasePhyPath,
} from '../../../config'
import { Link } from 'react-router-dom'
import DiseasesTreatmentImport from './DiseasesTreatmentImport'
import DataManualAdd from './DiseasesTreatmentAdd'

let SortStatusType = 'DESC'
const AnimalsList = ({ AnimalID, AllAnimalList, FromDate, ToDate }) => {
  // for Edit Form
  const [formID, setformID] = useState(0)
  const [AutoID, setAutoID] = useState(0)
  // for Edit Form
  const [isImport, setisImport] = useState(false)
  const [isAdd, setisisAdd] = useState(false)
  const tableRef = useRef(null)
  let keyword = ''
  let IndexTable = 'auto_id'
  const [ListData, setListData] = useState([])
  const [SendAllAnimalList, setSendAllAnimalList] = useState([])

  const FetchAnimalsList = async (animalID, FromDate, ToDate) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalsDiseasesTreatment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
          AnimalID: animalID,
          FromDate,
          ToDate,
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

  const deleteAnimalHealthData = async (formID, formType) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/deleteAnimalHealthData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          formID,
          formType,
          token: 'deleteAnimalHealthData',
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      FilterAnimalsList()
    } catch (err) {
      alert(err)
    }
  }

  const FilterAnimalsList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalsDiseasesTreatment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recordsPerPage: 10,
          SortStatusType,
          AnimalID,
          FromDate,
          ToDate,
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

  useEffect(() => {
    SortStatusType = 'DESC'
    FetchAnimalsList(AnimalID, FromDate, ToDate)
  }, [AnimalID, FromDate, ToDate])

  return (
    <CRow>
      <div className="mb-4 col-md-12" style={{ display: isAdd ? '' : 'none' }}>
        <DataManualAdd
          AllAnimalList={SendAllAnimalList}
          formID={formID}
          AutoID={AutoID}
          setisisAdd={setisisAdd}
          setisImport={setisImport}
          FilterAnimalsList={FilterAnimalsList}
          setformID={setformID}
          setAutoID={setAutoID}
        />
      </div>
      <div className="mb-4 col-md-12" style={{ display: isImport && !isAdd ? '' : 'none' }}>
        <DiseasesTreatmentImport setisImport={setisImport} FilterAnimalsList={FilterAnimalsList} />
      </div>
      <CCol xs={12} style={{ display: isImport ? 'none' : '' }}>
        <h4 className="mb-3 mt-3">Diseases/Treatment History</h4>
      </CCol>
      <CCol lg={7} style={{ display: isImport ? 'none' : '' }}>
        <CForm className="mb-lg-4 mb-4">
          <CFormInput
            type="text"
            placeholder="Search Here"
            style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
            onChange={(e) => {
              keyword = e.target.value
              FilterAnimalsList()
            }}
          />
        </CForm>
      </CCol>
      <CCol lg={5} className="mb-lg-4 mb-4" style={{ display: isImport ? 'none' : '' }}>
        <CButton color="primary" className="me-2">
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

        <span className="me-2">
          <DownloadTableExcel
            filename="users table"
            sheet="users"
            currentTableRef={tableRef.current}
          >
            <CButton color="danger" variant="outline">
              <CIcon icon={cilSave} className="me-2" />
              Export
            </CButton>
          </DownloadTableExcel>
        </span>
        <Link to="/add-from-sheet"></Link>
        <CButton
          color="primary"
          variant="outline"
          className="me-2"
          onClick={() => {
            setisImport(true)
          }}
        >
          <CIcon icon={cilSave} className="me-2" />
          Import
        </CButton>
        <CButton
          color="success"
          className="text-white"
          onClick={() => {
            setformID(0)
            setAutoID(0)
            document.getElementById('attachMentDT').value = ''
            setisisAdd(true)
            setisImport(true)
            let temp = AllAnimalList
            AllAnimalList &&
              AllAnimalList.length > 0 &&
              AllAnimalList.map((s, i) => {
                temp[i].status = 1
                if (document.getElementById(`dt_f_ani${s.ani_id}`)) {
                  document.getElementById(`dt_f_ani${s.ani_id}`).checked = false
                }
                return s
              })
            setSendAllAnimalList(temp)
            var inputs = document.getElementsByClassName('Addon_Fields_Inp')
            // Set the value for each input element
            for (var i = 0; i < inputs.length; i++) {
              inputs[i].value = ''
              // Replace 'New Value' with your desired value
            }
          }}
        >
          <CIcon icon={cilPlus} />
        </CButton>
      </CCol>
      <CCol xs={12} style={{ display: isImport ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Animal ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Disease</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Symptoms</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Observation Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Observation Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Treatment</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Treatment Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Treatment Date </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Treatment Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Attachment</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remark</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Added on</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Action</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi) => (
                  <CTableRow key={singi[IndexTable]}>
                    <CTableDataCell>
                      <span
                        style={{
                          display: 'block',
                          width: 'max-content',
                        }}
                        onClick={() => {
                          setformID(singi.formID)
                          setAutoID(singi.auto_id)
                          let temp = AllAnimalList
                          AllAnimalList &&
                            AllAnimalList.length > 0 &&
                            AllAnimalList.map((s, i) => {
                              temp[i].status = 1
                              if (document.getElementById(`dt_f_ani${s.ani_id}`)) {
                                document.getElementById(`dt_f_ani${s.ani_id}`).checked = false
                              }
                              return s
                            })
                          setSendAllAnimalList(temp)
                          setisisAdd(true)
                          setisImport(true)
                        }}
                      >
                        {/* {singi[IndexTable]} */}
                        &nbsp;
                        <CIcon icon={cilPencil} />
                      </span>
                      &nbsp;
                      <CIcon
                        className="text-danger"
                        icon={cilTrash}
                        onClick={() => {
                          // eslint-disable-next-line no-restricted-globals
                          if (confirm('Are you sure you want to Delete !') === true) {
                            deleteAnimalHealthData(singi.formID, 'diseasestreatments')
                          }
                        }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{singi.animalID}</CTableDataCell>
                    <CTableDataCell>{singi.disease}</CTableDataCell>
                    <CTableDataCell>{singi.symptoms}</CTableDataCell>
                    <CTableDataCell>{singi.observationDate}</CTableDataCell>
                    <CTableDataCell>{singi.observationTime}</CTableDataCell>
                    <CTableDataCell>{singi.treatment}</CTableDataCell>
                    <CTableDataCell>{singi.treatmentDescription}</CTableDataCell>
                    <CTableDataCell>{singi.treatmentDate}</CTableDataCell>
                    <CTableDataCell>{singi.treatmentTime}</CTableDataCell>
                    <CTableDataCell>
                      {singi.attachment &&
                      singi.attachment !== null &&
                      singi.attachment !== 'NA' ? (
                        <a
                          href={`${NodeUPLOADSsURL}${encodeURIComponent(
                            singi.attachment,
                          )}/${encodeURIComponent(
                            `${NodeUploadBasePhyPath}${singi.AttachmentName}`,
                          )}`}
                          download
                          target="_BLANK"
                          rel="noreferrer"
                        >
                          <i className="fa fa-eye"></i>
                          {singi.attachment}
                        </a>
                      ) : (
                        'NA'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{singi.comments}</CTableDataCell>
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

AnimalsList.propTypes = {
  AnimalID: PropTypes.any,
  FromDate: PropTypes.any,
  ToDate: PropTypes.any,
  AllAnimalList: PropTypes.any,
}
export default AnimalsList

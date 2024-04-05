import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'
// import CIcon from '@coreui/icons-react'
// import { cilFilter, cilPlus, cilSave, cilSortDescending } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  // CFormSelect,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'

const AddWorkerForm = ({ ForID, setShowAddWorkers, FilterWorkersList }) => {
  // const [List_Category, setList_Category] = useState([])
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData for_form="animal" data_id={ForID} returnData={setAddonsFieldData} />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // const [List_Donor_Breed, setList_Donor_Breed] = useState([])
  // const [List_Breed, setList_Breed] = useState([])
  // const [List_UseOn, setList_UseOn] = useState([])
  const [AjaxMsg, setAjaxMsg] = useState('')
  // let IndexTable = 'ani_id'
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [AddFormData, setAddFormData] = useState({
    auto_id: ForID === 'new' ? 0 : ForID,
    ani_id: '',
    chip_no: '',
    breed: '',
    dob: '',
    sex: 0,
    doner_id: '',
    doner_breed: '',
    father: '',
    category: '',
    recipt_no: '',
    move_date: '',
    AddonsFieldData: AddonsFieldData,
  })

  const HandleForm = (name, value) => {
    setAddFormData({ ...AddFormData, [name]: value })
  }

  const SubmitAnimalData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/addanimalsdata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(AddFormData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FilterWorkersList()
            setShowAddWorkers(false)
          }, 786)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const getAnimalsDetails = async (auto_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalsDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auto_id: auto_id,
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setAddFormData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getAnimalsMaster = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAnimalsMaster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          recordsPerPage: 10,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        // setList_Category(resJson.animal_category)
        // setList_Donor_Breed(resJson.donor_breed)
        // setList_Breed(resJson.animal_breed)
        // setList_UseOn(resJson.animal_useOn)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAnimalsMaster()
    //document.title = 'Add Worker'
    if (ForID !== 'new') {
      getAnimalsDetails(ForID)
    }
  }, [ForID])

  return (
    <CRow>
      <div style={{ display: ListAddonsFields ? '' : 'none' }}>
        <div
          className="ry_popup_bg"
          onClick={() => {
            setShowListAddonsFieldData(
              <ListAddonsFieldData
                for_form="animal"
                data_id={ForID}
                returnData={setAddonsFieldData}
              />,
            )
            setListAddonsFields(false)
          }}
        ></div>
        <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
          {ListAddonsFields ? <ListAddonsFieldPage for_form="animal" /> : ''}
        </div>
      </div>
      <CCol xs={12}>
        <h3 className="mb-3 mt-1">
          {ForID !== 'new' ? `Update Animal: ${AddFormData.ani_id}` : 'Add Animal'}

          <div
            style={{
              float: 'right',
              display: Number(localStorage.getItem('uType')) === 3 ? '' : 'none',
            }}
          >
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setListAddonsFields(true)
                setShowListAddonsFieldData('')
              }}
            >
              Add Field
            </button>
          </div>
          <div style={{ clear: 'both' }}></div>
        </h3>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm
              className="hello"
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitAnimalData(e)
              }}
            >
              <CRow>
                <CCol md={4}>
                  <div className="p-1">
                    <label>Animal ID</label>
                    <CFormInput
                      type="text"
                      required
                      name="ani_id"
                      value={AddFormData.ani_id}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Animal ID"
                      maxLength={50}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Microchip Number</label>
                    <CFormInput
                      type="text"
                      placeholder="Enter Microchip Number"
                      name="chip_no"
                      value={AddFormData.chip_no}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      maxLength={50}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Breed</label>
                    <CFormInput
                      type="text"
                      name="breed"
                      value={AddFormData.breed}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Date of Birth</label>
                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        type="text"
                        requiredry
                        name="dob"
                        value={AddFormData.dob}
                        onChange={(e) => {
                          HandleForm(e.target.name, e.target.value)
                        }}
                      />
                      <CFormInput
                        type="date"
                        style={{
                          position: 'absolute',
                          top: '5px',
                          bottom: '5px',
                          width: '44px',
                          right: '1px',
                          border: '0px',
                        }}
                        name="dob"
                        value={AddFormData.dob}
                        onChange={(e) => {
                          HandleForm(e.target.name, e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Gender</label>
                    <CFormSelect
                      name="sex"
                      value={AddFormData.sex}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </CFormSelect>
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Donor ID</label>
                    <CFormInput
                      type="text"
                      name="doner_id"
                      value={AddFormData.doner_id}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Donar ID"
                      maxLength={50}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Donor Breed</label>
                    <CFormInput
                      type="text"
                      name="doner_breed"
                      value={AddFormData.doner_breed}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Father</label>
                    <CFormInput
                      type="text"
                      name="father"
                      value={AddFormData.father}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Father"
                      maxLength={50}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Category</label>
                    <CFormInput
                      type="text"
                      requiredry
                      name="category"
                      value={AddFormData.category}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label> Recipient Number</label>
                    <CFormInput
                      type="text"
                      requiredry
                      name="recipt_no"
                      placeholder="Enter Recipient Number"
                      value={AddFormData.recipt_no}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    />
                  </div>
                </CCol>

                <CCol md={4}>
                  <div className="p-1">
                    <label>Move Date</label>
                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        type="text"
                        requiredry
                        name="move_date"
                        value={AddFormData.move_date}
                        onChange={(e) => {
                          HandleForm(e.target.name, e.target.value)
                        }}
                      />
                      <CFormInput
                        type="date"
                        style={{
                          position: 'absolute',
                          top: '5px',
                          bottom: '5px',
                          width: '44px',
                          right: '1px',
                          border: '0px',
                        }}
                        name="move_date"
                        value={AddFormData.move_date}
                        onChange={(e) => {
                          HandleForm(e.target.name, e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </CCol>
              </CRow>

              {ShowListAddonsFieldData}

              <div className="p-1 mt-2">
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CButton
                  type="submit"
                  color="primary"
                  className="mr-4"
                  style={{ marginRight: '20px' }}
                  onClick={() => {
                    HandleForm('AddonsFieldData', AddonsFieldData)
                  }}
                >
                  Save
                </CButton>
                <CButton
                  type="button"
                  color="light"
                  onClick={() => {
                    setShowAddWorkers(false)
                  }}
                >
                  Cancel
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

AddWorkerForm.propTypes = {
  ForID: PropTypes.any,
  setShowAddWorkers: PropTypes.any,
  FilterWorkersList: PropTypes.any,
}

export default AddWorkerForm

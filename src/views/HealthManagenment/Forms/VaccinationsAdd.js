import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import {
  BASEWEBURL,
  DoNodeUploadURL,
  NODEAPIURL,
  NodeUPLOADSsURL,
  NodeUploadBasePhyPath,
} from '../../../config'
// import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleBottom, cilArrowCircleRight, cilBackspace, cilSave } from '@coreui/icons'

import ListAddonsFieldPage from '../../FormFields/List'
import ListAddonsFieldData from '../../FormFields/ListData'

import HealthManageScheduling from '../../Scheduling/HealthManageScheduling'

let TempAnimalListData = []

const AddFromSheet = ({
  setisisAdd,
  setisImport,
  FilterAnimalsList,
  AllAnimalList,
  formID,
  AutoID,
  setformID,
  setAutoID,
}) => {
  // for the scheduling
  const [ShowScheduling, setShowScheduling] = useState(false)
  const [NotificationData, setNotificationData] = useState({})
  // for the scheduling

  const [AnimalSelected, setAnimalSelected] = useState(false)
  // for the Addons Fields
  const [ForID] = useState(0)
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData for_form="animalVacci" data_id={ForID} returnData={setAddonsFieldData} />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // for the Addons Fields
  const [IsLoader, setIsLoader] = useState('none')
  const [Msg, setMsg] = useState('')
  const [AssignedMax, setAssignedMax] = useState(false)
  const [SearchAnimals, SetSearchAnimals] = useState('')
  const [AnimalListData, setAnimalListData] = useState([])
  const HandleAnimalList = (index, name, value) => {
    TempAnimalListData[index][name] = value
    setAnimalListData(TempAnimalListData)
  }
  const [FormsData, setFormData] = useState({
    formID,
    animalIDs: AnimalListData,
    AddonsFieldData: AddonsFieldData,
    SelectAll: 0,
  })
  const HandleFormData = (name, value) => {
    setFormData({ ...FormsData, [name]: value })
  }

  // for the Attachment will be here
  const [showLoader, setshowLoader] = useState('none')
  const uploadAttachment = async (e, file, fileName) => {
    e.preventDefault()
    setshowLoader('block')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      }
      const res = await fetch(DoNodeUploadURL, requestOptions)
      const resJson = await res.json()
      setshowLoader('none')
      if (res.status === 200) {
        if (resJson.status === 1) {
          HandleFormData('attachment', { title: fileName, url: resJson.data.name })
        } else {
          alert(resJson.message)
        }
      } else {
        console.log(resJson.message)
        setshowLoader('none')
      }
    } catch (err) {
      setshowLoader('none')
      console.log(err)
    }
  }
  // for the Attachment Will be here

  // AddAnimalsVaccinations will be here
  const AddAnimalsVaccinations = async (e) => {
    e.preventDefault()
    if (AnimalSelected) {
      setIsLoader('block')
      let theSendData = {}
      theSendData = FormsData
      theSendData.NotificationData = NotificationData
      try {
        var requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(theSendData),
        }
        const res = await fetch(`${NODEAPIURL}/admin/AddAnimalsVaccinations`, requestOptions)
        const resJson = await res.json()
        setIsLoader('none')
        if (res.status === 200) {
          // console.log(resJson)
          setMsg(resJson.message)
          if (resJson.status === 1) {
            setFormData({
              type: '',
              dose: '',
              onDate: '',
              onTime: '',
              remark: '',
              animalIDs: AnimalListData,
              attachment: '',
            })
            setisisAdd(false)
            setisImport(false)
            FilterAnimalsList()
            setMsg('')
          }
        } else {
          setMsg(resJson.message)
          setIsLoader('none')
        }
      } catch (err) {
        setIsLoader('none')
        console.log(err)
      }
    } else {
      setMsg('Please select atleast one Animal to Continue.')
    }
    setTimeout(() => {
      setMsg('')
    }, 5000)
    return false
  }
  // AddAnimalsVaccinations will be here

  // get for the Edit Data
  const GetAnimalHealthData = async (formID, AutoID, AllAnim) => {
    setIsLoader('block')
    setMsg('Getting Data...')
    try {
      var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formID, AutoID, formType: 'vaccinations' }),
      }
      const res = await fetch(`${NODEAPIURL}/admin/GetAnimalHealthData`, requestOptions)
      const resJson = await res.json()
      setMsg('')
      setIsLoader('none')
      if (res.status === 200 && resJson.FormData && resJson.FormData.length > 0) {
        setFormData(resJson.FormData[0])
        console.log(resJson.AnimalIDs)
        if (resJson.AnimalIDs && resJson.AnimalIDs.length > 0) {
          const TempAnimalListData = AllAnim
          TempAnimalListData.map((s1, i) => {
            TempAnimalListData[i].status = 1
            resJson.AnimalIDs.map((s2) => {
              if (s2.animalID === s1.ani_id) {
                TempAnimalListData[i].status = 2
                setAnimalSelected(true)
              }
              return ''
            })
            return ''
          })
          console.log(TempAnimalListData)
          setAnimalListData(TempAnimalListData)
        }
      } else {
        setFormData({
          type: '',
          dose: '',
          onDate: '',
          onTime: '',
          remark: '',
          animalIDs: [],
          attachment: '',
        })
      }
    } catch (err) {
      setMsg(err.message)
    }
    return false
  }
  // get for the Edit Data
  useEffect(() => {
    setShowScheduling(false)
    TempAnimalListData = AllAnimalList
    setAnimalListData(TempAnimalListData)
    if (AutoID && Number(AutoID) !== 0 && Number(AutoID) !== '' && Number(AutoID) !== '0') {
      GetAnimalHealthData(formID, AutoID, AllAnimalList)
    } else {
      setFormData({
        type: '',
        dose: '',
        onDate: '',
        onTime: '',
        remark: '',
        animalIDs: [],
        attachment: '',
      })
    }
  }, [AllAnimalList, formID, AutoID])

  return (
    <CRow>
      <div style={{ display: ListAddonsFields ? '' : 'none' }}>
        <div
          className="ry_popup_bg"
          onClick={() => {
            setShowListAddonsFieldData(
              <ListAddonsFieldData
                for_form="animalVacci"
                data_id={ForID}
                returnData={setAddonsFieldData}
              />,
            )
            setListAddonsFields(false)
          }}
        ></div>
        <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
          {ListAddonsFields ? <ListAddonsFieldPage for_form="animalVacci" /> : ''}
        </div>
      </div>
      <CCol lg={12}>
        <CCard className="mb-4 p-1">
          <CCardBody>
            <CRow className="mb-4">
              <CCol lg={12}>
                <h6 className="text-success">
                  Add Vaccinations
                  <div
                    style={{
                      float: 'right',
                      display: Number(localStorage.getItem('uType')) === 3 ? '' : 'none',
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setListAddonsFields(true)
                        setShowListAddonsFieldData('')
                      }}
                    >
                      Add Field
                    </button>
                  </div>
                  <div style={{ clear: 'both' }}></div>
                </h6>
                <form
                  className=""
                  id="create-vaccination-form"
                  onSubmit={(e) => {
                    return AddAnimalsVaccinations(e)
                  }}
                  encType="multipart/form-data"
                >
                  <CCol md={12} className="mb-3">
                    <h5
                      style={{
                        padding: '5px 10px',
                        background: '#f5f5f5',
                        marginBottom: '0px',
                      }}
                    >
                      <span
                        onClick={() => {
                          setAssignedMax(!AssignedMax)
                        }}
                      >
                        Select Animals
                      </span>
                      <input
                        type="text"
                        placeholder="Search Animals"
                        onChange={(e) => {
                          SetSearchAnimals(e.target.value)
                        }}
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          height: '20px',
                          fontSize: '12px',
                        }}
                      />
                      <div style={{ display: 'inline-block' }}>
                        <CFormCheck
                          id="SelectAllCB"
                          label="Select All"
                          checked={FormsData.SelectAll === 1 ? true : false}
                          onChange={(e) => {
                            let statusValue = 1
                            if (e.target.checked) {
                              HandleFormData('SelectAll', 1)
                              setAnimalSelected(true)
                              statusValue = 2
                            } else {
                              HandleFormData('SelectAll', 0)
                              setAnimalSelected(false)
                            }
                            let temp = AllAnimalList
                            AllAnimalList &&
                              AllAnimalList.length > 0 &&
                              AllAnimalList.map((s, i) => {
                                temp[i].status = statusValue
                                if (document.getElementById(`vf_ani_${s.ani_id}`)) {
                                  document.getElementById(`vf_ani_${s.ani_id}`).checked =
                                    e.target.checked
                                }
                                return s
                              })
                          }}
                        />
                      </div>
                      <div style={{ float: 'right' }}>
                        <CIcon
                          onClick={() => {
                            setAssignedMax(!AssignedMax)
                          }}
                          icon={AssignedMax ? cilArrowCircleBottom : cilArrowCircleRight}
                          style={{
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </h5>
                    <div
                      style={{
                        maxHeight: AssignedMax ? '' : '90px',
                        padding: '10px',
                        overflowX: 'hidden',
                        overflowy: 'auto',
                        border: '1px solid #f5f5f5',
                      }}
                    >
                      <CRow>
                        {AllAnimalList && AllAnimalList.length > 0 ? (
                          <>
                            {AllAnimalList.sort((a, b) => b.status - a.status).map(
                              (user, index) => (
                                <CCol
                                  lg={6}
                                  key={user.auto_id}
                                  style={{
                                    display:
                                      SearchAnimals !== ''
                                        ? (user.ani_id &&
                                            user.ani_id
                                              .toLowerCase()
                                              .includes(SearchAnimals.toLowerCase())) ||
                                          (user.chip_no &&
                                            user.chip_no
                                              .toLowerCase()
                                              .includes(SearchAnimals.toLowerCase())) ||
                                          (user.recipt_no &&
                                            user.recipt_no
                                              .toLowerCase()
                                              .includes(SearchAnimals.toLowerCase()))
                                          ? ''
                                          : 'none'
                                        : '',
                                  }}
                                >
                                  {/* {user.status} */}
                                  {console.log(user)}
                                  <CFormCheck
                                    checked={user.status === 2 ? true : false}
                                    name="empID"
                                    id={`vf_ani_${user.ani_id}`}
                                    label={`${user.ani_id} (Chip No. ${user.chip_no})`}
                                    onChange={(e) => {
                                      FormsData.SelectAll = 0
                                      HandleFormData('SelectAll', 0)
                                      if (e.target.checked) {
                                        setAnimalSelected(true)
                                        HandleAnimalList(index, 'status', 2)
                                      } else {
                                        HandleAnimalList(index, 'status', 0)
                                      }
                                      setTimeout(() => {
                                        setAnimalListData(TempAnimalListData)
                                      }, 1786)
                                    }}
                                  />
                                </CCol>
                              ),
                            )}
                          </>
                        ) : (
                          ''
                        )}
                      </CRow>
                    </div>
                  </CCol>

                  <CRow className="mb-4">
                    <CCol lg={6}>
                      <CFormSelect
                        type="text"
                        name="type"
                        value={FormsData.type}
                        onChange={(e) => {
                          setShowScheduling(false)
                          HandleFormData(e.target.name, e.target.value)
                        }}
                        label="Vaccine Name"
                      >
                        <option value="">Select Vaccination</option>
                        {FormsData.type !== '' ? (
                          <option value={FormsData.type}>{FormsData.type}</option>
                        ) : (
                          ''
                        )}
                        <option value="Clostridia and Pasteurella Vaccines">
                          Clostridia and Pasteurella Vaccines
                        </option>
                        <option value="Anti-trypanosomiasis">Anti-trypanosomiasis</option>
                        <option value="Deworming">Deworming</option>
                        <option value="External parasites control /Spraying">
                          External parasites control /Spraying
                        </option>
                        <option value="Vitamins and mineralsupplementations">
                          Vitamins and mineralsupplementations
                        </option>
                        <option value="Camel pox vaccine">Camel pox vaccine</option>
                      </CFormSelect>
                    </CCol>
                    <CCol lg={6}>
                      <CFormInput
                        name="dose"
                        placeholder="i.e. 2ml or Half a vial"
                        value={FormsData.dose}
                        onChange={(e) => {
                          HandleFormData(e.target.name, e.target.value)
                        }}
                        label="Dose"
                      />
                      {/* <option value="">Select Dose</option>
                        {FormsData.dose !== '' ? (
                          <option value={FormsData.dose}>{FormsData.dose}</option>
                        ) : (
                          ''
                        )}
                        <option value="2 ccsubcut (S/C)">2 ccsubcut (S/C)</option>
                        <option value="Half a vial (S/C)">Half a vial (S/C)</option>
                        <option value="1 ccevery 25 Kg BW">1 ccevery 25 Kg BW</option>
                        <option value="as recommended by the manufacturer">
                          as recommended by the manufacturer
                        </option>
                        <option value="1 ccS/C">1 ccS/C</option>
                      </CFormSelect> */}
                    </CCol>
                  </CRow>

                  <CRow className="mb-4">
                    <CCol lg={6}>
                      <CFormInput
                        type="date"
                        name="onDate"
                        value={FormsData.onDate}
                        onChange={(e) => {
                          HandleFormData(e.target.name, e.target.value)
                        }}
                        label="Vaccine Date"
                      />
                    </CCol>
                    <CCol lg={6}>
                      <CFormInput
                        type="time"
                        name="onTime"
                        value={FormsData.onTime}
                        onChange={(e) => {
                          HandleFormData(e.target.name, e.target.value)
                        }}
                        label="Vaccine Time"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-4">
                    <CCol md={6}>
                      <label className="form-label">Attachment</label>
                      <input
                        id="attachMentVF"
                        type="file"
                        className="form-control"
                        style={{ lineHeight: '18px' }}
                        onChange={(e) => {
                          uploadAttachment(e, e.target.files[0], e.target.files[0].name)
                        }}
                      />
                      {FormsData.attachment &&
                      FormsData.AttachmentName &&
                      FormsData.AttachmentName !== null &&
                      FormsData.attachment !== null &&
                      FormsData.attachment !== 'NA' ? (
                        <a
                          href={`${NodeUPLOADSsURL}${encodeURIComponent(
                            FormsData.attachment,
                          )}/${encodeURIComponent(
                            `${NodeUploadBasePhyPath}${FormsData.AttachmentName}`,
                          )}`}
                          download
                          target="_BLANK"
                          rel="noreferrer"
                        >
                          <i className="fa fa-eye"></i>
                          {FormsData.attachment}
                        </a>
                      ) : (
                        ''
                      )}
                      <center style={{ display: showLoader }}>
                        <img
                          alt="Loader"
                          style={{ maxWidth: '32px', margin: '10px' }}
                          src={`${BASEWEBURL}/loader.gif`}
                        />
                      </center>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        name="remark"
                        value={FormsData.remark}
                        onChange={(e) => {
                          HandleFormData(e.target.name, e.target.value)
                        }}
                        label="Any Remark"
                      />
                    </CCol>
                  </CRow>
                  <div>
                    <CFormCheck
                      id="createScheduling"
                      checked={ShowScheduling}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setShowScheduling(true)
                        } else {
                          setShowScheduling(false)
                        }
                      }}
                      label="Schedule Notification"
                    />
                    {ShowScheduling ? (
                      <>
                        <HealthManageScheduling
                          setNotificationData={setNotificationData}
                          formID={formID}
                          description={FormsData.type}
                        />
                      </>
                    ) : (
                      ''
                    )}
                  </div>

                  <div
                    onMouseLeave={() => {
                      HandleFormData('AddonsFieldData', AddonsFieldData)
                      console.log(AddonsFieldData)
                    }}
                  >
                    {ShowListAddonsFieldData}
                  </div>
                  <div className="form-group mt-3 text-center">
                    <img
                      src={`${BASEWEBURL}/loader.gif`}
                      alt=""
                      style={{
                        maxWidth: '32px',
                        display: IsLoader,
                        margin: '10px auto',
                      }}
                    />
                    <div className="m-2 text-left">{Msg}</div>
                    <div>
                      <CButton
                        color="primary"
                        type="submit"
                        className="me-2"
                        onClick={() => {
                          HandleFormData('animalIDs', AnimalListData)
                        }}
                      >
                        <CIcon icon={cilSave} className="me-1" />
                        Submit
                      </CButton>
                      <CButton
                        type="button"
                        color="danger"
                        variant="outline"
                        onClick={() => {
                          setisisAdd(false)
                          setisImport(false)
                          FilterAnimalsList()
                          setformID(0)
                          setAutoID(0)
                        }}
                      >
                        <CIcon icon={cilBackspace} className="me-1" />
                        Back to List
                      </CButton>
                    </div>
                  </div>
                </form>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

AddFromSheet.propTypes = {
  setisisAdd: PropTypes.any,
  setisImport: PropTypes.any,
  FilterAnimalsList: PropTypes.any,
  AllAnimalList: PropTypes.any,
  formID: PropTypes.any,
  AutoID: PropTypes.any,
  setformID: PropTypes.any,
  setAutoID: PropTypes.any,
}

export default AddFromSheet

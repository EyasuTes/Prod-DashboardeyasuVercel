import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleBottom,
  cilArrowCircleRight,
  cilCloudDownload,
  cilDelete,
  cilPencil,
  cilPlus,
} from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CForm,
  CFormCheck,
} from '@coreui/react'
import { BASEWEBURL, DoUploadURL, NODEAPIURL, showFulldatetimein, UPLOADSsURL } from '../../config'
import loader from '../../assets/images/loader.gif'
// for Addon Fields
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'
// for Addon Fields

let TempAnimalListData = []
// let SortStatusType = 'ASC'
let Attachments = []
let AttachmentIndex = 0
const UploadActivity = ({ ForActId, setShowUploadActivity, FilterListData }) => {
  const [AnimalAdded, setAnimalAdded] = useState(1)
  const [isAction, setisAction] = useState(false)
  // for edit Notes
  const [EditNoteForm, setEditNoteForm] = useState(false)
  const [createdAtNote, setcreatedAtNote] = useState(0)
  const [EditNote, setEditNote] = useState('')
  // for edit Notes
  // for Addon Fields
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData
      for_form="aniActivities"
      data_id={ForActId}
      returnData={setAddonsFieldData}
    />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // for Addon Fields
  const [AssignedMax, setAssignedMax] = useState(false)
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [SearchEmployee, SetSearchEmployee] = useState('')
  const [NoteAttachment, setNoteAttachment] = useState('')
  const [NoteAttachmentName, setNoteAttachmentName] = useState('')
  const [showNoteLoader, setshowNoteLoader] = useState('none')
  const [NewNote, setNewNote] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [AnimalListData, setAnimalListData] = useState([])
  const HandleListUsers = (index, name, value) => {
    TempAnimalListData[index][name] = value
    setAnimalListData(TempAnimalListData)
  }

  const FetchWorkersList = async (ForActId) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/getAnimals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          action: 'AssingedActivity',
          ani_act_id: ForActId,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        if (resJson.AnimalsList && resJson.AnimalsList.length > 0) {
          TempAnimalListData = resJson.AnimalsList
          setAnimalListData(resJson.AnimalsList)
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [ActivityWorkers, setActivityWorkers] = useState({
    AnimalListData,
    act_id: ForActId,
    subject: '',
    description: '',
    startDate: '',
    startTime: '',
    endTime: '',
    endDate: '',
    veryUrgent: 0,
    assignedTo: 0,
    solution: '',
    status: 1,
    highlight: 0,
    emp_id: 0,
    AddonsFieldData,
    Walking: 0,
    Jogging: 0,
    HighIntensity: 0,
    device: localStorage.getItem('DeviceDetails'),
  })

  const HandleFormData = (e) => {
    setisAction(true)
    setActivityWorkers({ ...ActivityWorkers, [e.target.name]: e.target.value })
  }

  const HandleFormData2 = (name, value) => {
    setActivityWorkers({ ...ActivityWorkers, [name]: value })
  }

  const SubmitNewNote = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/addNewNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ani_act_id: ForActId,
          note: NewNote,
          attachment: NoteAttachment,
          attachmentName: NoteAttachmentName,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          setNewNote('')
          FetchActivityDetail(ForActId)
        }
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const EditNewNote = async (e) => {
    // e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/editNewNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ani_act_id: ForActId,
          note: EditNote,
          createdAt: createdAtNote,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          FetchActivityDetail(ForActId)
        }
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }
  const deleteFileAttachment = async (fileURL) => {
    // e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/activity/deleteFileAttachment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          act_id: ForActId,
          deletefile: fileURL,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        FetchActivityDetail(ForActId)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const SubmitWorkersData = async (e) => {
    e.preventDefault()
    let isAllGood = 1
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    if (isAllGood === 1) {
      SubmitWorkersActivity(e)
    }
  }
  const SubmitWorkersActivity = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/addActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ActivityWorkers),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            window.location.href = `${BASEWEBURL}/#/animals-activities`
            FilterListData()
            setShowUploadActivity(false)
          }, 300)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const FetchActivityDetail = async (ani_act_id) => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/animal/getDetailData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ani_act_id,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          if (resJson.data) {
            setActivityWorkers(resJson.data)
          }
          if (resJson.data && resJson.data.attachments && resJson.data.attachments.length > 0) {
            Attachments = resJson.data.attachments
          }
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const uploadAttachment = async (e, file, fileName) => {
    e.preventDefault()
    AttachmentIndex++
    setshowNoteLoader('block')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      }
      const res = await fetch(DoUploadURL, requestOptions)
      const resJson = await res.json()
      setshowNoteLoader('none')
      if (res.status === 200) {
        if (resJson.status === 1) {
          Attachments.push({
            title: fileName,
            url: resJson.data.name,
            createdAt: 0,
            index: AttachmentIndex,
          })
          setActivityWorkers({ ...ActivityWorkers, attachment: Attachments })
        } else {
          alert(resJson.message)
        }
        console.log(resJson.message)
      } else {
        console.log(resJson.message)
        setshowNoteLoader('none')
      }
    } catch (err) {
      setshowNoteLoader('none')
      console.log(err)
    }
  }

  const uploadNoteAttachment = async (e, file, fileName) => {
    e.preventDefault()
    AttachmentIndex++
    setshowNoteLoader('block')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      }
      const res = await fetch(DoUploadURL, requestOptions)
      const resJson = await res.json()
      setshowNoteLoader('none')
      if (res.status === 200) {
        if (resJson.status === 1) {
          setNoteAttachment(resJson.data.name)
          setNoteAttachmentName(resJson.data.realname)
        } else {
          alert(resJson.message)
        }
        console.log(resJson.message)
      } else {
        console.log(resJson.message)
        setshowNoteLoader('none')
      }
    } catch (err) {
      setshowNoteLoader('none')
      console.log(err)
    }
  }

  useEffect(() => {
    localStorage.setItem('notipage', '')
    localStorage.setItem('notipagevalue', '')
    Attachments = []
    AttachmentIndex = 0
    // SortStatusType = 'ASC'
    FetchWorkersList(ForActId)
    if (ForActId !== '' && ForActId !== '0' && ForActId !== 0) {
      FetchActivityDetail(ForActId)
    }
  }, [ForActId])

  return (
    <>
      <CRow>
        {/* for Addon Fields */}
        <div style={{ display: ListAddonsFields ? '' : 'none' }}>
          <div
            className="ry_popup_bg"
            onClick={() => {
              setListAddonsFields(false)
              setShowListAddonsFieldData(
                <ListAddonsFieldData
                  for_form="aniActivities"
                  data_id={ForActId}
                  returnData={setAddonsFieldData}
                />,
              )
            }}
          ></div>
          <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
            {ListAddonsFields ? <ListAddonsFieldPage for_form="aniActivities" /> : ''}
          </div>
        </div>
        {/* for Addon Fields */}
        {/* for Edit Notes */}
        <div style={{ display: EditNoteForm ? '' : 'none' }}>
          <div
            className="ry_popup_bg"
            onClick={() => {
              setEditNoteForm(false)
            }}
          ></div>
          <div className="ry_popup_content" style={{ maxWidth: '50%', maxHeight: '50%' }}>
            <div className="p-4">
              <div className="form-group">
                <label>Edit Note on Acticity #{ForActId}</label>
                <input
                  type="text"
                  required
                  placeholder="Edit Note"
                  className="form-control"
                  value={EditNote}
                  onChange={(e) => {
                    setEditNote(e.target.value)
                  }}
                />
              </div>
              <div className="form-group mt-3">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={(e) => {
                    if (EditNote === '') {
                      alert('Please Enter the Updated Note.')
                    } else {
                      EditNewNote()
                      setEditNoteForm(false)
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* for Edit Notes */}
        <CCol lg={12}>
          <h6
            style={{ lineHeight: '25px' }}
            className={
              ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0
                ? 'mb-0 mt-1 text-danger'
                : 'mb-0 mt-1 text-info'
            }
          >
            {ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0
              ? `Update #${ForActId} `
              : 'Create '}
            Animal Activity
            <div
              style={{
                float: 'right',
                display: Number(localStorage.getItem('uType')) === 3 ? '' : 'none',
              }}
            >
              <button
                type="button"
                className="btn p-1 mb-2 btn-sm btn-outline-primary"
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
        </CCol>
        <CCol lg={6} className="mb-4 d-none text-lg-end">
          <CButton color="primary" className="me-3">
            <CIcon icon={cilPlus} />
          </CButton>
          Add Field
        </CCol>
      </CRow>
      <CRow>
        <CCol md={ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0 ? 8 : 12}>
          <CCard className="mb-4 p-1">
            <CCardBody>
              <CForm
                className="hello"
                autoComplete="off"
                autofill="off"
                onSubmit={(e) => {
                  if (
                    Number(ActivityWorkers.Walking) === 0 &&
                    Number(ActivityWorkers.Jogging) === 0 &&
                    Number(ActivityWorkers.HighIntensity) === 0
                  ) {
                    e.preventDefault()
                    setAjaxMsg('Please Select Atleast One Activity Type')
                  } else {
                    SubmitWorkersData(e)
                  }
                }}
              >
                <CRow>
                  <CCol className="mt-2" md={6}>
                    <div className="d-flex">
                      <div className="me-2">
                        <CFormCheck
                          name="types[]"
                          id="typeWalking"
                          label="Walking"
                          checked={Number(ActivityWorkers.Walking) === 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              HandleFormData2('Walking', 1)
                            } else {
                              HandleFormData2('Walking', 0)
                            }
                          }}
                        />
                      </div>
                      <div className="me-2">
                        <CFormCheck
                          name="types[]"
                          id="typeJogging"
                          label="Jogging"
                          checked={Number(ActivityWorkers.Jogging) === 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              HandleFormData2('Jogging', 1)
                            } else {
                              HandleFormData2('Jogging', 0)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <CFormCheck
                          name="types[]"
                          id="typeHighIntensity"
                          label="High Intensity"
                          checked={Number(ActivityWorkers.HighIntensity) === 1}
                          value={ActivityWorkers.HighIntensity}
                          onChange={(e) => {
                            if (e.target.checked) {
                              HandleFormData2('HighIntensity', 1)
                            } else {
                              HandleFormData2('HighIntensity', 0)
                            }
                          }}
                        />
                      </div>
                    </div>
                    <CRow className="d-none">
                      <CCol md={12}>
                        <CFormSelect
                          label="Type"
                          name="type"
                          value={ActivityWorkers.type}
                          placeholder=""
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="0">Select</option>
                          {ActivityWorkers.type &&
                          ActivityWorkers.type !== 'Walking' &&
                          ActivityWorkers.type !== 'Jogging' &&
                          ActivityWorkers.type !== 'High-Intensity' ? (
                            <>
                              <option value={ActivityWorkers.type}>{ActivityWorkers.type}</option>
                            </>
                          ) : (
                            ''
                          )}
                          <option value="Walking">Walking</option>
                          <option value="Jogging">Jogging</option>
                          <option value="High-Intensity">High-Intensity</option>
                          <option value="Other">Other</option>
                        </CFormSelect>
                        <CFormInput
                          className="mt-2"
                          placeholder="Enter Other Type"
                          type="text"
                          maxLength={80}
                          style={{
                            display: ActivityWorkers.type === 'Other' ? '' : 'none',
                          }}
                          value={ActivityWorkers.otherType}
                          name="otherType"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol md={12}>
                        <CFormTextarea
                          required
                          rows={5}
                          label="Comment"
                          name="comment"
                          value={ActivityWorkers.comment}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        ></CFormTextarea>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow>
                      <CCol lg={6} className="mt-2">
                        <CFormInput
                          type="text"
                          label="Distance"
                          name="distance"
                          value={ActivityWorkers.distance}
                          placeholder=""
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        />
                      </CCol>
                      <CCol lg={6} className="mt-2">
                        <CFormSelect
                          defaultValue={0}
                          label="Distance Unit"
                          title="Distance Unit"
                          name="distanceIN"
                          value={ActivityWorkers.distanceIN}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="KM">KM</option>
                          <option value="Mt">Mt.</option>
                        </CFormSelect>
                      </CCol>
                      <CCol className="mt-2" md={6} title={ActivityWorkers.startDate}>
                        <CFormInput
                          type="date"
                          label="Start Date"
                          value={ActivityWorkers.startDate}
                          name="startDate"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                      </CCol>
                      <CCol
                        className="mt-2"
                        md={6}
                        title={ActivityWorkers.endDate !== 'null' ? ActivityWorkers.endDate : ''}
                      >
                        <CFormInput
                          type="date"
                          min={ActivityWorkers.startDate}
                          label="End Date"
                          value={ActivityWorkers.endDate}
                          name="endDate"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                      </CCol>

                      <CCol md={6} className="mt-2" title={ActivityWorkers.startTime}>
                        <CFormInput
                          type="time"
                          label="Start Time"
                          value={ActivityWorkers.startTime}
                          name="startTime"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                      </CCol>
                      <CCol
                        md={6}
                        className="mt-2"
                        title={ActivityWorkers.endDate !== 'null' ? ActivityWorkers.endDate : ''}
                      >
                        <CFormInput
                          type="time"
                          min={ActivityWorkers.endTime}
                          label="End Time"
                          value={ActivityWorkers.endTime}
                          name="endTime"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol lg={12}>
                        <label className="form-label">Attachment</label>
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Enter"
                          style={{ lineHeight: '18px' }}
                          onChange={(e) => {
                            uploadAttachment(e, e.target.files[0], e.target.files[0].name)
                          }}
                        />
                        {Attachments.map((newAttch, index) => (
                          <div
                            key={newAttch.url}
                            style={{
                              display: newAttch.createdAt === 0 ? '' : 'none',
                            }}
                          >
                            {newAttch.title}
                            <div
                              style={{ float: 'right' }}
                              onClick={(e) => {
                                Attachments.splice(index, 1)
                                setActivityWorkers({ ...ActivityWorkers, attachment: Attachments })
                              }}
                            >
                              X
                            </div>
                            <div style={{ clear: 'both' }}></div>
                          </div>
                        ))}
                        <center style={{ display: showNoteLoader }}>
                          <img
                            alt="Loader"
                            style={{ maxWidth: '32px', margin: '10px' }}
                            src={loader}
                          />
                        </center>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol
                    md={12}
                    className="mb-3"
                    onMouseLeave={() => {
                      HandleFormData2('AddonsFieldData', AddonsFieldData)
                    }}
                    style={{
                      borderTop: '1px solid #f5f5f5',
                      borderBottom: '1px solid #f5f5f5',
                      paddingBottom: '20px',
                    }}
                  >
                    {ShowListAddonsFieldData}
                  </CCol>
                  <CCol md={12} className="mb-3">
                    <h5
                      style={{
                        padding: '5px 10px',
                        background: '#f5f5f5',
                        marginBottom: '0px',
                      }}
                    >
                      <input
                        type="checkbox"
                        id="SelectAllEpp"
                        label="Select All"
                        onClick={(e) => {
                          const updatedArray = AnimalListData.map((item) => ({
                            ...item,
                            status: e.target.checked ? 2 : 1,
                          }))
                          // Update the state with the new array
                          setAnimalListData(updatedArray)
                          HandleFormData2('AnimalListData', updatedArray)
                          TempAnimalListData = updatedArray
                          AnimalListData.map((s) => {
                            const c = document.getElementById(`AnimalIDAct${s.auto_id}`)
                            if (c) {
                              c.checked = e.target.value
                            }
                            return ''
                          })
                          setAnimalAdded(AnimalAdded + 1)
                        }}
                      />
                      <span
                        onClick={() => {
                          setAssignedMax(!AssignedMax)
                        }}
                      >
                        &nbsp;Assign To
                      </span>
                      <input
                        type="text"
                        placeholder="Search Animals"
                        onChange={(e) => {
                          setAssignedMax(true)
                          SetSearchEmployee(e.target.value)
                        }}
                        style={{
                          marginLeft: '10px',
                          height: '20px',
                          fontSize: '12px',
                        }}
                      />
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
                        {AnimalListData.sort((a, b) => b.status - a.status).map((user, index) => (
                          <CCol
                            lg={12}
                            key={user.auto_id}
                            style={{
                              cursor: 'pointer',
                              display:
                                SearchEmployee !== ''
                                  ? user.ani_id
                                      .toLowerCase()
                                      .includes(SearchEmployee.toLowerCase()) ||
                                    user.chip_no
                                      .toLowerCase()
                                      .includes(SearchEmployee.toLowerCase()) ||
                                    user.sex.toLowerCase().includes(SearchEmployee.toLowerCase())
                                    ? ''
                                    : 'none'
                                  : '',
                            }}
                          >
                            <div>
                              {AnimalAdded ? (
                                <CFormCheck
                                  id={`AnimalIDAct${user.auto_id}`}
                                  checked={Number(user.status) === 2 ? true : false}
                                  onChange={(e) => {
                                    setisAction(true)
                                    setAnimalAdded(AnimalAdded + 1)
                                    if (e.target.checked) {
                                      HandleListUsers(index, 'status', 2)
                                    } else {
                                      HandleListUsers(index, 'status', 1)
                                    }
                                  }}
                                  label={`${user.ani_id} Chip: ${user.chip_no} (${user.sex})`}
                                />
                              ) : (
                                <span>{AnimalAdded}</span>
                              )}
                            </div>
                            <div style={{ clear: 'both' }}></div>
                          </CCol>
                        ))}
                      </CRow>
                    </div>
                  </CCol>
                  <CCol lg={12}>
                    <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                      {AjaxMsg}
                    </div>
                    <CButton
                      type="submit"
                      color="primary"
                      className="me-3 px-4"
                      onClick={() => {
                        setisAction(true)
                        HandleFormData2('AnimalListData', AnimalListData)
                      }}
                    >
                      Save
                    </CButton>
                    {/* {isAction ? 'yes' : 'no'} */}
                    <CButton
                      type="button"
                      color="light"
                      onClick={() => {
                        if (
                          isAction &&
                          window.confirm(
                            'Do you really want to leave? The Activity Will not be saved.',
                          )
                        ) {
                          window.location.href = `${BASEWEBURL}/#/animals-activities`
                          setShowUploadActivity(false)
                        } else {
                          window.location.href = `${BASEWEBURL}/#/animals-activities`
                          setShowUploadActivity(false)
                        }
                      }}
                    >
                      Back to Activity List
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
            className="mb-1 p-1"
            style={{
              display:
                ActivityWorkers.attachments && ActivityWorkers.attachments.length > 0 ? '' : 'none',
            }}
          >
            <CCardBody>
              <h4>Attachments</h4>
              <div
                style={{
                  overflow: 'auto',
                  maxHeight: '650px',
                }}
              >
                {ActivityWorkers.attachments &&
                  ActivityWorkers.attachments.map((snote) => (
                    <div
                      key={snote.url}
                      style={{
                        display: snote.createdAt === 0 ? 'none' : '',
                      }}
                    >
                      <hr />
                      <b style={{ display: 'block' }}>
                        {snote.f_name} {snote.l_name}
                        <div style={{ float: 'right' }}>{showFulldatetimein(snote.createdAt)}</div>
                        <div style={{ clear: 'both' }}></div>
                      </b>
                      <div style={{ display: snote.url.trim() === '' ? 'none' : '' }}>
                        <a
                          href={`${UPLOADSsURL}${snote.url}`}
                          target="_blank"
                          rel="noreferrer"
                          title={snote.title}
                        >
                          <small>{snote.title} </small>
                          <CIcon icon={cilCloudDownload} />
                        </a>
                        <CIcon
                          icon={cilDelete}
                          className={
                            Number(localStorage.getItem('emp_id')) === Number(snote.emp_id)
                              ? 'text-danger'
                              : 'd-none'
                          }
                          style={{ marginLeft: '5px' }}
                          title="Delete Attachment"
                          onClick={() => {
                            if (window.confirm('Do you really want to Delete the Attachemnt ?')) {
                              deleteFileAttachment(snote.url)
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol
          md={4}
          className="mb-4"
          style={{
            display:
              ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0 ? '' : 'none',
          }}
        >
          <CCard className="mb-4 p-1">
            <CCardBody>
              <h4>Notes</h4>
              <div
                style={{
                  overflow: 'auto',
                  maxHeight: '400px',
                }}
              >
                {ActivityWorkers.notes &&
                  ActivityWorkers.notes.map((snote) => (
                    <div key={snote.createdAt}>
                      <hr />
                      <b style={{ display: 'block' }}>
                        {snote.f_name} {snote.l_name}
                        <div style={{ float: 'right' }}>{showFulldatetimein(snote.createdAt)}</div>
                        <div style={{ clear: 'both' }}></div>
                      </b>
                      <p>{snote.note}</p>
                      <p>{console.log(snote.note)}</p>
                      {/* {snote.note2 instanceof Blob
                        ? 'yes ashgf jsdgj sdg sdgdsg'
                        : 'no sdg sdgdsg sdfg safsd safgsd325'} */}
                      <div style={{ display: snote.attachment.trim() === '' ? 'none' : '' }}>
                        <a
                          href={`${UPLOADSsURL}${snote.attachment}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <small>
                            {snote.AttachmentName &&
                            snote.AttachmentName !== null &&
                            snote.AttachmentName !== ''
                              ? snote.AttachmentName
                              : 'Attachment'}
                          </small>
                          <CIcon icon={cilCloudDownload} />
                        </a>
                      </div>
                      <div style={{ float: 'left' }}>
                        <CIcon
                          icon={cilPencil}
                          onClick={(e) => {
                            setcreatedAtNote(snote.createdAt)
                            setEditNote(snote.note)
                            setEditNoteForm(true)
                          }}
                          className={
                            Number(localStorage.getItem('emp_id')) === Number(snote.emp_id)
                              ? 'me-1 text-info'
                              : 'd-none'
                          }
                        />
                      </div>
                      <small className="text-warning">
                        {snote.updatedAt && snote.updatedAt !== 0 && snote.updatedAt !== ''
                          ? `Edited on ${showFulldatetimein(snote.updatedAt)}`
                          : ''}
                      </small>
                      <div style={{ clear: 'both' }}></div>
                    </div>
                  ))}
              </div>
              <CForm
                className="hello"
                autoComplete="off"
                autofill="off"
                style={{
                  border: '1px solid #dedede',
                  marginTop: '10px',
                  padding: '20px',
                }}
                onSubmit={(e) => {
                  SubmitNewNote(e)
                }}
              >
                <CFormInput
                  type="text"
                  label="New Note"
                  name="note"
                  value={NewNote}
                  placeholder=""
                  onChange={(e) => {
                    setNewNote(e.target.value)
                  }}
                  required
                />
                <label className="form-label">Attachment</label>
                <input
                  type="file"
                  name="noteatchemtn"
                  className="form-control mb-3"
                  placeholder="Enter"
                  style={{ lineHeight: '18px' }}
                  onChange={(e) => {
                    uploadNoteAttachment(e, e.target.files[0], e.target.files[0].name)
                  }}
                />
                <CButton type="submit" color="primary" className="mt-2">
                  Save Note
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol
          md={4}
          className="mb-4"
          style={{
            display:
              ActivityWorkers.attachments && ActivityWorkers.attachments.length > 0 ? '' : 'none',
          }}
        ></CCol>
      </CRow>
    </>
  )
}
UploadActivity.propTypes = {
  setShowUploadActivity: PropTypes.any,
  FilterListData: PropTypes.any,
  ForActId: PropTypes.any,
}
export default UploadActivity

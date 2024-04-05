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
import {
  BASEWEBURL,
  DoUploadURL,
  NODEAPIURL,
  reportDescriptionAlphaLength,
  reportDescriptionLength,
  reportTitleAlphaLength,
  reportTitleLength,
  showFulldatetimein,
  UPLOADSsURL,
} from '../../config'
import loader from '../../assets/images/loader.gif'
// for Addon Fields
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'
// for Addon Fields
import Editor from '../htmlEditor/editor'

let TempWorkerListData = []
// let SortStatusType = 'ASC'
let Attachments = []
let AttachmentIndex = 0
const UploadActivity = ({ ForActId, setShowUploadActivity, FilterListData }) => {
  const [isAction, setisAction] = useState(false)
  const [APICall, setAPICall] = useState(false)
  // for edit Notes
  const [EditNoteForm, setEditNoteForm] = useState(false)
  const [createdAtNote, setcreatedAtNote] = useState(0)
  const [EditNote, setEditNote] = useState('')
  // for edit Notes
  // for Addon Fields
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData
      for_form="activities"
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
  const [WorkerListData, setWorkerListData] = useState([])
  const HandleListUsers = (index, name, value) => {
    TempWorkerListData[index][name] = value
    setWorkerListData(TempWorkerListData)
  }

  const FetchWorkersList = async (ForActId) => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/listWorkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          action: 'AssingedActivity',
          act_id: ForActId,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        if (resJson.data && resJson.data.length > 0) {
          TempWorkerListData = resJson.data
          setWorkerListData(resJson.data)
          resJson.data.map((s) => {
            localStorage.removeItem(`assigned_${s.emp_id}`)
            return ''
          })
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [ActivityWorkers, setActivityWorkers] = useState({
    WorkerListData,
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
      const res = await fetch(`${NODEAPIURL}/admin/activity/addNewNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          act_id: ForActId,
          note: NewNote,
          attachment: NoteAttachment,
          attachmentName: NoteAttachmentName,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      setAPICall(false)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setNewNote('')
          FetchActivityDetail(ForActId)
        }
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAPICall(false)
      setAjaxMsg(err)
    }
  }

  const EditNewNote = async (e) => {
    // e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/activity/editNewNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          act_id: ForActId,
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
    if (ActivityWorkers.subject.length < reportTitleLength) {
      isAllGood = 0
      setAjaxMsg(`Subject must be Minimum ${reportTitleLength}+ Characters.`)
    }
    if (ActivityWorkers.description.length < reportDescriptionLength) {
      isAllGood = 0
      setAjaxMsg(`Description must be Minimum ${reportDescriptionLength}+ Characters.`)
    }
    if (!checkAlphamumericCount(ActivityWorkers.subject, reportTitleAlphaLength)) {
      isAllGood = 0
      setAjaxMsg(`Subject must be Minimum ${reportTitleAlphaLength}+ Alphanumeric Characters.`)
    }
    if (!checkAlphamumericCount(ActivityWorkers.description, reportDescriptionAlphaLength)) {
      isAllGood = 0
      setAjaxMsg(
        `Description must be Minimum ${reportDescriptionAlphaLength}+ Alphanumeric Characters.`,
      )
    }
    if (isAllGood === 1) {
      setAPICall(true)
      SubmitWorkersActivity(e)
    } else {
      setAPICall(false)
    }
  }
  const SubmitWorkersActivity = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/addActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ActivityWorkers),
      })
      const resJson = await res.json()
      setAPICall(false)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            window.location.href = `${BASEWEBURL}/#/workers-activity`
            FilterListData()
            setShowUploadActivity(false)
          }, 1500)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
    } catch (err) {
      setAPICall(false)
      setAjaxMsg(err)
    }
  }

  const FetchActivityDetail = async (act_id) => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getActivityDetailData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          act_id,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        if (resJson.status === 1) {
          if (resJson.data) {
            setActivityWorkers(resJson.data)
          }
          if (resJson.data && resJson.data.attachments && resJson.data.attachments.length > 0) {
            Attachments = resJson.data.attachments
          }
          if (resJson.users && resJson.users.length > 0) {
            // setWorkerListData(resJson.users)
            // TempWorkerListData = resJson.users
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

  function checkAlphamumericCount(value, length) {
    const alphanumericRegex = /[a-zA-Z0-9]/g
    const matches = value.match(alphanumericRegex)
    const total = matches ? matches.length : 0
    return Number(total) >= length
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

  const [AssignTypeDiv, setAssignTypeDiv] = useState(false)
  function showAssignTypeDiv(emp_id, change) {
    let returnValue = 'none'
    TempWorkerListData.map((s) => {
      if (Number(emp_id) === Number(s.emp_id)) {
        if (Number(s.status) === 2) {
          returnValue = 'block'
        }
        const temp = localStorage.getItem(`assigned_${s.emp_id}`)
        // console.log(temp)
        if (temp && Number(temp) === Number(s.emp_id)) {
          returnValue = 'block'
        }
        if (temp && Number(temp) === 0) {
          returnValue = 'none'
        }
      }
      return ''
    })
    return returnValue
  }

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
                  for_form="activities"
                  data_id={ForActId}
                  returnData={setAddonsFieldData}
                />,
              )
            }}
          ></div>
          <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
            {ListAddonsFields ? <ListAddonsFieldPage for_form="activities" /> : ''}
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
          <div
            className="ry_popup_content"
            style={{ maxWidth: '50%', maxHeight: '50%', height: 'max-content' }}
          >
            <div className="p-4">
              <div className="form-group">
                <label>Edit Note on Acticity #{ForActId}</label>
                <textarea
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
            Report
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
                  SubmitWorkersData(e)
                }}
              >
                <CRow>
                  <CCol md={6}>
                    <CRow className="mb-1">
                      <CCol md={12}>
                        <CFormInput
                          type="text"
                          label="Subject"
                          name="subject"
                          value={ActivityWorkers.subject}
                          placeholder=""
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        />
                        <small className="text-dark">
                          <div
                            style={{
                              display: 'inline-block',
                              background:
                                ActivityWorkers.subject.length >= reportTitleLength
                                  ? 'green'
                                  : 'red',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              marginRight: '5px',
                            }}
                          ></div>
                          {reportTitleLength}+ Character
                          <div
                            style={{
                              display: 'inline-block',
                              background: checkAlphamumericCount(
                                ActivityWorkers.subject,
                                reportTitleAlphaLength,
                              )
                                ? 'green'
                                : 'red',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              marginLeft: '5px',
                              marginRight: '5px',
                            }}
                          ></div>
                          {reportTitleAlphaLength}+ Alphanumeric
                        </small>
                        <small className="text-info" style={{ float: 'right' }}>
                          {ActivityWorkers.subject.length} Characters
                        </small>
                        <div style={{ clear: 'both' }}></div>
                      </CCol>
                    </CRow>
                    <CRow className="mb-1">
                      <CCol md={12}>
                        <CFormTextarea
                          required
                          rows={5}
                          label="Description"
                          name="description"
                          value={ActivityWorkers.description}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          className="d-none"
                        ></CFormTextarea>
                        <Editor
                          HandleFormData2={HandleFormData2}
                          PageContent={ActivityWorkers.description}
                          PageTitle={ActivityWorkers.subject}
                        />
                        <small className="text-dark">
                          <div
                            style={{
                              display: 'inline-block',
                              background:
                                ActivityWorkers.description.length >= reportDescriptionLength
                                  ? 'green'
                                  : 'red',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              marginRight: '5px',
                            }}
                          ></div>
                          {reportDescriptionLength}+ Character
                          <div
                            style={{
                              display: 'inline-block',
                              background: checkAlphamumericCount(
                                ActivityWorkers.description,
                                reportDescriptionAlphaLength,
                              )
                                ? 'green'
                                : 'red',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              marginLeft: '5px',
                              marginRight: '5px',
                            }}
                          ></div>
                          {reportDescriptionAlphaLength}+ Alphanumeric
                        </small>
                        <small className="text-info" style={{ float: 'right' }}>
                          {ActivityWorkers.description.length} Characters
                        </small>
                        <div style={{ clear: 'both' }}></div>
                      </CCol>
                    </CRow>
                    <CRow className="mb-4">
                      <CCol
                        md={12}
                        style={{
                          display:
                            ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0
                              ? 'none'
                              : 'none',
                        }}
                      >
                        <CFormSelect
                          label="Owner"
                          readOnly
                          name="emp_id"
                          value={ActivityWorkers.emp_id}
                          required
                        >
                          <option value="">Select Staff</option>
                          {WorkerListData.map((singi) => (
                            <option key={singi.emp_id} value={singi.emp_id}>
                              {singi.f_name} {singi.l_name} ({singi.email})
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-2">
                      <CCol lg={12}>
                        <CFormTextarea
                          rows={2}
                          label="Proposed Solution"
                          name="solution"
                          value={ActivityWorkers.solution}
                          defaultValue=""
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        ></CFormTextarea>
                      </CCol>
                    </CRow>
                    <CRow className="mb-1">
                      <CCol md={6} title={ActivityWorkers.startDate}>
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
                      <CCol lg={6} className="mt-1">
                        <CFormSelect
                          defaultValue={0}
                          label="Highlight"
                          title="Highlight to Supervisor"
                          name="highlight"
                          value={ActivityWorkers.highlight}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </CFormSelect>
                      </CCol>
                      <CCol lg={6} className="mt-1">
                        <CFormSelect
                          defaultValue={0}
                          label="Very Urgent"
                          title="Very Urgent"
                          name="veryUrgent"
                          value={ActivityWorkers.veryUrgent}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </CFormSelect>
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
                      <span
                        onClick={() => {
                          setAssignedMax(!AssignedMax)
                        }}
                      >
                        Assign To
                      </span>
                      <input
                        type="text"
                        placeholder="Search Employee"
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
                        {WorkerListData.sort((a, b) => b.status - a.status).map((user, index) => (
                          <CCol
                            lg={12}
                            key={user.emp_id}
                            style={{
                              cursor: 'pointer',
                              display:
                                SearchEmployee !== ''
                                  ? user.f_name
                                      .toLowerCase()
                                      .includes(SearchEmployee.toLowerCase()) ||
                                    user.l_name
                                      .toLowerCase()
                                      .includes(SearchEmployee.toLowerCase()) ||
                                    user.email.toLowerCase().includes(SearchEmployee.toLowerCase())
                                    ? ''
                                    : 'none'
                                  : '',
                            }}
                          >
                            <div>
                              <CFormCheck
                                checked={Number(user.status) === 2 ? true : false}
                                name="empID"
                                id={`AssignInp${user.emp_id}`}
                                onChange={(e) => {
                                  setisAction(true)
                                  setAssignTypeDiv(!AssignTypeDiv)
                                  if (e.target.checked) {
                                    HandleListUsers(index, 'status', 2)
                                    localStorage.setItem(`assigned_${user.emp_id}`, user.emp_id)
                                  } else {
                                    HandleListUsers(index, 'status', 1)
                                    localStorage.setItem(`assigned_${user.emp_id}`, 0)
                                  }
                                }}
                                label={`${user.f_name} ${user.l_name} (${user.email})`}
                              />
                            </div>
                            <div
                              style={{
                                // float: 'left',
                                marginLeft: '30px',
                                marginBottom: '10px',
                                display: showAssignTypeDiv(user.emp_id, AssignTypeDiv),
                              }}
                            >
                              <input
                                type="radio"
                                defaultChecked={Number(user.assignType) !== 2 ? true : false}
                                name={`type${user.emp_id}`}
                                id={`assignType1${user.emp_id}`}
                                value="1"
                                onChange={(e) => {
                                  setisAction(true)
                                  if (e.target.checked) {
                                    HandleListUsers(index, 'assignType', 1)
                                  } else {
                                    HandleListUsers(index, 'assignType', 2)
                                  }
                                }}
                              />
                              <span
                                onClick={() => {
                                  setisAction(true)
                                  HandleListUsers(index, 'assignType', 1)
                                  document.getElementById(
                                    `assignType1${user.emp_id}`,
                                  ).checked = true
                                }}
                              >
                                &nbsp;Responsible&nbsp;
                              </span>
                              <input
                                type="radio"
                                defaultChecked={Number(user.assignType) === 2 ? true : false}
                                id={`assignType2${user.emp_id}`}
                                name={`type${user.emp_id}`}
                                value="2"
                                onChange={(e) => {
                                  setisAction(true)
                                  if (e.target.checked) {
                                    HandleListUsers(index, 'assignType', 2)
                                  } else {
                                    HandleListUsers(index, 'assignType', 1)
                                  }
                                }}
                              />
                              <span
                                onClick={() => {
                                  setisAction(true)
                                  document.getElementById(
                                    `assignType2${user.emp_id}`,
                                  ).checked = true
                                  HandleListUsers(index, 'assignType', 2)
                                }}
                              >
                                &nbsp;Support
                              </span>
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
                      className={`me-3 px-4 ${APICall ? 'd-none' : ''}`}
                      onClick={() => {
                        setisAction(true)
                        setAjaxMsg('   ')
                        HandleFormData2('WorkerListData', WorkerListData)
                      }}
                    >
                      Save
                    </CButton>
                    {/* {isAction ? 'yes' : 'no'} */}
                    <CButton
                      type="button"
                      color="light"
                      className={`${APICall ? 'd-none' : ''}`}
                      onClick={() => {
                        if (
                          isAction &&
                          window.confirm(
                            'Do you really want to leave? The Activity Will not be saved.',
                          )
                        ) {
                          window.location.href = `${BASEWEBURL}/#/workers-activity`
                          setShowUploadActivity(false)
                        } else {
                          window.location.href = `${BASEWEBURL}/#/workers-activity`
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
                  ActivityWorkers.notes.map((snote, i) => (
                    <div key={`${snote.createdAt}${i}`}>
                      <hr />
                      <b style={{ display: 'block' }}>
                        {snote.f_name} {snote.l_name}
                        <div style={{ float: 'right' }}>{showFulldatetimein(snote.createdAt)}</div>
                        <div style={{ clear: 'both' }}></div>
                      </b>
                      <p style={{ whiteSpace: 'pre-line' }}>{snote.note}</p>
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
                          style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                          className={
                            Number(localStorage.getItem('emp_id')) === Number(snote.emp_id)
                              ? 'me-1 text-info'
                              : 'd-none'
                          }
                        />
                      </div>
                      <small
                        className="text-warning"
                        style={{ fontSize: '12px', cursor: 'pointer' }}
                        onClick={(e) => {
                          setcreatedAtNote(snote.createdAt)
                          setEditNote(snote.note)
                          setEditNoteForm(true)
                        }}
                      >
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
                  setAPICall(true)
                  SubmitNewNote(e)
                }}
              >
                <CFormTextarea
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
                <CButton
                  type="submit"
                  color="primary"
                  className={`mt-2 ${APICall ? 'd-none' : ''}`}
                >
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

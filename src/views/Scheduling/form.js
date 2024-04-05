import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleBottom,
  cilArrowCircleRight,
  // cilCloudDownload,
  // cilDelete,
  // cilPencil,
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
  CForm,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { BASEWEBURL, NODEAPIURL } from '../../config'

let TempWorkerListData = []
// let SortStatusType = 'ASC'
const UploadActivity = ({ ForActId, setShowUploadActivity, FilterListData }) => {
  const [isAction, setisAction] = useState(false)
  const [AssignedMax, setAssignedMax] = useState(false)
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [SearchEmployee, SetSearchEmployee] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [WorkerListData, setWorkerListData] = useState([])
  const [SelectAll, setSelectAll] = useState(1)
  const HandleListUsers = (index, name, value) => {
    TempWorkerListData[index][name] = value
    setWorkerListData(TempWorkerListData)
  }

  const FetchWorkersList = async (ForActId) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/scheduling/getUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          action: 'AssingedActivity',
          sch_id: ForActId,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200) {
        if (resJson.UsersList && resJson.UsersList.length > 0) {
          TempWorkerListData = resJson.UsersList
          setWorkerListData(resJson.UsersList)
          resJson.UsersList.map((s) => {
            // localStorage.removeItem(`assigned_${s.emp_id}`)
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
    sch_id: ForActId,
    title: '',
    description: '',
    NoEndDateInp: 0,
    startDate: '',
    endDate: '',
    sendHour: '',
    sendMin: '00',
    MondayInp: 1,
    TuesdayInp: 1,
    WednesdayInp: 1,
    ThursdayInp: 1,
    FridayInp: 1,
    SaturdayInp: 1,
    SundayInp: 1,
    emp_id: 0,
    device: localStorage.getItem('DeviceDetails'),
  })

  const HandleFormData = (e) => {
    setisAction(true)
    setActivityWorkers({ ...ActivityWorkers, [e.target.name]: e.target.value })
  }

  const HandleFormData2 = (name, value) => {
    setActivityWorkers({ ...ActivityWorkers, [name]: value })
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
      const res = await fetch(`${NODEAPIURL}/admin/scheduling/addActivity`, {
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
            // RAHULITJEC window.location.href = `${BASEWEBURL}/#/workers-activity`
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

  const FetchActivityDetail = async (sch_id) => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/scheduling/getDetailData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          sch_id,
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
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    localStorage.setItem('notipage', '')
    localStorage.setItem('notipagevalue', '')
    FetchWorkersList(ForActId)
    if (ForActId !== '' && ForActId !== '0' && ForActId !== 0) {
      FetchActivityDetail(ForActId)
    }
  }, [ForActId])

  const [AssignTypeDiv, setAssignTypeDiv] = useState(false)

  function ShowDayInput(day, defaultValue) {
    const returnValue = (
      <>
        <CFormCheck
          label={day}
          className="me-2"
          id={`${day}Inp`}
          checked={defaultValue === 1}
          name={`${day}Inp`}
          onChange={(e) => {
            if (e.target.checked) {
              HandleFormData2(`${day}Inp`, 1)
            } else {
              HandleFormData2(`${day}Inp`, 0)
            }
          }}
        />
      </>
    )
    return returnValue
  }

  return (
    <>
      <CRow>
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
            Scheduling Notification
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
        <CCol md={ForActId && ForActId !== '' && ForActId !== '0' && ForActId !== 0 ? 12 : 12}>
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
                          maxLength={65}
                          label="Title"
                          name="title"
                          value={ActivityWorkers.title}
                          placeholder=""
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-1">
                      <CCol md={12}>
                        <CFormTextarea
                          required
                          maxLength={255}
                          rows={3}
                          label="Description"
                          name="description"
                          value={ActivityWorkers.description}
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        ></CFormTextarea>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-1">
                      <CCol md={6} title={ActivityWorkers.startDate}>
                        <CFormInput
                          type="date"
                          required
                          label="Start Date"
                          value={ActivityWorkers.startDate}
                          name="startDate"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                        />
                        {ShowDayInput('NoEndDate', ActivityWorkers.NoEndDateInp)}
                      </CCol>
                      {ActivityWorkers.NoEndDateInp === 1 ? (
                        ''
                      ) : (
                        <CCol
                          md={6}
                          title={ActivityWorkers.endDate !== 'null' ? ActivityWorkers.endDate : ''}
                        >
                          <CFormInput
                            required={ActivityWorkers.NoEndDateInp !== 1}
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
                      )}
                    </CRow>
                    <div className="mt-2"></div>
                    <b>Select Days</b>
                    <div className="d-flex mt-1">
                      {ShowDayInput('Monday', ActivityWorkers.MondayInp)}
                      {ShowDayInput('Tuesday', ActivityWorkers.TuesdayInp)}
                      {ShowDayInput('Wednesday', ActivityWorkers.WednesdayInp)}
                      {ShowDayInput('Thursday', ActivityWorkers.ThursdayInp)}
                    </div>
                    <div className="d-flex mt-1">
                      {ShowDayInput('Friday', ActivityWorkers.FridayInp)}
                      {ShowDayInput('Saturday', ActivityWorkers.SaturdayInp)}
                      {ShowDayInput('Sunday', ActivityWorkers.SundayInp)}
                    </div>
                    <div className="mt-2"></div>

                    <CRow className="mb-1">
                      <b>Select Sending Time</b>
                      <CCol md={6}>
                        <CFormSelect
                          value={ActivityWorkers.sendHour}
                          name="sendHour"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="">Select Hour</option>
                          <option value="08">8 AM</option>
                          <option value="09">9 AM</option>
                          <option value="10">10 AM</option>
                          <option value="11">11 AM</option>
                          <option value="12">12 PM</option>
                          <option value="13">1 PM</option>
                          <option value="14">2 PM</option>
                          <option value="15">3 PM</option>
                          <option value="16">4 PM</option>
                          <option value="17">5 PM</option>
                          <option value="18">6 PM</option>
                          <option value="19">7 PM</option>
                          <option value="20">8 PM</option>
                          <option value="21">9 PM</option>
                          <option value="22">10 PM</option>
                          <option value="23">11 PM</option>
                          <option value="24">12 AM</option>
                          <option value="01">01 AM</option>
                          <option value="02">02 AM</option>
                          <option value="03">03 AM</option>
                          <option value="04">04 AM</option>
                          <option value="05">05 AM</option>
                          <option value="06">06 AM</option>
                          <option value="07">07 AM</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6} title={ActivityWorkers.startDate}>
                        <CFormSelect
                          value={ActivityWorkers.sendMin}
                          name="sendMin"
                          onChange={(e) => {
                            HandleFormData(e)
                          }}
                          required
                        >
                          <option value="">Select Min</option>
                          <option value="00">0</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12} className="mb-3 mt-3">
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
                          setSelectAll(SelectAll + 1)
                          const updatedArray = WorkerListData.map((item) => ({
                            ...item,
                            status: e.target.checked ? 2 : 1,
                          }))
                          // Update the state with the new array
                          setWorkerListData(updatedArray)
                          HandleFormData2('WorkerListData', updatedArray)
                          TempWorkerListData = updatedArray
                          WorkerListData.map((s) => {
                            document.getElementById(`AssignInpSche${s.emp_id}`).checked =
                              e.target.value
                            return ''
                          })
                        }}
                      />
                      &nbsp;
                      <span
                        onClick={() => {
                          setAssignedMax(!AssignedMax)
                        }}
                      >
                        Send To
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
                              {SelectAll ? (
                                <CFormCheck
                                  checked={Number(user.status) === 2}
                                  name="empID"
                                  id={`AssignInpSche${user.emp_id}`}
                                  onChange={(e) => {
                                    setisAction(true)
                                    setAssignTypeDiv(!AssignTypeDiv)
                                    if (e.target.checked) {
                                      HandleListUsers(index, 'status', 2)
                                      // localStorage.setItem(`assigned_${user.emp_id}`, user.emp_id)
                                    } else {
                                      HandleListUsers(index, 'status', 1)
                                      // localStorage.setItem(`assigned_${user.emp_id}`, 0)
                                    }
                                  }}
                                  label={`${user.f_name} ${user.l_name} (${user.email})`}
                                />
                              ) : (
                                ''
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
                        HandleFormData2('WorkerListData', WorkerListData)
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
                          window.location.href = `${BASEWEBURL}/#/scheduling`
                          setShowUploadActivity(false)
                        } else {
                          window.location.href = `${BASEWEBURL}/#/scheduling`
                          setShowUploadActivity(false)
                        }
                      }}
                    >
                      Back to List
                    </CButton>
                  </CCol>
                </CRow>
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

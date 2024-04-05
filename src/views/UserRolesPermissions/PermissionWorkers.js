import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import axios from 'axios'
// import CIcon from '@coreui/icons-react'
// import { cilFilter, cilPlus, cilSave, cilSortDescending } from '@coreui/icons'
import { CCard, CCardBody, CCol, CRow, CForm, CButton, CFormInput } from '@coreui/react'
import { CFormSelect } from '@coreui/react'
import { NODEAPIURL } from '../../config'
const AddWorkerForm = ({
  ForEmpID,
  setEditPermsWorkers,
  FetchPermissionList,
  EditPermiId,
  setEditPermiId,
}) => {
  const [AjaxMsg, setAjaxMsg] = useState('')

  const [PermissionArray] = useState([
    { id: 'dsh_lvst', title: 'LiveStock Health Dashboard' },
    { id: 'ls_mng', title: 'LiveStock Management' },
    { id: 'lsh_mng', title: 'LiveStock Health  Management' },
    { id: 'wrk_mng', title: 'Workers Management' },
    { id: 'geo_mng', title: 'Geo fencing Management' },
    { id: 'invt_mng', title: 'Inventory Management' },
    { id: 'resr_mng', title: 'Researcher Management' },
    { id: 'vend_mng', title: 'Vendors Management' },
    { id: 'rols_mng', title: 'User Roles and Permissions' },
  ])

  const [EmpData, setEmpData] = useState({
    f_name: '',
    l_name: '',
    email: '',
  })
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [WorkedAddData, setWorkedAddData] = useState({
    emp_id: ForEmpID,
    permi_id: EditPermiId,
    ls_mng: 0,
    title: 'Role',
    dpt_id: '',
    uType: '',
    lsh_mng: 0,
    wrk_mng: 0,
    geo_mng: 0,
    invt_mng: 0,
    resr_mng: 0,
    bend_mng: 0,
    rols_mng: 0,
    dsh_lvst: 0,
    department: 0,
  })

  const HandleForm = (name, value) => {
    setWorkedAddData({ ...WorkedAddData, [name]: value })
  }

  const SubmitWorkersData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/addUserPermission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(WorkedAddData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FetchPermissionList(ForEmpID)
            setEditPermsWorkers(false)
            setEditPermiId(0)
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

  const FetchWorkersDetails = async (emp_id, permi_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getUserPermission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emp_id,
          permi_id,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setWorkedAddData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getworkersDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emp_id: emp_id,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.status === 1) {
        setEmpData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [Departments, setDepartments] = useState([])
  const FetchDepartments = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/department/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setDepartments(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchDepartments()
    if (ForEmpID !== 'new') {
      FetchWorkersDetails(ForEmpID, EditPermiId)
    }
  }, [ForEmpID, EditPermiId])

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <CForm
            className="hello"
            autoComplete="off"
            autofill="off"
            onSubmit={(e) => {
              SubmitWorkersData(e)
            }}
          >
            <h3>
              Manage Web Permission for {EmpData.f_name.trim()}
              &nbsp;{EmpData.l_name.trim()} ({EmpData.email.trim()})
            </h3>
            <CRow className="mt-2">
              <CCol md={4} className="">
                <div className="pt-3 pb-1">
                  <label>Title For the Permission</label>
                  <CFormInput
                    name="title"
                    value={WorkedAddData.title}
                    onChange={(e) => {
                      HandleForm(e.target.name, e.target.value)
                    }}
                  />
                </div>
                <div className="pt-3 pb-1">
                  <label>Role</label>
                </div>
                <CFormSelect
                  className=""
                  value={WorkedAddData.uType}
                  onChange={(e) => {
                    HandleForm('uType', e.target.value)
                  }}
                >
                  <option value={0}>Select Type</option>
                  <option value={1}>Staff</option>
                  <option value={2}>Supervisor</option>
                  <option value={3}>Admin</option>
                </CFormSelect>
                <small
                  className="text-danger"
                  style={{
                    maxWidth: '100%',
                    display: 'inline-block',
                  }}
                >
                  {WorkedAddData.uType === 1 || WorkedAddData.uType === '1'
                    ? 'Can use the App and See the Report of his account on the Web.'
                    : ''}
                  {WorkedAddData.uType === 2 || WorkedAddData.uType === '2'
                    ? 'Can use the App and See the Report of Their Department Employee on the Web.'
                    : ''}
                  {WorkedAddData.uType === 3 || WorkedAddData.uType === '3'
                    ? 'Can use App and Web with Full Functions.'
                    : ''}
                </small>
                <div className="pt-3 pb-1">
                  <label>Department</label>
                </div>
                <CFormSelect
                  name="dpt_id"
                  value={WorkedAddData.dpt_id}
                  // style={{ borderRadius: '50px', border: 'none', padding: '5px 30px', lineHeight: '2' }}
                  onChange={(e) => {
                    HandleForm(e.target.name, e.target.value)
                  }}
                >
                  <option value="0">Select Department</option>
                  {Departments.map((singi) => (
                    <option key={singi.dpt_id} value={singi.dpt_id}>
                      {singi.dept_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={8}>
                <CRow className="mt-2">
                  {PermissionArray.map((item) => (
                    <CCol md={6} key={item.id}>
                      <div className="p-1">
                        <label>{item.title}</label>
                      </div>
                      <CFormSelect
                        className="bg-primary text-white"
                        name="permission[]"
                        value={WorkedAddData[item.id]}
                        onChange={(e) => {
                          HandleForm(item.id, e.target.value)
                        }}
                      >
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </CFormSelect>
                    </CCol>
                  ))}
                </CRow>
              </CCol>
            </CRow>
            <div className="p-1 mt-4">
              <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                {AjaxMsg}
              </div>
              <CButton
                type="submit"
                color="primary"
                className="mr-4"
                style={{ marginRight: '20px' }}
              >
                Save
              </CButton>
              <CButton
                type="button"
                color="light"
                onClick={() => {
                  setEditPermsWorkers(false)
                  setEditPermiId(0)
                }}
              >
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

AddWorkerForm.propTypes = {
  ForEmpID: PropTypes.any,
  EditPermiId: PropTypes.any,
  FetchPermissionList: PropTypes.any,
  setEditPermiId: PropTypes.any,
  setEditPermsWorkers: PropTypes.any,
}

export default AddWorkerForm

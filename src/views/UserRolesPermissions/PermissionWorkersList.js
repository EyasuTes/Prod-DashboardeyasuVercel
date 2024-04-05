import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'
import PermissionWorkers from './PermissionWorkers'
import { showFulldatetimein } from '../../config'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'
const AddWorkerForm = ({ ForEmpID, setShowPermsWorkers, FilterWorkersList, setShowAddWorkers }) => {
  const [EditPermsWorkers, setEditPermsWorkers] = useState(false)
  const [EditPermiId, setEditPermiId] = useState(0)

  const [PermissionArray] = useState([
    { id: 'ls_mng', title: 'LiveStock Management' },
    { id: 'lsh_mng', title: 'LiveStock Health  Management' },
    { id: 'wrk_mng', title: 'Workers Management' },
    { id: 'geo_mng', title: 'Geo fencing Management' },
    { id: 'invt_mng', title: 'Inventory Management' },
    { id: 'resr_mng', title: 'Researcher Management' },
    { id: 'vend_mng', title: 'Vendors Management' },
    { id: 'rols_mng', title: 'User Roles and Permissions' },
    { id: 'dsh_lvst', title: 'LiveStock Health Dashboard' },
  ])

  function ShowPermission(per_id) {
    var the = ''
    PermissionArray.map((sin) => {
      if (per_id === sin.id) {
        the = sin.title
      }
      return sin.title
    })
    return the
  }

  const [EmpData, setEmpData] = useState({
    f_name: '',
    l_name: '',
    email: '',
  })
  const [UserPermissionList, setUserPermissionList] = useState([])

  const FetchPermissionList = async (emp_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getUserPermissionList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emp_id: emp_id,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        setUserPermissionList(resJson.data)
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

  useEffect(() => {
    if (ForEmpID !== 'new') {
      FetchPermissionList(ForEmpID)
    }
  }, [ForEmpID])

  let PermsForm = ''
  if (EditPermsWorkers) {
    PermsForm = (
      <PermissionWorkers
        ForEmpID={ForEmpID}
        EditPermiId={EditPermiId}
        setEditPermiId={setEditPermiId}
        setEditPermsWorkers={setEditPermsWorkers}
        FetchPermissionList={FetchPermissionList}
      />
    )
  }

  function deletePermission(permi_id, emp_id, permi_title) {
    fetch(`${NODEAPIURL}/admin/deletePermission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        permi_id,
        emp_id,
        permi_title,
        forName: `${EmpData.f_name} ${EmpData.l_name}`,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 1) {
          FetchPermissionList(ForEmpID)
        } else {
          alert(resJson.message)
        }
      })
  }

  return (
    <CCol xs={12}>
      {PermsForm}
      <CCard className="mb-4" style={{ display: EditPermsWorkers ? 'none' : '' }}>
        <CCardBody>
          <h3>
            Manage Web Permission for {EmpData.f_name.trim()}
            &nbsp;{EmpData.l_name.trim()} ({EmpData.email.trim()})
            <div style={{ float: 'right' }}>
              <CButton
                type="button"
                title="Add More Role"
                className="text-white"
                style={{
                  marginRight: '10px',
                }}
                color="success"
                onClick={() => {
                  setEditPermsWorkers(true)
                  setEditPermiId(0)
                }}
              >
                <CIcon icon={cilPlus} />
              </CButton>
              <CButton
                type="button"
                className="text-white"
                color="danger"
                onClick={() => {
                  setShowPermsWorkers(false)
                  setShowAddWorkers(false)
                }}
              >
                Back
              </CButton>
            </div>
            <div style={{ clear: 'both' }}></div>
          </h3>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col">Department</CTableHeaderCell>
                <CTableHeaderCell scope="col">User Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Permission</CTableHeaderCell>
                <CTableHeaderCell scope="col">Updated on</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {UserPermissionList.map((singi) => (
                <CTableRow key={singi.permi_id}>
                  <CTableDataCell>{singi.permi_id}</CTableDataCell>
                  <CTableDataCell>{singi.title}</CTableDataCell>
                  <CTableDataCell>
                    {singi.dept_name !== '' && singi.dept_name !== null ? singi.dept_name : 'NA'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {singi.uType === 1 ? <div className="text-success">Staff</div> : ''}
                    {singi.uType === 2 ? <div className="text-info">Supervisor</div> : ''}
                    {singi.uType === 3 ? <div className="text-danger">Admin</div> : ''}
                  </CTableDataCell>
                  <CTableDataCell>
                    <ul>
                      {singi.dsh_lvst === 1 ? <li>{ShowPermission('dsh_lvst')}</li> : ''}
                      {singi.ls_mng === 1 ? <li>{ShowPermission('ls_mng')}</li> : ''}
                      {singi.lsh_mng === 1 ? <li>{ShowPermission('lsh_mng')}</li> : ''}
                      {singi.wrk_mng === 1 ? <li>{ShowPermission('wrk_mng')}</li> : ''}
                      {singi.geo_mng === 1 ? <li>{ShowPermission('geo_mng')}</li> : ''}
                      {singi.invt_mng === 1 ? <li>{ShowPermission('invt_mng')}</li> : ''}
                      {singi.resr_mng === 1 ? <li>{ShowPermission('resr_mng')}</li> : ''}
                      {singi.vend_mng === 1 ? <li>{ShowPermission('vend_mng')}</li> : ''}
                      {singi.rols_mng === 1 ? <li>{ShowPermission('rols_mng')}</li> : ''}

                      {singi.ls_mng === 0 &&
                      singi.lsh_mng === 0 &&
                      singi.wrk_mng === 0 &&
                      singi.geo_mng === 0 &&
                      singi.invt_mng === 0 &&
                      singi.resr_mng === 0 &&
                      singi.vend_mng === 0 &&
                      singi.dsh_lvst === 0 &&
                      singi.rols_mng === 0
                        ? 'No Permission'
                        : ''}
                    </ul>
                  </CTableDataCell>
                  <CTableDataCell>{showFulldatetimein(singi.updatedAt)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      type="button"
                      color="info"
                      className="text-white"
                      onClick={() => {
                        setEditPermsWorkers(true)
                        setEditPermiId(singi.permi_id)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    &nbsp;
                    <CButton
                      type="button"
                      color="danger"
                      className="text-white"
                      onClick={() => {
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm('Are you sure to Delete the Permission?') === true) {
                          deletePermission(singi.permi_id, singi.emp_id, singi.title)
                        }
                        // eslint-enable-next-line no-restricted-globals
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

AddWorkerForm.propTypes = {
  ForEmpID: PropTypes.any,
  setShowPermsWorkers: PropTypes.any,
  FilterWorkersList: PropTypes.any,
  setShowAddWorkers: PropTypes.any,
}

export default AddWorkerForm

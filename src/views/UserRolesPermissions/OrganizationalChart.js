import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { BASEWEBURL, NODEAPIURL, UPLOADSsURL } from '../../config'
import { Tree, TreeNode } from 'react-organizational-chart'
import './OrganizationalChart.css'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilGrid, cilList } from '@coreui/icons'

const OrganizationalChart = () => {
  const [AdminData, setAdminData] = useState([])
  const [Loader, SetLoader] = useState(true)
  const [Grid, setGrid] = useState(false)
  // const [Dept, setDept] = useState(0)
  const [SuperVisorData, setSuperVisorData] = useState([])
  const [StaffData, setStaffData] = useState([])
  const [DepartmentData, setDepartmentData] = useState([])

  const FetchDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/supervisor/GetorganizationChart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({}),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson && resJson.adminData && resJson.adminData.length > 0) {
          setAdminData(resJson.adminData)
        }

        if (resJson && resJson.superVisorData && resJson.superVisorData.length > 0) {
          setSuperVisorData(resJson.superVisorData)
        }

        if (resJson && resJson.staffData && resJson.staffData.length > 0) {
          setStaffData(resJson.staffData)
        }

        if (resJson && resJson.departmentData && resJson.departmentData.length > 0) {
          setDepartmentData(resJson.departmentData)
        }
      } else {
        alert(resJson.message)
      }
      SetLoader(false)
    } catch (err) {
      SetLoader(false)
      alert(err.message)
    }
  }

  function ShowEmpImg(image) {
    let send = `${UPLOADSsURL}logo.png`
    if (image && image !== '' && image !== 'null' && image !== null) {
      send = `${UPLOADSsURL}${image}`
    }
    // send = `${UPLOADSsURL}${image}`
    return send
  }

  useEffect(() => {
    FetchDataList()
  }, [])

  function countUnder(dpt_id) {
    const filteredStaffData = StaffData.filter((item) => item.dpt_id === dpt_id)
    const filteredSuperVisorData = SuperVisorData.filter((item) => item.dpt_id === dpt_id)
    return (
      <small>
        {`${filteredSuperVisorData.length} Supervisor, ${filteredStaffData.length} Staffs`}
      </small>
    )
  }

  return (
    <>
      {Loader ? (
        <div className="bg-white p-5 mt-4" style={{ textAlign: 'center' }}>
          <img src={`${BASEWEBURL}/loader.gif`} alt="Loader" style={{ maxWidth: '100px' }} />
        </div>
      ) : (
        <CRow>
          <CCol xs={12}>
            <h3 className="mb-3 mt-2">
              Organizational Chart
              <div style={{ float: 'right' }}>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    window.print()
                  }}
                >
                  <CIcon
                    icon={cilCloudDownload}
                    style={{ width: '1.5rem', height: '1.5rem', color: 'red' }}
                  />
                </a>
                &nbsp;&nbsp;
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    setGrid(!Grid)
                  }}
                >
                  <CIcon
                    className={Grid ? 'danger' : 'success'}
                    icon={Grid ? cilGrid : cilList}
                    style={{ width: '1.5rem', height: '1.5rem', color: Grid ? 'green' : 'blue' }}
                  />
                </a>
              </div>
              <div style={{ clear: 'both' }}></div>
            </h3>
          </CCol>
          {Grid ? (
            <CCol xs={12} id="GridOrdChart">
              <CCard className="mb-4">
                <CCardBody className="overFlow">
                  <Tree
                    label={
                      <>
                        <div className="chartBox">
                          <h3>Admin</h3>
                          <div style={{ textAlign: 'left', display: 'flex' }}>
                            {AdminData.map((s, i) => (
                              <div className="chartBox chartBoxAdmin" key={i}>
                                <h6 className="text-danger">
                                  {s.f_name} {s.l_name}
                                </h6>
                                <img src={ShowEmpImg(s.image)} alt={s.image} />
                                <small>({s.title})</small>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    }
                  >
                    {DepartmentData.map((s2, i2) => (
                      <>
                        <TreeNode
                          label={
                            <>
                              <div className="chartBox" key={i2}>
                                <h5 className="text-info">
                                  {s2.dept_name}
                                  <br />
                                  <small className="text-success">
                                    {countUnder(s2.dpt_id, s2.dept_name)}
                                  </small>
                                </h5>
                                <div style={{ textAlign: 'left', display: 'flex' }}>
                                  {SuperVisorData.filter((s4) => s4.dpt_id === s2.dpt_id).map(
                                    (s4, i) => (
                                      <div className="chartBox chartBoxAdmin" key={i}>
                                        <h4 className="text-danger">
                                          {s4.f_name} {s4.l_name}
                                        </h4>
                                        <img src={ShowEmpImg(s4.image)} alt={s4.image} />
                                        <small>({s4.title})</small>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          }
                        >
                          {StaffData.filter((s3) => s3.dpt_id === s2.dpt_id).map((s3, i3) => (
                            <>
                              <TreeNode
                                key={s3.emp_id}
                                style={{ display: 'none' }}
                                label={
                                  <>
                                    <div className="chartBox chartBoxStaff" key={i3}>
                                      <h6 className="text-success">
                                        {s3.f_name} {s3.l_name}
                                      </h6>
                                      <img src={ShowEmpImg(s3.image)} alt={s3.image} />
                                      <small>({s3.title})</small>
                                    </div>
                                  </>
                                }
                              />
                            </>
                          ))}
                        </TreeNode>
                      </>
                    ))}
                  </Tree>
                </CCardBody>
              </CCard>
            </CCol>
          ) : (
            <CCol xs={12} id="ListOrdChart">
              <CCard className="mb-4">
                <CCardBody className="overFlow">
                  <Tree
                    label={
                      <>
                        <div className="chartBox">
                          <h3>Admin</h3>
                          <div style={{ textAlign: 'left', display: 'flex' }}>
                            {AdminData.map((s, i) => (
                              <div className="chartBox chartBoxAdmin" key={i}>
                                <h4 className="text-danger">
                                  {s.f_name} {s.l_name}
                                </h4>
                                <img src={ShowEmpImg(s.image)} alt={s.image} />
                                <small>({s.title})</small>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    }
                  >
                    {DepartmentData.map((s2, i2) => (
                      <>
                        <TreeNode
                          label={
                            <>
                              <div className="chartBox" key={i2}>
                                <h5 className="text-info">
                                  {s2.dept_name}
                                  <br />
                                  <small className="text-success">
                                    {countUnder(s2.dpt_id, s2.dept_name)}
                                  </small>
                                </h5>
                                <div style={{ textAlign: 'left', display: 'flex' }}>
                                  {SuperVisorData.filter((s4) => s4.dpt_id === s2.dpt_id).map(
                                    (s4, i) => (
                                      <div className="chartBox chartBoxAdmin" key={i}>
                                        <h4 className="text-danger">
                                          {s4.f_name} {s4.l_name}
                                        </h4>
                                        <img src={ShowEmpImg(s4.image)} alt={s4.image} />
                                        <small>({s4.title})</small>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          }
                        >
                          <TreeNode
                            style={{ display: 'none' }}
                            label={
                              <>
                                {StaffData.filter((s3) => s3.dpt_id === s2.dpt_id).map((s3, i3) => (
                                  <div className="chartBox d-flex chartBoxStaff" key={i3}>
                                    <img src={ShowEmpImg(s3.image)} alt={s3.image} />
                                    <div>
                                      <b className="text-success">
                                        {s3.f_name} {s3.l_name}
                                      </b>
                                      <br />
                                      <small>({s3.title})</small>
                                    </div>
                                  </div>
                                ))}
                              </>
                            }
                          />
                        </TreeNode>
                      </>
                    ))}
                  </Tree>
                </CCardBody>
              </CCard>
            </CCol>
          )}
        </CRow>
      )}
    </>
  )
}

export default OrganizationalChart

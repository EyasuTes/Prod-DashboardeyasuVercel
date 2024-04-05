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

const AddWorkerDepartmentForm = ({ ForDataID, setShowAddData, FilterDataList }) => {
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [AddData, setAddData] = useState({
    cat_id: ForDataID === 'new' ? 0 : ForDataID,
    title: '',
  })

  const HandleForm = (name, value) => {
    setAddData({ ...AddData, [name]: value })
  }

  const SubmitWorkersData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/addPrdCatiData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AddData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FilterDataList()
            setShowAddData(false)
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

  const [CatiDataList, setCatiDataList] = useState([])
  const FetchCatiDataList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdCatiData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          parent: 0,
          SortStatusType: 'ASC',
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.data && resJson.data.length > 0) {
          setCatiDataList(resJson.data)
        } else {
          setCatiDataList([])
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FetchDetails = async (cat_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdCatiData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cat_id,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.data && resJson.data.length > 0) {
          setAddData(resJson.data[0])
        }
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    FetchCatiDataList()
    if (ForDataID !== 'new') {
      FetchDetails(ForDataID)
    }
  }, [ForDataID])

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-4">
          {ForDataID !== 'new' ? `Update Category: ${AddData.title}` : 'Add Category'}
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
                SubmitWorkersData(e)
              }}
            >
              <CRow>
                <CCol md={12}>
                  <div className="p-1">
                    <label>Title</label>
                    <CFormInput
                      type="text"
                      required
                      name="title"
                      value={AddData.title}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Title"
                    />
                  </div>
                </CCol>
                <CCol md={12}>
                  <div className="p-1">
                    <label>Parent Category</label>
                    <CFormSelect
                      type="text"
                      required
                      name="parent"
                      value={AddData.parent}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                      placeholder="Enter Title"
                    >
                      <option value="0">Select Parent</option>
                      {CatiDataList.map((s) => (
                        <option
                          value={s.cat_id}
                          key={s.cat_id}
                          style={{
                            display: Number(ForDataID) === Number(s.cat_id) ? 'none' : '',
                          }}
                        >
                          {s.title}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <div className="p-1 mt-2">
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
                    setShowAddData(false)
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

AddWorkerDepartmentForm.propTypes = {
  ForDataID: PropTypes.any,
  setShowAddData: PropTypes.any,
  FilterDataList: PropTypes.any,
}

export default AddWorkerDepartmentForm

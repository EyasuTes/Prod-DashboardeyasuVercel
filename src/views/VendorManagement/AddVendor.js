import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CCard, CCardBody, CCol, CRow, CButton, CFormInput, CForm } from '@coreui/react'
import { NODEAPIURL, BASEWEBURL } from '../../config'
// for Addon Fields
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'
// for Addon Fields

const AddVendor = ({ ForDataID, setShowAddData, FilterDataList }) => {
  // for Addon Fields
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData for_form="vendors" data_id={ForDataID} returnData={setAddonsFieldData} />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // for Addon Fields
  const [FormData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    permit_no: '',
    ven_id:
      ForDataID && ForDataID !== '' && ForDataID !== '0' && ForDataID !== 0 && ForDataID !== 'NEW'
        ? ForDataID
        : 0,
    AddonsFieldData: AddonsFieldData,
  })

  const HandleForm = (name, value) => {
    setFormData({ ...FormData, [name]: value })
  }

  const HandleFormData = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value })
  }

  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  const SubmitFormData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/UpdateData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(FormData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            window.location.href = `${BASEWEBURL}/#/manage-vendor`
            setShowAddData(false)
            FilterDataList()
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

  const vendorGetDetails = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/getDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ven_id: ForDataID }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setFormData(resJson.data[0])
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    if (
      ForDataID &&
      ForDataID !== '' &&
      ForDataID !== '0' &&
      ForDataID !== 0 &&
      ForDataID !== 'NEW'
    ) {
      vendorGetDetails(ForDataID)
    }
  }, [ForDataID])

  return (
    <CRow>
      {/* for Addon Fields */}
      <div style={{ display: ListAddonsFields ? '' : 'none' }}>
        <div
          className="ry_popup_bg"
          onClick={() => {
            setListAddonsFields(false)
            setShowListAddonsFieldData(
              <ListAddonsFieldData
                for_form="vendors"
                data_id={ForDataID}
                returnData={setAddonsFieldData}
              />,
            )
          }}
        ></div>
        <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
          {ListAddonsFields ? <ListAddonsFieldPage for_form="vendors" /> : ''}
        </div>
      </div>
      {/* for Addon Fields */}
      <CCol xs={12}>
        <h3 className="mb-2 mb-1">
          {ForDataID &&
          ForDataID !== '' &&
          ForDataID !== '0' &&
          ForDataID !== 0 &&
          ForDataID !== 'NEW'
            ? 'Update Vendor'
            : 'Create Vendor'}
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
                setShowListAddonsFieldData('Loading Updated Fields')
              }}
            >
              Add Field
            </button>
          </div>
          <div style={{ clear: 'both' }}></div>
        </h3>
      </CCol>
      <CCol xs={6} className="text-end d-none">
        <CButton color="primary" className="me-3">
          <CIcon icon={cilPlus} />
        </CButton>
        Add Field
      </CCol>
      <CCol lg={12}>
        <CCard className="mb-4 p-4">
          <CCardBody>
            <CForm
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitFormData(e)
              }}
            >
              <CRow className="mb-4">
                <CCol lg={4}>
                  <CFormInput
                    type="text"
                    required
                    name="name"
                    label="Name"
                    maxLength={90}
                    value={FormData.name}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Name"
                  />
                </CCol>
                <CCol lg={4}>
                  <CFormInput
                    type="email"
                    name="email"
                    label="Email"
                    maxLength={90}
                    value={FormData.email}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Email"
                  />
                </CCol>
                <CCol lg={4}>
                  <CFormInput
                    type="text"
                    required
                    name="mobile"
                    label="Mobile"
                    maxLength={20}
                    value={FormData.mobile}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Mobile"
                  />
                </CCol>
              </CRow>
              <CRow className="mb-5">
                <CCol lg={4}>
                  <CFormInput
                    type="text"
                    name="company"
                    label="Company"
                    maxLength={80}
                    value={FormData.company}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Company Name"
                  />
                </CCol>
                <CCol lg={4}>
                  <CFormInput
                    type="text"
                    name="permit_no"
                    label="Permit Number"
                    maxLength={50}
                    value={FormData.permit_no}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Permit Number"
                  />
                </CCol>
              </CRow>
              {ShowListAddonsFieldData}
              <CRow className="mt-4">
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CCol lg={12} className="text-center">
                  <CButton
                    type="submit"
                    color="primary"
                    className="me-3 px-4"
                    onClick={() => {
                      HandleForm('AddonsFieldData', AddonsFieldData)
                    }}
                  >
                    Save
                  </CButton>
                  <CButton
                    type="button"
                    color="dark"
                    variant="outline"
                    className="px-4"
                    onClick={() => {
                      window.location.href = `${BASEWEBURL}/#/manage-vendor`
                      setShowAddData(false)
                    }}
                  >
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

AddVendor.propTypes = {
  ForDataID: PropTypes.any,
  setShowAddData: PropTypes.any,
  FilterDataList: PropTypes.any,
}

export default AddVendor

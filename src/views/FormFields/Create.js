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
  CFormTextarea,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'

const FormFieldAdd = ({ ForID, setShowAddAddonField, FilterFormFieldssList, for_form }) => {
  const [AjaxMsg, setAjaxMsg] = useState('')
  // let IndexTable = 'ani_id'
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })
  const [AddFormData, setAddFormData] = useState({
    field_id: ForID === 'new' ? 0 : ForID,
    for_form,
    title: '',
    field_type: 'text',
    is_required: 0,
    order_by: 1,
    options: '',
  })

  const HandleForm = (name, value) => {
    setAddFormData({ ...AddFormData, [name]: value })
  }

  const SubmitData = async (e) => {
    e.preventDefault()
    setAjaxMsg('Loading...')
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/addformFieldsdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AddFormData),
      })
      const resJson = await res.json()
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            FilterFormFieldssList()
            setShowAddAddonField(false)
          }, 786)
        }
        setAjaxMsg(resJson.message)
      } else {
        setAjaxMsg(resJson.message)
      }
      setTimeout(() => {
        setAjaxMsg('')
      }, 2500)
    } catch (err) {
      setAjaxMsg(err)
    }
  }

  const getDetails = async (field_id) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getformFieldDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_id }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && Number(resJson.status) === 1) {
        setAddFormData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (ForID !== 'new' && ForID !== 0) {
      getDetails(ForID)
    }
  }, [ForID])

  return (
    <CRow>
      <CCol xs={12}>
        <h6 className="mb-2 mt-0 text-center">
          {ForID !== 'new' ? `Update Addon Field: ${AddFormData.ani_id}` : 'Add Addon Field'}
        </h6>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4 m-4">
          <CCardBody>
            <CForm
              className="hello"
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitData(e)
              }}
            >
              <CRow>
                <CCol md={4}>
                  <div className="p-1">
                    <b title="1 will be visible First on the Form.">Order No.</b>
                    <CFormInput
                      type="text"
                      required
                      min="1"
                      name="order_by"
                      value={AddFormData.order_by}
                      onChange={(e) => {
                        const temp = e.target.value.replace(/[^0-9A-Z, ]+/gi, '')
                        HandleForm(e.target.name, temp)
                      }}
                      placeholder="Enter Order Number"
                      maxLength={80}
                    />
                  </div>
                </CCol>

                <CCol md={8}>
                  <div className="p-1">
                    <b>Title of the Addon Field</b>
                    <CFormInput
                      type="text"
                      required
                      name="title"
                      value={AddFormData.title}
                      onChange={(e) => {
                        const temp = e.target.value.replace(/[^0-9A-Z, ]+/gi, '')
                        HandleForm(e.target.name, temp)
                      }}
                      placeholder="Enter Title"
                      maxLength={80}
                    />
                  </div>
                </CCol>

                <CCol
                  md={12}
                  className="mt-3"
                  style={{
                    display: AddFormData.field_type === 'select' ? '' : 'none',
                  }}
                >
                  <div className="p-1">
                    <b>Options for the Dropdown i.e. Option 1, Option 2 (Comma Seperated Value)</b>
                    <CFormTextarea
                      type="text"
                      required={AddFormData.field_type === 'select' ? true : false}
                      name="options"
                      value={AddFormData.options}
                      onChange={(e) => {
                        const temp = e.target.value.replace(/[^0-9A-Z, ]+/gi, '')
                        HandleForm(e.target.name, temp)
                      }}
                      placeholder="Enter Options for the Dropdown i.e. Option 1, Option 2 (Comma Seperated Value)"
                      maxLength={80}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <b>Input Type</b>
                    <CFormSelect
                      required
                      name="field_type"
                      value={AddFormData.field_type}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="">Select</option>
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Drop Down</option>
                    </CFormSelect>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div className="p-1">
                    <b>Required Field</b>
                    <CFormSelect
                      required
                      name="is_required"
                      value={AddFormData.is_required}
                      onChange={(e) => {
                        HandleForm(e.target.name, e.target.value)
                      }}
                    >
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <div className="p-1 mt-2 text-center">
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
                    setShowAddAddonField(false)
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

FormFieldAdd.propTypes = {
  ForID: PropTypes.any,
  setShowAddAddonField: PropTypes.any,
  FilterFormFieldssList: PropTypes.any,
  for_form: PropTypes.any,
}

export default FormFieldAdd

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CForm,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'

const AddProduct = ({ ForDataID, ForData, FilterDataList, setShowUploadBill }) => {
  const [FormData, setFormData] = useState({
    ind: '',
    cat_id: ForData.cat_id,
    prd_id: ForData.prd_id,
    quantity: '',
    remark: '',
    status: 1,
    device: localStorage.getItem('DeviceDetails'),
  })

  const HandleFormData = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value })
  }

  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  const SubmitFormData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/addProductUsages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(FormData),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            setShowUploadBill(false)
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

  const [PrdCatiData, setPrdCatiData] = useState([])
  const getPrdCatiData = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdCatiData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setPrdCatiData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  const [PrdUnitsData, setPrdUnitsData] = useState([])
  const getPrdUnitsData = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getPrdUnitsData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setPrdUnitsData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getPrdCatiData()
    getPrdUnitsData()
    if (
      ForDataID &&
      ForDataID !== '' &&
      ForDataID !== '0' &&
      ForDataID !== 0 &&
      ForDataID !== 'NEW'
    ) {
      //   productGetDetails(ForDataID)
    }
  }, [ForDataID])

  return (
    <CRow>
      <CCol xs={8}>
        <h3 className="mb-4">Adding Consumption/ External for {ForData.title}</h3>
      </CCol>
      <CCol xs={4} className="text-end d-none">
        <CButton color="primary" className="me-3">
          <CIcon icon={cilPlus} />
        </CButton>
        Add Field
      </CCol>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitFormData(e)
              }}
            >
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    required
                    className="mb-3"
                    max={Number(localStorage.getItem(`prd_${ForData.prd_id}`))}
                    name="quantity"
                    label="Quantity"
                    maxLength={80}
                    value={FormData.quantity}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Quantity"
                  />
                  <CFormTextarea
                    type="text"
                    rows={3}
                    name="remark"
                    label="Remark"
                    maxLength={255}
                    value={FormData.remark}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Remark"
                  />
                </CCol>
                <CCol className="readonlySection" ms={6}>
                  <div className="spanry"></div>
                  <CFormSelect
                    required
                    className="mb-3"
                    name="unit"
                    label="Unit"
                    maxLength={80}
                    value={ForData.unit}
                  >
                    <option value="">Select Unit</option>
                    {PrdUnitsData.map((s) => (
                      <option value={s.unit_id} key={s.unit_id}>
                        {s.title}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormSelect
                    type="text"
                    required
                    className="mb-3"
                    name="category"
                    label="Category"
                    value={ForData.category}
                  >
                    <option value="">Select Category</option>
                    {PrdCatiData.map((s) => (
                      <option value={s.cat_id} key={s.cat_id}>
                        {s.title}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow>
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CCol lg={12} className="text-center">
                  <CButton type="submit" color="primary" className="me-3 px-4">
                    Save
                  </CButton>
                  <CButton
                    type="button"
                    color="dark"
                    variant="outline"
                    className="px-4"
                    onClick={() => {
                      setShowUploadBill(false)
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

AddProduct.propTypes = {
  ForDataID: PropTypes.any,
  ForData: PropTypes.any,
  FilterDataList: PropTypes.any,
  setShowUploadBill: PropTypes.any,
}

export default AddProduct

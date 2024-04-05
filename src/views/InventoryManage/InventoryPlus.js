import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CForm,
  CFormSelect,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'

// var tempDelivered = 0
// var tempPrdID = 0

const AddVendor = ({ setShowInventaryPlus, FetchDataList, ActionCategoryID, ActionProductID }) => {
  const [PrdUnit, setPrdUnit] = useState(0)
  const [ButtonDisplay, setButtonDisplay] = useState('block')
  const [FormsData, setFormsData] = useState({
    ib_id: 0,
    status: 1,
    cat_id: ActionCategoryID,
    prd_id: ActionProductID,
    ind: 0,
    testing: 3,
    quantity: '',
    remark: '',
    testingRemark: '',
    testingQty: 0,
  })
  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  function handleForms(e) {
    setFormsData({ ...FormsData, [e.target.name]: e.target.value })
  }

  const SubmitFormData = async (e) => {
    e.preventDefault()
    setButtonDisplay('none')
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/addPlus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(FormsData),
      })
      const resJson = await res.json()
      setButtonDisplay('block')
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            setShowInventaryPlus(false)
            FetchDataList()
            setAjaxMsg('')
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

  // for Master Data here
  const [PrdCatiData, setPrdCatiData] = useState([])
  const getPrdCatiData = async () => {
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
  const [PrdData, setPrdData] = useState([])
  const getPrdData = async (category) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getListData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
          category,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setPrdData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }
  const [PrdUnitsData, setPrdUnitsData] = useState([])
  const getPrdUnitsData = async () => {
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
  // for Master Data here
  useEffect(() => {
    getPrdCatiData()
    getPrdUnitsData()
    getPrdData(ActionCategoryID)
  }, [ActionCategoryID])

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="text-left mb-2">
          Add Quantity
          <div style={{ display: 'none', float: 'right' }}>
            <Link to="/manage-products-uom" className="btn pt-0 pb-0 pr-1 pl-1 btn-info text-white">
              UOM
            </Link>
            &nbsp;
            <Link
              to="/manage-products-category"
              className="btn pt-0 pb-0 pr-1 pl-1 btn-info text-white"
            >
              Category
            </Link>
            &nbsp;
            <Link to="/manage-products" className="btn pt-0 pb-0 pr-1 pl-1 btn-success text-white">
              Products
            </Link>
          </div>
          <div style={{ clear: 'both' }}></div>
        </h3>
      </CCol>
      {/* {console.log(PrdData)}
      {console.log(PrdUnitsData)} */}
      <CCol lg={12}>
        <CCard className="mb-0 p-0">
          <CCardBody>
            <CForm
              autoComplete="off"
              autofill="off"
              onSubmit={(e) => {
                SubmitFormData(e)
              }}
            >
              <CRow className="mb-0">
                <CCol md={6}>
                  <CFormSelect
                    value={FormsData.cat_id}
                    required
                    name="cat_id"
                    label="Category"
                    maxLength={90}
                    onChange={(e) => {
                      handleForms(e)
                      getPrdData(e.target.value)
                    }}
                  >
                    <option value="">Select Category</option>
                    {PrdCatiData.map((item) => (
                      <option value={item.cat_id} key={item.cat_id}>
                        {item.title}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    value={FormsData.prd_id}
                    required
                    name="prd_id"
                    label="Product"
                    maxLength={90}
                    onChange={(e) => {
                      handleForms(e)
                      PrdData.map((s) => {
                        if (Number(e.target.value) === s.prd_id) {
                          setPrdUnit(s.unit)
                        }
                        return ''
                      })
                    }}
                  >
                    <option value="">Select Product</option>
                    {PrdData.map((item) => (
                      <option value={item.prd_id} key={item.prd_id}>
                        {item.title} ({item.cat_no})
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    min={1}
                    type="number"
                    name="quantity"
                    label="Quantity"
                    value={FormsData.quantity}
                    onChange={(e) => {
                      handleForms(e)
                    }}
                    placeholder="Enter Quantity"
                  />
                  <label>
                    {PrdUnitsData.map((s_unit) => (
                      <span key={s_unit.unit_id}>
                        {Number(PrdUnit) === Number(s_unit.unit_id) ? `UOM: ${s_unit.title}` : ''}
                      </span>
                    ))}
                  </label>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="remark"
                    label="Remark"
                    maxLength={50}
                    value={FormsData.remark}
                    onChange={(e) => {
                      handleForms(e)
                    }}
                    placeholder="Enter Remark"
                  />
                </CCol>

                <CCol md={4}></CCol>
              </CRow>

              <CRow>
                <div className="hideifempty mb-0" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CCol lg={12} className="text-center mt-1">
                  <CButton
                    type="submit"
                    color="primary"
                    className=""
                    style={{ display: ButtonDisplay }}
                  >
                    Submit
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
  setShowInventaryPlus: PropTypes.any,
  FetchDataList: PropTypes.any,
  ActionCategoryID: PropTypes.any,
  ActionProductID: PropTypes.any,
}

export default AddVendor

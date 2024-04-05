import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import CIcon from '@coreui/icons-react'
import { cilFile, cilPlus } from '@coreui/icons'
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
import { NODEAPIURL, UPLOADSsURL, showFulldatetimein } from '../../config'

const AddVendor = ({ ForDataID, setShowUploadBill, FilterDataList }) => {
  const [ReqData, setReqData] = useState({})
  const [BillData, setBillData] = useState({
    icr_id: ForDataID,
    bill_file: '',
    bill_date: '',
    dateDelivery: '',
  })
  const [FormDataHere, setFormDataHere] = useState({
    ReqData,
    BillData,
    icr_id:
      ForDataID && ForDataID !== '' && ForDataID !== '0' && ForDataID !== 0 && ForDataID !== 'NEW'
        ? ForDataID
        : 0,
    device: localStorage.getItem('DeviceDetails'),
  })
  const [VendorList, setVendorList] = useState([])
  const FetchvendorList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/vendor/getListData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Act_status: 1 }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setVendorList(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  // for add Inventary Producst will be here
  // , setDefaultProductList
  const [DefaultProductList] = useState([
    {
      ind: 1,
      cat_id: 0,
      testing: 0,
      prd_id: 0,
      quantity: '',
      unitName: '',
      rate: '',
      tax: 5,
      testingQty: '',
      testingRemark: '',
    },
  ])
  const [ProductList, setProductList] = useState(DefaultProductList)
  const handleAddProductList = (ind) => {
    setProductList((temp) => [
      ...temp,
      {
        ind,
        cat_id: 0,
        testing: 0,
        prd_id: 0,
        quantity: '',
        rate: '',
        tax: 5,
        testingQty: '',
        testingRemark: '',
      },
    ])
  }
  const handleEditProductList = (changeId, ind, val) => {
    ProductList[changeId][ind] = val
  }
  const handleRemoveProductList = (ind) => {
    if (ind !== 1) {
      setProductList(ProductList.filter((item) => item.ind !== ind))
    }
  }
  const RefreshProductList = () => {
    // const temp = Number(ProductList.length) + 10000
    const temp = 99999999
    handleAddProductList(temp)
    handleRemoveProductList(temp)
  }
  // for add Inventary Producst will be here
  const SubmitFormData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/SubmitTestingResult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(FormDataHere),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setShowUploadBill(false)
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            setShowUploadBill(false)
            FilterDataList()
            // window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
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
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getBillDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ib_id: ForDataID }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.status && resJson.status === 1) {
        setFormDataHere(resJson.data)
        setReqData(resJson.data.ReqData)
        if (resJson.data.BillData && resJson.data.BillData.ib_id) {
          setBillData(resJson.data.BillData)
        }
        if (resJson.data.DeliveryProducts && resJson.data.DeliveryProducts.length > 0) {
          setProductList(resJson.data.DeliveryProducts)
        }
        // console.log(resJson.data)
      } else {
        alert(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  // for Master Data here
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
  const [PrdData, setPrdData] = useState([])
  const getPrdData = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getListData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
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
  // for Master Data here
  useEffect(() => {
    FetchvendorList()
    if (
      ForDataID &&
      ForDataID !== '' &&
      ForDataID !== '0' &&
      ForDataID !== 0 &&
      ForDataID !== 'NEW'
    ) {
      vendorGetDetails(ForDataID)
    }
    getPrdCatiData()
    getPrdData()
    getPrdUnitsData()
  }, [ForDataID])

  function checkValueExist(onArray, Index1, Index2, DefaultVal) {
    return onArray && onArray[Index1] && onArray[Index1][Index2]
      ? onArray[Index1][Index2]
      : DefaultVal
  }

  return (
    <CRow>
      <CCol xs={6}>
        <h3 className="mb-4">
          {ForDataID &&
          ForDataID !== '' &&
          ForDataID !== '0' &&
          ForDataID !== 0 &&
          ForDataID !== 'NEW'
            ? 'Testing Result'
            : 'Testing Result'}
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
              <CRow className="mb-2 d-none">
                <CCol className="readonlySection" md={3}>
                  <div className="spanry"></div>
                  <CFormSelect
                    type="text"
                    required
                    name="ven_id"
                    readonly
                    label="Vendor"
                    maxLength={90}
                    value={checkValueExist(FormDataHere, 'ReqData', 'ven_id', 0)}
                    onChange={(e) => {
                      // HandleFormData(e)
                    }}
                    placeholder="Enter Name"
                  >
                    {VendorList.map((item) => (
                      <option
                        value={item.ven_id}
                        key={item.ven_id}
                        style={{
                          display:
                            Number(checkValueExist(FormDataHere, 'ReqData', 'ven_id', 0)) ===
                            Number(item.ven_id)
                              ? 'SGHDSHGKDSGHTK'
                              : 'none',
                        }}
                      >
                        {item.name}
                        {item.company.trim() !== '' ? ` (${item.company})` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol className="readonlySection" md={3}>
                  <div className="spanry"></div>
                  <CFormInput
                    readonly
                    type="text"
                    name="e_remark"
                    label="Remark"
                    maxLength={50}
                    value={checkValueExist(FormDataHere, 'ReqData', 'e_remark', 0)}
                    onChange={(e) => {
                      // HandleFormData(e)
                    }}
                    placeholder="Enter Permit Number"
                  />
                </CCol>
                <CCol className="readonlySection" md={3}>
                  <div className="spanry"></div>
                  <CFormInput
                    readonly
                    type="text"
                    name="a_remark"
                    label="Admin Remark"
                    maxLength={50}
                    value={checkValueExist(FormDataHere, 'ReqData', 'a_remark', 0)}
                    onChange={(e) => {
                      // HandleFormData(e)
                    }}
                    placeholder="Enter Permit Number"
                  />
                </CCol>
                <CCol md={3}>
                  <label>
                    Created on
                    {showFulldatetimein(checkValueExist(FormDataHere, 'ReqData', 'createdAt', 0))}
                  </label>
                  <a
                    href={`${UPLOADSsURL}${checkValueExist(
                      FormDataHere,
                      'ReqData',
                      'ven_file',
                      0,
                    )}`}
                    target="_BLANK"
                    rel="noreferrer"
                    className=""
                  >
                    <CIcon icon={cilFile} style={{ width: '50px', height: '50px' }} />
                  </a>
                </CCol>
              </CRow>
              <CRow className="mb-2 d-none readonlySection">
                <div className="spanry"></div>
                <CCol lg={3}>
                  <CFormInput
                    readonly
                    className="text-danger"
                    type="date"
                    name="bill_date"
                    label="Bill Date"
                    maxLength={50}
                    value={BillData.bill_date}
                    onChange={(e) => {
                      setBillData({ ...BillData, [e.target.name]: e.target.value })
                    }}
                    placeholder="Enter Permit Number"
                  />
                </CCol>

                <CCol lg={3}>
                  <CFormInput
                    readonly
                    className="text-success"
                    type="date"
                    name="dateDelivery"
                    label="Date of Delivery"
                    maxLength={50}
                    value={BillData.dateDelivery}
                    onChange={(e) => {
                      setBillData({ ...BillData, [e.target.name]: e.target.value })
                    }}
                    placeholder="Enter Permit Number"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12}>
                  <div>
                    {ProductList.map((sPortFol, run) => (
                      <div
                        className="row mb-3 pt-3 mx-0 align-items-center"
                        key={sPortFol.ind}
                        style={{
                          position: 'relative',
                          display: sPortFol.testing === 3 ? 'none' : '',
                          background: '#f5f5f5',
                          border: '1px solid #accad6',
                          margin: '20px auto',
                          padding: '20px 10px',
                        }}
                      >
                        <div className="col-md-3 readonlySection">
                          <div className="spanry"></div>
                          <div className="form-group">
                            <label>Category</label>
                            <select
                              readOnly
                              required
                              name="cat_id"
                              className="form-control"
                              value={sPortFol.cat_id}
                              onChangeCapture={(e) => {
                                handleEditProductList(run, e.target.name, e.target.value)
                                RefreshProductList()
                              }}
                            >
                              <option value="">Select Type</option>
                              {PrdCatiData.map((s_cati) => (
                                <option value={s_cati.cat_id} key={s_cati.cat_id}>
                                  {s_cati.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 readonlySection">
                          <div className="spanry"></div>
                          <div className="form-group">
                            <label>Select Product</label>
                            <select
                              required
                              name="prd_id"
                              className="form-control"
                              value={sPortFol.prd_id}
                              onChangeCapture={(e) => {
                                RefreshProductList()
                                // unitName
                                handleEditProductList(run, e.target.name, e.target.value)
                              }}
                            >
                              <option value="">Select Products</option>
                              {PrdData.map((s_prd) => (
                                <option
                                  value={s_prd.prd_id}
                                  key={s_prd.prd_id}
                                  style={{
                                    display:
                                      Number(s_prd.category) === Number(sPortFol.cat_id)
                                        ? ''
                                        : 'none',
                                  }}
                                >
                                  {s_prd.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3 readonlySection">
                          <div className="spanry"></div>
                          <label>
                            Quantity
                            {PrdData.map((s_prd) => (
                              <span
                                key={s_prd.prd_id}
                                style={{
                                  display:
                                    Number(s_prd.prd_id) === Number(sPortFol.prd_id) ? '' : 'none',
                                }}
                              >
                                {PrdUnitsData.map((s_unit) => (
                                  <span
                                    key={s_unit.unit_id}
                                    style={{
                                      display:
                                        Number(s_prd.unit) === Number(s_unit.unit_id) ? '' : 'none',
                                    }}
                                  >
                                    <b>&nbsp;({s_unit.title})</b>
                                  </span>
                                ))}
                              </span>
                            ))}
                          </label>
                          <div className="form-group">
                            <input
                              min="1"
                              required
                              className="form-control"
                              type="number"
                              step="1"
                              name="quantity"
                              placeholder="Enter Quantity"
                              value={sPortFol.quantity}
                              onChange={(e) => {
                                RefreshProductList()
                                handleEditProductList(run, e.target.name, e.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="m-2"></div>
                        <div className="col-md-3">
                          <label>Testing Quantity</label>
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="number"
                              step="1"
                              name="testingQty"
                              placeholder="Enter Testing Quantity"
                              value={sPortFol.testingQty}
                              onChange={(e) => {
                                RefreshProductList()
                                handleEditProductList(run, e.target.name, e.target.value)
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <label>Testing Status</label>
                          <div className="form-group">
                            <select
                              required
                              className="form-control"
                              type="number"
                              step="1"
                              name="testing"
                              value={sPortFol.testing}
                              onChange={(e) => {
                                handleEditProductList(run, e.target.name, e.target.value)
                                RefreshProductList()
                              }}
                            >
                              <option value="0">Select Testing Status</option>
                              <option value="1">Pass</option>
                              <option value="2">Fail</option>
                              {/* <option value="3">No Need</option> */}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label>Testing Remark</label>
                          <div className="form-group">
                            <input
                              maxLength="255"
                              className="form-control"
                              type="text"
                              step="1"
                              name="testingRemark"
                              placeholder="Enter Testing Remark"
                              value={sPortFol.testingRemark}
                              onChange={(e) => {
                                RefreshProductList()
                                handleEditProductList(run, e.target.name, e.target.value)
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className="d-none"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div className="text-warning">
                            Total Amount:&nbsp;
                            {(Number(sPortFol.rate) * Number(sPortFol.quantity)).toFixed(2)}
                          </div>

                          <div className="text-danger">
                            Tax Amount:
                            {(
                              (Number(sPortFol.rate) *
                                Number(sPortFol.quantity) *
                                Number(sPortFol.tax)) /
                              100
                            ).toFixed(2)}
                          </div>

                          <div className="text-info">
                            Net Amount:
                            {(
                              (Number(sPortFol.rate) *
                                Number(sPortFol.quantity) *
                                Number(sPortFol.tax)) /
                                100 +
                              Number(sPortFol.rate)
                            ).toFixed(2)}
                          </div>
                        </div>
                        <hr className="mt-3" />
                        {sPortFol.testing === 1 ? (
                          <div className="text-white bg-dark text-center">Testing Pass</div>
                        ) : (
                          ''
                        )}

                        {sPortFol.testing === 2 ? (
                          <div className="text-white bg-dark text-center">Testing Failed</div>
                        ) : (
                          ''
                        )}

                        {sPortFol.testing === 3 ? (
                          <div className="text-white bg-dark text-center">Testing No Needed</div>
                        ) : (
                          ''
                        )}
                      </div>
                    ))}
                    <div style={{ display: 'none' }}>
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => {
                          // HandleArrayForm('ProductList', ProductList);
                          handleAddProductList(Number(ProductList.length) + 1)
                        }}
                      >
                        <CIcon icon={cilPlus} />
                        &nbsp;More Product
                      </button>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CCol lg={12} className="text-center">
                  <CButton
                    type="submit"
                    color="primary"
                    className="me-3 px-4"
                    onClick={() => {
                      setFormDataHere({
                        device: localStorage.getItem('DeviceDetails'),
                        ReqData,
                        BillData,
                        ProductList,
                        icr_id:
                          ForDataID &&
                          ForDataID !== '' &&
                          ForDataID !== '0' &&
                          ForDataID !== 0 &&
                          ForDataID !== 'NEW'
                            ? ForDataID
                            : 0,
                      })
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
                      // window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
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

AddVendor.propTypes = {
  ForDataID: PropTypes.any,
  setShowUploadBill: PropTypes.any,
  FilterDataList: PropTypes.any,
}

export default AddVendor

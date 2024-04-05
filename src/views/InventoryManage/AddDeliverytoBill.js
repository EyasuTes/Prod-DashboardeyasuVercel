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
  CFormSelect,
} from '@coreui/react'
import { NODEAPIURL, BASEWEBURL } from '../../config'

// var tempDelivered = 0
// var tempPrdID = 0

const AddVendor = ({ ForDataID, setShowDelivery, FilterDataList }) => {
  const [ButtonDisplay, setButtonDisplay] = useState('block')
  const [AddDeliveryData, setAddDeliveryData] = useState({
    ib_id: ForDataID,
    status: 1,
    cat_id: 0,
    prd_id: 0,
    testing: 0,
    quantity: '',
    remark: '',
    maxQuantity: 9999999,
  })
  const [AddDeliveryForm, setAddDeliveryForm] = useState(false)
  const [BillData, setBillData] = useState({
    ib_id: ForDataID,
    ven_id: 0,
    e_remark: '',
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
    },
  ])
  const [ProductList, setProductList] = useState(DefaultProductList)
  const [DeliveryProducts, setDeliveryProducts] = useState([])

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
    const temp = Number(ProductList.length) + 1
    handleAddProductList(temp)
    handleRemoveProductList(temp)
  }
  // for add Inventary Producst will be here
  const SubmitFormData = async (e) => {
    e.preventDefault()
    setButtonDisplay('none')
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/AddDeliveryData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(AddDeliveryData),
      })
      const resJson = await res.json()
      setButtonDisplay('block')
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          vendorGetDetails(ForDataID)
          // setAddDeliveryForm(true)
          setAddDeliveryForm(false)
          setTimeout(() => {
            // setShowDelivery(false)
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
      const res = await fetch(`${NODEAPIURL}/admin/inventory/getBillDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ib_id: ForDataID }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.status && resJson.status === 1) {
        if (resJson.data.BillData && resJson.data.BillData.ib_id) {
          setBillData(resJson.data.BillData)
        }

        if (resJson.data.BillProducts && resJson.data.BillProducts.length > 0) {
          setProductList(resJson.data.BillProducts)
        }

        if (resJson.data.DeliveryProducts && resJson.data.DeliveryProducts.length > 0) {
          setDeliveryProducts(resJson.data.DeliveryProducts)
        }
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

  return (
    <CRow>
      <div
        style={{
          position: 'fixed',
          background: '#0f0f0fcc',
          padding: '20px',
          margin: 'auto',
          display: AddDeliveryForm ? '' : 'none',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '888888',
        }}
        onClick={() => {
          setAddDeliveryForm(false)
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          background: '#fff',
          padding: '10px',
          margin: 'auto',
          borderRadius: '20px',
          display: AddDeliveryForm ? '' : 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '999999',
          maxWidth: '50%',
          maxHeight: '50%',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <button
            className="btn btn-outline-danger d-none"
            onClick={() => {
              setAddDeliveryForm(false)
            }}
          >
            X
          </button>
        </div>
        <CForm
          autoComplete="off"
          autofill="off"
          onSubmit={(e) => {
            SubmitFormData(e)
          }}
        >
          <div className="row">
            <div className="col-md-4" style={{ paddingTop: '20px' }}>
              {PrdCatiData.map((s_cati) => (
                <span
                  className="btn btn-outline-info mb-3"
                  key={s_cati.cat_id}
                  style={{
                    display: AddDeliveryData.cat_id === s_cati.cat_id ? '' : 'none',
                    width: '100%',
                  }}
                >
                  <b>Category: </b>
                  {s_cati.title}
                </span>
              ))}
              <br />
              {PrdData.map((s_prd) => (
                <span
                  className="btn btn-outline-success mb-3"
                  key={s_prd.cat_id}
                  style={{
                    display: AddDeliveryData.prd_id === s_prd.prd_id ? '' : 'none',
                    width: '100%',
                  }}
                >
                  <b>Product: </b>
                  {s_prd.title}
                </span>
              ))}
              <br />
              {PrdData.map((s_prd) => (
                <span
                  key={s_prd.prd_id}
                  style={{
                    display: Number(s_prd.prd_id) === Number(AddDeliveryData.prd_id) ? '' : 'none',
                  }}
                >
                  {PrdUnitsData.map((s_unit) => (
                    <span
                      className="btn btn-outline-danger"
                      key={s_unit.unit_id}
                      style={{
                        width: '100%',
                        display: Number(s_prd.unit) === Number(s_unit.unit_id) ? '' : 'none',
                      }}
                    >
                      <b>Unit: </b>
                      {s_unit.title}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div className="col-md-8">
              <div
                style={{
                  padding: '10px',
                  border: '1px solid #f5f5f5',
                  marginTop: '20px',
                }}
              >
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    required
                    type="number"
                    placeholder="Enter Delivered Quantity"
                    value={AddDeliveryData.quantity}
                    min={1}
                    max={AddDeliveryData.maxQuantity ? AddDeliveryData.maxQuantity : 9999999}
                    name="quantity"
                    className="form-control"
                    onChange={(e) => {
                      setAddDeliveryData({ ...AddDeliveryData, [e.target.name]: e.target.value })
                    }}
                  />
                </div>

                <div className="form-group mt-1">
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    required
                    maxLength={20}
                    placeholder="Enter Delivery Date"
                    min={1}
                    value={AddDeliveryData.dod}
                    name="dod"
                    className="form-control"
                    onChange={(e) => {
                      setAddDeliveryData({ ...AddDeliveryData, [e.target.name]: e.target.value })
                    }}
                  />
                </div>

                <div className="form-group mt-1">
                  <label>Need Testing</label>
                  <select
                    name="testing"
                    className="form-control"
                    onChange={(e) => {
                      setAddDeliveryData({ ...AddDeliveryData, [e.target.name]: e.target.value })
                    }}
                  >
                    <option value="0">Yes</option>
                    <option value="3">No</option>
                  </select>
                </div>

                <div className="form-group mt-1">
                  <label>Delivery Remark</label>
                  <input
                    type="text"
                    value={AddDeliveryData.remark}
                    maxLength={250}
                    placeholder="Enter Delivery Remark"
                    min={1}
                    name="remark"
                    className="form-control"
                    onChange={(e) => {
                      setAddDeliveryData({ ...AddDeliveryData, [e.target.name]: e.target.value })
                    }}
                  />
                </div>
                <div className="hideifempty mb-2" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <div className="text-center mt-2" style={{ display: ButtonDisplay }}>
                  <CButton
                    type="submit"
                    color="danger"
                    className="text-white"
                    onClick={() => {
                      setAddDeliveryForm(false)
                    }}
                  >
                    Cancel
                  </CButton>
                  &nbsp;&nbsp;
                  <CButton type="submit" color="success" className="text-white">
                    Save
                  </CButton>
                </div>
              </div>
            </div>
          </div>
        </CForm>
      </div>
      <CCol xs={6}>
        <h3 className="mb-2 mb-2">
          {ForDataID &&
          ForDataID !== '' &&
          ForDataID !== '0' &&
          ForDataID !== 0 &&
          ForDataID !== 'NEW'
            ? `Add Delivery to PO #${ForDataID}`
            : 'Create PO'}
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
                // SubmitFormData(e)
              }}
            >
              <CRow className="mb-2">
                <CCol md={4}>
                  <CFormSelect
                    readOnly
                    type="text"
                    required
                    name="ven_id"
                    label="Vendor"
                    maxLength={90}
                    value={BillData.ven_id}
                    onChange={(e) => {
                      setBillData({ ...BillData, [e.target.name]: e.target.value })
                    }}
                  >
                    {/* <option value="">Select Vendor</option> */}
                    {VendorList.map((item) => (
                      <option
                        value={item.ven_id}
                        key={item.ven_id}
                        style={{ display: BillData.ven_id === item.ven_id ? '' : 'none' }}
                      >
                        {item.name}
                        {item.company.trim() !== '' ? ` (${item.company})` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={4}>
                  <CFormInput
                    readOnly
                    type="text"
                    name="e_remark"
                    label="Remark"
                    maxLength={50}
                    value={BillData.e_remark}
                    onChange={(e) => {
                      setBillData({ ...BillData, [e.target.name]: e.target.value })
                    }}
                    placeholder="Enter Remark"
                  />
                </CCol>

                <CCol md={4}></CCol>
              </CRow>
              <CRow>
                <CCol md={12}>
                  <div className="mt-4">
                    <h3 className="text-center">Products</h3>
                    {ProductList.map((sPortFol, run) => (
                      <div
                        key={`${sPortFol.prd_id}${sPortFol.updateAt}`}
                        style={{
                          background: '#f5f5f5',
                          border: '1px solid #accad6',
                          margin: '20px auto',
                          padding: '20px 10px',
                        }}
                      >
                        <div
                          className="row mb-3 pt-3 mx-0 align-items-center"
                          style={{
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '0',
                              bottom: '0',
                              zIndex: 777777,
                              left: '0',
                              right: '0',
                            }}
                          ></div>
                          <div className="col-md-2">
                            <div className="form-group">
                              <label>Category</label>
                              <select
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
                          <div className="col-md-3">
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

                          <div className="col-md-2">
                            <label>Rate</label>
                            <div className="form-group">
                              <input
                                required
                                min="0"
                                step="0.01"
                                className="form-control"
                                type="number"
                                name="rate"
                                placeholder="Enter Rate"
                                value={sPortFol.rate}
                                onChange={(e) => {
                                  RefreshProductList()
                                  handleEditProductList(run, e.target.name, e.target.value)
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-2">
                            <label>Tax (%)</label>
                            <div className="form-group">
                              <input
                                required
                                min="0"
                                step="0.5"
                                className="form-control"
                                type="number"
                                name="tax"
                                placeholder="Enter Tax Rate"
                                value={sPortFol.tax}
                                onChange={(e) => {
                                  handleEditProductList(run, e.target.name, e.target.value)
                                  RefreshProductList()
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-2">
                            <label>
                              Quantity
                              {PrdData.map((s_prd) => (
                                <span
                                  key={s_prd.prd_id}
                                  style={{
                                    display:
                                      Number(s_prd.prd_id) === Number(sPortFol.prd_id)
                                        ? ''
                                        : 'none',
                                  }}
                                >
                                  {PrdUnitsData.map((s_unit) => (
                                    <span
                                      key={s_unit.unit_id}
                                      style={{
                                        display:
                                          Number(s_prd.unit) === Number(s_unit.unit_id)
                                            ? ''
                                            : 'none',
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

                          <div
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
                        </div>
                        <div className="forDeliveryFormAndList text-center">
                          <CButton
                            color="info"
                            className="text-white"
                            onClick={() => {
                              setAjaxMsg('')
                              setAddDeliveryForm(true)
                              setAddDeliveryData({
                                ib_id: ForDataID,
                                status: 1,
                                cat_id: sPortFol.cat_id,
                                prd_id: sPortFol.prd_id,
                                quantity: '',
                                testing: 0,
                                dod: '',
                                remark: '',
                                maxQuantity: sPortFol.quantity,
                              })
                            }}
                          >
                            Add Delivery
                          </CButton>
                          <div
                            style={{
                              padding: '20px',
                              background: '#fff',
                              marginTop: '10px',
                            }}
                          >
                            <div className="row mt-1">
                              <div className="col-md-3">
                                <b>Quantity</b>
                              </div>
                              <div className="col-md-3">
                                <b>Date of Delivery</b>
                              </div>
                              <div className="col-md-3">
                                <b>Testing</b>
                              </div>
                              <div className="col-md-3">
                                <b>Delivery Remark</b>
                              </div>
                            </div>
                            {DeliveryProducts.map((s) => (
                              <div className="mt-3" key={`${s.prd_id}${s.updateAt}`}>
                                {Number(sPortFol.prd_id) === Number(s.prd_id) ? (
                                  <div className="row">
                                    <div className="col-md-3">{s.quantity}</div>
                                    <div className="col-md-3">{s.dod}</div>
                                    <div className="col-md-3">
                                      {s.testing === 0 ? (
                                        <span className="btn btn-sm btn-warning text-white">
                                          Pending
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                      {s.testing === 1 ? (
                                        <span className="btn btn-sm btn-success text-white">
                                          Pass
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                      {s.testing === 2 ? (
                                        <span className="btn btn-sm btn-danger text-white">
                                          Fail
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                      {s.testing === 3 ? (
                                        <span className="btn btn-sm btn-info text-white">
                                          No Need
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                    <div className="col-md-3">{s.dod}</div>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <div className="hideifempty mb-2 d-none" style={AjaxMsgStyle}>
                  {AjaxMsg}
                </div>
                <CCol lg={12} className="text-center mt-4">
                  <CButton
                    type="button"
                    color="dark"
                    variant="outline"
                    className="px-4"
                    onClick={() => {
                      window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
                      setShowDelivery(false)
                    }}
                  >
                    Close Delivery Page
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
  setShowDelivery: PropTypes.any,
  FilterDataList: PropTypes.any,
}

export default AddVendor

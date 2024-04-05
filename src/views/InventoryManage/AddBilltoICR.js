import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash } from '@coreui/icons'
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

const AddVendor = ({ ForDataID, setShowUploadBill, FilterDataList }) => {
  const [BillData, setBillData] = useState({
    ib_id: ForDataID,
    ven_id: 0,
    e_remark: '',
  })
  const [FormDataHere, setFormDataHere] = useState({
    BillData,
    ib_id:
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
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/UpdateBillData`, {
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
        if (resJson.status === 1) {
          setAjaxMsgStyle({ color: 'green', padding: '5px' })
          setTimeout(() => {
            // window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
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
        if (resJson.data.BillData && resJson.data.BillData.ib_id) {
          setBillData(resJson.data.BillData)
        }
        if (resJson.data.BillProducts && resJson.data.BillProducts.length > 0) {
          setProductList(resJson.data.BillProducts)
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
      <CCol xs={6}>
        <h3 className="mb-2 mb-2">
          {ForDataID &&
          ForDataID !== '' &&
          ForDataID !== '0' &&
          ForDataID !== 0 &&
          ForDataID !== 'NEW'
            ? `Update PO #${ForDataID}`
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
                SubmitFormData(e)
              }}
            >
              <CRow className="mb-2">
                <CCol md={4}>
                  <CFormSelect
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
                    <option value="">Select Vendor</option>
                    {VendorList.map((item) => (
                      <option value={item.ven_id} key={item.ven_id}>
                        {item.name}
                        {item.company.trim() !== '' ? ` (${item.company})` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={4}>
                  <CFormInput
                    readonly
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
                  <div
                    className="mt-4"
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #accad6',
                      margin: '10px auto',
                      padding: '20px 10px',
                    }}
                  >
                    <h3 className="text-center">Products</h3>
                    {ProductList.map((sPortFol, run) => (
                      <div
                        className="row mb-3 pt-3 mx-0 align-items-center"
                        key={sPortFol.index}
                        style={{
                          position: 'relative',
                        }}
                      >
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

                        <div className="col-lg-1 text-right">
                          <button
                            type="button"
                            className="btn text-danger"
                            style={{
                              height: '40px',
                              display: sPortFol.ind === 1 ? 'none' : '',
                            }}
                            onClick={() => {
                              handleRemoveProductList(sPortFol.ind)
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
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
                      </div>
                    ))}
                    <div style={{ textAlign: 'right' }}>
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
                        BillData,
                        ProductList,
                        ib_id:
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
                      window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
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

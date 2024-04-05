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
import { NODEAPIURL, BASEWEBURL } from '../../config'
// for Addon Fields
import ListAddonsFieldPage from '../FormFields/List'
import ListAddonsFieldData from '../FormFields/ListData'
import ProductCategoryCreate from '../InventoryManage/ProductCategoryCreate'
import ProductUOMCreate from '../InventoryManage/ProductUOMCreate'
import { Link } from 'react-router-dom'
// for Addon Fields
import '../InventoryManage/inventory.css'

const AddProduct = ({ ForDataID, setShowAddData, FilterDataList, pageFrom, category }) => {
  const [ShowCategoryCreate, setShowCategoryCreate] = useState(false)
  const [ShowUnitCreate, setShowUnitCreate] = useState(false)
  // for Addon Fields
  const [AddonsFieldData, setAddonsFieldData] = useState([])
  const [ShowListAddonsFieldData, setShowListAddonsFieldData] = useState(
    <ListAddonsFieldData for_form="products" data_id={ForDataID} returnData={setAddonsFieldData} />,
  )
  const [ListAddonsFields, setListAddonsFields] = useState(false)
  // for Addon Fields
  const [FormData, setFormData] = useState({
    cat_no: '',
    unit: 0,
    title: '',
    brand: '',
    description: '',
    category: Number(category),
    subCategory: 0,
    minQuantity: 10,
    OrangeQuantity: 50,
    prd_id:
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
      const res = await fetch(`${NODEAPIURL}/admin/product/UpdateData`, {
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
            if (pageFrom !== 'invantory') {
              window.location.href = `${BASEWEBURL}/#/manage-products`
            }
            // window.location.href = `${BASEWEBURL}/#/manage-products`
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

  const productGetDetails = async (ForDataID) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd_id: ForDataID }),
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
      productGetDetails(ForDataID)
    }
  }, [ForDataID])

  return (
    <CRow>
      {/* For Add Category */}
      <div
        className="RYPOPUPBG"
        style={{
          display: ShowCategoryCreate ? '' : 'none',
        }}
        onClick={() => {
          setShowCategoryCreate(false)
        }}
      ></div>
      <div
        className="RYPOPUOCONTENT"
        style={{
          display: ShowCategoryCreate ? '' : 'none',
          maxWidth: '50%',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <button
            className="btn btn-outline-danger d-none"
            onClick={() => {
              setShowCategoryCreate(false)
            }}
          >
            X
          </button>
        </div>
        {ShowCategoryCreate ? (
          <ProductCategoryCreate
            ForDataID="new"
            setShowAddData={setShowCategoryCreate}
            FilterDataList={getPrdCatiData}
          />
        ) : (
          ''
        )}
      </div>
      {/* For Add Category */}

      {/* For Add Unit */}
      <div
        style={{
          position: 'fixed',
          background: '#0f0f0fcc',
          padding: '20px',
          margin: 'auto',
          display: ShowUnitCreate ? '' : 'none',
          overflow: 'auto',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '999999',
        }}
        onClick={() => {
          setShowUnitCreate(false)
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          background: '#fff',
          padding: '10px',
          margin: 'auto',
          borderRadius: '20px',
          display: ShowUnitCreate ? '' : 'none',
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
              setShowUnitCreate(false)
            }}
          >
            X
          </button>
        </div>
        {ShowUnitCreate ? (
          <ProductUOMCreate
            ForDataID="new"
            setShowAddData={setShowUnitCreate}
            FilterDataList={getPrdUnitsData}
          />
        ) : (
          ''
        )}
      </div>
      {/* For Add Unit */}

      {/* for Addon Fields */}
      <div style={{ display: ListAddonsFields ? '' : 'none' }}>
        <div
          className="ry_popup_bg"
          onClick={() => {
            setListAddonsFields(false)
            setShowListAddonsFieldData(
              <ListAddonsFieldData
                for_form="products"
                data_id={ForDataID}
                returnData={setAddonsFieldData}
              />,
            )
          }}
        ></div>
        <div className="ry_popup_content" style={{ maxWidth: '80%', maxHeight: '60%' }}>
          {ListAddonsFields ? <ListAddonsFieldPage for_form="products" /> : ''}
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
            ? 'Update Product'
            : 'Create Product'}
          <div style={{ float: 'right' }}>
            <Link
              to="/manage-products-category"
              className="btn btn-outline-info me-1"
              target="_BLANK"
            >
              View Category
            </Link>
            <Link to="/manage-products-uom" className="btn btn-outline-warning me-1">
              View UOM
            </Link>
            <button
              style={{ display: Number(localStorage.getItem('uType')) === 3 ? '' : 'none' }}
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setListAddonsFields(true)
                setShowListAddonsFieldData('')
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
        <CCard className="mb-1 p-1">
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
                  <CRow className="mb-1">
                    <CCol md={12}>
                      <CFormInput
                        type="text"
                        required
                        name="cat_no"
                        className="mb-3"
                        label="Catalogue No/ Ref No."
                        maxLength={80}
                        value={FormData.cat_no}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                        placeholder="Enter Catalogue No/ Ref No."
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormInput
                        type="text"
                        required
                        name="title"
                        label="Title"
                        maxLength={80}
                        value={FormData.title}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                        placeholder="Enter Title"
                      />
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol md={6}>
                      <label className="form-label">Category</label>
                      <span
                        type="button"
                        style={{ float: 'right' }}
                        className="text-info"
                        onClick={() => {
                          // HandleFormData(e)
                          FormData.category = 0
                          setShowCategoryCreate(true)
                          // setShowAddData(false)
                        }}
                      >
                        Add Category
                      </span>
                      <CFormSelect
                        required
                        className="mb-1"
                        name="category"
                        maxLength={80}
                        value={FormData.category}
                        onChange={(e) => {
                          FormData.subCategory = 0
                          HandleFormData(e)
                        }}
                      >
                        <option value="">Select Category</option>
                        {PrdCatiData.map((s) => (
                          <option
                            key={s.cat_id}
                            value={s.cat_id}
                            style={{
                              display: Number(s.parent) === 0 ? '' : 'none',
                            }}
                          >
                            {s.title}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormSelect
                        className="mb-1"
                        name="subCategory"
                        label="Sub Category"
                        maxLength={80}
                        value={FormData.subCategory}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                      >
                        <option value="">Select Sub Category</option>
                        {PrdCatiData.map((s) => (
                          <option
                            key={s.cat_id}
                            value={s.cat_id}
                            style={{
                              display:
                                s.parent !== 0 && Number(s.parent) === Number(FormData.category)
                                  ? ''
                                  : 'none',
                            }}
                          >
                            {s.title}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        required
                        name="brand"
                        label="Brand"
                        maxLength={90}
                        value={FormData.brand}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                        placeholder="Enter Brand"
                      />
                    </CCol>
                    <CCol md={6}>
                      <label className="form-label">UOM</label>
                      <span
                        type="button"
                        className="text-info"
                        style={{ float: 'right' }}
                        onClick={() => {
                          FormData.unit = 0
                          setShowUnitCreate(true)
                        }}
                      >
                        Add UOM
                      </span>
                      <CFormSelect
                        required
                        className="mb-1"
                        name="unit"
                        maxLength={80}
                        value={FormData.unit}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                      >
                        <option value="">Select Unit</option>
                        {PrdUnitsData.map((s) => (
                          <option value={s.unit_id} key={s.unit_id}>
                            {s.title}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow>
                    <CCol md={6}>
                      <CFormInput
                        type="number"
                        required
                        className="mb-1"
                        name="minQuantity"
                        label="Minimum Quantity Alert"
                        maxLength={80}
                        value={FormData.minQuantity}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="number"
                        required
                        className="mb-1"
                        name="OrangeQuantity"
                        label="Minimum Quantity Alert"
                        value={FormData.OrangeQuantity}
                        onChange={(e) => {
                          HandleFormData(e)
                        }}
                      />
                    </CCol>
                  </CRow>
                  <CFormTextarea
                    type="text"
                    rows={5}
                    name="description"
                    label="Description"
                    maxLength={500}
                    value={FormData.description}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Description"
                  />
                </CCol>
              </CRow>
              {ShowListAddonsFieldData}
              <CRow className="mt-1">
                <div className="hideifempty mb-1" style={AjaxMsgStyle}>
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
                      if (pageFrom !== 'invantory') {
                        window.location.href = `${BASEWEBURL}/#/manage-products`
                      }
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

AddProduct.propTypes = {
  ForDataID: PropTypes.any,
  setShowAddData: PropTypes.any,
  FilterDataList: PropTypes.any,
  pageFrom: PropTypes.any,
  category: PropTypes.any,
}

export default AddProduct

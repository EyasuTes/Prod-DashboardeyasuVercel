import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel'

import CIcon from '@coreui/icons-react'
import {
  cilMinus,
  cilPencil,
  cilPlus,
  // cilEnvelopeClosed,
  // cilMobile,
  // cilEnvelopeLetter,
  // cilMobile,
  // cilPencil,
  cilSave,
  cilSortAscending,
  cilSortDescending,
  // cilUser,
  // cilUser,
} from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CDropdownMenu,
  CDropdownItem,
  CNav,
  CDropdown,
  CDropdownToggle,
  // CNav,
  // CDropdown,
  // CDropdownMenu,
  // CDropdownItem,
  // CDropdownToggle,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'
import AddProductUsages from './AddProductUsages'
import ViewProductUsages from './viewProductUsages'
import InventoryPlus from './InventoryPlus'
import AddProduct from '../VendorManagement/AddProduct'
import './inventory.css'

let Act_status = 0
let CarIdSort = localStorage.getItem('SortInvtCati')
let SubCatIdSort = localStorage.getItem('SortInvtSubCati')
let keyword = ''
let SortStatusType = 'DESC'

const ProductsInventaryPage = () => {
  const tableRef = useRef(null)
  const [ShowUploadBill, setShowUploadBill] = useState(false)
  const [ListData, setListData] = useState([])
  const [availabeQty, setavailabeQty] = useState([])

  // const [Testingdata, setTestingdata] = useState([])
  const [ForDataID, setForDataID] = useState(0)
  const [ForDataType, setForDataType] = useState(0)
  const [ForData, setForData] = useState({})

  const FetchDataList = async () => {
    // alert(1)
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getProductInventaryList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          CarIdSort,
          SubCatIdSort,
          token: 'hello',
          Act_status: 1,
          SortStatusType,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      // setLeaveTypeData(resJson.leave_type)
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
      if (res.status === 200 && resJson.availabeQty && resJson.availabeQty.length > 0) {
        setavailabeQty(resJson.availabeQty)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const FilterDataList = async () => {
    setListData([])
    try {
      const res = await fetch(`${NODEAPIURL}/admin/product/getProductInventaryList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keyword,
          Act_status,
          SortStatusType,
          CarIdSort,
          SubCatIdSort,
          device: localStorage.getItem('DeviceDetails'),
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
      if (res.status === 200 && resJson.availabeQty && resJson.availabeQty.length > 0) {
        setavailabeQty(resJson.availabeQty)
      }
    } catch (err) {
      console.log(err)
    }
  }

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

  useEffect(() => {
    keyword = ''
    Act_status = 1
    CarIdSort = localStorage.getItem('SortInvtCati')
    SubCatIdSort = localStorage.getItem('SortInvtSubCati')
    SortStatusType = 'DESC'
    FetchDataList()
    getPrdCatiData()
  }, [])

  let AddForm = ''
  if (ShowUploadBill && ForDataType === 'add') {
    AddForm = (
      <AddProductUsages
        ForDataID={ForDataID}
        ForData={ForData}
        setShowUploadBill={setShowUploadBill}
        FilterDataList={FilterDataList}
      />
    )
  }

  if (ShowUploadBill && ForDataType === 'view') {
    AddForm = (
      <ViewProductUsages
        ForDataID={ForDataID}
        ForData={ForData}
        setShowUploadBill={setShowUploadBill}
      />
    )
  }

  function GetClassName(availabeQty, data) {
    var className = ''
    availabeQty.map((s) => {
      if (Number(data.prd_id) === Number(s.prd_id)) {
        if (Number(s.inQty) - Number(s.outQty) > Number(data.OrangeQuantity)) {
          className = 'bg-success'
        } else if (Number(s.inQty) - Number(s.outQty) < Number(data.minQuantity)) {
          className = 'bg-danger'
        } else {
          className = 'bg-warning'
        }
      }
      return ''
    })
    return className
  }

  function GetClassText(availabeQty, data) {
    var className = ''
    availabeQty.map((s) => {
      if (Number(data.prd_id) === Number(s.prd_id)) {
        if (Number(s.inQty) - Number(s.outQty) > Number(data.OrangeQuantity)) {
          className = 'text-success'
        } else if (Number(s.inQty) - Number(s.outQty) < Number(data.minQuantity)) {
          className = 'text-danger'
        } else {
          className = 'text-warning'
        }
      }
      return ''
    })
    return className
  }

  const [ShowProductPlus, setShowProductPlus] = useState(false)
  const [ShowInventaryPlus, setShowInventaryPlus] = useState(false)
  const [ActionCategoryID, setActionCategoryID] = useState(0)
  const [ActionProductID, setActionProductID] = useState(0)

  return (
    <CRow>
      <CCol md={12}>
        <div
          className="RYPOPUPBG"
          style={{ display: ShowInventaryPlus ? '' : 'none' }}
          onClick={() => {
            setShowInventaryPlus(false)
          }}
        ></div>
        <div
          className="RYPOPUOCONTENT"
          style={{
            display: ShowInventaryPlus ? '' : 'none',
            maxWidth: '50%',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <button
              className="btn btn-outline-danger d-none"
              onClick={() => {
                setShowInventaryPlus(false)
              }}
            >
              X
            </button>
          </div>
          {ShowInventaryPlus ? (
            <InventoryPlus
              setShowInventaryPlus={setShowInventaryPlus}
              FetchDataList={FetchDataList}
              ActionProductID={ActionProductID}
              ActionCategoryID={ActionCategoryID}
            />
          ) : (
            ''
          )}
        </div>
        {/* Add product from will be here */}
        <div
          style={{
            display: ShowProductPlus ? '' : 'none',
          }}
          className="RYPOPUPBG"
          onClick={() => {
            setShowProductPlus(false)
          }}
        ></div>
        <div
          className="RYPOPUOCONTENT"
          style={{
            display: ShowProductPlus ? '' : 'none',
            maxWidth: '80%',
            maxHeight: '90%',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <button
              className="btn btn-outline-danger d-none"
              onClick={() => {
                setShowProductPlus(false)
              }}
            >
              X
            </button>
          </div>
          {ShowProductPlus ? (
            <AddProduct
              setShowAddData={setShowProductPlus}
              pageFrom="invantory"
              ForDataID="NEW"
              category={CarIdSort}
              subcategory={SubCatIdSort}
              FilterDataList={FetchDataList}
            />
          ) : (
            ''
          )}
        </div>
        {/* Add product from will be here */}
      </CCol>
      <CCol md={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <h3 className="mb-0">Inventory</h3>
      </CCol>
      <CCol md={8} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <CForm className="mb-lg-3 mb-3">
          <CRow>
            <CCol md={3}>
              <label>&nbsp;</label>
              <CFormInput
                type="text"
                placeholder="Search Here"
                style={{
                  borderRadius: '5px',
                  border: 'none',
                }}
                onChange={(e) => {
                  keyword = e.target.value
                  FilterDataList()
                }}
              />
            </CCol>
            <CCol md={3}>
              <label>Status</label>
              <CFormSelect
                value={Act_status}
                onChange={(e) => {
                  Act_status = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>Category</label>
              <CFormSelect
                value={CarIdSort}
                onChange={(e) => {
                  SubCatIdSort = 0
                  CarIdSort = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                {PrdCatiData.map((s) => (
                  <option
                    value={s.cat_id}
                    key={s.cat_id}
                    style={{ display: s.parent === 0 ? '' : 'none' }}
                  >
                    {s.title}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>Sub Category</label>
              <CFormSelect
                value={SubCatIdSort}
                onChange={(e) => {
                  SubCatIdSort = e.target.value
                  FilterDataList()
                }}
              >
                <option value="">All</option>
                {PrdCatiData.map((s) => (
                  <option
                    value={s.cat_id}
                    key={s.cat_id}
                    style={{
                      display:
                        s.parent !== 0 && Number(CarIdSort) === Number(s.parent) ? '' : 'none',
                    }}
                  >
                    {s.title}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
      <CCol md={4} className="mb-lg-0 mb-5" style={{ display: ShowUploadBill ? 'none' : '' }}>
        <label>&nbsp;</label>
        <br />
        <button
          className="btn btn-outline-success me-3"
          onClick={() => {
            setShowProductPlus(!ShowProductPlus)
          }}
        >
          <CIcon icon={cilPlus} />
        </button>
        <CButton color="primary" className="me-3">
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
            onClick={() => {
              SortStatusType = 'DESC'
              FilterDataList()
            }}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
            onClick={() => {
              SortStatusType = 'ASC'
              FilterDataList()
            }}
          />
        </CButton>
        <DownloadTableExcel filename="users table" sheet="users" currentTableRef={tableRef.current}>
          <CButton color="primary" variant="outline">
            <CIcon icon={cilSave} className="me-2" />
            Export
          </CButton>
        </DownloadTableExcel>
      </CCol>
      <CCol xs={12} style={{ display: ShowUploadBill ? 'none' : '' }}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable hover bordered responsive ref={tableRef}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Available</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Detail</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ListData.map((singi, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>{singi.prd_id}</CTableDataCell>
                    <CTableDataCell>{singi.catName}</CTableDataCell>
                    <CTableDataCell>{singi.title}</CTableDataCell>
                    <CTableDataCell>{singi.unitName}</CTableDataCell>
                    <CTableDataCell>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setShowInventaryPlus(true)
                          setActionCategoryID(singi.category)
                          setActionProductID(singi.prd_id)
                        }}
                      >
                        <CIcon icon={cilPlus} />
                      </button>
                      &nbsp;
                      {availabeQty.map((s) => (
                        <>
                          {Number(s.prd_id) === Number(singi.prd_id) ? (
                            <b
                              key={`${s.prd_id}_${i}`}
                              className={GetClassText(availabeQty, singi)}
                            >
                              {Number(s.inQty) -
                                (s.outQty && s.outQty !== null ? Number(s.outQty) : 0)}
                              {localStorage.setItem(
                                `prd_${s.prd_id}`,
                                Number(s.inQty) -
                                  (s.outQty && s.outQty !== null ? Number(s.outQty) : 0),
                              )}
                            </b>
                          ) : (
                            ''
                          )}
                        </>
                      ))}
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-sm btn-danger text-white"
                        onClick={() => {
                          setShowUploadBill(true)
                          setForData(singi)
                          setForDataType('add')
                          setForDataID(singi.prd_id)
                        }}
                      >
                        <CIcon icon={cilMinus} />
                      </button>
                    </CTableDataCell>
                    <CTableDataCell>
                      <button
                        type="button"
                        className="btn btn-info text-white"
                        onClick={() => {
                          setForData(singi)
                          setShowUploadBill(true)
                          setForDataType('view')
                          setForDataID(singi.prd_id)
                        }}
                      >
                        View
                      </button>
                      <CNav variant="pills" className="d-none">
                        <CDropdown variant="nav-item">
                          <CDropdownToggle className={GetClassName(availabeQty, singi)}>
                            Action
                            <CIcon
                              icon={cilPencil}
                              style={{
                                display: singi.status === 4 || singi.status === 3 ? 'none' : '',
                              }}
                            />
                          </CDropdownToggle>
                          <CDropdownMenu
                            style={{
                              display: singi.status === 4 || singi.status === 3 ? 'none' : '',
                            }}
                          >
                            <CDropdownItem
                              onClick={(e) => {
                                console.log(e)
                                setShowUploadBill(true)
                                setForData(singi)
                                setForDataType('add')
                                setForDataID(singi.prd_id)
                              }}
                            >
                              Add Conjunction/ External
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => {
                                setForData(singi)
                                setShowUploadBill(true)
                                setForDataType('view')
                                setForDataID(singi.prd_id)
                              }}
                            >
                              View Detailed
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CNav>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductsInventaryPage

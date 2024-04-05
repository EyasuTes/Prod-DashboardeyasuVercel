import React, { useState, useEffect, useRef } from 'react'
// import axios from 'axios'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import {
  // cilFilter,
  cilPencil,
  cilPlus,
  // cilSave,
  cilSortDescending,
  cilSortAscending,
} from '@coreui/icons'
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  // CPagination,
  // CPaginationItem,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { NODEAPIURL } from '../../config'
import CreateField from './Create'

let SortStatusType = 'DESC'
const FormFieldList = ({ for_form }) => {
  const tableRef = useRef(null)
  let keyword = ''
  let IndexTable = 'field_id'
  const [ForID, setForID] = useState(0)
  const [ResetPassword, setResetPassword] = useState(false)
  const [ListData, setListData] = useState([])
  const [ShowAddAddonField, setShowAddAddonField] = useState(false)

  const FilterFormFieldssList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getformFieldsslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          for_form,
          recordsPerPage: 10,
          SortStatusType,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        setListData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateFormFieldStatus = async (field_id, new_status) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/updateFormFieldStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status,
          field_id,
        }),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200) {
        FilterFormFieldssList()
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    SortStatusType = 'ASC'

    const FetchFormFieldssList = async () => {
      try {
        const res = await fetch(`${NODEAPIURL}/admin/getformFieldsslist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: 'hello',
            recordsPerPage: 10,
            for_form,
          }),
        })
        const resJson = await res.json()
        // console.log(resJson)
        if (res.status === 200) {
          setListData(resJson.data)
        } else {
          console.log(resJson.message)
        }
      } catch (err) {
        console.log(err)
      }
    }
    FetchFormFieldssList()
  }, [for_form])

  let AddForm = ''
  if (ShowAddAddonField) {
    AddForm = (
      <CreateField
        for_form={for_form}
        ForID={ForID}
        setShowAddAddonField={setShowAddAddonField}
        FilterFormFieldssList={FilterFormFieldssList}
        ResetPassword={ResetPassword}
      />
    )
  }

  return (
    <CRow>
      <CCol xs={12}>{AddForm}</CCol>
      <CCol xs={12} style={{ display: ShowAddAddonField ? 'none' : '' }}>
        <h6 className="mb-0 mt-0 text-center">Addon Field List</h6>
      </CCol>
      <CCol lg={7} style={{ display: ShowAddAddonField ? 'none' : '' }}>
        <CForm className="mb-lg-2 mb-2">
          <CFormInput
            type="text"
            placeholder="Search Here"
            style={{
              borderRadius: '10px',
              border: '1px solid #F5F5F5',
              padding: '5px 10px',
              lineHeight: '2',
              margin: '20px auto',
            }}
            onChange={(e) => {
              keyword = e.target.value
              FilterFormFieldssList()
            }}
          />
        </CForm>
      </CCol>
      <CCol
        lg={5}
        className="mb-lg-2 mb-3"
        style={{ display: ShowAddAddonField ? 'none' : '', textAlign: 'right' }}
      >
        <CButton
          color="primary"
          className="me-3"
          onClick={() => {
            SortStatusType = SortStatusType === 'DESC' ? 'ASC' : 'DESC'
            FilterFormFieldssList()
          }}
        >
          <CIcon
            style={{
              display: SortStatusType === 'ASC' ? '' : 'none',
            }}
            icon={cilSortDescending}
          />
          <CIcon
            style={{
              display: SortStatusType === 'DESC' ? '' : 'none',
            }}
            icon={cilSortAscending}
          />
        </CButton>
        <CButton
          color="warning"
          className="text-white"
          onClick={() => {
            setForID('new')
            setResetPassword(false)
            setShowAddAddonField(true)
          }}
        >
          <CIcon icon={cilPlus} />
          &nbsp;New Addon Field
        </CButton>
      </CCol>
      <CCol xs={12} style={{ display: ShowAddAddonField ? 'none' : '' }}>
        <CTable hover bordered responsive ref={tableRef}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Order No.</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Field ID</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Field Type</CTableHeaderCell>
              <CTableHeaderCell scope="col">Is Required</CTableHeaderCell>
              <CTableHeaderCell scope="col">Options</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {ListData.map((singi) => (
              <CTableRow key={singi[IndexTable]}>
                <CTableDataCell>{singi.order_by}</CTableDataCell>
                {/* <CTableDataCell>{singi.field_id}</CTableDataCell> */}
                <CTableDataCell>{singi.title}</CTableDataCell>
                <CTableDataCell>
                  {singi.field_type === 'text' ? 'Text' : ''}
                  {singi.field_type === 'number' ? 'Number' : ''}
                  {singi.field_type === 'select' ? 'Drop Down' : ''}
                </CTableDataCell>

                <CTableDataCell>
                  {singi.is_required === 1 ? <span className="text-danger">Yes</span> : ''}
                  {singi.is_required === 0 ? <span className="text-success">No</span> : ''}
                </CTableDataCell>

                <CTableDataCell>{singi.options}</CTableDataCell>
                <CTableDataCell>
                  <CNav variant="pills">
                    <CDropdown variant="nav-item">
                      <CDropdownToggle className={singi.status === 1 ? '' : 'bg-danger'}>
                        {singi.status === 1 ? 'Active' : 'Inactive'}
                        <CIcon icon={cilPencil} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          onClick={(e) => {
                            setForID(singi[IndexTable])
                            setResetPassword(false)
                            setShowAddAddonField(true)
                          }}
                        >
                          Edit
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={(e) => {
                            updateFormFieldStatus(singi[IndexTable], singi.status === 1 ? 0 : 1)
                          }}
                        >
                          {singi.status === 1 ? 'De-activate' : 'Activate'}
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CNav>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  )
}

FormFieldList.propTypes = { for_form: PropTypes.any }

export default FormFieldList

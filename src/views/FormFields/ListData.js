import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import PropTypes from 'prop-types'
import {
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  // sdfgsf dsjkgfjksdg
} from '@coreui/react'
import { NODEAPIURL } from '../../config'

const DataFormFieldList = ({ for_form, data_id, returnData }) => {
  let IndexTable = 'field_id'
  const [ListData, setListData] = useState([])

  useEffect(() => {
    const FetchFormFieldssList = async () => {
      try {
        const res = await fetch(`${NODEAPIURL}/admin/DataformFieldsslist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            for_form,
            data_id,
          }),
        })
        const resJson = await res.json()
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
  }, [for_form, data_id])

  const handleAddListData = (index) => {
    setListData((temp) => [
      ...temp,
      {
        field_id: index,
        title: '',
        icon: '',
        selected: 0,
        presentValue: '',
        ValueOn: 0,
        target: '',
        detailed: 0,
      },
    ])
  }
  const handleEditListData = (changeId, ind, val) => {
    ListData[changeId][ind] = val
  }
  const handleRemoveListData = (ind) => {
    if (ind !== 1) {
      setListData(ListData.filter((item) => item.field_id !== ind))
    }
  }
  const RefreshListData = () => {
    const temp = Number(ListData.length) + 10000
    handleAddListData(temp)
    handleRemoveListData(temp)
    returnData(ListData)
    console.log(ListData)
  }
  return (
    <CRow>
      <CCol xs={12} style={{ display: ListData.length < 1 ? 'none' : '' }}>
        <h5 className="mb-0 mt-3 text-left text-success">Addon Fields</h5>
      </CCol>

      <CCol xs={12}>
        <div className="row">
          {ListData.map((singi, run) => (
            <div className="col-md-6 mt-3" key={singi[IndexTable]}>
              <label>{singi.title}</label>
              {singi.field_type === 'text' ? (
                <CFormInput
                  required={singi.is_required === 1 ? true : false}
                  type="text"
                  className="Addon_Fields_Inp"
                  name="value"
                  value={singi.value}
                  placeholder={`Enter ${singi.title}`}
                  onChange={(e) => {
                    handleEditListData(run, e.target.name, e.target.value)
                    RefreshListData()
                  }}
                />
              ) : (
                ''
              )}
              {singi.field_type === 'number' ? (
                <CFormInput
                  className="Addon_Fields_Inp"
                  required={singi.is_required === 1 ? true : false}
                  type="number"
                  name="value"
                  value={singi.value}
                  placeholder={`Enter ${singi.title}`}
                  onChange={(e) => {
                    handleEditListData(run, e.target.name, e.target.value)
                    RefreshListData()
                  }}
                />
              ) : (
                ''
              )}
              {singi.field_type === 'select' ? (
                <CFormSelect
                  className="Addon_Fields_Inp"
                  required={singi.is_required === 1 ? true : false}
                  name="value"
                  value={singi.value}
                  placeholder={`Enter ${singi.title}`}
                  onChange={(e) => {
                    handleEditListData(run, e.target.name, e.target.value)
                    RefreshListData()
                  }}
                >
                  <option value="">Select</option>
                  {singi.options.split(',').map((s) => (
                    <option key={s} value={s} style={{ display: s.trim() === '' ? 'none' : '' }}>
                      {s}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </CCol>
    </CRow>
  )
}

DataFormFieldList.propTypes = {
  for_form: PropTypes.any,
  data_id: PropTypes.any,
  returnData: PropTypes.any,
}

export default DataFormFieldList

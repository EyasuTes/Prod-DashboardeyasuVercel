import React, { useState, useEffect } from 'react'

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
import { NODEAPIURL, BASEWEBURL, DoUploadURL } from '../../config'
import loader from '../../assets/images/loader.gif'

const CertificateRequest = () => {
  const [AttachmentHere, setAttachmentHere] = useState('')
  const [VendorList, setVendorList] = useState([])
  const [FormDataHere, setFormData] = useState({
    icr_id: 0,
    ven_id: '',
    ven_file: AttachmentHere,
    status: 1,
    device: localStorage.getItem('DeviceDetails'),
  })
  const HandleFormData = (e) => {
    setFormData({ ...FormDataHere, [e.target.name]: e.target.value })
  }

  const [AjaxMsg, setAjaxMsg] = useState('')
  const [AjaxMsgStyle, setAjaxMsgStyle] = useState({ color: '#cc0000', padding: '5px' })

  const SubmitFormData = async (e) => {
    e.preventDefault()
    setAjaxMsgStyle({ color: '#cc0000', padding: '5px' })
    try {
      const res = await fetch(`${NODEAPIURL}/admin/inventory/CertificateRequest`, {
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
            window.location.href = `${BASEWEBURL}/#/vendor-product-approval`
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
  const [showNoteLoader, setshowNoteLoader] = useState('none')
  const uploadAttachment = async (e, file, fileName) => {
    e.preventDefault()
    setshowNoteLoader('block')
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      }
      const res = await fetch(DoUploadURL, requestOptions)
      const resJson = await res.json()
      setshowNoteLoader('none')
      if (res.status === 200) {
        if (resJson.status === 1) {
          setAttachmentHere(resJson.data.name)
        } else {
          alert(resJson.message)
        }
        console.log(resJson.message)
      } else {
        console.log(resJson.message)
        setshowNoteLoader('none')
      }
    } catch (err) {
      setshowNoteLoader('none')
      console.log(err)
    }
  }

  useEffect(() => {
    FetchvendorList()
  }, [])

  return (
    <CRow>
      <CCol xs={6}>
        <h3 className="mb-4">Certificate Request</h3>
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
              <CRow className="mb-4">
                <CCol lg={4}>
                  <CFormSelect
                    type="text"
                    required
                    name="ven_id"
                    label="Vendor"
                    maxLength={90}
                    value={FormDataHere.ven_id}
                    onChange={(e) => {
                      HandleFormData(e)
                      console.log(FormDataHere)
                    }}
                    placeholder="Enter Name"
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
                <CCol lg={4}>
                  <center style={{ display: showNoteLoader }}>
                    <img alt="Loader" style={{ maxWidth: '32px', margin: '10px' }} src={loader} />
                  </center>
                  <label className="form-label">Vendor/Product Certificate</label>
                  <input
                    type="file"
                    required
                    name="noteatchemtn"
                    accept="application/pdf,image/*"
                    className="form-control mb-3"
                    placeholder="Enter"
                    style={{ lineHeight: '18px' }}
                    onChange={(e) => {
                      uploadAttachment(e, e.target.files[0], e.target.files[0].name)
                    }}
                  />
                </CCol>
                <CCol lg={4}>
                  <CFormInput
                    type="text"
                    name="e_remark"
                    label="Remark"
                    maxLength={90}
                    value={FormDataHere.e_remark}
                    onChange={(e) => {
                      HandleFormData(e)
                    }}
                    placeholder="Enter Remark"
                  />
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
                      setFormData({ ...FormDataHere, ven_file: AttachmentHere })
                    }}
                  >
                    Request Approval
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

export default CertificateRequest

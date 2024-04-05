import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { BASEWEBURL, NODEAPIURL } from '../../../config'
// import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilBackspace } from '@coreui/icons'

const AddFromSheet = ({ setisImport, FilterAnimalsList }) => {
  const [IsLoader, setIsLoader] = useState('none')
  const [Msg, setMsg] = useState('')
  function SubmitData(e) {
    setIsLoader('block')
    return false
  }

  // upload file will be here
  const uploadAttachment = async (e, file, fileName) => {
    e.preventDefault()
    setIsLoader('block')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    try {
      var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      }
      const res = await fetch(`${NODEAPIURL}/admin/importanimalsTemperatures`, requestOptions)
      const resJson = await res.json()
      setIsLoader('none')
      if (res.status === 200) {
        // console.log(resJson)
        if (resJson.status === 1) {
          // console.log(resJson)
        } else {
          setMsg(resJson.message)
        }
        setMsg(resJson.message)
      } else {
        setMsg(resJson.message)
        setIsLoader('none')
      }
    } catch (err) {
      setIsLoader('none')
      console.log(err)
    }
  }
  // upload file will be here

  return (
    <CRow>
      <CCol lg={12}>
        <h3 className="mb-3 mt-3">Add Temperature</h3>
      </CCol>

      <CCol lg={12}>
        <CCard className="mb-4 p-1">
          <CCardBody>
            <CRow className="mb-4">
              <CCol lg={6}>
                <h5 className="text-success">Step 01</h5>
                <p>
                  Please Download the Template for Import from the below Button:
                  <br />
                  <a
                    download
                    href={`${BASEWEBURL}/import/Temperatures.csv`}
                    className="btn btn-warning text-white"
                  >
                    Download Template
                  </a>
                </p>
              </CCol>

              <CCol lg={6}>
                <h5 className="text-success">Step 02</h5>

                <p>
                  Fill the File Correclty and save the the File as CSV and Import on Step 03.
                  {/* <br /> */}
                </p>
              </CCol>
              <CCol lg={12}>
                <hr />
              </CCol>
              <CCol lg={12}>
                <h5 className="text-success">Step 03</h5>

                <form
                  className=""
                  onSubmit={(e) => {
                    return SubmitData(e)
                  }}
                  encType="multipart/form-data"
                >
                  <div className="form-group">
                    <input
                      type="file"
                      label="Import From Sheet"
                      required
                      accept=".csv"
                      onChange={(e) => {
                        uploadAttachment(e, e.target.files[0], e.target.files[0].name)
                      }}
                    />
                  </div>

                  <div className="form-group mt-3 text-center">
                    <img
                      src={`${BASEWEBURL}/loader.gif`}
                      alt=""
                      style={{
                        maxWidth: '32px',
                        display: IsLoader,
                        margin: '10px auto',
                      }}
                    />
                    <div className="m-2 text-left">{Msg}</div>
                    <div
                      style={{ display: Msg === '' ? '' : '' }}
                      onClick={() => {
                        setisImport(false)
                        FilterAnimalsList()
                      }}
                    >
                      <CButton color="primary" variant="outline">
                        <CIcon icon={cilBackspace} />
                        Back to List
                      </CButton>
                    </div>
                  </div>
                </form>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

AddFromSheet.propTypes = {
  setisImport: PropTypes.any,
  FilterAnimalsList: PropTypes.any,
}

export default AddFromSheet

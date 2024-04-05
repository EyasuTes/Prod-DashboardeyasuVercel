import React, { useState, useEffect } from 'react'
import { CCol, CRow } from '@coreui/react'
import { NODEAPIURL } from '../../config'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleBottom, cilArrowCircleTop, cilPencil } from '@coreui/icons'
import Inventory from './Inventory'

const ProductsInventaryPage = () => {
  const [ShowCati, setShowCati] = useState(0)
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
        // setShowCati(resJson.data[0].cat_id)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getPrdCatiData()
  }, [])

  const InventoryHeaderStyle = {
    padding: '3px 10px',
    marginBottom: '0px',
    cursor: 'pointer',
    background: '#5367F9',
    lineHeight: '36px',
  }
  const InventoryPageStyle = {
    border: '1px solid #5367F9',
    padding: '10px',
    background: '#fff',
  }
  const InventorySubHeaderStyle = {
    padding: '3px 10px',
    marginBottom: '0px',
    cursor: 'pointer',
    background: '#3399ff69',
  }
  const InventorySubPageStyle = {
    border: '1px solid #3399ff',
    padding: '10px',
    background: '#fff',
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h3 className="mb-4">
          Inventory By Category &nbsp;
          <Link to="/manage-products-category">
            <CIcon icon={cilPencil} />
          </Link>
        </h3>
      </CCol>
      {PrdCatiData.map((s) => (
        <CCol md={12} key={s.cat_id}>
          {s.parent === 0 ? (
            <div className="mb-0">
              <div>
                <div>
                  <span
                    onClick={() => {
                      localStorage.setItem('SortInvtCati', s.cat_id)
                      localStorage.setItem('SortInvtSubCati', 0)
                      setShowCati(ShowCati !== s.cat_id ? s.cat_id : 0)
                    }}
                  >
                    <h4 className="text-white" style={InventoryHeaderStyle}>
                      {s.title}
                      <div style={{ float: 'right', lineHeight: '36px' }}>
                        <CIcon
                          className="text-white"
                          icon={cilArrowCircleBottom}
                          style={{
                            display: ShowCati !== s.cat_id ? '' : 'none',
                            fontSize: '1.5rem',
                            width: '1.5rem',
                            height: '1.5rem',
                          }}
                        />
                        <CIcon
                          className="text-white"
                          icon={cilArrowCircleTop}
                          style={{
                            display: ShowCati !== s.cat_id ? 'none' : '',
                            fontSize: '1.5rem',
                            width: '1.5rem',
                            height: '1.5rem',
                          }}
                        />
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </h4>
                  </span>
                  {ShowCati === s.cat_id ? (
                    <div style={InventoryPageStyle}>
                      <Inventory />
                    </div>
                  ) : (
                    ''
                  )}
                  <ul>
                    {PrdCatiData.map((sChild) => (
                      <div key={`${s.cat_id}_${sChild.cat_id}`}>
                        {s.cat_id === sChild.parent ? (
                          <>
                            <li style={{ listStyle: 'none' }}>
                              <span
                                onClick={() => {
                                  localStorage.setItem('SortInvtCati', s.cat_id)
                                  localStorage.setItem('SortInvtSubCati', sChild.cat_id)
                                  setShowCati(ShowCati !== sChild.cat_id ? sChild.cat_id : 0)
                                }}
                              >
                                <h4 className="bg-info text-white" style={InventorySubHeaderStyle}>
                                  {sChild.title}
                                  <div style={{ float: 'right', lineHeight: '36px' }}>
                                    <CIcon
                                      className="text-white"
                                      icon={cilArrowCircleBottom}
                                      style={{
                                        display: ShowCati !== sChild.cat_id ? '' : 'none',
                                        fontSize: '1.5rem',
                                        width: '1.5rem',
                                        height: '1.5rem',
                                      }}
                                    />
                                    <CIcon
                                      className="text-white"
                                      icon={cilArrowCircleTop}
                                      style={{
                                        display: ShowCati !== sChild.cat_id ? 'none' : '',
                                        fontSize: '1.5rem',
                                        width: '1.5rem',
                                        height: '1.5rem',
                                      }}
                                    />
                                  </div>
                                  <div style={{ clear: 'both' }}></div>
                                </h4>
                              </span>
                              {ShowCati === sChild.cat_id ? (
                                <div style={InventorySubPageStyle}>
                                  <Inventory />
                                </div>
                              ) : (
                                ''
                              )}
                            </li>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </CCol>
      ))}
    </CRow>
  )
}

export default ProductsInventaryPage

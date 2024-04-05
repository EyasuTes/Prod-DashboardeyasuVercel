import React, { useState, useEffect } from 'react'
import { CCol, CFormCheck, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import { NODEAPIURL } from '../../config'
import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleBottom,
  cilArrowCircleRight,
  cilArrowCircleTop,
  cilHistory,
} from '@coreui/icons'
import AnimalsList from './AnimalsList'

const AnimalListByBirthYear = () => {
  const [Action, SetAction] = useState(1)
  const [SelectAll, SeSelectAll] = useState('Select All')
  const [Message, SetMessage] = useState('')
  const [AnimalsData, SetAnimalsData] = useState([])
  const [DeleteMulti, setDeleteMulti] = useState(false)
  const [ShowCati, setShowCati] = useState(0)
  const [BirthYears, setBirthYears] = useState([])

  const FetchAnimalsList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const resJson = await res.json()
      console.log(resJson)
      if (res.status === 200 && resJson.data.length > 0) {
        SetAnimalsData(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getAnimalsBirthYear = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getAnimalsBirthYear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SortStatusType: 'ASC',
          Act_status: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setBirthYears(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      alert(err)
    }
  }

  const ConfirmDeleteAnimals = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${NODEAPIURL}/admin/ConfirmDeleteAnimals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          animals: AnimalsData.filter((item) => item.status === 2),
          token: 'deleteAnimal',
        }),
      })
      const resJson = await res.json()
      SetMessage(resJson.message)
      SeSelectAll('Select All')
    } catch (err) {
      SetMessage('There is Problem, Please try afater some time..')
      console.log(err)
    }
  }

  useEffect(() => {
    getAnimalsBirthYear()
    SeSelectAll('Select All')
    const intervalId = setInterval(() => {
      // Update state or perform desired task
      getAnimalsBirthYear()
    }, 4444) // Interval in milliseconds
    // Clean up the interval when the component is unmounted or when the dependencies change
    return () => clearInterval(intervalId)
  }, [])

  const InventoryHeaderStyle = {
    padding: '3px 10px',
    marginBottom: '3px',
    cursor: 'pointer',
    background: '#5367F9',
    lineHeight: '36px',
  }
  const InventoryPageStyle = {
    border: '1px solid #5367F9',
    padding: '10px',
    marginTop: '-3px',
    background: '#fff',
  }

  function getTotal() {
    let returnValue = 0
    BirthYears.map((s) => {
      returnValue = Number(s.total) + Number(returnValue)
      return ''
    })
    return returnValue
  }

  return (
    <CRow>
      <CCol xs={12}>
        <div>
          {DeleteMulti ? (
            <div
              style={{
                border: '1px dashed #cc0000',
                padding: '5px 20px',
                margin: '20px auto',
              }}
            >
              <h3 className="mb-3 mt-2 text-danger">
                <div style={{ float: 'right', paddingRight: '20px' }}>
                  <CFormCheck
                    type="checkbox"
                    id="DeleteAniMultiAll"
                    onClick={(e) => {
                      if (e.target.checked) {
                        SeSelectAll('Unselect All')
                        const updatedAnimals = AnimalsData.map((animal) => ({
                          ...animal,
                          status: 2,
                        }))
                        SetAnimalsData(updatedAnimals)
                        SetAction(Action + 1)
                      } else {
                        SeSelectAll('Select All')
                        const updatedAnimals = AnimalsData.map((animal) => ({
                          ...animal,
                          status: 1,
                        }))
                        SetAnimalsData(updatedAnimals)
                        SetAction(Action + 1)
                      }
                    }}
                    label={SelectAll}
                  />
                </div>
                Select The Animal below to Delete
                <div style={{ clear: 'both' }}></div>
              </h3>
              <form
                className="row"
                onSubmit={(e) => {
                  ConfirmDeleteAnimals(e)
                }}
              >
                {Action &&
                  AnimalsData.map((s, i) => (
                    <h6 className="col-md-3" key={s.auto_id}>
                      <CFormCheck
                        type="checkbox"
                        id={`DeleteAniMulti${s.auto_id}`}
                        name="deleteAni"
                        checked={s.status === 2}
                        onClick={(e) => {
                          AnimalsData[i].status = e.target.checked ? 2 : 1
                          SetAction(Action + 1)
                        }}
                        label={`${s.ani_id} (Chip No: ${s.ani_id}) Gender: ${s.sex}`}
                      />
                    </h6>
                  ))}
                <div className="alert alert-danger hideifempty">{Message}</div>
                <div className="col-md-12 text-center">
                  <button
                    type="button"
                    className="btn btn-success text-white"
                    onClick={() => {
                      setDeleteMulti(!DeleteMulti)
                      SeSelectAll('Select All')
                    }}
                  >
                    Cancel
                  </button>
                  &nbsp;
                  <button type="submit" className="btn btn-danger text-white">
                    Confirm Delete
                  </button>
                </div>
              </form>
            </div>
          ) : (
            ''
          )}
        </div>
        <h3 className="mb-3 mt-2">
          Animal by Birth Year (Total {getTotal()}) &nbsp;
          <Link to="/animals-list">
            <CIcon icon={cilArrowCircleRight} />
          </Link>
          <div style={{ float: 'right' }}>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                setDeleteMulti(!DeleteMulti)
                FetchAnimalsList()
              }}
            >
              Delete Animals
            </button>
            &nbsp;
            <Link to="/animal-logs" className="btn btn-info text-white">
              Animal Logs&nbsp;
              <CIcon icon={cilHistory} />
            </Link>
          </div>
          <div style={{ clear: 'both' }}></div>
        </h3>
      </CCol>
      {BirthYears.map((s) => (
        <CCol md={12} key={s.birthYear}>
          <div className="mb-0">
            <div>
              <div>
                <span
                  onClick={() => {
                    localStorage.setItem('SortBirthYear', s.birthYear)
                    setShowCati(ShowCati !== s.birthYear ? s.birthYear : 0)
                  }}
                >
                  <h4 className="text-white" style={InventoryHeaderStyle}>
                    {s.birthYear} ({s.total} Animals)
                    <div style={{ float: 'right', lineHeight: '36px' }}>
                      <CIcon
                        className="text-white"
                        icon={cilArrowCircleBottom}
                        style={{
                          display: ShowCati !== s.birthYear ? '' : 'none',
                          fontSize: '1.5rem',
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                      />
                      <CIcon
                        className="text-white"
                        icon={cilArrowCircleTop}
                        style={{
                          display: ShowCati !== s.birthYear ? 'none' : '',
                          fontSize: '1.5rem',
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                      />
                    </div>
                    <div style={{ clear: 'both' }}></div>
                  </h4>
                </span>
                {ShowCati === s.birthYear ? (
                  <div style={InventoryPageStyle}>
                    <AnimalsList />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </CCol>
      ))}
    </CRow>
  )
}

export default AnimalListByBirthYear

import React, { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import {
  // CCardTitle,
  // CCardSubtitle,
  // CCardText,
  // CImage,
  CCol,
  CRow,
  CButton,
  // CFormInput,
} from '@coreui/react'
import {
  NODEAPIURL,
  // UPLOADSsURL,
  // DoUploadURL,
  AllMonthsName,
  // GetArrayFromJson,
  // showdateYMDtoLocal,
  PrintaDiv,
  BASEWEBURL,
} from '../../config'
// import { Link } from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import AnimalLogs from '../LivestockManagenment/AnimalsLogs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowRight, cilCloudDownload, cilWindowMinimize } from '@coreui/icons'

import Inventory from '../InventoryManage/Inventory'

const date = new Date()
let ActivityMonth = Number(date.getMonth()) + 1
let ActivityYear = date.getUTCFullYear()

const DashboardLiveStock = () => {
  // for the Graph Data
  const [ActionCount, SetActionCount] = useState(1)
  const [AnimalsDataTitle, SetAnimalsDataTitle] = useState('')
  const [AnimalsData, SetAnimalsData] = useState([])
  const [ShowGraphData, SetShowGraphData] = useState(false)
  const [AnimalsBirthYear, SetAnimalsBirthYear] = useState([['type', 'Total']])
  const [AnimalsGender, SetAnimalsGender] = useState([['type', 'Total']])
  const [AnimalsBreed, SetAnimalsBreed] = useState([['type', 'Total']])
  const [AnimalsFather, SetAnimalsFather] = useState([['type', 'Total']])
  const [AnimalsCategory, SetAnimalsCategory] = useState([['type', 'Total']])
  const [AnimalsDonerID, SetAnimalsDonerID] = useState([['type', 'Total']])
  const [AnimalsDonerBreed, SetAnimalsDonerBreed] = useState([['type', 'Total']])
  const [AnimalsActivity, SetAnimalsActivity] = useState([['type', 'Total']])
  const [AnimalsBirthYearGraphOptions] = useState({
    title: 'Type',
    is3D: true,
    // colors: ['#00bf63', '#ff914d', '#ff5757', '#666161'],
  })
  // for the Graph Data

  const GetAnimalDataByFilter = async (ForAttribute) => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/GetAnimalDataByFilter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ForAttribute }),
      })
      const resJson = await res.json()
      // for the Birthda Year
      SetAnimalsDataTitle(`${resJson.title} (${resJson.data.length})`)
      const groupByForAttribute = resJson.data.reduce((result, current) => {
        const index = result.findIndex(
          (item) =>
            `${item.ForAttribute}`.toLowerCase() === `${current.ForAttribute}`.toLowerCase(),
        )
        if (index >= 0) {
          result[index].data.push(current)
        } else {
          result.push({ ForAttribute: current.ForAttribute, show: 1, data: [current] })
        }
        return result
      }, [])
      SetAnimalsData(groupByForAttribute)
      // for the Birthda Year
    } catch (err) {
      console.log(err)
    }
  }

  const [AnimalsWithNoActivity, setAnimalsWithNoActivity] = useState([])
  const getDataDashboardLiveStock = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/dataDashboardLiveStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ActivityMonth, ActivityYear }),
      })
      const resJson = await res.json()
      if (resJson.data && resJson.data.length > 0) {
        setAnimalsWithNoActivity(resJson.data)
      }
      // for the Birthda Year
      if (resJson.AnimalsBirthYear && resJson.AnimalsBirthYear.length > 0) {
        let temp = []
        temp.push(['Birth Year', 'Total'])
        resJson.AnimalsBirthYear.forEach((item) => {
          if (item.birthYear === 0) {
            item.birthYear = 'Other'
          }
          temp.push([`${item.birthYear}`, item.total])
        })
        SetAnimalsBirthYear(temp)
      }
      // for the Birthda Year

      // for the Gender
      if (resJson.AnimalsGender && resJson.AnimalsGender.length > 0) {
        let temp = []
        temp.push(['Gender', 'Total'])
        resJson.AnimalsGender.forEach((item) => {
          temp.push([`${item.sex}`, item.total])
        })
        SetAnimalsGender(temp)
      }
      // for the Gender

      // for the breed
      if (resJson.AnimalsBreed && resJson.AnimalsBreed.length > 0) {
        let temp = []
        temp.push(['Breed', 'Total'])
        resJson.AnimalsBreed.forEach((item) => {
          item.breed = item.breed.charAt(0).toUpperCase() + item.breed.slice(1)
          temp.push([`${item.breed}`, item.total])
        })
        SetAnimalsBreed(temp)
      }
      // for the breed

      // for the AnimalsFather
      if (resJson.AnimalsFather && resJson.AnimalsFather.length > 0) {
        let temp = []
        temp.push(['Father', 'Total'])
        resJson.AnimalsFather.forEach((item) => {
          temp.push([`${item.father}`, item.total])
        })
        SetAnimalsFather(temp)
      }
      // for the AnimalsFather

      // for the AnimalsCategory
      if (resJson.AnimalsCategory && resJson.AnimalsCategory.length > 0) {
        let temp = []
        temp.push(['Category', 'Total'])
        resJson.AnimalsCategory.forEach((item) => {
          temp.push([`${item.category}`, item.total])
        })
        SetAnimalsCategory(temp)
      }
      // for the AnimalsCategory

      // for the AnimalsDonerID
      if (resJson.AnimalsDonerID && resJson.AnimalsDonerID.length > 0) {
        let temp = []
        temp.push(['Doner ID', 'Total'])
        resJson.AnimalsDonerID.forEach((item) => {
          temp.push([`${item.doner_id}`, item.total])
        })
        SetAnimalsDonerID(temp)
      }
      // for the AnimalsDonerID

      // for the AnimalsDonerBreed
      if (resJson.AnimalsDonerBreed && resJson.AnimalsDonerBreed.length > 0) {
        let temp = []
        temp.push(['Doner Breed', 'Total'])
        resJson.AnimalsDonerBreed.forEach((item) => {
          item.doner_breed = item.doner_breed.charAt(0).toUpperCase() + item.doner_breed.slice(1)
          temp.push([`${item.doner_breed}`, item.total])
        })
        SetAnimalsDonerBreed(temp)
      }
      // for the AnimalsDonerBreed

      // for the AnimalsDonerBreed
      let temp = []
      temp.push(['Actity Type', 'Total'])
      if (resJson.AnimalsActivity && resJson.AnimalsActivity.length > 0) {
        resJson.AnimalsActivity.forEach((item) => {
          temp.push([`${item.type}`, item.total])
        })
      }
      SetAnimalsActivity(temp)
      // for the AnimalsDonerBreed
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getDataDashboardLiveStock()
    setTimeout(() => {
      document.getElementById('GetActivityData').click()
      // document.getElementById('GetActivityData').click()
    }, 786)
  }, [])
  return (
    <div id="ReportDatahere">
      {/* for the Graph Data Details */}
      <div className="ry_popup_bg" style={{ display: ShowGraphData ? '' : 'none' }}>
        <div
          style={{
            padding: '10px',
            position: 'fixed',
            top: '0px',
            right: '0px',
            zIndex: 999999,
          }}
          className="dontPrint"
        >
          <button
            type="button"
            className="btn btn-info text-white me-3"
            onClick={() => {
              PrintaDiv('TodayAttedanceDiv', '')
            }}
          >
            <CIcon className="text-white" icon={cilCloudDownload} />
          </button>

          <button
            type="button"
            className="btn btn-danger text-white"
            icon={cilWindowMinimize}
            onClick={() => {
              SetShowGraphData(false)
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className="ry_popup_content"
        id="TodayAttedanceDiv"
        style={{
          display: ShowGraphData ? '' : 'none',
          maxWidth: '75%',
          maxHeight: '75%',
        }}
      >
        <h4 className="text-center text-dark">
          {AnimalsDataTitle}
          {/* Today Attedance on {showdateYMDtoLocal(ShowAttedanceDate)} */}
        </h4>
        <div className="row">
          <div className="col-md-12">
            {ActionCount ? (
              <>
                {AnimalsData.map((s1, i) => (
                  <div className="DBLSAniDataItem" key={s1.ForAttribute}>
                    <h5
                      className="text-success"
                      style={{ textTransform: 'capitalize', cursor: 'pointer' }}
                      onClick={() => {
                        SetActionCount(ActionCount + 1)
                        AnimalsData[i].show = s1.show === 1 ? 0 : 1
                        SetAnimalsData(AnimalsData)
                      }}
                    >
                      {s1.ForAttribute}
                      <div style={{ float: 'right' }}>
                        ({s1.data.length})
                        {s1.show === 1 ? (
                          <>
                            <CIcon icon={cilArrowBottom} />
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilArrowRight} />
                          </>
                        )}
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </h5>
                    <div
                      className="row"
                      style={{
                        display: ActionCount && s1.show === 1 ? '' : 'none',
                      }}
                    >
                      {s1.data.map((s2) => (
                        <div className="col-md-3" key={s2.chip_no}>
                          <div className="DBLSAniData">
                            <b>Animal ID: {s2.ani_id}</b>
                            <br />
                            <small>Chip No.: {s2.chip_no}</small>
                            <br />
                            <small>Gender: {s2.sex}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {/* for the Graph Data Details */}

      <CButton
        className="mt-4 d-none dontPrint"
        id="GetActivityData"
        onClick={() => {
          // FilterAttendanceListData('', 0)
          // FetchActivityGraphData(0, 0)
        }}
      >
        Get Reports Data
      </CButton>
      {/* `style={{ display: localStorage.getItem('uType') === '3' ? '' : 'none' }}` */}
      <CRow className="">
        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('sex')
          }}
        >
          <h6 className="text-info mt-3">Animal By Gender</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsGender}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('category')
          }}
        >
          <h6 className="text-info mt-3">Animal By Category</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsCategory}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('breed')
          }}
        >
          <h6 className="text-info mt-3">Animal By Breed</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsBreed}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol
          md={12}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('birthYear')
          }}
        >
          <h6 className="text-info mt-3">Animal By Birth Year</h6>
        </CCol>
        <CCol
          md={12}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('birthYear')
          }}
        >
          <div className="bg-white p-3">
            <Chart
              className=""
              chartType="Bar"
              data={AnimalsBirthYear}
              options={AnimalsBirthYearGraphOptions}
              width={'100%'}
              height={'250px'}
            />
          </div>
        </CCol>

        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('father')
          }}
        >
          <h6 className="text-info mt-3">Animal By Father</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsFather}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('doner_breed')
          }}
        >
          <h6 className="text-info mt-3">Animal By Donar Breed</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsDonerBreed}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol
          md={4}
          onClick={() => {
            SetShowGraphData(true)
            GetAnimalDataByFilter('doner_id')
          }}
        >
          <h6 className="text-info mt-3">Animal By Donar ID</h6>
          <Chart
            className=""
            chartType="PieChart"
            data={AnimalsDonerID}
            options={AnimalsBirthYearGraphOptions}
            width={'100%'}
            height={'250px'}
          />
        </CCol>

        <CCol className="dontPrint d-none" md={4}>
          <div>
            <div>
              <h6 className="text-danger">
                {AnimalsWithNoActivity.length}
                &nbsp;Animal with No Activity Today
              </h6>
              <ul
                style={{
                  maxHeight: '250px',
                  overflow: 'auto',
                  background: '#F5F4F5',
                }}
              >
                {AnimalsWithNoActivity.map((s) => (
                  <li key={s.auto_id}>
                    {s.ani_id} Chip No.: {s.chip_no}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CCol>

        <div style={{ clear: 'both' }}></div>
        <div style={{ clear: 'both' }} className="m-2"></div>
      </CRow>

      <div
        className="mt-1 mb-4 dontPrint"
        style={{ border: '2px solid #dedede', padding: '10px 20px' }}
      >
        <h6 className="text-info">Animal Activity</h6>
        <CRow>
          <CCol md={3}>
            <select
              name="ActivityMonth"
              defaultValue={ActivityMonth + 1}
              className="form-control"
              onChange={(e) => {
                ActivityMonth = e.target.value
                document.title = `Report for ${AllMonthsName[e.target.value]} ${ActivityYear}`
                getDataDashboardLiveStock()
              }}
              style={{ minWidth: 'fit-content' }}
            >
              <option value="">Select Month</option>
              {AllMonthsName.map((s, i) => (
                <option key={s} value={Number(i) + 1}>
                  {s}
                </option>
              ))}
            </select>
          </CCol>
          <CCol md={3}>
            <input
              name="ActivityYear"
              defaultValue={ActivityYear}
              className="form-control"
              onChange={(e) => {
                ActivityYear = e.target.value
                document.title = `Report for ${AllMonthsName[ActivityMonth]} ${e.target.value}`
                getDataDashboardLiveStock()
              }}
              style={{ minWidth: 'fit-content' }}
            />
          </CCol>
          <CCol md={3} className="dontPrint">
            <button
              type="button"
              className="btn btn-info text-white"
              onClick={() => {
                // window.print()
              }}
            >
              Filter
            </button>
          </CCol>
          <CCol md={12}>
            <div
              className="bg-white mt-3 mb-3 p-3"
              onClick={() => {
                window.location.href = `${BASEWEBURL}/#/animals-activities`
              }}
            >
              <Chart
                className=""
                chartType="Bar"
                data={AnimalsActivity}
                options={AnimalsBirthYearGraphOptions}
                width={'100%'}
                height={'250px'}
              />
            </div>
          </CCol>
        </CRow>
      </div>

      <div
        className="mt-0 mb-4 dontPrint"
        style={{ border: '2px solid #dedede', padding: '10px 20px' }}
      >
        <Inventory />
      </div>

      <div
        className="mt-0 mb-4 dontPrint"
        style={{ border: '2px solid #dedede', padding: '10px 20px' }}
      >
        <AnimalLogs />
      </div>
    </div>
  )
}

export default DashboardLiveStock

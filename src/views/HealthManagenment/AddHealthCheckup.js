import React, { useEffect, useState } from 'react'

import CIcon from '@coreui/icons-react'
import { cilArrowRight } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CNavLink,
  CNav,
  CNavItem,
  CTabContent,
  CTabPane,
} from '@coreui/react'

import VaccinationsForm from './Forms/VaccinationsForm'
import TemperatureForm from './Forms/TemperatureForm'
import WeightForm from './Forms/WeightForm'

import BodyExaminationForm from './Forms/BodyExaminationForm'
import DiseasesTreatmentForm from './Forms/DiseasesTreatmentForm'
import HaematoBioForm from './Forms/HaematoBioForm'
import BloodParasiteForm from './Forms/BloodParasiteForm'
import { NODEAPIURL } from 'src/config'

// import Testonly from './Forms/backup/HaematoBioForm'

const AddHealthCheckup = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [AllAnimalList, setAllAnimalList] = useState([])
  const [AnimalID, setAnimalID] = useState(0)
  const [FromDate, setFromDate] = useState('')
  const [ToDate, setToDate] = useState('')
  const FetchAnimalsList = async () => {
    try {
      const res = await fetch(`${NODEAPIURL}/admin/getanimalslist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'hello',
          selectOnly: 1,
        }),
      })
      const resJson = await res.json()
      if (res.status === 200 && resJson.data && resJson.data.length > 0) {
        setAllAnimalList(resJson.data)
      } else {
        console.log(resJson.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    FetchAnimalsList()
  }, [])
  return (
    <CRow>
      <CCol lg={3}>
        <h3 className="mb-2 mt-1">Health Check-up</h3>
      </CCol>
      <CCol lg={3} className="text-lg-end mb-2 mt-2">
        <input
          type="date"
          value={FromDate}
          className="form-control"
          onChange={(e) => {
            setFromDate(e.target.value)
            setToDate(e.target.value)
          }}
        />
      </CCol>
      <CCol lg={3} className="text-lg-end mb-2 mt-2">
        <input
          type="date"
          min={FromDate}
          value={ToDate}
          className="form-control"
          onChange={(e) => setToDate(e.target.value)}
        />
      </CCol>
      <CCol lg={3} className="text-lg-end mb-2 mt-2">
        <select
          name=""
          value={AnimalID}
          className="form-control"
          onChange={(e) => setAnimalID(e.target.value)}
        >
          <option value="">Select Animals</option>
          <option value="0">All Animals</option>
          {AllAnimalList.map((s) => (
            <option value={s.ani_id} key={s.ani_id}>
              {s.ani_id} (Chip: {s.chip_no})
            </option>
          ))}
        </select>
      </CCol>
      <CCol lg={12}>
        <CCard className="mb-4 p-4">
          <CCardBody>
            <CRow className="d-none">
              <CCol lg={12}>
                <h4 className="mb-3">Animal ID</h4>
              </CCol>
              <CCol lg={4} className="mb-5">
                <CFormInput type="text" placeholder="ABCD1234" />
              </CCol>
              <CCol lg={4} className="mb-5">
                <CButton color="primary">
                  <CIcon icon={cilArrowRight} />
                </CButton>
              </CCol>
            </CRow>
            <CRow className="health-tab">
              <CCol lg={12}>
                <CNav variant="tabs" role="tablist">
                  <CNavItem>
                    <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                      Vaccinations
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                      Temperature
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>
                      Weight
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 4} onClick={() => setActiveKey(4)}>
                      Body Examination
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 5} onClick={() => setActiveKey(5)}>
                      Diseases/Treatment History
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 6} onClick={() => setActiveKey(6)}>
                      Haematology & Biochemistry
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey === 7} onClick={() => setActiveKey(7)}>
                      Blood Parasite
                    </CNavLink>
                  </CNavItem>
                  {/* <CNavItem>
                    <CNavLink active={activeKey === 8} onClick={() => setActiveKey(8)}>
                      Testonly
                    </CNavLink>
                  </CNavItem> */}
                </CNav>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="tab1" visible={activeKey === 1}>
                    <VaccinationsForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab2" visible={activeKey === 2}>
                    <TemperatureForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab3" visible={activeKey === 3}>
                    <WeightForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab4" visible={activeKey === 4}>
                    <BodyExaminationForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab5" visible={activeKey === 5}>
                    <DiseasesTreatmentForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab6" visible={activeKey === 6}>
                    <HaematoBioForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="tab7" visible={activeKey === 7}>
                    <BloodParasiteForm
                      AllAnimalList={AllAnimalList}
                      AnimalID={AnimalID}
                      FromDate={FromDate}
                      ToDate={ToDate}
                    />
                  </CTabPane>

                  {/* <CTabPane role="tabpanel" aria-labelledby="tab7" visible={activeKey === 8}>
                    <Testonly />
                  </CTabPane> */}
                </CTabContent>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddHealthCheckup

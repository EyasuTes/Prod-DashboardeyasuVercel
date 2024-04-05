import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="w-100 text-center">
        <span className="ms-1">Fujairah Research Centre &copy; 2023 - All Rights Reserved.</span>
      </div>
      <div className="ms-auto d-none">
        <span className="me-1">
          Design & Developed by &nbsp;
          <a href="https://www.sjain.io/" target="_blank" rel="noreferrer">
            <img src="https://sjain.io/logo/sjain-blue.svg" alt="Sjain Ventures" width={45} />
          </a>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

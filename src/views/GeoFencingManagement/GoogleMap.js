import React from 'react'
import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'

const ShowGoogleMap = ({ Lat, Long, Radious, defaultCenter, changeMarkerPosition }) => {
  const apiIsLoaded = (map, maps) => {
    if (map) {
      map.setOptions({ mapId: 'satellite', mapTypeControl: true, minZoom: 2 })
    }
  }
  return (
    <>
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '', mapIds: ['satellite', 'hybrid', 'terrain', 'roadmap'] }}
          onchange={changeMarkerPosition}
          onClick={changeMarkerPosition}
          center={defaultCenter.center}
          zoom={defaultCenter.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }) => {
            apiIsLoaded(map, maps)
            new maps.Circle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.3,
              map,
              center: { lat: Number(Lat), lng: Number(Long) },
              radius: Number(Radious),
              draggable: true,
            })
          }}
        ></GoogleMapReact>
      </div>
    </>
  )
}

ShowGoogleMap.propTypes = {
  Lat: PropTypes.any,
  Long: PropTypes.any,
  Radious: PropTypes.any,
  changeMarkerPosition: PropTypes.any,
  defaultCenter: PropTypes.any,
}

export default ShowGoogleMap

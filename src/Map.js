/* global google */
import { GoogleMap, useLoadScript, Marker, InfoWindowF } from '@react-google-maps/api'
function Map({ rows }) {
    const jobPositions = rows.map(row => {
        const [title, address, city, latitude, longitude] = row
        const position = { lat: Number(latitude), lng: Number(longitude) }
        return position
    })

    // function onLoad(map) {
    //     const bounds = new google.maps.LatLngBounds()
    //     jobPositions.forEach(position => {
    //         bounds.extend(position)
    //     });
    //     map.fitBounds(bounds)
    // }

    const jobMarkers = jobPositions.map((position, index) => (
        <Marker key={index} position={position} background="red" />
    ))

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    return isLoaded
        ? (
            <GoogleMap mapContainerClassName='map-container' center={{ lat: 0, lng: 0 }} zoom={10}>
                {jobMarkers}
            </GoogleMap>
            
        )
        : <p>Map loading...</p>
}

export default Map
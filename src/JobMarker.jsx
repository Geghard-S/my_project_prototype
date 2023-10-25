import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import jobToMarkerUrl from './service/job/jobToMarkerUrl'

const InfW = ({ closeWindow, position }) => (
    <InfoWindowF onCloseClick={closeWindow} position={position}>
        <>
            <h3>{position.customerName}</h3>
            <h3>{position.address}</h3>
            <h2>{position.phone}</h2>
            <h2>{position.currentStage}</h2>
        </>
    </InfoWindowF>
)

export default function JobMarker({ handleMarkerClick, index, position, infoWindowOpen, infoWindowData, closeWindow }) {
    function handleClick() {
        handleMarkerClick(index, position.lat, position.lng, position.address, position.percentage)
    }
    const showWindow = infoWindowOpen && infoWindowData?.index === index
    const url = jobToMarkerUrl(position)

    return (
        <MarkerF key={index} position={position} onClick={handleClick} icon={{ url }}>
            {showWindow && <InfW closeWindow={closeWindow} position={position} />}
        </MarkerF>
    )
}
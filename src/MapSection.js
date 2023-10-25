/* global google */
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState } from 'react';
import JobItemRow from './JobItemRow';
import JobMarker from './JobMarker';
import filterByStage from './service/job/filterByStage';
import jobsToPositions from './service/job/rowsToPositions';
import StageSelect from './StageSelect';
import fetchSheet from './service/sheet/fetchSheet';
import sheetToJobs from './service/sheet/sheetToJobs';

function Map({ savedJobs }) {
    const [sheet, setSheet] = useState([])
    const [mapRef, setMapRef] = useState()
    const [infoWindowOpen, setInfoWindowOpen] = useState(false)
    const [infoWindowData, setInfoWindowData] = useState()
    const [jobRows, setJobRows] = useState([])
    const [stageFilter, setStageFilter] = useState('')
    const [urls, setUrls] = useState([])

    const sheetNames = ["Sheet1", "Sheet2", "Sheet3"];

    const sheetsUrls = [
        process.env.REACT_APP_GOOGLE_SHEET_URL2,
        process.env.REACT_APP_GOOGLE_SHEET_URL3,
        process.env.REACT_APP_GOOGLE_SHEET_URL4
    ]

    // set initial url just to show all location pin. this is being tringger first
    useEffect(() => {
        setUrls([sheetsUrls[0]])
    }, [])

    //get all data from spreadsheet using fetch sheet function. when urls gets changed this useEffect runs
    useEffect(() => {
        const getSheet = async () => {
            try {
                console.log(urls)
                const sheet = await fetchSheet(urls)
                setSheet(sheet);

                console.log(sheet)
            } catch (error) {
                console.error('Error getting sheet:', error);
            }
        };
        getSheet()
    }, [urls])

    // when we get sheet from spreadsheet. this useEffect runs
    useEffect(() => {

        // sheet to jobs is responsible for getting all data and coordination lat/long. we are using map to have the same index for each jobs for each sheet
        const jobs = sheet.map(sheetToJobs(savedJobs));

        // converting all arrays into flat arry.
        Promise.all(jobs).then(jobs => {
            console.log(jobs)
            const sortedJobs = jobs.flat();
            sortedJobs.sort((a, b) => +a.jobIndex > +b.jobIndex ? 1 : -1)

            setJobRows(sortedJobs.filter(j => !!j).map(({ jobIndex, ...job }, index) => ({
                jobIndex: index,
                ...job
            })));
        });
    }, [sheet, savedJobs])

    const filteredJobs = filterByStage(jobRows, stageFilter)
    const jobPositions = jobsToPositions(filteredJobs)

    // map html reference being set in the state when we load the map with alll the location pin. so that we can highlight all pin/deatils 
    function onLoad(map) {
        setMapRef(map)
        const bounds = new google.maps.LatLngBounds()
        // with extend function with set all pin with lat/long
        jobPositions?.forEach(position => {
            bounds.extend(position)
        });
        map.fitBounds(bounds)
    }

    // whnever someone click on the pin we show details/info
    function handleMarkerClick(index, latitude, longitude, address, percentage) {
        mapRef?.panTo({ lat: latitude, lng: longitude })
        setInfoWindowData({ index, address, percentage })
        setInfoWindowOpen(true)
    }

    function closeWindow() {
        setInfoWindowData(false)
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const hasLoaded = isLoaded &&
        sheet?.every(n => n?.values != null) && jobRows?.length > 0;

    // on click row we highlight details with that correpondant row's lat/long and addres
    function onClickRow(i) {
        const position = jobPositions[i]
        handleMarkerClick(i, position.lat, position.lng, position.address, position.percentage)
    }

    // on select dropdown we change the sheet url to get new data from the sheet
    function onChangeUrl(e) {
        setUrls([e.target.value])
    }

    return (
        <>
            <div id='sheetSelectArea'>
                <p id='caption'>
                    Jobs not shown on the list are missing one of the following: "Job#", "Customer Name", "Address"
                </p>
                <div id='selectionArea'>
                    <p id='select'>Select Spreadsheet</p>
                    <select id="sheetSelect" className="sheetSelect" onChange={onChangeUrl}>
                        {
                            sheetsUrls.map((url, i) => {
                                return <option value={url} key={i}>
                                    {sheetNames[i]}
                                </option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='table-container' role="region" aria-labelledby="caption" tabIndex="0">
                <table className="table">
                    <thead>
                        <tr>
                            <th id='col1' className='bgColor'>#</th>
                            <th id='col2' className='bgColor'>Customer Name</th>
                            {/* <th id='col3'>Address</th> */}
                            <th id='col4'>Current Stage</th>
                            <th id='col5'>Progress</th>
                            <th id='col6'>SS</th>
                            <th id='col7'>Adders</th>
                            <th id='col8'>HOA</th>
                            <th id='col9'>MPU</th>
                            <th id='col10'>Meter Spot</th>
                            <th id='col11'>Stucco</th>
                            <th id='col12'>Plan Design</th>
                            <th id='col13'>Layout App.</th>
                            <th id='col14'>Placard</th>
                            <th id='col15'>Permit Sub.</th>
                            <th id='col16'>Permit Obt.</th>
                            <th id='col17'>Installation</th>
                            <th id='col18'>Final Ins.</th>
                            <th id='col19'>80% Payment</th>
                            <th id='col20'>Monitoring</th>
                            <th id='col21'>PTO</th>
                            <th id='col22'>Final Payment</th>
                            <th id='col23'>Note</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {filteredJobs?.map((job, i) => <JobItemRow key={job.jobIndex} row={job} onClickRow={() => onClickRow(i)} />)}
                    </tbody>
                </table>
            </div>
            <hr></hr>
            <StageSelect stageFilter={stageFilter} handleStageFilterChange={stage => setStageFilter(stage)} />
            {hasLoaded ? (
                <GoogleMap mapContainerClassName='map-container' onLoad={onLoad} onClick={closeWindow}>
                    {jobPositions?.map((position, index) => (
                        <JobMarker
                            key={position.jobIndex}
                            handleMarkerClick={handleMarkerClick}
                            index={index}
                            position={position}
                            infoWindowOpen={infoWindowOpen}
                            infoWindowData={infoWindowData}
                            closeWindow={closeWindow}
                        />
                    ))}
                </GoogleMap>
            ) : <p>Map loading...</p>}
        </>
    )
}

export default Map
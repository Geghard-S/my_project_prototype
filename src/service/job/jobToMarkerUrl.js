import { markerColors } from "../../stage-colors";

const baseUrl = 'http://maps.google.com/mapfiles/ms/icons';

export default function jobToMarkerUrl(job) {
    const buttonColor = markerColors[job.currentStage]
    if (buttonColor == null) {
        console.log('no button color job:', job)
    }
    return `${baseUrl}/${buttonColor}.png`;
}
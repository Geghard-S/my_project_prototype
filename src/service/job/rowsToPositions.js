export default function jobsToPositions (rows) {
    return rows?.map(row => {
        const { jobIndex, customerName, address, phone, latitude, longitude, percentage, currentStage, incompleteStageIndex } = row
        const position = { jobIndex, customerName, address, phone, lat: Number(latitude), lng: Number(longitude), percentage, currentStage, incompleteStageIndex }
        return position
    })
}
export default function JobItemRow ({ row, onClickRow }) {
    const { jobIndex, customerName, address, currentStage, projectProgress, siteSurvey, adders, hoa, mpu, meterspot, stucco, planDesign, 
        layoutApproval, placard, permitSubmission, permitObtaining, installation, finalInspection, payment, monitoringSetupDate, pto, note, finalPayment} = row
    
    return (
        <tr onClick={onClickRow}>
            <td id='col1'>{jobIndex + 1}</td>
            <td id='col2'>{customerName}</td>
            {/* <td id='col3'>{address}</td> */}
            <td id='col4'>{currentStage}</td>
            <td id='col5'>{projectProgress}</td>
            <td id='col6'>{siteSurvey}</td>
            <td id="col7">{adders}</td>
            <td id="col8">{hoa}</td>
            <td id="col9">{mpu}</td>
            <td id="col10">{meterspot}</td>
            <td id="col11">{stucco}</td>
            <td id="col12">{planDesign}</td>
            <td id="col13">{layoutApproval}</td>
            <td id="col14">{placard}</td>
            <td id="col15">{permitSubmission}</td>
            <td id="col16">{permitObtaining}</td>
            <td id="col17">{installation}</td>
            <td id="col18">{finalInspection}</td>
            <td id="col19">{payment}</td>
            <td id="col20">{monitoringSetupDate}</td>
            <td id="col21">{pto}</td>
            <td id="col22">{finalPayment}</td>
            <td id="col23">{note}</td>
        </tr>
    )
}
const defaultColumns = ['jobIndex', 'jobPoNumber', 'customerName', 'projectProgress', 'utility', 'jobInfo', 'address', 'phone', 'email', 'watt']
const secondaryColumns = ['wo', 'salesman', 'status', 'siteSurvey', 'adders', 'hoa', 'mpu', 'meterspot', 'stucco', 'planDesign', 'layoutApproval', 'placard', 'permitSubmission', 'permitObtaining', 'installation', 'finalInspection', 'payment']

const getColumnsOrder = (contractPriceSheet, headingK) => {
    const columnOrder = contractPriceSheet
        ? [...defaultColumns, 'contractPrice', 'solarCost', 'salesman', 'refferal', 'status', 'siteSurvey', 'adders', 'hoa', 'mpu', 'meterspot', 'stucco', 'planDesign', 'layoutApproval', 'placard', 'permitSubmission', 'permitObtaining', 'installation', 'finalInspection', 'payment', 'monitoringSetupDate', 'pto', 'note', 'finalPayment']//,issues
        : headingK === 'WO'
            ? [...defaultColumns, ...secondaryColumns, 'monitoringSetupDate', 'pto', 'finalPayment', 'total']
            : [...defaultColumns, ...secondaryColumns, 'accountReceivable', 'monitoringSetupDate', 'pto', 'finalPayment', 'total']

    return columnOrder;
}

export default getColumnsOrder;

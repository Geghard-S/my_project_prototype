import { createDoc } from "../../firebase.js";
import parseJobs from "../../utils/parseJob";
import getColumnsOrder from "../../utils/getColumnsOrder";

const parseAddress = address => address.trim().replaceAll('\n', ' ');

export default function sheetToJobs(savedJobs) {
    return async (sheet) => {
        if (sheet == null || sheet.values == null) {
            return []
        }
        const headingRow = sheet.values[2]
        const headingK = headingRow[10]
        const contractPriceSheet = headingK === 'Contract price'

        const jobs = sheet.values.map(row => {
            const job = {}
            getColumnsOrder(contractPriceSheet, headingK).forEach((column, index) => {
                const value = row[index]
                job[column] = value
            })
            return job
        })

        const filteredJobs = jobs?.filter(job => {
            const isNum = !isNaN(parseFloat(job.jobIndex)) && isFinite(job.jobIndex);
            //const notEmpty = !!thirdCol && !!seventhCol && !!salesman;
            if (!isNum) {
                return false
            }
            const addressed = job.address != null && job.address !== ''
            return addressed
        });

        const parseJob = parseJobs(contractPriceSheet)

        const getCoordinates = async (url, job) => {
            const response = await fetch(url)
            const { results } = await response.json()
            if (results.length === 0) return;

            const [{ geometry: { location } }] = results;

            // Add new address/coordinates to Firestore
            createDoc({
                address: parseAddress(job.address),
                coordinates: JSON.stringify(location)
            })

            return parseJob(job, location);
        }

        const rowPromises = filteredJobs.slice(0, 100)?.map(async (job) => {
            const address = parseAddress(job.address)
            const encodedAddress = encodeURIComponent(address)
            const location = savedJobs.find(job => job.address === address) // getGeometryFromSpreadsheet(job, locations);

            if (location) {
                return parseJob(job, location.coordinates);
            }

            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDO5u2tuiSkLarrhhCWi6G6wVEntq5F2v8`
            try {
                return await getCoordinates(url, job);
            } catch (error) {
                console.log('error job', job)

                try {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    console.log('Address data recovered!', job)
                    return await getCoordinates(url, job);
                } catch {
                    console.log('Failed twice')
                    return {};
                }
            }
        })

        const rowResults = await Promise.all(rowPromises)
        const validResults = rowResults.filter(result => result !== false)

        return validResults
    }
}
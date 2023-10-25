import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase.js';

export default function useSavedJobs() {
    const [savedJobs, setSavedJobs] = useState();

    useEffect(() => {
        const colName = 'coordinates'

        async function getData() {
            try {
                const querySnapshot = await getDocs(collection(db, colName));
                const savedJobs = []
                querySnapshot.forEach((doc) => {
                    const { address, coordinates } = doc.data();
                    if (!(address && coordinates)) return;
                    savedJobs.push({ address, coordinates: JSON.parse(coordinates) })
                });
                setSavedJobs(savedJobs)
            } catch (e) {
                console.log('error getting data from Firestore', e)
            }
        }

        getData();
    }, [])

    return savedJobs
}

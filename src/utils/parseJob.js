import { stageLabels } from "../stage-colors";

const parseJobs = (contractPriceSheet) => (job, location) => {
    const { lat, lng } = location
    job.latitude = lat
    job.longitude = lng
    job.stages = [
        job.siteSurvey,
        job.permitSubmission,
        job.permitObtaining,
        job.installation,
        job.finalInspection
    ]; // Define the stages array
    if (contractPriceSheet) {
        job.stages.push(job.note)
    }

    //const incompleteStageIndex = stages.findIndex(stage => stage === 'no'); // Find the index of the first incomplete stage
    job.incompleteStageIndex = job.stages.findIndex((stage, index) => {
        if (index === 5) {
            if (stage == null) return false
            const stageStr = String(stage);
            if (stageStr === '') return false
            if (stageStr.toLowerCase() === 'no') return false
            return true
        }
        if (stage == null) return true
        const stageStr = String(stage);
        if (stageStr === '') return true
        if (stageStr.toLowerCase() === 'no') return true
        return false
    });

    job.currentStage = job.incompleteStageIndex >= 0 ? stageLabels[job.incompleteStageIndex] : 'Completed';

    return job;
}

export default parseJobs;

export default function filterByStage(jobs, stage) {
    return stage === ''
        ? jobs
        : jobs.filter(job =>{
            return job.currentStage === stage 
})
}


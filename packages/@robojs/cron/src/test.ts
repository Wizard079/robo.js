import Cron from './index'

async function main() {
	const job = await Cron('*/5 * * * * *', () => {
		console.log('This will run every fifth second')
	})

	console.log('Scheduled job:', job.raw)

	const jobId = await job.save() // Save the job with a generated ID
	console.log('Job saved with ID:', jobId)

    setTimeout(async () => {
		await job.remove(jobId) // Remove the scheduled job
		console.log('Job removed with ID:', jobId)
	}, 20000) 
}

// Execute the main function
main().catch(console.error)

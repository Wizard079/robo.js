import Croner, { CronOptions } from 'croner'
import { nanoid } from 'nanoid'
import { Flashcore } from 'robo.js'

type FileOrFunction = string | (() => void)

let jobsId: string[] = [] // array for storing jobsId

async function getFunOrObj(fileOrFunction: FileOrFunction | undefined | CronOptions) {
	if (typeof fileOrFunction === 'string') {
		try {
			const jobFile = await import(fileOrFunction)
			if (jobFile.default) return jobFile.default
			else throw new Error('File does not have default export')
		} catch (e) {
			console.error(`Failed to load or execute file: ${fileOrFunction}`, e)
		}
	}
	return fileOrFunction
}
export default async function Cron(
	cronExpression: string | Date,
	param1?: FileOrFunction | CronOptions,
	param2?: FileOrFunction | CronOptions
) {
	const funOrObj1 = await getFunOrObj(param1)
	const funOrObj2 = await getFunOrObj(param2)
	const job = Croner(cronExpression, funOrObj1, funOrObj2)

	return {
		save: async (id = nanoid()) => {
			if (typeof funOrObj1 === 'object' && typeof param2 === 'string') {
				await Flashcore.set(id, { cronExpression, param1, param2 })
			} else if (typeof funOrObj1 !== 'object' && typeof param1 === 'string') {
				await Flashcore.set(id, { cronExpression, param1, param2 })
			} else {
				throw new Error('Only file-based jobs will be save')
			}
			jobsId.push(id)
			return id
		},
		remove: async (id: string) => {
			try {
				await Flashcore.delete(id)
				jobsId = jobsId.filter((item: string) => item !== id)
				return id
			} catch (e) {
				console.error(`Error : removing job with ${id} results in  `, e)
			}
		},
		raw: job
	}
}
export { jobsId }

import { Flashcore } from 'robo.js'
import { CronOptions } from 'croner'
import Cron, { jobsId } from '..'
type FileOrFunction = string | (() => void)
interface CronArgs {
	cronExpression: string | Date
	param1?: FileOrFunction | CronOptions
	param2?: FileOrFunction | CronOptions
}
export default async () => {
	for (const id in jobsId) {
		const arg: CronArgs = await Flashcore.get(id)
		try {
			Cron(arg.cronExpression, arg.param1, arg.param2)
		} catch (e) {
			console.error(`Unable to load ${arg} `, e)
		}
	}
}

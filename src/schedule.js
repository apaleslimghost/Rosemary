import parseDuration from '!/parse-duration'
import { TaskSchema } from './components/schemas'

/** @typedef {import('!/zod@3.18').z.output<typeof TaskSchema>} Task */
/** @typedef {Task & {startTime: Date}} ScheduledTask */

/** @returns Task */
const task = (
	/** @type {string} */ length,
	/** @type {string} */ name
) => ({
	length: parseDuration(length),
	name
})

/** @returns {ScheduledTask[]} */
const scheduleTasks = (/** @type {Task[]} */ [lastTask, ...otherTasks], /** @type {Date} */ endTime) => {
	if(!lastTask) return []

	const startTime = new Date(endTime.getTime() - lastTask.length)

	return [
		{...lastTask, startTime},
		...scheduleTasks(otherTasks, startTime)
	]
}

const scheduleGroups = (/** @type {Task[][]} */ groups, /** @type {Date} */ endTime) => (
	groups
		.map(group => scheduleTasks(group, endTime))
		.flat()
		.sort((a, b) => (a.startTime?.getTime() ?? NaN) - (b.startTime?.getTime() ?? NaN))
)

export default scheduleGroups

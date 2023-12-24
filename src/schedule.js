/** @typedef {import('zod').z.output<typeof import('./components/schemas').TaskSchema>} Task */
/** @typedef {import('zod').z.output<typeof import('./components/schemas').ScheduledTaskSchema>} ScheduledTask */

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

// @ts-check

const parseDuration = require('parse-duration')
const humanizeDuration = require('humanize-duration')

/** @typedef {{ length: number, name: string }} Task */
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

const printTask = (/** @type {ScheduledTask} */ task) => `${task.startTime.toLocaleTimeString('en-GB')} ${task.name} (${humanizeDuration(task.length)})`

const scheduleGroups = (/** @type {Task[][]} */ groups, /** @type {Date} */ endTime) => (
	groups
		.map(group => scheduleTasks(group, endTime))
		.flat()
		.sort((a, b) => (a.startTime?.getTime() ?? NaN) - (b.startTime?.getTime() ?? NaN))
)

const groups = [
	[
		task('1h', 'roast potatoes'),
		task('10m', 'baste potatoes'),
		task('20m', 'parboil potatoes'),
		task('20m', 'chop potatoes')
	],
	[
		task('20m', 'rest meat'),
		task('3h', 'roast meat'),
		task('10m', 'sear meat')
	]
]

console.log(
	scheduleGroups(groups, new Date()).map(printTask).join('\n')
)

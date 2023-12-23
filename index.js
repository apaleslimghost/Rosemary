// @ts-check

const toposort = require('toposort')
const parseDuration = require('parse-duration')

/** @typedef {{ length: number, deps: string[] }} Task */

/** @returns Task */
const task = (
	/** @type {string} */ length,
	/** @type {string[]} */ deps
) => ({
	length: parseDuration(length),
	deps
})

const deps = (/** @type {Record<string, Task>} */ tasks) => {
	return Object.entries(tasks).flatMap(([name, task]) => task.deps.map(
		/** @returns {[string, string]} */
		dep => [name, dep]
	))
}

const schedule = (/** @type {Record<string, Task>} */ tasks, /** @type {Date} */ time) => {
	return toposort(deps(tasks)).map((task) => ({
		time: new Date(time.getTime() - tasks[task].length),
		task
	}))
}

const tasks = {
	boil: task('10m', ['chop']),
	chop: task('5m', ['wash']),
	wash: task('1m', []),
}

console.log(schedule(tasks, new Date()).map(({ time, task }) => `${task} ${tasks[task].length} ${time.toTimeString()}`))

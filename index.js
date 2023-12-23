// @ts-check

const toposort = require('toposort')
const moment = require('moment')
const parseDuration = require('parse-duration')


/** @typedef {{ length: moment.Duration, deps: string[] }} Task */

/** @returns Task */
const task = (
	/** @type {string} */ length,
	/** @type {string[]} */ deps
) => ({
	length: moment.duration(parseDuration(length)),
	deps
})

const deps = (/** @type {Record<string, Task>} */ tasks) => {
	return Object.entries(tasks).flatMap(([name, task]) => task.deps.map(
		/** @returns {[string, string]} */
		dep => [name, dep]
	))
}

const schedule = (/** @type {Record<string, Task>} */ tasks, /** @type {moment.Moment} */ time) => {
	return toposort(deps(tasks)).map((task) => ({
		time: time.subtract(tasks[task].length).clone(),
		task
	}))
}

const tasks = {
	boil: task('10m', ['chop']),
	chop: task('5m', ['wash']),
	wash: task('1m', []),
}

console.log(schedule(tasks, moment()).map(({ time, task }) => `${task} ${tasks[task].length} ${time.format()}`))

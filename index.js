// @ts-check

const toposort = require('toposort')
const moment = require('moment')
const parseDuration = require('parse-duration')

class Task {
	/**
	 * @param {string} length
	 * @param {string[]} deps
	 */
	constructor(length, deps) {
		this.length = moment.duration(parseDuration(length))
		this.deps = deps
	}

	static deps(/** @type {Record<string, Task>} */ tasks) {
		return Object.entries(tasks).flatMap(([name, task]) => task.deps.map(
			/** @returns {[string, string]} */
			dep => [name, dep]
		))
	}

	static sort(/** @type {Record<string, Task>} */ tasks) {
		return toposort(this.deps(tasks)).map((k) => tasks[k])
	}

	static deadline(/** @type {Record<string, Task>} */ tasks, /** @type {moment.Moment} */ time) {
		return this.sort(tasks).map((task) =>
			 [
				time.subtract(task.length).clone(),
				task
			]
		)
	}

	toString() {
		return this.name + '(' + this.length.humanize() + ')'
	}
}

const tasks = {
	boil: new Task('10m', ['chop']),
	chop: new Task('5m', ['wash']),
	wash: new Task('1m', []),
}

console.log(Task.deadline(tasks, moment()))

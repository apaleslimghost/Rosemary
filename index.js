// @ts-check

const toposort = require('toposort')
const moment   = require('moment')
const parseDuration = require('parse-duration')

class Task {
	static instances = {}

	constructor(name, length, deps) {
		this.name = name
		this.length = moment.duration(parseDuration(length))
		this.deps = deps

		Task.instances[name] = this
	}

	static deps() {
		return Object.values(this.instances).flatMap((task) => task.depPairs())
	}

	static sort() {
		return toposort(this.deps()).map((k) => Task.instances[k])
	}

	static deadline(time) {
		return this.sort().map((task) =>
			 [
				time.subtract(task.length).clone(),
				task
			]
		)
	}

	toString() {
		return this.name + '(' + this.length.humanize() + ')'
	}

	depPairs() {
		return this.deps.map((dep) => [this.name, dep])
	}
}

new Task('boil', '10m', ['chop'])
new Task('chop', '5m', ['wash'])
new Task('wash', '1m', [])

console.log(Task.deadline(moment()))

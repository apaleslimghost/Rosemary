import { html, createContext, useState } from '!/htm/preact/standalone.mjs'
import { produce } from '!/immer'

import useLocalStorage from '../use-local-storage.js'
import {StateSchema} from './schemas.js'
import { Group } from './group.js'
import { Task } from './task.js'
import scheduleGroups from '../schedule.js'

/** @returns {Date} */
function nextTime(/** @type {string} */ time) {
	const now = new Date()

	const [hourString, minuteString] = time.split(':')
	now.setHours(parseInt(hourString))
	now.setMinutes(parseInt(minuteString))
	now.setSeconds(0)

	if(now < new Date()) {
		now.setDate(now.getDate() + 1)
	}

	return now
}

function App() {
	const [appState, setAppState] = useLocalStorage('rosemary', StateSchema, { groups: [] })

	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [scheduleTime, setScheduleDate] = useState(new Date().toLocaleTimeString('en-GB', {timeStyle: 'short'}))

	console.log(scheduleTime, nextTime(scheduleTime))

	function addGroup() {
		setAppState(produce(state => {
			state.groups.push([])
		}))
	}

	function scheduledTasks() {
		setAppState(produce(state => {
			state.scheduledTasks = scheduleGroups(
				state.groups,
				nextTime(scheduleTime)
			)
		}))
	}

	return html`
		${appState.groups.map((tasks, i) => html`
			<${Group}
				tasks=${tasks}
				addTask=${
					(/** @type {import('../schedule').Task} */ task) => {
						setAppState(produce(state => {
							state.groups[i].push(task)
						}))
					}
				}
			/>
		`)}

		<button onClick=${addGroup}>+</button>

		<form onSubmit=${(/** @type {Event} */ event) => {
			event.preventDefault()
			scheduledTasks()
		}}>
			<input
				type="time"
				value=${scheduleTime}
				onChange=${
					(/** @type {InputEvent} */ event) => {
						setScheduleDate(
							/** @type {HTMLInputElement} */(event.currentTarget).value ?? new Date().toLocaleTimeString('en-GB', {timeStyle: 'short'})
						)
					}
				}
			/>
			<button>Go</button>
		</form>

		${appState.scheduledTasks && html`
			<ul>
				${appState.scheduledTasks.map(task =>
					html`<${Task} ...${task} />`
				)}
			</ul>
		`}
	`
}

export default App

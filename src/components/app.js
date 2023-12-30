import { html } from '!/htm/preact'
import { createContext, useState } from '!/preact/compat'
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

	function addGroup() {
		setAppState(produce(state => {
			state.groups.push([])
		}))
	}

	function scheduledTasks() {
		setAppState(produce(state => {
			const time = nextTime(scheduleTime)

			state.scheduleTime = time
			state.scheduledTasks = scheduleGroups(
				state.groups,
				time
			)
		}))
	}

	function clearSchedule() {
		setAppState(produce(state => {
			state.scheduleTime = undefined
			state.scheduledTasks = undefined
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

		<section>
			${appState.scheduleTime && appState.scheduledTasks
				? html`
					<h3>
						<time datetime=${appState.scheduleTime.toISOString()}>
							${appState.scheduleTime.toLocaleTimeString('en-GB', {timeStyle: 'short'})}
						</time>

						<button onClick=${() => clearSchedule()}>
							×
						</button>
					</h3>

					<ul>
						${appState.scheduledTasks.map(task =>
							html`<${Task} ...${task} />`
						)}
					</ul>
				`
				: html`
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
				`
			}
		</section>
	`
}

export default App

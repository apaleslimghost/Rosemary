import { html, useState } from '!/htm/preact/standalone.mjs'
import { Task } from './task.js'
import parseDuration from '!/parse-duration'


export const Group = (
	/** @type {{ tasks: import('../schedule').Task[], addTask: (task: import('../schedule').Task) => void }} */
	{ tasks, addTask }
) => {
	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [newTaskName, setNewTaskName] = useState('')
	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [newTaskLength, setNewTaskLength] = useState('')

	return html`
		<section>
			<ul>
				${tasks.map(task => html`
					<${Task} ...${task} />
				`)}

				<li>
					<form onSubmit=${(/** @type {Event} */event) => {
						event.preventDefault()
						addTask({
							name: newTaskName,
							length: parseDuration(newTaskLength)
						})
						setNewTaskName('')
						setNewTaskLength('')
					}}>
						<input
							placeholder='Chop potatoes'
							value=${newTaskName}
							onInput=${
								(/** @type {InputEvent} */ ev) =>
									setNewTaskName(
										/** @type {HTMLInputElement} */(ev.currentTarget).value
									)
							}
						/>
						<input
							placeholder='10m'
							size='6'
							value=${newTaskLength}
							onInput=${
								(/** @type {InputEvent} */ ev) =>
									setNewTaskLength(
										/** @type {HTMLInputElement} */(ev.currentTarget).value
									)
							}
						/>
						<button>+</button>
					</form>
				</li>
			</ul>
		</section>
	`
}

import { html, useState } from '!/htm/preact/standalone.mjs'
import { Task } from './task.js'


export const Group = (
	/** @type {{ tasks: import('../schedule').Task[], addTask: (task: import('../schedule').Task) => void }} */
	{ tasks, addTask }
) => {
	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [newTaskName, setNewTaskName] = useState('')

	return html`
		<section>
			<ul>
				${tasks.map(task => html`
					<${Task} ...${task} />
				`)}

				<li>
					<input
						value=${newTaskName}
						onInput=${
							(/** @type {InputEvent} */ ev) =>
								setNewTaskName(
									/** @type {HTMLInputElement} */(ev.currentTarget).value
								)
						}
					/>
					<button
						onClick=${() => {
							addTask({
								name: newTaskName,
								length: 0
							})
							setNewTaskName('')
						}}
					>+</button>
				</li>
			</ul>
		</section>
	`
}

import { html } from '!/htm/react'
import { useState } from '!/react'
import { Task } from './task.js'
import parseDuration from '!/parse-duration'
import { Droppable, Draggable } from '!/react-beautiful-dnd'

export const Group = (
	/** @type {{
	 * 	tasks: import('../schedule').Task[],
	 * 	addTask: (task: import('../schedule').Task) => void
	 * 	index: number
	 * }}
	 */
	{ tasks, addTask, index }
) => {
	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [newTaskName, setNewTaskName] = useState('')
	/** @type {[string, import('../use-local-storage').StateFunction<string>]} */
	const [newTaskLength, setNewTaskLength] = useState('')

	return html`
		<section>
			<${Droppable} droppableId=${index}>
				${(/** @type {import('react-beautiful-dnd').DroppableProvided} */ provided) => html`
					<div ref=${provided.innerRef} ...${provided.droppableProps}>
						${tasks.map((task, i) => html`
							<${Draggable} draggableId=${i} index=${i}>
								${(/** @type {import('react-beautiful-dnd').DraggableProvided} */ provided) => html`
									<${Task} task=${task} draggable=${provided} />
								`}
							<//>
						`)}
						${provided.placeholder}
					</div>
				`}
			<//>

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
		</section>
	`
}

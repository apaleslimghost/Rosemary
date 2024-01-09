import { html } from '!/htm/react'
import humanizeDuration from '!/humanize-duration'

export const Task = (
	/**
	 * @type {{
	 *		task: import('../schedule').Task | import('../schedule').ScheduledTask,
	 *		draggable?: import('react-beautiful-dnd').DraggableProvided
	 * }}
	 */
	{ task, draggable }
) => html`
	<div
		ref=${draggable && draggable.innerRef}
		...${draggable ? draggable.draggableProps : {}}
	>
		${draggable && html`
			<span ...${draggable.dragHandleProps}>⣿</span>
		`}
		${'startTime' in task ? task.startTime.toLocaleTimeString('en-GB', {timeStyle: 'short'}) + ' ' : ''}
		${task.name} (${humanizeDuration(task.length)})
	</div>
`

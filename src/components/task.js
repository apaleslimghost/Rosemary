import { html } from '!/htm/preact/standalone.mjs'
import humanizeDuration from '!/humanize-duration'

export const Task = (/** @type {import('../schedule').Task | import('../schedule').ScheduledTask} */ task) => html`
	<li>
		${'startTime' in task ? task.startTime.toLocaleTimeString('en-GB') + ' ' : ''}
		${task.name} (${humanizeDuration(task.length)})
	</li>
`

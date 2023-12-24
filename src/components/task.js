import { html } from '!/htm/preact/standalone.mjs'
import humanizeDuration from '!/humanize-duration'

export const Task = (/** @type {import('../schedule').Task} */ task) => html`
	<li>${task.name} ${humanizeDuration(task.length)}</li>
`

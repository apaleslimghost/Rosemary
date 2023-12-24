import { html } from '!/htm/preact/standalone.mjs'
import humanizeDuration from '!/humanize-duration'

import useLocalStorage from '../use-local-storage.js'
import {StateSchema} from './schemas.js'

function App() {
	const [appState, setAppState] = useLocalStorage('rosemary', StateSchema, { groups: [] })

	function addGroup() {
		setAppState(state => ({
			groups: [
				...state.groups,
				[]
			]
		}))
	}

	function addTask(/** @type {number} */ index) {

	}

	return html`
		<section>
			${appState.groups.map((group, groupIndex) => html`
				<ul>
					${group.map(task => html`
						<li>${task.name} ${humanizeDuration(task.length)}</li>
					`)}

					<li><button onClick=${() => addTask(groupIndex)}>+</button></li>
				</ul>
			`)}
		</section>
		<button onClick=${addGroup}>+</button>
	`
}

export default App

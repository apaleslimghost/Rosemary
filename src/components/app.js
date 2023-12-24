import { html, createContext } from '!/htm/preact/standalone.mjs'
import { produce } from '!/immer'

import useLocalStorage from '../use-local-storage.js'
import {StateSchema} from './schemas.js'
import { Group } from './group.js'

function App() {
	const [appState, setAppState] = useLocalStorage('rosemary', StateSchema, { groups: [] })

	function addGroup() {
		setAppState(produce(state => {
			state.groups.push([])
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
	`
}

export default App

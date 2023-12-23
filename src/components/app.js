import { html } from '!/htm/preact/standalone.mjs'
import useLocalStorage from '../use-local-storage.js'
import StateSchema from './state.js'

function App() {
	const [count, setCount] = useLocalStorage('count', StateSchema, {count: 13.7})

	return html`
		<button onClick=${() => setCount(c => ({ count: c.count + 1 }))}>${count.count}</button>
	`
}

export default App

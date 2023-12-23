import { useState, useEffect } from '!/htm/preact/standalone.mjs'

/**
 * @template T
 * @typedef {(state: T) => T} Updater
 */

/**
 * @template T
 * @typedef {(arg: T | Updater<T>) => void} StateFunction
 */

/** @template T */
/** @returns {[T, StateFunction<T>]} */
const useLocalStorage = (/** @type {string} */ key, /** @type {T} */ initialState) => {
	const /** @type {[T, StateFunction<T>]} */ [state, setState] = useState(() => {
		const stored = localStorage.getItem(key)
		if(stored) {
			return JSON.parse(stored)
		}

		return initialState
	})

	useEffect(() => {
		function update(/** @type {StorageEvent} */ event) {
			if(event.key === key && event.newValue) {
				setState(JSON.parse(event.newValue))
			}
		}

		window.addEventListener('storage', update)
		return () => window.removeEventListener('storage', update)
	}, [key])

	localStorage.setItem(key, JSON.stringify(state))

	return [state, setState]
}

export default useLocalStorage

import { useState, useEffect } from '!/react'
import { z } from '!/zod@3.18'

/**
 * @template T
 * @typedef {(state: T) => T} Updater
 */

/**
 * @template T
 * @typedef {(arg: T | Updater<T>) => void} StateFunction
 */

/** @template {z.ZodTypeAny} T */
const useLocalStorage = (
	/** @type {string} */ key,
	/** @type {T} */ schema,
	/** @type {z.output<T>} */ initialState
) => {
	const /** @type {[z.output<T>, StateFunction<z.output<T>>]} */ [state, setState] = useState(() => {
		const stored = localStorage.getItem(key)
		if(stored) {
			const data = JSON.parse(stored)
			const result = schema.safeParse(data)
			if(result.success) {
				return result.data
			} else {
				console.error(result.error)
				localStorage.removeItem(key)
			}
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

	return /** @type {const} */([state, setState])
}

export default useLocalStorage

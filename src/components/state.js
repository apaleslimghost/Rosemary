import { z } from '!/zod@3.18'

const StateSchema = z.object({
	count: z.number()
})

export default StateSchema

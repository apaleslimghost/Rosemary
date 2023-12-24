import { z } from '!/zod@3.18'

export const TaskSchema = z.object({
	length: z.number(),
	name: z.string()
})

export const StateSchema = z.object({
	groups: z.array(z.array(TaskSchema))
})

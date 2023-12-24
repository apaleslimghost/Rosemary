import { z } from '!/zod@3.18'

export const TaskSchema = z.object({
	length: z.number(),
	name: z.string()
})

export const ScheduledTaskSchema = TaskSchema.extend({
	startTime: z.string().transform(str => new Date(str))
})

export const StateSchema = z.object({
	groups: z.array(z.array(TaskSchema)),
	scheduledTasks: z.array(ScheduledTaskSchema).optional(),
	scheduleTime: z.string().optional().transform(str => str ? new Date(str) : undefined)
})

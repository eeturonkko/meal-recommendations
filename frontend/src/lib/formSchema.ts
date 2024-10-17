import { z } from 'zod';

export const newFoodFormSchema = z.object({
	id: z.number(),
	food: z.string().min(1).max(100),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const newMealFormSchema = z.object({
	id: z.number(),
	meal: z.string().min(1).max(100)
});

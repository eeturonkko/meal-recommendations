import { z } from 'zod';

export const newFoodFormSchema = z.object({
	food: z.string().min(1).max(100),
	//Date needs to be YYYY-MM-DD
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

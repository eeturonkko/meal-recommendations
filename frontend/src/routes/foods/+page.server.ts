import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { getAllMeals, addMeal, deleteMeal } from '$lib/functions';
import { newMealFormSchema } from '$lib/formSchema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const meals = await getAllMeals();
	return { meals };
};

export const actions = {
	addMeal: async (event) => {
		const form = await superValidate(event, zod(newMealFormSchema));
		const { meal } = form.data;
		await addMeal(meal);
	},

	deleteMeal: async (event) => {
		const form = await superValidate(event, zod(newMealFormSchema));
		const { id } = form.data;
		await deleteMeal(id);
	}
} satisfies Actions;

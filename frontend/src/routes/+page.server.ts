import { zod } from 'sveltekit-superforms/adapters';
import { newFoodFormSchema } from '$lib/formSchema';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import {
	getAllFoods,
	getLastFiveFoods,
	getRecommendedFoods,
	addEatenFood,
	deleteEatenFood
} from '$lib/functions';

export const load: PageServerLoad = async () => {
	const [allFoods, recommendedFoods, fiveLastFoods] = await Promise.all([
		getAllFoods(),
		getRecommendedFoods(),
		getLastFiveFoods()
	]);

	return {
		foods: allFoods,
		lastFiveFoods: fiveLastFoods,
		recommendedFoods: recommendedFoods
	};
};

export const actions = {
	addFood: async (event) => {
		const form = await superValidate(event, zod(newFoodFormSchema));
		const { food, date } = form.data;
		await addEatenFood(food, date);
	},

	deleteFood: async (event) => {
		const form = await superValidate(event, zod(newFoodFormSchema));
		const { id } = form.data;
		await deleteEatenFood(id);
	}
} satisfies Actions;

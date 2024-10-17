import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	// Add stuff
};

export const actions = {
	addFood: async (event) => {
		// Add stuff
		console.log(event);
	}
} satisfies Actions;

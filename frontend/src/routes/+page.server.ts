import type { PageServerLoad } from './$types';
import { getAllFoods, getRecommendedFoods } from '$lib/functions';

export const load: PageServerLoad = async () => {
	const [allFoods, recommendedFoods] = await Promise.all([getAllFoods(), getRecommendedFoods()]);

	return {
		foods: allFoods,
		recommendedFoods: recommendedFoods
	};
};

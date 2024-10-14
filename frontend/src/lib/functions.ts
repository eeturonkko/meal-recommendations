import type { Food, RecommendedFood, AllFoodsResponse, RecommendedFoodsResponse } from '$lib/types';

export async function getAllFoods(): Promise<Food[]> {
	const res = await fetch('http://localhost:5000/all_foods');
	const data: AllFoodsResponse = await res.json();
	return data.all_foods;
}

export async function getRecommendedFoods(): Promise<RecommendedFood[]> {
	const res = await fetch('http://localhost:5000/recommend_foods');
	const data: RecommendedFoodsResponse = await res.json();
	return data.recommendations;
}

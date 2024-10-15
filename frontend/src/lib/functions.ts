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

export async function addEatenFood(food: string, date: string): Promise<void> {
	await fetch('http://localhost:5000/add_food', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ food_name: food, eaten_date: date })
	});
}

export async function deleteEatenFood(id: number): Promise<void> {
	await fetch('http://localhost:5000/delete_food_by_id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	});
}

import { expect, test, vi } from 'vitest';
import { getAllFoods, getRecommendedFoods, addEatenFood, deleteEatenFood } from '$lib/functions';
import type { Food, RecommendedFood } from '$lib/types';

const mockFetch = vi.fn();

globalThis.fetch = mockFetch;

const mockAllFoods: Food[] = [
	{ id: 1, food_name: 'Apple', eaten_date: '2024-10-16' },
	{ id: 2, food_name: 'Banana', eaten_date: '2024-10-17' }
];

const mockRecommendedFoods: RecommendedFood[] = [
	{ food_name: 'Salmon', last_eaten_date: '2024-10-15' },
	{ food_name: 'Quinoa', last_eaten_date: '2024-10-14' }
];

test('getAllFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		json: async () => ({ all_foods: mockAllFoods }),
		ok: true
	});

	const foods = await getAllFoods();
	expect(foods).toEqual(mockAllFoods);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/all_foods');
});

test('getRecommendedFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		json: async () => ({ recommendations: mockRecommendedFoods }),
		ok: true
	});

	const recommendedFoods = await getRecommendedFoods();
	expect(recommendedFoods).toEqual(mockRecommendedFoods);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/recommend_foods');
});

test('addEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true
	});

	await addEatenFood('Apple', '2024-10-17');
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/add_food', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ food_name: 'Apple', eaten_date: '2024-10-17' })
	});
});

test('deleteEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true
	});

	await deleteEatenFood(1);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/delete_food_by_id', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: 1 })
	});
});

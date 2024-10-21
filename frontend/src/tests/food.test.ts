import type { Food, RecommendedFood } from '$lib/types';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
	getAllFoods,
	getLastFiveFoods,
	getRecommendedFoods,
	addEatenFood,
	updateEatenFood,
	deleteEatenFood
} from '$lib/functions';

const mockAllFoods: Food[] = [
	{ id: 1, food_name: 'Apple', eaten_date: '2024-10-16' },
	{ id: 2, food_name: 'Banana', eaten_date: '2024-10-17' },
	{ id: 3, food_name: 'Carrot', eaten_date: '2024-10-18' },
	{ id: 4, food_name: 'Date', eaten_date: '2024-10-19' },
	{ id: 5, food_name: 'Eggplant', eaten_date: '2024-10-20' },
	{ id: 6, food_name: 'Fennel', eaten_date: '2024-10-21' },
	{ id: 7, food_name: 'Grape', eaten_date: '2024-10-22' },
	{ id: 8, food_name: 'Honey', eaten_date: '2024-10-23' },
	{ id: 9, food_name: 'Iceberg lettuce', eaten_date: '2024-10-24' }
];

const mockRecommendedFoods: RecommendedFood[] = [
	{ food_name: 'Salmon', last_eaten_date: '2024-10-15' },
	{ food_name: 'Quinoa', last_eaten_date: '2024-10-14' },
	{ food_name: 'Pumpkin seeds', last_eaten_date: '2024-10-13' },
	{ food_name: 'Oats', last_eaten_date: '2024-10-12' },
	{ food_name: 'Nuts', last_eaten_date: '2024-10-11' },
	{ food_name: 'Mushrooms', last_eaten_date: '2024-10-10' },
	{ food_name: 'Lentils', last_eaten_date: '2024-10-09' }
];

const mockFetch = vi.fn();
let originalFetch: typeof fetch;

beforeEach(() => {
	originalFetch = globalThis.fetch;
	globalThis.fetch = mockFetch;
});

afterEach(() => {
	globalThis.fetch = originalFetch;
	mockFetch.mockReset();
});

test('getAllFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({ all_foods: mockAllFoods })
	});

	const foods = await getAllFoods();
	expect(foods).toEqual(mockAllFoods);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/all_foods');
});

test('getLastFiveFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({ last_five_foods: mockAllFoods.slice(0, 5) })
	});

	const foods = await getLastFiveFoods();
	expect(foods).toEqual(mockAllFoods.slice(0, 5));
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/last_five_foods');
});

test('getRecommendedFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({ recommendations: mockRecommendedFoods })
	});

	const recommendedFoods = await getRecommendedFoods();
	expect(recommendedFoods).toEqual(mockRecommendedFoods);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/recommend_foods');
});

test('addEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await addEatenFood('Apple', '2024-10-17');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/add_food',
		expect.objectContaining({
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ food_name: 'Apple', eaten_date: '2024-10-17' })
		})
	);
});

test('updateEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await updateEatenFood(1, 'Apple', '2024-10-17');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/update_food_by_id',
		expect.objectContaining({
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: 1, food_name: 'Apple', eaten_date: '2024-10-17' })
		})
	);
});

test('updateEatenFood handles server errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 404,
		json: async () => ({ message: 'Food not found' })
	});

	await expect(updateEatenFood(999, 'Apple', '2024-10-17')).rejects.toThrow('Food not found');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/update_food_by_id',
		expect.any(Object)
	);
});

test('deleteEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await deleteEatenFood(1);
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/delete_food_by_id',
		expect.objectContaining({
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: 1 })
		})
	);
});

test('deleteEatenFood handles server errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 404,
		json: async () => ({ message: 'Food not found' })
	});

	await expect(deleteEatenFood(999)).rejects.toThrow('Food not found');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/delete_food_by_id',
		expect.any(Object)
	);
});

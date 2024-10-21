import type { Meal } from '$lib/types';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { getAllMeals, addMeal, deleteMeal } from '$lib/functions';

const mockAllMeals: Meal[] = [
	{ id: 1, meal_name: 'Tortillapizzat' },
	{ id: 2, meal_name: 'Lasagne' }
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

test('getAllMeals fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({ all_meals: mockAllMeals })
	});

	const meals = await getAllMeals();
	expect(meals).toEqual(mockAllMeals);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/all_meals');
});

test('getAllMeals handles fetch errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 500,
		json: async () => ({ message: 'Internal Server Error' })
	});

	await expect(getAllMeals()).rejects.toThrow('Internal Server Error');
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/all_meals');
});

test('addMeal sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await addMeal('Pizza');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/add_meal',
		expect.objectContaining({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ meal_name: 'Pizza' })
		})
	);
});

test('addMeal handles server errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 400,
		json: async () => ({ message: 'Bad Request' })
	});

	await expect(addMeal('')).rejects.toThrow('Bad Request');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/add_meal',
		expect.any(Object)
	);
});

test('deleteMeal sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await deleteMeal(1);
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/delete_meal_by_id',
		expect.objectContaining({
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: 1 })
		})
	);
});

test('deleteMeal handles server errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 404,
		json: async () => ({ message: 'Meal not found' })
	});

	await expect(deleteMeal(999)).rejects.toThrow('Meal not found');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/delete_meal_by_id',
		expect.any(Object)
	);
});

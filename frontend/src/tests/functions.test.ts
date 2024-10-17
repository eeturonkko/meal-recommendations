import type { Food, RecommendedFood, Meal } from '$lib/types';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
	getAllFoods,
	getLastFiveFoods,
	getRecommendedFoods,
	addEatenFood,
	deleteEatenFood,
	getAllMeals,
	addMeal,
	deleteMeal
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
	{ id: 9, food_name: 'Iceberg lettuce', eaten_date: '2024-10-24' },
	{ id: 10, food_name: 'Jalapeno', eaten_date: '2024-10-25' }
];

const mockRecommendedFoods: RecommendedFood[] = [
	{ food_name: 'Salmon', last_eaten_date: '2024-10-15' },
	{ food_name: 'Quinoa', last_eaten_date: '2024-10-14' }
];

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

test('getAllFoods fetches the correct data', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: true,
		json: async () => ({ all_foods: mockAllFoods })
	});

	const foods = await getAllFoods();
	expect(foods).toEqual(mockAllFoods);
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/all_foods');
});

test('getAllFoods handles fetch errors', async () => {
	mockFetch.mockRejectedValueOnce(new Error('Network Error'));

	await expect(getAllFoods()).rejects.toThrow('Network Error');
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

test('getLastFiveFoods handles fetch errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 500,
		json: async () => ({ message: 'Internal Server Error' })
	});

	await expect(getLastFiveFoods()).rejects.toThrow('Internal Server Error');
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

test('getRecommendedFoods handles non-OK response', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 500,
		json: async () => ({ message: 'Internal Server Error' })
	});

	await expect(getRecommendedFoods()).rejects.toThrow('Internal Server Error');
	expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:5000/recommend_foods');
});

test('addEatenFood sends the correct request', async () => {
	mockFetch.mockResolvedValueOnce({ ok: true });

	await addEatenFood('Apple', '2024-10-17');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/add_food',
		expect.objectContaining({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ food_name: 'Apple', eaten_date: '2024-10-17' })
		})
	);
});

test('addEatenFood handles server errors', async () => {
	mockFetch.mockResolvedValueOnce({
		ok: false,
		status: 400,
		json: async () => ({ message: 'Bad Request' })
	});

	await expect(addEatenFood('Apple', 'invalid-date')).rejects.toThrow('Bad Request');
	expect(globalThis.fetch).toHaveBeenCalledWith(
		'http://localhost:5000/add_food',
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

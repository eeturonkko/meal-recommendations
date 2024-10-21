import type {
	Food,
	RecommendedFood,
	AllFoodsResponse,
	LastFiveFoodsResponse,
	RecommendedFoodsResponse,
	Meal
} from '$lib/types';

export async function getAllFoods(): Promise<Food[]> {
	const res = await fetch('http://localhost:5000/all_foods');
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to fetch all foods');
	}
	const data: AllFoodsResponse = await res.json();
	return data.all_foods;
}

export async function getLastFiveFoods(): Promise<Food[]> {
	const res = await fetch('http://localhost:5000/last_five_foods');
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to fetch last five foods');
	}
	const data: LastFiveFoodsResponse = await res.json();
	return data.last_five_foods;
}

export async function getRecommendedFoods(): Promise<RecommendedFood[]> {
	const res = await fetch('http://localhost:5000/recommend_foods');
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to fetch recommended foods');
	}
	const data: RecommendedFoodsResponse = await res.json();
	return data.recommendations;
}

export async function addEatenFood(food: string, date: string): Promise<void> {
	const res = await fetch('http://localhost:5000/add_food', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ food_name: food, eaten_date: date })
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to add eaten food');
	}
}

export async function updateEatenFood(id: number, food: string, date: string): Promise<void> {
  const res = await fetch('http://localhost:5000/update_food_by_id', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, food_name: food, eaten_date: date })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update eaten food');
  }
}

export async function deleteEatenFood(id: number): Promise<void> {
	const res = await fetch('http://localhost:5000/delete_food_by_id', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to delete eaten food');
	}
}

export async function getAllMeals(): Promise<Meal[]> {
	const res = await fetch('http://localhost:5000/all_meals');
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to fetch all meals');
	}
	const data: { all_meals: Meal[] } = await res.json();
	return data.all_meals;
}

export async function addMeal(meal: string): Promise<void> {
	const res = await fetch('http://localhost:5000/add_meal', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ meal_name: meal })
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to add meal');
	}
}

export async function deleteMeal(id: number): Promise<void> {
	const res = await fetch('http://localhost:5000/delete_meal_by_id', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.message || 'Failed to delete meal');
	}
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('fi-FI');
}

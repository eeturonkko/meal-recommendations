/** Interface representing a food item from the 'all_foods' endpoint */
export interface Food {
	id: number;
	food_name: string;
	eaten_date: string; // Use 'Date' if you parse it into a Date object
}

/** Interface representing a recommended food item from the 'recommendations' endpoint */
export interface RecommendedFood {
	food_name: string;
	last_eaten_date: string; // Use 'Date' if you parse it into a Date object
}

/** Interface representing the response from the 'all_foods' endpoint */
export interface AllFoodsResponse {
	all_foods: Food[];
}

/** Interface representing the response from the 'recommendations' endpoint */
export interface RecommendedFoodsResponse {
	recommendations: RecommendedFood[];
}

export interface Meal {
	id: number;
	meal_name: string;
}

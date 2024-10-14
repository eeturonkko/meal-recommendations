<script lang="ts">
	import type { PageData } from './$types';
	import type { Food, RecommendedFood } from '$lib/types';

	export let data: PageData;

	const foods: Food[] = data.foods;
	const recommendedFoods: RecommendedFood[] = data.recommendedFoods;
</script>

<main class="container">
	<h1>Mitä tänään syötäisiin?</h1>
	<h2 class="text-green">Kaikki ruuat</h2>
	<ul>
		{#each foods as food}
			<li>{food.food_name} - Syöty {food.eaten_date}</li>
		{/each}
	</ul>

	<h2>Ruokavinkit</h2>
	<ul>
		{#each recommendedFoods as food}
			<li>{food.food_name} - Viimeksi syöty {food.last_eaten_date}</li>
		{/each}
	</ul>
</main>

<style>
	@import './styles.css';
</style>

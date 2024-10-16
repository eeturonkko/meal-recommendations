<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { Food, RecommendedFood } from '$lib/types';

	let dialog: HTMLDialogElement | null;

	function showModal() {
		if (!dialog) return;
		dialog.showModal();
	}

	function closeModal() {
		if (!dialog) return;
		dialog.close();
	}

	//TODO: Why is this not reactive?
	/*   export { data } = $props();
  let foods = $state(data.foods as Food[]);
  let recommendedFoods = $state(data.recommendedFoods as RecommendedFood[]);
 */

	export let data: PageData;
	$: foods = data.foods as Food[];
	$: recommendedFoods = data.recommendedFoods as RecommendedFood[];
</script>

<main class="container">
	<h1>Mitä tänään syötäisiin?</h1>
	<button class="dialog-open-btn" onclick={showModal}>Lisää ruoka</button>
	<dialog bind:this={dialog}>
		<p>Lisää ruoka</p>
		<form action="?/addFood" method="POST" use:enhance>
			<label for="food">Ruoka</label>
			<input placeholder="Ruoka" type="text" name="food" id="food" required />
			<label for="date">Pvm</label>
			<input type="date" name="date" id="date" required />
			<div class="dialog-form-btn-group">
				<button type="submit" onclick={closeModal}>Lisää</button>
				<button onclick={closeModal}>Peruuta</button>
			</div>
		</form>
	</dialog>
	<h2 class="text-green">Kaikki ruuat</h2>
	<ul>
		{#each foods as food}
			<div class="food-item">
				<li>{food.food_name} - Syöty {food.eaten_date}</li>
				<form method="POST" action="?/deleteFood" use:enhance>
					<input type="hidden" name="id" value={food.id} />
					<button type="submit">X</button>
				</form>
			</div>
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

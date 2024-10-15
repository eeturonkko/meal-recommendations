<script lang="ts">
	export let data: PageData;
	const foods: Food[] = data.foods;
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { Food, RecommendedFood } from '$lib/types';
	const recommendedFoods: RecommendedFood[] = data.recommendedFoods;

	let dialog: HTMLDialogElement | null;

	function showModal() {
		if (!dialog) return;
		dialog.showModal();
	}

	function closeModal() {
		if (!dialog) return;
		dialog.close();
	}
</script>

<main class="container">
	<h1>Mitä tänään syötäisiin?</h1>
	<button class="dialog-open-btn" on:click={showModal}>Lisää ruoka</button>
	<dialog bind:this={dialog}>
		<p>Lisää ruoka</p>
		<form action="?/addFood" method="POST" use:enhance>
			<label for="food">Ruoka</label>
			<input placeholder="Ruoka" type="text" name="food" id="food" />
			<label for="date">Pvm</label>
			<input type="date" name="date" id="date" />
			<div class="dialog-form-btn-group">
				<button type="submit">Lisää</button>
				<button on:click={closeModal}>Peruuta</button>
			</div>
		</form>
	</dialog>
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

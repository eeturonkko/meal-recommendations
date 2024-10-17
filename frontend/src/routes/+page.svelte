<script lang="ts">
	import { enhance } from '$app/forms';

	let dialog: HTMLDialogElement | null;

	function showModal() {
		if (!dialog) return;
		dialog.showModal();
	}

	function closeModal() {
		if (!dialog) return;
		dialog.close();
	}

	let { data } = $props();
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

	<h2 class="text-green">Viimeiset viisi ruokaa</h2>
	<ul>
		{#if data.lastFiveFoods.length === 0}
			<p>Ei syötyjä ruokia</p>
		{/if}
		{#each data.lastFiveFoods as food}
			<li class="food-item">
				<span>{food.food_name} - Syöty {food.eaten_date}</span>
				<form method="POST" action="?/deleteFood" use:enhance>
					<input type="hidden" name="id" value={food.id} />
					<button class="delete-btn" type="submit">X</button>
				</form>
			</li>
		{/each}
	</ul>

	<h2>Ruokavinkit</h2>
	<ul>
		{#if data.recommendedFoods.length === 0}
			<p>Ei suosituksia</p>
		{/if}
		{#each data.recommendedFoods as food}
			<li>{food.food_name} - Viimeksi syöty {food.last_eaten_date}</li>
		{/each}
	</ul>
	<a href="/foods" class="view-foods-link">Katso kaikki ruoat</a>
</main>

<style>
	.container {
		max-width: 800px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		padding: 30px;
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 34px;
		color: #2c7a7b;
		margin-bottom: 20px;
		line-height: 1.2;
	}

	h2 {
		font-size: 26px;
		color: #2c7a7b;
		margin: 30px 0 20px;
	}

	ul {
		list-style: none;
		padding-left: 0;
		margin-bottom: 30px;
	}

	li {
		background-color: #edf2f7;
		margin: 10px 0;
		padding: 15px;
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	}

	li:nth-child(odd) {
		background-color: #f7fafc;
	}

	dialog {
		width: 100%;
		max-width: 400px;
		border: none;
		border-radius: 10px;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		padding: 25px;
		position: fixed;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: left;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.6);
	}

	dialog p {
		font-size: 20px;
		font-weight: bold;
		color: #2c7a7b;
		margin-bottom: 20px;
	}

	dialog label {
		display: block;
		font-size: 16px;
		margin-bottom: 8px;
		color: #2c7a7b;
	}

	dialog input[type='text'],
	dialog input[type='date'] {
		width: calc(100% - 20px);
		padding: 12px;
		margin-bottom: 20px;
		border: 1px solid #cbd5e0;
		border-radius: 8px;
		box-sizing: border-box;
	}

	dialog form {
		display: flex;
		flex-direction: column;
	}

	.dialog-form-btn-group {
		display: flex;
		justify-content: space-evenly;
		gap: 10px;
		font-weight: 600;
	}

	dialog button {
		background-color: #38a169;
		color: #ffffff;
		border: none;
		padding: 12px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		width: 100%;
		font-weight: 600;
	}

	.dialog-open-btn {
		background-color: #38a169;
		color: white;
		border: none;
		padding: 12px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		width: 100%;
		font-weight: 600;
		margin-bottom: 20px;
	}

	.delete-btn {
		background-color: #e53e3e;
		color: white;
		border: none;
		padding: 10px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
		font-weight: 600;
	}

	.view-foods-link {
		display: block;
		margin-top: 20px;
		color: #2c7a7b;
		text-decoration: underline;
		font-size: 16px;
		font-weight: bold;
	}

	.view-foods-link:hover {
		color: #38a169;
	}
</style>

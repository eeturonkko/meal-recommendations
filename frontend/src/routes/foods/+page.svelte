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
		<p>Lisää ruoka tietokantaan</p>
		<form action="?/addMeal" method="POST" use:enhance>
			<label for="meal">Ruoka</label>
			<input placeholder="Ruoka" type="text" name="meal" id="meal" required />
			<div class="dialog-form-btn-group">
				<button type="submit" onclick={closeModal}>Lisää</button>
				<button onclick={closeModal}>Peruuta</button>
			</div>
		</form>
	</dialog>

	<h2 class="text-green">Kaikki ruoat</h2>

	{#if data.meals.length === 0}
		<p>Ei ruokia</p>
	{/if}

	{#if data.meals.length > 0}
		<table class="meals-table">
			<thead>
				<tr>
					<th>Ruoka</th>
					<th>Toiminnot</th>
				</tr>
			</thead>
			<tbody>
				{#each data.meals as meal}
					<tr>
						<td>{meal.meal_name}</td>
						<td>
							<form method="POST" action="?/deleteMeal" use:enhance>
								<input type="hidden" name="id" value={meal.id} />
								<button class="delete-btn" type="submit">Poista</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<a href="/" class="view-foods-link">Takaisin</a>
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

	.meals-table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	.meals-table thead {
		background-color: #2c7a7b;
		color: white;
	}

	.meals-table th,
	.meals-table td {
		padding: 12px 15px;
		border: 1px solid #e2e8f0;
		text-align: left;
	}

	.meals-table tbody tr:nth-child(even) {
		background-color: #f7fafc;
	}

	.meals-table tbody tr:hover {
		background-color: #e2e8f0;
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
		padding: 7px;
		border-radius: 8px;
		cursor: pointer;
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

	dialog input[type='text'] {
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
</style>

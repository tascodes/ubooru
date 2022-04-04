<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';
	let password = '';

	const onSignIn = async () => {
		const response = await fetch('login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, password })
		});

		if (response.status === 200) {
			goto('/');
		}
	};
</script>

<div class="h-screen flex items-center justify-center">
	<div class="mx-auto bg-white overflow-hidden shadow rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
				<div class="mt-1">
					<input
						bind:value={name}
						type="text"
						name="name"
						id="name"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						placeholder="Username"
					/>
				</div>
			</div>
			<div class="mt-4">
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<div class="mt-1">
					<input
						bind:value={password}
						type="password"
						name="password"
						id="password"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						placeholder="Password"
					/>
				</div>
			</div>
			<button
				on:click={onSignIn}
				type="button"
				class="ml-auto mt-8 flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Sign in
			</button>
		</div>
	</div>
</div>

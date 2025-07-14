<script lang="ts">
	import { getAuthContext } from '$lib/auth/context.svelte.js';

	const auth = getAuthContext();

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let fullName = $state('');
	let loading = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');

	async function handleRegister() {
		if (password !== confirmPassword) {
			message = 'Passwords do not match';
			messageType = 'error';
			return;
		}

		if (password.length < 6) {
			message = 'Password must be at least 6 characters';
			messageType = 'error';
			return;
		}

		loading = true;
		message = '';

		const { data, error } = await auth.signUp(email, password, {
			full_name: fullName
		});

		if (error) {
			message = error.message;
			messageType = 'error';
		} else {
			message = 'Check your email for confirmation link!';
			messageType = 'success';
		}

		loading = false;
	}

	const isFormValid = $derived(
		email.includes('@') &&
			password.length >= 8 &&
			password === confirmPassword &&
			fullName.trim().length > 0
	);
</script>

<svelte:head>
	<title>Mood Tracker — Registration</title>
	<meta name="description" content="Mood Tracker" />
</svelte:head>

<div class="auth-form-wrapper">
	<div class="auth-form">
		<h1>Register</h1>

		<form
			class="form"
			onsubmit={(e) => {
				e.preventDefault();
				handleRegister();
			}}
		>
			<div class="form-group">
				<label for="username">Full Name</label>
				<input
					id="full_name"
					type="text"
					placeholder="Enter your full name"
					class="input"
					class:input_error={false}
					bind:value={fullName}
				/>
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					class="input"
					class:input_error={!email.includes('@')}
					type="email"
					placeholder="Enter your email"
					bind:value={email}
					required
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					class="input"
					class:input_error={false}
					placeholder="Enter your password"
					bind:value={password}
					required
					minlength="6"
				/>
			</div>

			<div class="form-group">
				<label for="confirm-password">Confirm Password</label>
				<input
					id="confirm-password"
					class="input"
					class:input_error={false}
					type="password"
					placeholder="Confirm your password"
					bind:value={confirmPassword}
					required
					minlength="6"
				/>
			</div>

			<button type="submit" disabled={loading || !isFormValid}>
				{loading ? 'Registering...' : 'Register'}
            </button>
		</form>

		{#if message}
			<p class="message {messageType}">
				{message}
			</p>
		{/if}

		<p>
			Already have an account?
			<a href="/login">Login here</a>
		</p>
	</div>
</div>

<style lang="scss">
	.auth-form-wrapper {
		background: linear-gradient(to bottom, var(--color-gradient-start), var(--color-gradient-end));
		width: 100dvw;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	.auth-form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	.form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.input {
		width: 100%;
		box-sizing: border-box;
		outline-style: none;
		color: var(--color-neutral-600);
		font-size: var(--text-lg);
		font-style: italic;
		padding: 1rem;
		border: 1px solid var(--color-neutral-300);
		border-radius: 1rem;
		&:active,
		&:focus {
			outline: 0.25rem solid var(--color-blue-600);
		}
	}
	.input_error {
		border: 1px solid var(--color-red-700);
		&:active,
		&:focus {
			outline: 0.25rem solid var(--color-red-700);
		}
	}
</style>
	
<script lang="ts">
	import { getAuthContext } from '$lib/auth/context.svelte.js';
	import { goto } from '$app/navigation';

	const auth = getAuthContext();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let message = $state('');
	let showForgotPassword = $state(false);

	async function handleLogin() {
		loading = true;
		message = '';

		const { data, error } = await auth.signIn(email, password);

		if (error) {
			message = error.message;
		} else {
			goto('/');
		}

		loading = false;
	}

	async function handleForgotPassword() {
		if (!email) {
			message = 'Please enter your email address';
			return;
		}

		loading = true;
		const { error } = await auth.resetPassword(email);

		if (error) {
			message = error.message;
		} else {
			message = 'Check your email for password reset instructions';
			showForgotPassword = false;
		}

		loading = false;
	}

	const isFormValid = $derived(email.includes('@') && password.length > 8);
</script>

<svelte:head>
	<title>Mood Tracker — Login</title>
	<meta name="description" content="Mood Tracker" />
</svelte:head>

<div class="auth-form-wrapper">
	<div class="auth-form">
		<h1>Login</h1>

		{#if !showForgotPassword}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleLogin();
				}}
				class="form"
			>
				<div class="form-group">
					<label for="email">Email</label>

					<input
						class="input"
						class:input_error={!email.includes('@')}
						id="email"
						type="email"
						placeholder="Enter your email"
						bind:value={email}
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<input
						class="input"
						class:input_error={password.length < 8}
						id="password"
						type="password"
						placeholder="Enter your password"
						bind:value={password}
						required
					/>
				</div>

				<button type="submit" disabled={loading || !isFormValid}>
					{loading ? 'Logging in...' : 'Login'}
                </button>
			</form>
			<div class="button-group">
				<button type="button" onclick={() => (showForgotPassword = true)}>
					Forgot your password?
                </button>
			</div>
		{:else}
			<div class="forgot-password">
				<h2>Reset Password</h2>
				<div class="form-group">
					<label for="reset-email">Email</label>
					<input
						class="input"
						class:input_error={!email.includes('@')}
						id="reset-email"
						type="email"
						placeholder="Enter your email"
						bind:value={email}
						required
					/>
				</div>

				<div class="button-group">
					<button
						type="button"
						onclick={handleForgotPassword}
						disabled={loading || !email.includes('@')}
					>
						{loading ? 'Sending...' : 'Send Reset Email'}
					</button>

					<button type="button" onclick={() => (showForgotPassword = false)}>Back to Login</button>
				</div>
			</div>
		{/if}

		{#if message}
			<div class="message">{message}</div>
		{/if}

		<p>
			Don't have an account?
			<a href="/register">Register here</a>
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
	.forgot-password {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.button-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>

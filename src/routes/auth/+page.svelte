<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';

	// Define types for our form data
	interface FormError {
		error: string;
		email?: string;
		fullName?: string;
	}

	interface FormSuccess {
		success: string;
		message: string;
	}

	// Svelte 5 reactive state
	let isLoading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	// Derived state for form data
	let formData = $derived($page.form as (FormError | FormSuccess) | null);

	// Enhanced submit function
	const createSubmitHandler = (action: 'signup' | 'login'): SubmitFunction => {
		return ({ formData }) => {
			clearMessages();
			isLoading = true;
			successMessage = '';
			errorMessage = '';

			return async ({ result, update }) => {

				if (result.type === 'redirect') {
					// Successful submission with redirect - don't set loading to false yet
					successMessage =
						action === 'signup'
							? 'Account created! Redirecting...'
							: 'Login successful! Redirecting...';
					await update(); // This will trigger the redirect
					return;
				}

				// For all other cases, stop loading
				isLoading = false;

				if (result.type === 'success') {
					// Handle successful form submission (non-redirect)
					const successData = result.data as FormSuccess;
					if (successData?.message) {
						successMessage = successData.message;
					} else {
						successMessage =
							action === 'signup' ? 'Account created successfully!' : 'Login successful!';
					}
				} else if (result.type === 'failure') {
					// Server returned validation errors - form data will be updated
					// No need to set error message here, it comes from formData
				} else if (result.type === 'error') {
					// Unexpected server error
					errorMessage = 'An unexpected error occurred. Please try again.';
				}

				await update();
			};
		};
	};

	// Helper function
	function clearMessages() {
		successMessage = '';
		errorMessage = '';
	}

	// Computed values
	let displayError = $derived(
		errorMessage || (formData && 'error' in formData ? formData.error : '')
	);
	let displaySuccess = $derived(
		successMessage || (formData && 'success' in formData ? formData.message : '')
	);
</script>

<!-- Success Message -->
{#if displaySuccess}
	<div>
		<strong>Success:</strong>
		{displaySuccess}
		<button onclick={clearMessages}>×</button>
	</div>
{/if}

<!-- Error Message -->
{#if displayError}
	<div>
		<strong>Error:</strong>
		{displayError}
		<button onclick={clearMessages}>×</button>
	</div>
{/if}

<div>
	<!-- Signup Form -->
	<div>
		<h2>Sign Up</h2>
		<form method="POST" action="?/signup" use:enhance={createSubmitHandler('signup')}>
			<div>
				<label for="signup-full-name">Full Name:</label>
				<input
					id="signup-full-name"
					name="full_name"
					type="text"
					value={formData && 'fullName' in formData ? (formData.fullName ?? '') : ''}
					disabled={isLoading}
				/>
			</div>

			<div>
				<label for="signup-email">Email:</label>
				<input
					id="signup-email"
					name="email"
					type="email"
					value={formData && 'email' in formData ? (formData.email ?? '') : ''}
					disabled={isLoading}
					required
				/>
			</div>

			<div>
				<label for="signup-password">Password:</label>
				<input id="signup-password" name="password" type="password" disabled={isLoading} required />
			</div>

			<button type="submit" disabled={isLoading}>
				{isLoading ? 'Signing up...' : 'Sign Up'}
			</button>
		</form>
	</div>

	<!-- Login Form -->
	<div>
		<h2>Login</h2>
		<form method="POST" action="?/login" use:enhance={createSubmitHandler('login')}>
			<div>
				<label for="login-email">Email:</label>
				<input
					id="login-email"
					name="email"
					type="email"
					value={formData && 'email' in formData ? (formData.email ?? '') : ''}
					disabled={isLoading}
					required
				/>
			</div>

			<div>
				<label for="login-password">Password:</label>
				<input id="login-password" name="password" type="password" disabled={isLoading} required />
			</div>

			<button type="submit" disabled={isLoading}>
				{isLoading ? 'Logging in...' : 'Login'}
			</button>
		</form>
	</div>
</div>

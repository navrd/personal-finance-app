<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { CustomInput } from '$lib/components';
	import BlankButton from '$lib/components/utility/BlankButton.svelte';
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

	type AuthTabs = 'login' | 'signup';

	// Svelte 5 reactive state
	let isLoading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');
	let currentTab = $state<AuthTabs>('login');

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

	function switchTabs(tab: AuthTabs) {
		currentTab = tab;
	}

	// Computed values
	let displayError = $derived(
		errorMessage || (formData && 'error' in formData ? formData.error : '')
	);
	let displaySuccess = $derived(
		successMessage || (formData && 'success' in formData ? formData.message : '')
	);
</script>

<div class="login-wrapper">
	<!-- Success Message -->
	{#if displaySuccess}
		<div class="message message_success">
			<strong>Success:</strong>
			{displaySuccess}
			<button class="button" onclick={clearMessages}>×</button>
		</div>
	{/if}

	<!-- Error Message -->
	{#if displayError}
		<div class="message message_error">
			<strong>Error:</strong>
			{displayError}
			<button onclick={clearMessages}>×</button>
		</div>
	{/if}
	<!-- Signup Form -->
	{#if !displayError && !displaySuccess}
		{#if currentTab === 'signup'}
			<div class="login-wrapper__form">
				<h2 class="form-title">Sign Up</h2>
				<form
					method="POST"
					class="form"
					action="?/signup"
					use:enhance={createSubmitHandler('signup')}
				>
					<CustomInput
						type="text"
						name="full_name"
						disabled={isLoading}
						id="signup-fullname"
						label="Full Name"
					/>

					<CustomInput
						type="email"
						name="email"
						disabled={isLoading}
						id="signup-email"
						label="Email"
						value={formData && 'email' in formData ? (formData.email ?? '') : ''}
					/>

					<CustomInput
						type="password"
						name="password"
						disabled={isLoading}
						id="signup-password"
						label="Password"
					/>

					<button class="button" type="submit" disabled={isLoading}>
						{#if isLoading}
							<div class="button__loading">
								<div class="loading__dot"></div>
								<div class="loading__dot"></div>
								<div class="loading__dot"></div>
							</div>
						{:else}Sign Up{/if}
					</button>
				</form>
				<h2 class="auth-switch">
					Already have an account? <BlankButton onclick={() => switchTabs('login')}
						><span class="switch-tabs">Login</span></BlankButton
					>
				</h2>
			</div>
		{/if}

		<!-- Login Form -->
		{#if currentTab === 'login'}
			<div class="login-wrapper__form">
				<h2 class="form-title">Login</h2>
				<form
					method="POST"
					class="form"
					action="?/login"
					use:enhance={createSubmitHandler('login')}
				>
					<CustomInput
						type="email"
						name="email"
						disabled={isLoading}
						id="login-email"
						label="Email"
						value={formData && 'email' in formData ? (formData.email ?? '') : ''}
					/>

					<CustomInput
						type="password"
						name="password"
						disabled={isLoading}
						id="login-password"
						label="Password"
					/>

					<button type="submit" class="button" disabled={isLoading}>
						{#if isLoading}
							<div class="button__loading">
								<div class="loading__dot"></div>
								<div class="loading__dot"></div>
								<div class="loading__dot"></div>
							</div>
						{:else}Sign Up{/if}
					</button>
				</form>
				<h2 class="auth-switch">
					Don't have an account? <BlankButton onclick={() => switchTabs('signup')}
						><span class="switch-tabs">Sign Up</span></BlankButton
					>
				</h2>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.login-wrapper {
		min-width: 100dvw;
		max-width: 100dvw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--color-beige-100);
		color: var(--color-grey-900);
		font-size: 1.125rem;
		overflow: hidden;
	}
	.login-wrapper__form,
	.message {
		min-width: 30dvw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		gap: 0.75rem;
	}
	.form-title {
		font-size: 2rem;
		font-weight: bolder;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		justify-content: center;
	}
	.button {
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover,
		&:active,
		&:focus {
			cursor: pointer;
			opacity: 50%;
		}
	}
	.auth-switch {
		display: flex;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-grey-500);
	}
	.switch-tabs {
		font-weight: bolder;
		text-decoration: underline;
		cursor: pointer;
	}
	.button__loading {
		width: 5rem;
		height: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	@for $i from 1 through 10 {
		.button__loading :nth-child(#{$i}n) {
			animation-delay: #{$i * 0.25}s;
		}
	}
	@keyframes flickerAnimation {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.loading__dot {
		width: 1rem;
		height: 1rem;
		background: white;
		border-radius: 50%;
		animation: flickerAnimation 1s ease infinite;
	}
</style>

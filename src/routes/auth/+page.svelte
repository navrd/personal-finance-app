<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { CustomInput, CustomButton, LoadingDots, BlankButton } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';

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

	let successMessage = $state('');
	let errorMessage = $state('');
	let currentTab = $state<AuthTabs>('login');

	let loginMail = $state('');
	let loginPassword = $state('');
	let signupName = $state('');
	let signupEmail = $state('');
	let signupPasswordOne = $state('');
	let signupPasswordTwo = $state('');
	let isLoading = $state(false);

	function validateEmail(value: string | number): string | null {
		const email = String(value).trim();
		if (!email) return 'Email is required';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address';
		return null;
	}

	function validatePassword(value: string | number): string | null {
		const password = String(value);
		if (!password) return 'Password is required';
		return null;
	}

	function validateName(value: string | number): string | null {
		const name = String(value).trim();
		if (!name) return 'Name is required';
		if (name.length < 2) return 'Name must be at least 2 characters';
		return null;
	}

	function validateSignupPassword(value: string | number): string | null {
		const password = String(value);
		if (!password) return 'Password is required';
		if (password.length < 8) return 'Password must be at least 8 characters';
		if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
		if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
		if (!/\d/.test(password)) return 'Password must contain at least one number';
		return null;
	}

	function validateConfirmPassword(value: string | number): string | null {
		const confirmPassword = String(value);
		if (!confirmPassword) return 'Please confirm your password';
		if (signupPasswordOne !== confirmPassword) return 'Passwords do not match';
		return null;
	}

	// Form validation states (for submit buttons - check actual values, not just touched state)
	const isLoginFormValid = $derived.by(() => {
		return (
			validateEmail(loginMail) === null &&
			validatePassword(loginPassword) === null &&
			loginMail.trim().length > 0 &&
			loginPassword.length > 0
		);
	});

	const isSignupFormValid = $derived.by(() => {
		return (
			validateName(signupName) === null &&
			validateEmail(signupEmail) === null &&
			validateSignupPassword(signupPasswordOne) === null &&
			validateConfirmPassword(signupPasswordTwo) === null &&
			signupName.trim().length > 0 &&
			signupEmail.trim().length > 0 &&
			signupPasswordOne.length > 0 &&
			signupPasswordTwo.length > 0
		);
	});

	// Submit states
	const canSubmitLogin = $derived.by(() => Boolean(isLoginFormValid && !isLoading));
	const canSubmitSignup = $derived.by(() => Boolean(isSignupFormValid && !isLoading));

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

<div class="auth-wrapper">
	<!-- Success Message -->
	{#if displaySuccess}
		<div class="message message_success">
			<strong>Success:</strong>
			{displaySuccess}
			<CustomButton onclick={clearMessages}>×</CustomButton>
		</div>
	{/if}

	<!-- Error Message -->
	{#if displayError}
		<div class="message message_error">
			<strong>Error:</strong>
			{displayError}
			<CustomButton onclick={clearMessages}>×</CustomButton>
		</div>
	{/if}
	<!-- Signup Form -->
	{#if !displayError && !displaySuccess}
		{#if currentTab === 'signup'}
			<div class="auth-wrapper__form">
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
						bind:value={signupName}
						validator={validateName}
					/>

					<CustomInput
						type="email"
						name="email"
						disabled={isLoading}
						id="signup-email"
						label="Email"
						bind:value={signupEmail}
						validator={validateEmail}
					/>

					<CustomInput
						type="password"
						name="password"
						disabled={isLoading}
						id="signup-password-one"
						label="Password"
						bind:value={signupPasswordOne}
						validator={validateSignupPassword}
					/>
					<CustomInput
						type="password"
						name="password"
						disabled={isLoading}
						id="signup-password-two"
						label="Password"
						bind:value={signupPasswordTwo}
						validator={validateConfirmPassword}
					/>

					<CustomButton type="submit" disabled={!canSubmitSignup}>
						{#if isLoading}
							<LoadingDots />
						{:else}Sign Up{/if}
					</CustomButton>
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
			<div class="auth-wrapper__form">
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
						bind:value={loginMail}
						validator={validateEmail}
					/>

					<CustomInput
						type="password"
						name="password"
						disabled={isLoading}
						id="login-password"
						label="Password"
						bind:value={loginPassword}
						validator={validatePassword}
					/>

					<CustomButton type="submit" disabled={!canSubmitLogin}>
						{#if isLoading}
							<LoadingDots />
						{:else}Login{/if}
					</CustomButton>
				</form>
				<h2 class="auth-switch">
					Don't have an account? <BlankButton onclick={() => switchTabs('signup')}
						><span class="switch-tabs">Sign Up</span></BlankButton
					>
				</h2>
				<h2 class="auth-switch">
					Forgot password? <BlankButton onclick={() => goto('auth/reset-password')}
						><span class="switch-tabs">Reset it</span></BlankButton
					>
				</h2>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.auth-wrapper {
		min-width: 100dvw;
		max-width: 100dvw;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--color-beige-100);
		color: var(--color-grey-900);
		font-size: var(--font-size-l);
		overflow: hidden;
	}
	.auth-wrapper__form,
	.message {
		min-width: 30dvw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: white;
		border-radius: var(--radius-m);
		padding: var(--padding-xxl);
		gap: var(--gap-m);
	}
	.form-title {
		font-size: var(--font-size-xxxl);
		font-weight: bolder;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-m);
		justify-content: center;
	}
	.auth-switch {
		display: flex;
		gap: var(--gap-xs);
		font-size: var(--font-size-s);
		color: var(--color-grey-500);
	}
	.switch-tabs {
		font-weight: bolder;
		text-decoration: underline;
		cursor: pointer;
	}
</style>

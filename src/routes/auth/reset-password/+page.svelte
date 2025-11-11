<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { BlankButton, CustomButton, CustomInput, LoadingDots, SuccesfulSubmit } from '$lib/components';

	let { form } = $props();
	let isLoading = $state(false);
	let loginMail = $state('');

	function validateEmail(value: string | number): string | null {
		const email = String(value).trim();
		if (!email) return 'Email is required';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address';
		return null;
	}

	const isResetPasswordFormValid = $derived.by(() => {
		return validateEmail(loginMail) === null && loginMail.trim().length > 0;
	});

	const canSubmitResetPassword = $derived(Boolean(isResetPasswordFormValid && !isLoading));
</script>

<div class="auth-wrapper">
	<div class="auth-wrapper__form">
		{#if form?.success}
			<SuccesfulSubmit message="Check {loginMail} for a password reset link!" />{:else}
			<form
				class="form"
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update({reset: false});
						isLoading = false;
					};
				}}
			>
				<h1 class="form-title">Reset Password</h1>
				<CustomInput
					type="email"
					name="email"
					disabled={isLoading}
					id="login-email"
					label="Email"
					bind:value={loginMail}
					validator={validateEmail}
				/>

				{#if form?.error}
					<p class="error">{form.error}</p>
				{/if}

				<CustomButton type="submit" disabled={!canSubmitResetPassword}>
					{#if isLoading}
						<LoadingDots />
					{:else}Reset password{/if}
				</CustomButton>

				<h2 class="auth-switch">
					Remember password? <BlankButton onclick={() => goto('/auth')}
						><span class="switch-tabs">Go back to sign in</span></BlankButton
					>
				</h2>
			</form>
		{/if}
	</div>
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
		font-size: 1.125rem;
		overflow: hidden;
	}
	.auth-wrapper__form {
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
</style>

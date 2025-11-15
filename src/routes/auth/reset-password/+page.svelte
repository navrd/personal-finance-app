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
		min-width: var(--full-screen-width);
		max-width: var(--full-screen-width);
		min-height: var(--full-screen-height);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--color-beige-100);
		color: var(--color-grey-900);
		font-size: var(--font-size-l);
		overflow: hidden;
	}
	.auth-wrapper__form {
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

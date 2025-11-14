<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CustomButton, CustomInput, LoadingDots, SuccesfulSubmit } from '$lib/components';

	let { form } = $props();
	let isLoading = $state(false);
	let passwordOne = $state('');
	let passwordTwo = $state('');
	let timeToRedirect = $state(3);

	function validatePassword(value: string | number): string | null {
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
		if (passwordOne !== confirmPassword) return 'Passwords do not match';
		return null;
	}

	const isUpdatePasswordFormValid = $derived.by(() => {
		return (
			validatePassword(passwordOne) === null &&
			validateConfirmPassword(passwordTwo) === null &&
			passwordOne.length > 0 &&
			passwordTwo.length > 0
		);
	});

	const canSubmitUpdatePassword = $derived.by(() =>
		Boolean(isUpdatePasswordFormValid && !isLoading)
	);

	$effect(() => {
		if (form?.success) {
			const interval = setInterval(() => {
				timeToRedirect--;

				if (timeToRedirect <= 0) {
					clearInterval(interval);
					goto('/app/overview');
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});
</script>

<div class="auth-wrapper">
	<div class="auth-wrapper__form">
		{#if form?.success}
			<SuccesfulSubmit
				message="Password has been succesfully updated! Redirecting in {timeToRedirect}s..."
			/>{:else}
			<form
				class="form"
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update({ reset: false });
						isLoading = false;
					};
				}}
			>
				<h1 class="form-title">Update Password</h1>
				<CustomInput
					type="password"
					name="password"
					disabled={isLoading}
					id="password"
					label="Password"
					bind:value={passwordOne}
					validator={validatePassword}
				/>
				<CustomInput
					type="password"
					name="passwordConfirm"
					disabled={isLoading}
					id="password-confirm"
					label="confirm password"
					bind:value={passwordTwo}
					validator={validateConfirmPassword}
				/>

				{#if form?.error}
					<p class="message error">{form.error}</p>
				{/if}

				<CustomButton type="submit" disabled={!canSubmitUpdatePassword}>
					{#if isLoading}
						<LoadingDots />
					{:else}Update password{/if}
				</CustomButton>
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
</style>

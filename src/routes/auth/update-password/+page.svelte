<script lang="ts">
	import { enhance } from '$app/forms';
	import { CustomButton, CustomInput, LoadingDots } from '$lib/components';

	let { form } = $props();
	let isLoading = $state(false);
	let passwordOne = $state('');
	let passwordTwo = $state('');

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
</script>

<div class="auth-wrapper">

	<div class="auth-wrapper__form">
		<form
			class="form"
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
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
	.auth-wrapper__form,
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
</style>

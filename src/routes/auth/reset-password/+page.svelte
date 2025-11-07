<script lang="ts">
  import { enhance } from '$app/forms';
  
  let { form } = $props();
  let loading = $state(false);
</script>

<div class="container">
  <h1>Reset Password</h1>
  
  {#if form?.success}
    <p class="success">Check your email for a password reset link!</p>
  {:else}
    <form 
      method="POST" 
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          await update();
          loading = false;
        };
      }}
    >
      <label>
        Email
        <input 
          type="email" 
          name="email" 
          required 
          disabled={loading}
        />
      </label>
      
      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  {/if}
</div>
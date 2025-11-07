<script lang="ts">
  import { enhance } from '$app/forms';
  
  let { form } = $props();
  let loading = $state(false);
</script>

<div class="container">
  <h1>Update Password</h1>
  
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
      New Password
      <input 
        type="password" 
        name="password" 
        required 
        minlength="6"
        disabled={loading}
      />
    </label>
    
    <label>
      Confirm Password
      <input 
        type="password" 
        name="passwordConfirm" 
        required 
        minlength="6"
        disabled={loading}
      />
    </label>
    
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
    
    <button type="submit" disabled={loading}>
      {loading ? 'Updating...' : 'Update Password'}
    </button>
  </form>
</div>
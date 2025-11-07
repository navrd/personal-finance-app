import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.safeGetSession();
  
  // User must have a valid session from the email link
  if (!session) {
    console.log('No active session redirecting to reset')
    throw redirect(303, '/auth/reset-password');
  }
};

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (!password || !passwordConfirm) {
      return fail(400, { error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return fail(400, { error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters' });
    }

    const { error } = await locals.supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/'); // Redirect to home or dashboard
  },
} satisfies Actions;
// src/routes/auth/+page.server.ts (or wherever you have your auth actions)
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { PotError } from '$lib/types'


export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session, user } = await safeGetSession()
    return {
        session,
        user
    }
}

export const actions: Actions = {
    signout: async ({ locals, cookies }) => {
        try {
            // Server-side signout
            const { error } = await locals.supabase.auth.signOut()

            if (error) {
                console.error('Supabase signout error:', error)
            }

            // Clear all auth-related cookies
            const cookiesToClear = [
                'sb-access-token',
                'sb-refresh-token',
                'supabase-auth-token',
                'auth-token',
                // Add any other custom session cookies
            ]

            cookiesToClear.forEach(cookieName => {
                // Clear with different path/domain combinations
                cookies.delete(cookieName, { path: '/' })
                cookies.delete(cookieName, { path: '/', httpOnly: true })
                cookies.delete(cookieName, { path: '/', secure: true, httpOnly: true })
            })

            // Set a flag cookie for client-side cleanup (short-lived)
            cookies.set('clear-client-auth', 'true', {
                path: '/',
                maxAge: 5, // 5 seconds
                httpOnly: false, // Accessible to client JS
                secure: false // Works in dev
            })

        } catch (error) {
            console.error('Signout error:', error)
            // Don't throw here, continue with redirect
        }

        // Redirect to login or home
        throw redirect(303, '/auth')
    },

    createPot: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const name = formData.get('name')?.toString().trim();
            const targetStr = formData.get('target')?.toString();
            const theme = formData.get('theme')?.toString() || 'blue';
            const total = formData.get('total')?.toString();

            // Validation
            if (!name) {
                return fail(400, {
                    message: 'Pot name is required',
                    name, target: parseFloat(targetStr || '0'), theme
                } satisfies PotError);
            }
            const target = parseFloat(targetStr || '0');
            if (isNaN(target) || target <= 0) {
                return fail(400, {
                    message: 'Target amount must be a positive number',
                    name, target, theme
                } satisfies PotError);
            }

            if (name.length > 30) {
                return fail(400, {
                    message: 'Pot name must be 30 characters or less',
                    name, target, theme
                } satisfies PotError);
            }



            if (target > 1000000) {
                return fail(400, {
                    message: 'Target amount cannot exceed $1,000,000',
                    name, target, theme
                } satisfies PotError);
            }

            // Check if pot name already exists for this user
            const { data: existingPot } = await supabase
                .from('pots')
                .select('id')
                .eq('name', name)
                .eq('user_id', session.user.id)
                .single();

            if (existingPot) {
                return fail(400, {
                    message: 'A pot with this name already exists',
                    name, target, theme
                } satisfies PotError);
            }

            // Create the pot
            const { error } = await supabase
                .from('pots')
                .insert({
                    name,
                    target,
                    theme,
                    total,
                    user_id: session.user.id
                });

            if (error) {
                console.error('Error creating pot:', error);
                return fail(500, {
                    message: 'Failed to create pot. Please try again.',
                    name, target, theme
                } satisfies PotError);
            }

            return { success: true, message: 'Pot created successfully!' };

        } catch (err) {
            console.error('Unexpected error creating pot:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies PotError);
        }
    },

    updatePot: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const id = formData.get('id')?.toString();
            const name = formData.get('name')?.toString().trim();
            const targetStr = formData.get('target')?.toString();
            const theme = formData.get('theme')?.toString();
            const total = formData.get('total')?.toString();

            if (!id) {
                return fail(400, { message: 'Pot ID is required' } satisfies PotError);
            }

            // Validation
            if (!name) {
                return fail(400, {
                    message: 'Pot name is required',
                    id, name, target: parseFloat(targetStr || '0'), theme
                } satisfies PotError);
            }

            const target = parseFloat(targetStr || '0');
            if (isNaN(target) || target <= 0) {
                return fail(400, {
                    message: 'Target amount must be a positive number',
                    id, name, target, theme
                } satisfies PotError);
            }

            // Check if pot exists and belongs to user
            const { data: existingPot } = await supabase
                .from('pots')
                .select('id, total')
                .eq('id', id)
                .eq('user_id', session.user.id)
                .single();

            if (!existingPot) {
                return fail(404, { message: 'Pot not found' } satisfies PotError);
            }

            // Check if new target is less than current total
            if (target < existingPot.total) {
                return fail(400, {
                    message: `Target cannot be less than current saved amount ($${existingPot.total})`,
                    id, name, target, theme
                } satisfies PotError);
            }

            // Update the pot
            const { error } = await supabase
                .from('pots')
                .update({ name, target, theme, total })
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error updating pot:', error);
                return fail(500, { message: 'Failed to update pot' } satisfies PotError);
            }

            return { success: true, message: 'Pot updated successfully!' };

        } catch (err) {
            console.error('Unexpected error updating pot:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies PotError);
        }
    },

    deletePot: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const id = formData.get('id')?.toString();

            if (!id) {
                return fail(400, { message: 'Pot ID is required' } satisfies PotError);
            }

            // Check if pot exists and belongs to user
            const { data: existingPot } = await supabase
                .from('pots')
                .select('id, name, total')
                .eq('id', id)
                .eq('user_id', session.user.id)
                .single();

            if (!existingPot) {
                return fail(404, { message: 'Pot not found' } satisfies PotError);
            }

            // Prevent deletion if pot has money
            if (existingPot.total > 0) {
                return fail(400, {
                    message: `Cannot delete pot "${existingPot.name}" because it contains $${existingPot.total}. Withdraw the money first.`
                } satisfies PotError);
            }

            // Delete the pot
            const { error } = await supabase
                .from('pots')
                .delete()
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error deleting pot:', error);
                return fail(500, { message: 'Failed to delete pot' } satisfies PotError);
            }

            return { success: true, message: 'Pot deleted successfully!' };

        } catch (err) {
            console.error('Unexpected error deleting pot:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies PotError);
        }
    },

}

// src/routes/auth/+page.server.ts (or wherever you have your auth actions)
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { BudgetError } from '$lib/types'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
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
    createBudget: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const category_id = formData.get('category_id')?.toString().trim();
            const maximumStr = formData.get('maximum')?.toString();
            const theme_id = formData.get('theme_id')?.toString() || 'blue';

            // Validation
            if (!category_id) {
                return fail(400, {
                    error: 'Budget category is required',
                    category_id, maximumStr, theme_id
                });
            }


            const maximum = parseFloat(maximumStr || '0');
            if (isNaN(maximum) || maximum <= 0) {
                return fail(400, {
                    error: 'Maximum amount must be a positive number',
                    category_id, maximumStr, theme_id
                });
            }

            const { data: existingBudget } = await supabase
                .from('budgets')
                .select('id')
                .eq('category_id', category_id)
                .eq('user_id', session.user.id)
                .single();

            if (existingBudget) {
                return fail(400, {
                    message: 'A budget with this category already exists',
                    category_id, maximum, theme_id
                } satisfies BudgetError);
            }
            //create the budget
            const { error } = await supabase
                .from('budgets')
                .insert([
                    {
                        category_id,
                        maximum,
                        theme_id,
                        user_id: session.user.id
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error creating budget:', error);
                return fail(500, {
                    message: 'Failed to create budget. Please try again.',
                    category_id, maximum, theme_id
                } satisfies BudgetError);
            }

            return { success: true, message: 'Budget created successfully!' };

        } catch (err) {
            console.error('Unexpected error creating budget:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies BudgetError);
        }
    },

    updateBudget: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const id = formData.get('id')?.toString();
            const category_id = formData.get('category_id')?.toString().trim();
            const maximumStr = formData.get('maximum')?.toString();
            const theme_id = formData.get('theme_id')?.toString();

            if (!id) {
                return fail(400, { message: 'Budget ID is required' } satisfies BudgetError);
            }

            // Validation

            const maximum = parseFloat(maximumStr || '0');
            if (isNaN(maximum) || maximum <= 0) {
                return fail(400, {
                    message: 'Maximum amount must be a positive number',
                    category_id, maximum, theme_id
                } satisfies BudgetError);
            }

            if (!category_id) {
                return fail(400, {
                    message: 'Budget category is required',
                    category_id, maximum, theme_id
                } satisfies BudgetError);
            }

            const { data: existingBudget } = await supabase
                .from('budgets')
                .select('id')
                .eq('id', id)
                .eq('user_id', session.user.id)
                .single();
                
            if (!existingBudget) {
                return fail(404, { message: 'Budget not found' } satisfies BudgetError);
            }


            // Update the budget
            const { error } = await supabase
                .from('budgets')
                .update({ category_id, maximum, theme_id })
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error updating budget:', error);
                return fail(500, { message: 'Failed to update budget' } satisfies BudgetError);
            }

            return { success: true, message: 'Budget updated successfully!' };

        } catch (err) {
            console.error('Unexpected error updating budget:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies BudgetError);
        }
    },

    deleteBudget: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw redirect(303, '/auth');
        }

        try {
            const formData = await request.formData();
            const id = formData.get('id')?.toString();

            if (!id) {
                return fail(400, { message: 'Budget ID is required' } satisfies BudgetError);
            }

            // Check if budget exists and belongs to user
            const { data: existingBudget } = await supabase
                .from('budgets')
                .select('id')
                .eq('id', id)
                .eq('user_id', session.user.id)
                .single();

            if (!existingBudget) {
                return fail(404, { message: 'Budget not found' } satisfies BudgetError);
            }


            // Delete the budget
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', id)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error deleting budget:', error);
                return fail(500, { message: 'Failed to delete budget' } satisfies BudgetError);
            }

            return { success: true, message: 'Budget deleted successfully!' };

        } catch (err) {
            console.error('Unexpected error deleting budget:', err);
            return fail(500, { message: 'An unexpected error occurred' } satisfies BudgetError);
        }
    },
}

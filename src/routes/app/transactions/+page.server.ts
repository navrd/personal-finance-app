// src/routes/auth/+page.server.ts (or wherever you have your auth actions)
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

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
    }
}

import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const fullName = formData.get('full_name') as string

        if (!email?.trim() || !password?.trim()) {
            return fail(400, {
                error: 'Email and password are required',
                email: email || '',
                fullName: fullName || ''
            })
        }

        if (password.length < 6) {
            return fail(400, {
                error: 'Password must be at least 6 characters long',
                email,
                fullName
            })
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        })

        if (error) {
            console.error('Signup error:', error)
            return fail(400, {
                error: error.message || 'Failed to create account',
                email,
                fullName
            })
        }

        redirect(303, '/app/overview')
    },

    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email?.trim() || !password?.trim()) {
            return fail(400, {
                error: 'Email and password are required',
                email: email || ''
            })
        }

        const { error } = await supabase.auth.signInWithPassword({ 
            email: email.trim(), 
            password 
        })
        
        if (error) {
            console.error('Login error:', error)
            return fail(400, {
                error: error.message || 'Invalid email or password',
                email
            })
        }

        redirect(303, '/app/overview')
    },
}
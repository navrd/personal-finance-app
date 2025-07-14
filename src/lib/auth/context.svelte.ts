import { getContext, setContext } from 'svelte'
import type { User } from '@supabase/supabase-js'
import { supabase } from '$lib/supabaseClient'

interface UserProfile {
    id: string
    email: string
    avatar_url?: string
    avatar_path?: string;
    username: string
    full_name: string;
    created_at: string
    updated_at: string
}

class AuthContext {
    user = $state<User | null>(null)
    profile = $state<UserProfile | null>(null)
    loading = $state(true)
    initialized = $state(false)

    constructor() {
        this.initialize()
    }

    private async initialize() {
        if (this.initialized) return

        const { data: { session } } = await supabase.auth.getSession()
        this.user = session?.user ?? null

        if (this.user) {
            await this.loadProfile()
        }

        this.loading = false
        this.initialized = true

        supabase.auth.onAuthStateChange(async (event, session) => {
            this.user = session?.user ?? null

            if (this.user) {
                setTimeout(async () => this.loadProfile())
            } else {
                this.profile = null
            }

            this.loading = false
        })
    }

    private async loadProfile() {
        if (!this.user) return

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.user.id)
            .single()

        if (!error && data) {
            this.profile = data
        }
    }

    async signUp(email: string, password: string, userData?: Partial<UserProfile>) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        return { data, error }
    }

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    }

    async signOut() {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { error } = await supabase.auth.signOut()
                if (error) {
                    console.warn("Server signOut failed, but clearing local state:", error)
                }
            } else {
                console.log("No active session, clearing local state only")
            }


            this.user = null
            this.profile = null

            return { error: null }
        } catch (err) {
            console.error("SignOut exception:", err)
            this.user = null
            this.profile = null
            return { error: null }
        }
    }

    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })
        return { error }
    }

    async updateProfile(updates: Partial<UserProfile>) {
        if (!this.user) return { error: new Error('No user logged in') }

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', this.user.id)
            .select()
            .single()

        if (!error && data) {
            this.profile = data
        }

        return { data, error }
    }

    // Derived states
    get isAuthenticated() {
        return !!this.user
    }

    get userEmail() {
        return this.user?.email ?? ''
    }
}

const AUTH_KEY = Symbol('auth')

export function setAuthContext() {
    const authContext = new AuthContext()
    setContext(AUTH_KEY, authContext)
    return authContext
}

export function getAuthContext(): AuthContext {
    const context = getContext<AuthContext>(AUTH_KEY)
    if (!context) {
        throw new Error('Auth context not found. Make sure to call setAuthContext() in a parent component.')
    }
    return context
}
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Access token only lives in memory (React state). Refresh token lives in HttpOnly cookie.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null)

    const isLoggedIn = !!accessToken

    const login = useCallback(async (username, password) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // receive refresh cookie
            body: JSON.stringify({ username, password }),
        })
        if (!res.ok) {
            throw new Error('Invalid credentials')
        }
        const data = await res.json()
        setAccessToken(data.access_token)
    }, [])

    const refresh = useCallback(async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // send refresh cookie
        })
        if (!res.ok) throw new Error('Refresh failed')
        const data = await res.json()
        setAccessToken(data.access_token)
        return data.access_token
    }, [])

    const logout = useCallback(async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
        } finally {
            setAccessToken(null)
        }
    }, [])

    const authFetch = useCallback(
        async (input, init = {}) => {
            const opts = { ...init, headers: { ...(init.headers || {}) }, credentials: 'include' }
            if (accessToken) {
                opts.headers['Authorization'] = `Bearer ${accessToken}`
            }
            let res = await fetch(input, opts)
            if (res.status === 401) {
                try {
                    const newToken = await refresh()
                    const retryOpts = { ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${newToken}` } }
                    res = await fetch(input, retryOpts)
                } catch (e) {
                    await logout()
                    throw e
                }
            }
            return res
        },
        [accessToken, refresh, logout]
    )

    const value = useMemo(() => ({ accessToken, isLoggedIn, login, logout, refresh, authFetch }), [accessToken, isLoggedIn, login, logout, refresh, authFetch])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

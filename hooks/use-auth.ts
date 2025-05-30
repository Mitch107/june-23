"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  favorites: number[]
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, name: string) => boolean
  logout: () => void
  addToFavorites: (profileId: number) => void
  removeFromFavorites: (profileId: number) => void
  isFavorite: (profileId: number) => boolean
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      login: (email, password) => {
        // Simple mock authentication - in real app, this would call an API
        if (email && password) {
          const user = {
            id: Date.now().toString(),
            name: email.split("@")[0],
            email,
          }
          set({ user })
          return true
        }
        return false
      },
      register: (email, password, name) => {
        // Simple mock registration - in real app, this would call an API
        if (email && password && name) {
          const user = {
            id: Date.now().toString(),
            name,
            email,
          }
          set({ user })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, favorites: [] })
      },
      addToFavorites: (profileId) => {
        const { user, favorites } = get()
        if (user && !favorites.includes(profileId)) {
          set({ favorites: [...favorites, profileId] })
        }
      },
      removeFromFavorites: (profileId) => {
        const { user, favorites } = get()
        if (user) {
          set({ favorites: favorites.filter((id) => id !== profileId) })
        }
      },
      isFavorite: (profileId) => {
        const { favorites } = get()
        return favorites.includes(profileId)
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

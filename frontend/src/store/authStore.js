import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      updateUser: (user) => set({ user }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      
      getToken: () => get().token,
    }),
    {
      name: 'flowdesk-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore

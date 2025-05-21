"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use the singleton Supabase client
  const supabase = createClient()

  useEffect(() => {
    // Function to get the authenticated user and session
    const getAuthData = async () => {
      try {
        // First get the session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError.message)
          setIsLoading(false)
          return
        }

        setSession(sessionData.session)

        // If we have a session, get the authenticated user
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser()

          if (userError) {
            console.error("Error getting user:", userError.message)
            setUser(null)
          } else {
            setUser(userData.user)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Unexpected error in getAuthData:", error)
        setUser(null)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Get the initial auth data
    getAuthData()

    // Set up the auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      // When auth state changes, get the user with getUser()
      if (session) {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.error("Error getting user after auth state change:", error)
          setUser(null)
        } else {
          setUser(data.user)
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    // Clean up the subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return <AuthContext.Provider value={{ user, session, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

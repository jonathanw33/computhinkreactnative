import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://vimxqfeghdkhysqkidnd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbXhxZmVnaGRraHlzcWtpZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTg3NDYsImV4cCI6MjA1MjUzNDc0Nn0.i9VteMzT1BSFEMMBN987yigxn2Dkz_v5HnlqVJgmBls'

const CustomStorageAdapter = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error('Error getting item:', error)
      return null
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting item:', error)
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: CustomStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
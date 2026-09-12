import api from '@/lib/axios'
import type { AuthResponse } from '@/types'

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

// POST /api/register
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/register', data)
  return response.data
}

// POST /api/login
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/login', data)
  return response.data
}

// POST /api/logout
export async function logout(): Promise<void> {
  await api.post('/logout')
}

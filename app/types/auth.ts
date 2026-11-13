export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
}

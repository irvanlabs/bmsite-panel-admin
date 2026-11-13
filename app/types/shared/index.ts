export interface UserProfile {
  name: string
  email: string
  avatar: string
}

export interface ActivityItem {
  id: string
  title: string
  icon: string
  timestamp: string
}

export interface SubscriptionInfo {
  plan: string
  renewalDate: string
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
}

export interface WebsiteInfo {
  domain: string
  status: 'live' | 'building' | 'offline'
}

export type PageStatus = 'published' | 'draft' | 'archived' | 'private' | 'scheduled'

export interface Collaborator {
  id: string
  name: string
  avatar: string
}

export interface PageInfo {
  id: string
  name: string
  slug: string
  lastModified: string
  status: PageStatus
  collaborators: Collaborator[]
  live: boolean
  seoScore: number
}

export interface PagesSummary {
  collaborators: Collaborator[]
  totalPages: number
  liveLinks: number
  seoScore: number
}

export interface AnalyticsMetric {
  label: string
  value: string | number
  icon?: string
  trend?: { dir: 'up' | 'down', value: string }
}

export interface DeviceSlice {
  label: string
  value: number
}

export interface TrafficSource {
  label: string
  value: number
}

export interface TopContentRow {
  path: string
  pageviews: number
  uniqueViews: number
  avgTime: string
  trend: 'up' | 'down' | 'flat'
}

export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface PlanInfo {
  tier: PlanTier
  name: string
  monthlyPrice: string
  renewalDate: string
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
  limits: Record<string, number> | null
}

export interface UsageStat {
  icon: string
  title: string
  current: number
  maximum: number
  unit?: string
}

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'expired' | 'completed'

export interface BillingInvoice {
  id: string
  invoiceId: number
  date: string
  amount: number
  status: InvoiceStatus
}

export interface ProfileForm {
  companyName: string
  ownerName: string
  email: string
  phone: string
  website: string
  timeze: string
  language: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatar: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: string
}

export interface SessionItem {
  id: string
  device: string
  location: string
  current: boolean
}

export interface LoginEntry {
  id: string
  device: string
  location: string
  date: string
}

export interface NotificationPrefs {
  email: boolean
  billing: boolean
  website: boolean
  marketing: boolean
  system: boolean
}

export interface AdminMetric {
  label: string
  value: string | number
  icon: string
  change: string
  changeDir: 'up' | 'down'
}

export interface AdminOrder {
  id: string
  customer: string
  plan: string
  amount: number
  date: string
  status: InvoiceStatus
}

export type UserStatus = 'active' | 'pending' | 'expired' | 'suspended'

export interface AdminUser {
  id: number
  name: string
  email: string
  avatar: string
  website: string | null
  createdDate: string
  plan: string | null
  status: string
  role: string
  paymentAmount: number | null
  paymentDate: string | null
}

export type TemplateCategory = 'umkm' | 'company' | 'school' | 'government' | 'organization' | 'portfolio' | 'landing-page' | 'blog' | 'e-commerce'
export type TemplateStatus = 'published' | 'draft' | 'archived' | 'private' | 'featured'

export interface Template {
  id: string
  name: string
  slug: string
  category: TemplateCategory
  description: string
  thumbnail: string
  previews: string[]
  lastUpdated: string
  visibility: boolean
  status: TemplateStatus
  featured: boolean
  downloads: number
  rating: number
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatusKind = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface TicketUser {
  id: number
  name: string
  email: string
}

export interface TicketMessageResponse {
  id: number
  ticket_id: number
  user_id: number
  message: string
  user: TicketUser | null
  created_at: string
}

export interface TicketResponse {
  id: number
  user_id: number
  subject: string
  priority: TicketPriority
  status: TicketStatusKind
  assigned_to: number | null
  user: TicketUser | null
  assignee: TicketUser | null
  messages: TicketMessageResponse[]
  created_at: string
  updated_at: string
}

export interface WithdrawalUser {
  id: number
  name: string
  email: string
}

export interface WithdrawalRow {
  id: number
  user_id: number
  withdrawal_number: string
  amount: string
  bank_name: string
  account_number: string
  account_name: string
  status: string
  notes: string | null
  processed_at: string | null
  created_at: string
  updated_at: string
  user: WithdrawalUser | null
}

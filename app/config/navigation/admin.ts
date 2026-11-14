import type { NavLink, NavMenu } from '~/types/nav'

export const adminNav: NavMenu[] = [
  {
    heading: 'Utama',
    items: [
      { title: 'Dashboard', icon: 'i-lucide-layout-dashboard', link: '/admin', exact: true },
      { title: 'Analytics', icon: 'i-lucide-bar-chart-3', link: '/admin/analytics' },
      { title: 'Pengguna', icon: 'i-lucide-users', link: '/admin/users' },
      { title: 'Pelanggan', icon: 'i-lucide-building-2', link: '/admin/customers' },
      { title: 'Aktivitas', icon: 'i-lucide-history', link: '/admin/audit' },
    ],
  },
  {
    heading: 'Platform',
    items: [
      { title: 'Transaksi', icon: 'i-lucide-credit-card', link: '/admin/billings' },
      { title: 'Tagihan', icon: 'i-lucide-receipt-text', link: '/admin/invoices' },
      { title: 'Kupon', icon: 'i-lucide-ticket-percent', link: '/admin/coupons' },
      { title: 'Penarikan', icon: 'i-lucide-banknote', link: '/admin/withdrawals' },
      { title: 'Website', icon: 'i-lucide-globe', link: '/admin/websites' },
      { title: 'Template', icon: 'i-lucide-layers', link: '/admin/templates' },
      { title: 'Paket', icon: 'i-lucide-package', link: '/admin/plans' },
    ],
  },
  {
    heading: 'Bantuan',
    items: [
      { title: 'Dukungan', icon: 'i-lucide-life-buoy', link: '/admin/support' },
      { title: 'Pengaturan Platform', icon: 'i-lucide-settings', link: '/admin/settings' },
    ],
  },
]

export const adminNavBottom: NavLink[] = [
  { title: 'Bantuan & Dukungan', icon: 'i-lucide-circle-help', link: 'https://github.com/dianprata/nuxt-shadcn-dashboard' },
  { title: 'Masukan', icon: 'i-lucide-send', link: 'https://github.com/dianprata/nuxt-shadcn-dashboard' },
]

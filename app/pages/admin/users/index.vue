<script setup lang="ts">
import type { AdminUser } from '~/types/shared'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import UserFilters from '@/components/admin/users/UserFilters.vue'
import UserStatsCards from '@/components/admin/users/UserStatsCards.vue'
import UserTable from '@/components/admin/users/UserTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchUsers, createUser, updateUserStatus, updateUserRole, type AdminUserResponse } from '~/services/admin/users.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const search = ref('')
const status = ref('_all')
const role = ref('_all')
const page = ref(1)
const total = ref(0)

const users = ref<AdminUser[]>([])

function mapUser(raw: AdminUserResponse): AdminUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: '',
    website: raw.website,
    createdDate: raw.created_at,
    plan: raw.plan,
    status: raw.status,
    role: raw.role,
    paymentAmount: raw.payment_amount,
    paymentDate: raw.payment_date,
  }
}

async function loadUsers() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return
    const result = await fetchUsers(token, {
      search: search.value,
      status: status.value,
      role: role.value,
      page: page.value,
      sort: 'created_at',
      direction: 'desc',
    })
    users.value = result.data.map(mapUser)
    total.value = result.meta.total
  } catch {
    // stays empty on error
  } finally {
    loading.value = false
  }
}

// --- Suspend/Activate dialogs ---
const suspendDialog = ref(false)
const activateDialog = ref(false)
const roleDialog = ref(false)
const selectedUser = ref<AdminUser | null>(null)
const selectedRole = ref('user')
const submitting = ref(false)

function handleSuspend(user: AdminUser) {
  selectedUser.value = user
  suspendDialog.value = true
}

function handleActivate(user: AdminUser) {
  selectedUser.value = user
  activateDialog.value = true
}

function handleChangeRole(user: AdminUser) {
  selectedUser.value = user
  selectedRole.value = user.role
  roleDialog.value = true
}

async function confirmSuspend() {
  if (!selectedUser.value) return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    await updateUserStatus(token, selectedUser.value.id, 'suspended')
    toast.success(`${selectedUser.value.name} ditangguhkan`)
    suspendDialog.value = false
    await loadUsers()
  } catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menangguhkan')
  } finally {
    submitting.value = false
  }
}

async function confirmActivate() {
  if (!selectedUser.value) return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    await updateUserStatus(token, selectedUser.value.id, 'active')
    toast.success(`${selectedUser.value.name} diaktifkan`)
    activateDialog.value = false
    await loadUsers()
  } catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal mengaktifkan')
  } finally {
    submitting.value = false
  }
}

async function confirmChangeRole() {
  if (!selectedUser.value) return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    await updateUserRole(token, selectedUser.value.id, selectedRole.value)
    toast.success(`Role ${selectedUser.value.name} diubah ke ${selectedRole.value}`)
    roleDialog.value = false
    await loadUsers()
  } catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal mengubah role')
  } finally {
    submitting.value = false
  }
}

function handleView(user: AdminUser) {
  navigateTo(`/admin/users/${user.id}`)
}

function handleExport() { toast.info('Mengekspor CSV pengguna...') }

// --- Create user ---
const createDialog = ref(false)
const createForm = ref({ name: '', email: '', phone: '', password: '', role: 'user' })
const createError = ref<string | null>(null)

function handleNewUser() {
  createForm.value = { name: '', email: '', phone: '', password: '', role: 'user' }
  createError.value = null
  createDialog.value = true
}

async function confirmCreate() {
  createError.value = null
  if (!createForm.value.name.trim()) {
    createError.value = 'Nama wajib diisi'
    return
  }
  if (!createForm.value.email.trim()) {
    createError.value = 'Email wajib diisi'
    return
  }
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    await createUser(token, {
      name: createForm.value.name.trim(),
      email: createForm.value.email.trim(),
      phone: createForm.value.phone.trim() || undefined,
      password: createForm.value.password || undefined,
      role: createForm.value.role,
    })
    toast.success(`${createForm.value.name} ditambahkan`)
    createDialog.value = false
    page.value = 1
    await loadUsers()
  } catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string }, message?: string } }
    createError.value = err.data?.error?.message ?? err.data?.message ?? 'Gagal menambahkan pengguna'
  } finally {
    submitting.value = false
  }
}

function handleReset() {
  search.value = ''
  status.value = '_all'
  role.value = '_all'
  page.value = 1
}

onMounted(async () => {
  await auth.bootstrap()
  await loadUsers()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Direktori Pengguna" description="Pantau dan kelola semua atelier digital aktif di seluruh platform." size="large">
      <template #actions>
        <Button variant="outline" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="size-4" /> Ekspor CSV
        </Button>
        <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" @click="handleNewUser">
          <Icon name="i-lucide-plus" class="size-4" /> Pengguna Baru
        </Button>
      </template>
    </SharedPageHeader>

    <UserStatsCards users-count="–" active-count="–" pending-count="–" expired-count="–" new-count="–" paying-count="–" />

    <UserFilters v-model:search="search" v-model:status="status" v-model:role="role" @reset="handleReset" />

    <UserTable :data="users" :loading="loading" @suspend="handleSuspend" @activate="handleActivate" @change-role="handleChangeRole" @view="handleView" />

    <!-- Pagination -->
    <div v-if="total > 10" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadUsers()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 10 >= total" @click="page++; loadUsers()">
        Selanjutnya
      </Button>
    </div>

    <!-- Create User Dialog -->
    <Dialog v-model:open="createDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Pengguna Baru</DialogTitle>
          <DialogDescription>
            Tambahkan pengguna baru ke platform.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4 py-4" @submit.prevent="confirmCreate">
          <div v-if="createError" class="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {{ createError }}
          </div>
          <div class="space-y-1.5">
            <Label for="new-name">Nama</Label>
            <Input id="new-name" v-model="createForm.name" placeholder="Nama lengkap" class="rounded-xl" required />
          </div>
          <div class="space-y-1.5">
            <Label for="new-email">Email</Label>
            <Input id="new-email" v-model="createForm.email" type="email" placeholder="nama@contoh.com" class="rounded-xl" required />
          </div>
          <div class="space-y-1.5">
            <Label for="new-phone">Telepon <span class="text-muted-foreground">(opsional)</span></Label>
            <Input id="new-phone" v-model="createForm.phone" type="tel" placeholder="+62..." class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="new-password">Kata Sandi <span class="text-muted-foreground">(opsional)</span></Label>
            <Input id="new-password" v-model="createForm.password" type="password" placeholder="Kosongkan untuk dibuat otomatis" class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="new-role">Role</Label>
            <Select v-model="createForm.role">
              <SelectTrigger id="new-role" class="w-full rounded-xl border-editor-border">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="createDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="submitting" @click="confirmCreate">
            {{ submitting ? 'Menyimpan...' : 'Tambah Pengguna' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Suspend Dialog -->
    <Dialog v-model:open="suspendDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Tangguhkan Pengguna</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menangguhkan <strong>{{ selectedUser?.name }}</strong>?
            Pengguna tidak akan dapat mengakses akunnya.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="suspendDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" :disabled="submitting" @click="confirmSuspend">
            Tangguhkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Activate Dialog -->
    <Dialog v-model:open="activateDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Aktifkan Pengguna</DialogTitle>
          <DialogDescription>
            Aktifkan kembali <strong>{{ selectedUser?.name }}</strong>?
            Pengguna akan dapat mengakses akunnya kembali.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="activateDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="submitting" @click="confirmActivate">
            Aktifkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Change Role Dialog -->
    <Dialog v-model:open="roleDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Ubah Role</DialogTitle>
          <DialogDescription>
            Pilih role baru untuk <strong>{{ selectedUser?.name }}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <Select v-model="selectedRole">
            <SelectTrigger class="w-full rounded-xl border-editor-border">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="roleDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="submitting" @click="confirmChangeRole">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

# Dashboard Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded dashboard data (status, domain, subscription) with live API data from bmsite-api. Add site selector dropdown. Wire "View Live Site" to actual domain.

**Architecture:** New `GET /api/v1/dashboard-summary` endpoint in bmsite-api aggregates site list + active subscription. Frontend fetches on mount, passes data to existing card components. `QuickActionsCard` gets a `liveUrl` prop instead of hardcoded URL. `WelcomeBanner` reads name from `useAuth`.

**Tech Stack:** Laravel (PHP) for API, Nuxt 4 / Vue 3 / TypeScript for frontend, `$fetch` for HTTP, shadcn-vue Select for dropdown.

---

### Task 1: Expose token from useAuth

**Files:**
- Edit: `app/composables/useAuth.ts`

The dashboard service needs the Bearer token, but `useAuth` doesn't expose it.

- [ ] **Step 1: Add `token` to the return**

In `app/composables/useAuth.ts`, add `token` to the return object at line 50:

Replace:
```typescript
  return { user, isAuthenticated, isAdmin, login, logout: doLogout, fetchUser, bootstrap }
```

With:
```typescript
  const token = computed(() => state.value.token)

  return { user, token, isAuthenticated, isAdmin, login, logout: doLogout, fetchUser, bootstrap }
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "useAuth" || echo "No errors"
```

---

### Task 2: API — Dashboard Controller (bmsite-api)

**Files:**
- Create: `app/Http/Controllers/Api/V1/DashboardController.php`
- Edit: `routes/api.php`

- [ ] **Step 1: Create the controller**

File: `../bmsite-api/app/Http/Controllers/Api/V1/DashboardController.php`

```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Site;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();

        $sites = Site::where('user_id', $user->id)
            ->with(['domains', 'subscription.plan'])
            ->orderByDesc('updated_at')
            ->get();

        $siteId = $request->query('site_id');

        if ($siteId) {
            $selectedSite = $sites->firstWhere('id', $siteId);
        } else {
            $selectedSite = $sites->first();
        }

        if ($siteId && !$selectedSite) {
            $validator = Validator::make([], []);
            $validator->errors()->add('site_id', 'Site tidak ditemukan');
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Site tidak ditemukan',
                    'details' => $validator->errors()->toArray(),
                ],
            ], 404);
        }

        $activeSubscription = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('plan')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'sites' => $sites->map(function ($site) {
                    $primaryDomain = $site->domains->firstWhere('is_primary', true);
                    return [
                        'id' => $site->id,
                        'subdomain' => $site->subdomain,
                        'status' => $site->status->value,
                        'primary_domain' => $primaryDomain ? $primaryDomain->domain : ($site->subdomain . '.bmsite.app'),
                    ];
                }),
                'selected_site' => $selectedSite ? [
                    'id' => $selectedSite->id,
                    'subdomain' => $selectedSite->subdomain,
                    'status' => $selectedSite->status->value,
                    'primary_domain' => optional($selectedSite->domains->firstWhere('is_primary', true))->domain ?? ($selectedSite->subdomain . '.bmsite.app'),
                ] : null,
                'subscription' => $activeSubscription ? [
                    'status' => $activeSubscription->status->value,
                    'plan' => $activeSubscription->plan?->name ?? 'Free',
                    'renewal_date' => $activeSubscription->renewal_date?->toDateString(),
                ] : null,
            ],
            'message' => 'Dashboard summary retrieved successfully',
        ]);
    }
}
```

- [ ] **Step 2: Add the route**

In `../bmsite-api/routes/api.php`, inside the `auth:sanctum` group (after line ~65, after the `/auth/me` route), add:

```php
        Route::get('/dashboard-summary', [\App\Http\Controllers\Api\V1\DashboardController::class, 'summary'])->middleware('throttle:60,1');
```

- [ ] **Step 3: Test with curl (optional — requires running API server)**

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/dashboard-summary
```

---

### Task 3: Dashboard service (bmsite-panel)

**Files:**
- Create: `app/services/client/dashboard.service.ts`

- [ ] **Step 1: Create the service**

```typescript
interface SiteItem {
  id: string
  subdomain: string
  status: string
  primary_domain: string
}

interface SubscriptionData {
  status: string
  plan: string
  renewal_date: string | null
}

interface DashboardSummaryData {
  sites: SiteItem[]
  selected_site: SiteItem | null
  subscription: SubscriptionData | null
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchDashboardSummary(token: string, siteId?: string): Promise<DashboardSummaryData> {
  const params = siteId ? `?site_id=${siteId}` : ''
  const res = await $fetch<{ success: boolean, data: DashboardSummaryData }>(
    `${apiBase()}/dashboard-summary${params}`,
    { headers: authHeaders(token) }
  )
  return res.data
}
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "dashboard" || echo "No errors"
```

---

### Task 4: Wire QuickActionsCard with live URL prop

**Files:**
- Edit: `app/components/dashboard/QuickActionsCard.vue`

- [ ] **Step 1: Add `liveUrl` prop**

Replace the entire file content with:

```vue
<script setup lang="ts">
import SharedActionCard from '@/components/shared/ActionCard.vue'
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{
  liveUrl?: string
}>(), {
  liveUrl: 'https://bmsite.app',
})
</script>

<template>
  <SharedActionCard
    title="Kelola website Anda"
    description="Edit konten atau pratinjau situs live Anda. Perubahan dipublikasikan secara instan."
    icon="i-lucide-zap"
  >
    <div class="flex flex-wrap gap-2">
        <Button
          class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover"
          as-child
        >
        <NuxtLink to="/client/websites">
          <Icon name="i-lucide-pencil" class="size-4" />
          Edit Website
        </NuxtLink>
      </Button>
      <Button class="rounded-xl" variant="outline" as-child>
        <NuxtLink :to="`https://${liveUrl}`" external target="_blank">
          <Icon name="i-lucide-external-link" class="size-4" />
          Lihat Situs Live
        </NuxtLink>
      </Button>
    </div>
  </SharedActionCard>
</template>
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "QuickActions" || echo "No errors"
```

---

### Task 5: Wire client dashboard page

**Files:**
- Edit: `app/pages/client/index.vue`

- [ ] **Step 1: Replace the entire file**

```vue
<script setup lang="ts">
import type { ActivityItem, SubscriptionInfo, WebsiteInfo } from '~/types/shared'
import DashboardDomainCard from '@/components/dashboard/DomainCard.vue'
import DashboardProTipCard from '@/components/dashboard/ProTipCard.vue'
import DashboardQuickActionsCard from '@/components/dashboard/QuickActionsCard.vue'
import DashboardRecentActivityCard from '@/components/dashboard/RecentActivityCard.vue'
import DashboardStatusCard from '@/components/dashboard/StatusCard.vue'
import DashboardSubscriptionCard from '@/components/dashboard/SubscriptionCard.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedWelcomeBanner from '@/components/shared/WelcomeBanner.vue'
import { fetchDashboardSummary } from '~/services/client/dashboard.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'client',
})

const auth = useAuth()

const sites = ref<{ id: string, subdomain: string }[]>([])
const selectedSiteId = ref<string | null>(null)

const website = ref<WebsiteInfo>({
  domain: '',
  status: 'building',
})

const subscription = ref<SubscriptionInfo>({
  plan: '',
  renewalDate: '',
  status: 'trialing',
})

const liveUrl = ref('')
const activities = ref<ActivityItem[]>([])

const loading = ref(true)

function siteSelectOptions() {
  if (!selectedSiteId.value && sites.value.length > 0) {
    selectedSiteId.value = sites.value[0].id
  }
}

async function loadDashboard() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return

    const data = await fetchDashboardSummary(token, selectedSiteId.value ?? undefined)

    sites.value = data.sites.map(s => ({ id: s.id, subdomain: s.subdomain }))

    if (!selectedSiteId.value && data.selected_site) {
      selectedSiteId.value = data.selected_site.id
    }

    if (data.selected_site) {
      website.value = {
        domain: data.selected_site.primary_domain,
        status: data.selected_site.status === 'active' ? 'live' : 'building',
      }
      liveUrl.value = data.selected_site.primary_domain
    }

    if (data.subscription) {
      subscription.value = {
        plan: data.subscription.plan,
        renewalDate: data.subscription.renewal_date ?? '',
        status: data.subscription.status as SubscriptionInfo['status'],
      }
    }
  } catch {
    // dashboard stays empty on error
  } finally {
    loading.value = false
  }
}

watch(selectedSiteId, () => {
  if (selectedSiteId.value) {
    loadDashboard()
  }
})

onMounted(async () => {
  await auth.bootstrap()
  siteSelectOptions()
  await loadDashboard()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p class="mt-1 text-sm text-muted-foreground">Website kamu dalam sekilas pandang.</p>
      </div>
      <div v-if="sites.length > 1" class="flex items-center gap-2">
        <label for="site-select" class="text-sm text-muted-foreground">Situs:</label>
        <select id="site-select" v-model="selectedSiteId" class="rounded-xl border bg-background px-3 py-1.5 text-sm">
          <option v-for="site in sites" :key="site.id" :value="site.id">
            {{ site.subdomain }}
          </option>
        </select>
      </div>
    </div>

    <SharedWelcomeBanner :name="auth.user.value?.name" />

    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="h-32 animate-pulse rounded-xl bg-muted" />
    </div>

    <template v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatusCard :website="website" />
        <DashboardDomainCard :website="website" />
        <DashboardSubscriptionCard :subscription="subscription" />
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <DashboardQuickActionsCard :live-url="liveUrl" />
        </div>
        <div class="space-y-6">
          <DashboardRecentActivityCard :activities="activities" />
          <DashboardProTipCard />
        </div>
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep -i "client/index\|QuickActions\|Welcome" || echo "No errors"
```

---

### Final verification

- [ ] **Step 1: Run full typecheck**

```bash
cd /Users/naufal/Projects/Personal/bmsite/bmsite-panel && bun run typecheck 2>&1 | tail -5
```

- [ ] **Step 2: Run build**

```bash
cd /Users/naufal/Projects/Personal/bmsite/bmsite-panel && bun run build
```

---

## Dependency Order

```
Task 1 (expose token) ──→ Task 3 (dashboard service)
                                     │
Task 2 (API endpoint) ───────────────┤
                                     │
                        Task 4 (QuickActions prop) ──→ Task 5 (wire dashboard page)
```

Tasks 1 & 2 are independent, can run in parallel. Tasks 3 & 4 can run in parallel after their dependencies. Task 5 depends on all.

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const target = (config.apiBase as string) || ''
  if (!target) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_API_BASE belum dikonfigurasi' })
  }

  const path = event.path.replace(/^\/_api/, '') || '/'
  const url = `${target}${path}`

  const headers: Record<string, string> = { accept: 'application/json' }
  const auth = getHeader(event, 'authorization')
  if (auth) headers.authorization = auth
  const contentType = getHeader(event, 'content-type')
  if (contentType) headers['content-type'] = contentType

  return proxyRequest(event, url, { headers })
})

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://equora.app'
  const routes = ['/', '/auth', '/pricing', '/terms', '/privacy']

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))
}

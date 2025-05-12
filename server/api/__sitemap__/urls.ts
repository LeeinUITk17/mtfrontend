import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '@nuxtjs/sitemap'

export default defineSitemapEventHandler(async () => {
  try {
    const plantRes = await fetch('https://api.caosugiongtuananh.com/plants')
    if (!plantRes.ok) {
      console.error('Failed to fetch plants:', plantRes.status, plantRes.statusText)
    }
    const plants = plantRes.ok ? await plantRes.json() : []
    const postRes = await fetch('https://api.caosugiongtuananh.com/posts')
    if (!postRes.ok) {
      console.error('Failed to fetch posts:', postRes.status, postRes.statusText)
    }
    const posts = postRes.ok ? await postRes.json() : []

    const sitemapUrls: SitemapUrlInput[] = [
      ...plants.map((plant: any) => ({
        loc: `/plants/${plant.slug}`,
        lastmod: new Date(plant.updatedAt || plant.createdAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      })),
      ...posts.map((post: any) => ({
        loc: `/posts/${post.slug}`,
        lastmod: new Date(post.updatedAt || post.createdAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      }))
    ]
    return sitemapUrls
  } catch (error) {
    console.error('Error in sitemap generation:', error)
    return [] 
  }
})
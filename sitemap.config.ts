export default {
  siteUrl: 'https://caosugiongtuananh.com',
  trailingSlash: false,
  defaults: {
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  async routes() {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.caosugiongtuananh.com'

    try {
      const [plantRes, postRes, galleryRes] = await Promise.all([
        fetch(`${apiBase}/plants`),
        fetch(`${apiBase}/posts`),
        fetch(`${apiBase}/gallery`)
      ])

      const [plants, posts, galleryImages] = await Promise.all([
        plantRes.json(),
        postRes.json(),
        galleryRes?.json() || []
      ])

      const staticRoutes = [
        {
          url: '/',
          priority: 1.0,
          changefreq: 'daily',
          images: [
            { url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png', title: 'Homepage Banner' }
          ]
        },
        {
          url: '/plants',
          priority: 0.9,
          images: plants.slice(0, 5).map((plant: any) => ({
            url: plant.image_url,
            title: plant.name
          }))
        },
        {
          url: '/posts',
          priority: 0.9,
          images: posts.slice(0, 5).map((post: any) => ({
            url: post.featured_image,
            title: post.title
          }))
        },
        {
          url: '/gallery',
          priority: 0.8,
          images: galleryImages.slice(0, 10).map((image: any) => ({
            url: image.url,
            title: image.title || 'Gallery Image'
          }))
        },
        {
          url: '/contact',
          priority: 0.7,
          lastmod: '2025-10-05' 
        }
      ]

      const plantRoutes = plants.map((plant: any) => ({
        url: `/plants/${plant.id}`,
        lastmod: plant.updated_at || plant.created_at,
        priority: 0.8,
        images: plant.images?.map((img: string) => ({ url: img })) || []
      }))

      const postRoutes = posts.map((post: any) => ({
        url: `/posts/${post.id}`,
        lastmod: post.updated_at || post.published_at || post.created_at,
        priority: 0.7,
        images: [
          { url: post.featured_image, title: post.title },
          ...(post.content_images || []).map((img: string) => ({ url: img }))
        ]
      }))

      const authRoutes = [
        { url: '/login', priority: 0.1, changefreq: 'yearly' },
        { url: '/register', priority: 0.1, changefreq: 'yearly' }
      ]

      return [...staticRoutes, ...plantRoutes, ...postRoutes, ...authRoutes]
    } catch (error) {
      console.error('Sitemap generation error:', error)
      return [
        { url: '/', priority: 1.0 },
        { url: '/plants', priority: 0.9 },
        { url: '/posts', priority: 0.9 },
        { url: '/gallery', priority: 0.8 },
        { url: '/contact', priority: 0.7 }
      ]
    }
  },
  exclude: [
    '/admin/**', 
    '/private/**'
  ]
}
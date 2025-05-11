export default {
  siteUrl: 'https://caosugiongtuananh.com',
  trailingSlash: false,
  async routes() {
    const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'https://api.caosugiongtuananh.com'

    const [plantRes, postRes] = await Promise.all([
      fetch(`${apiBase}/plants`),
      fetch(`${apiBase}/posts`)
    ])

    const plants = await plantRes.json()
    const posts = await postRes.json()

    const staticRoutes = ['/', '/plants', '/posts', '/gallery']
    const plantRoutes = plants.map((plant: any) => `/plants/${plant.id}`)
    const postRoutes = posts.map((post: any) => `/posts/${post.id}`)

    return [...staticRoutes, ...plantRoutes, ...postRoutes]
  }
}

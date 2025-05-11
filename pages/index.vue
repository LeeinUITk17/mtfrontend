<template>
    <div>
        <banner />

        <div class="sticky top-0 z-10 bg-gradient-to-r from-green-500 via-green-900 to-green-500 shadow-md">
            <scrollableMenu :menu-items="menuItems" @scrollToSection="handleScrollToSection" />
        </div>

        <section id="plant-varieties-section" class="py-12 md:py-16 bg-green-50/30"> 
            <div class="container mx-auto px-4">
                <AboutUs />
            </div>
        </section>

        <section id="featured-plants-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Cây Cao Su Giống Chất Lượng Tại Bình Phước</h1>
                <p class="text-center text-lg mb-8 max-w-3xl mx-auto">
                    Vườn ươm Tuấn Anh chuyên cung cấp các giống cao su chất lượng cao như RRIV 209, PB 235, DK4, 
                    đạt tiêu chuẩn loại 1, cho năng suất mủ vượt trội. Giá cây cao su giống 2025 cạnh tranh nhất thị trường.
                </p>
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Cây trồng nổi bật</h2>   
                <div v-if="plantsPending" class="text-center py-10">
                    <LoadingSpinner />
                    <p class="text-sm text-gray-500 mt-2">Đang tải cây trồng...</p>
                </div>
                <div v-else-if="plantsError" class="text-center text-red-500 bg-red-50 p-4 rounded border border-red-200">
                    <p>Không thể tải cây trồng nổi bật: {{ plantsError.message || plantsError }}</p>
                </div>
                <div v-else-if="featuredPlants && featuredPlants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <PlantCard v-for="plant in featuredPlants" :key="plant.id" :plant="plant" />
                </div>
                <div v-else class="text-center text-gray-600 py-10">
                    <p>Chưa có cây trồng nổi bật nào.</p>
                </div>
            </div>
        </section>
        <section id="plant-varieties-section" class="py-12 md:py-16 bg-green-50/30"> 
            <div class="container mx-auto px-4">
                <PlantVarietiesTable />
            </div>
        </section>

        <section id="recent-posts-section" class="bg-gray-50 py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Bài viết Quan trọng Gần đây</h2>
                <div v-if="postsPending" class="text-center py-10">
                    <LoadingSpinner />
                    <p class="text-sm text-gray-500 mt-2">Đang tải bài viết...</p>
                </div>
                <div v-else-if="postsError" class="text-center text-red-500 bg-red-50 p-4 rounded border border-red-200">
                    <p>Không thể tải bài viết: {{ postsError.message || postsError }}</p>
                </div>
                <div v-else-if="recentHighRatedPosts && recentHighRatedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    <PostPreview v-for="post in recentHighRatedPosts" :key="post.id" :post="post" />
                </div>
                <div v-else class="text-center text-gray-600 py-10">
                    <p>Chưa có bài viết quan trọng nào.</p>
                </div>
                <div class="text-center mt-8">
                    <NuxtLink to="/posts" class="text-primary hover:underline font-medium">Xem tất cả bài viết →</NuxtLink>
                </div>
            </div>
        </section>


        
        <section id="cta-section" class="bg-primary py-10 text-gray-500 text-center">
            <div class="container mx-auto px-4">
                <p class="text-xl mb-4 font-semibold">Vườn ươm cao su giống Tuấn Anh - Chơn Thành, Bình Phước</p>
                <p class="mb-6 max-w-2xl mx-auto">
                    Chuyên cung cấp cây cao su giống số lượng lớn cho các tỉnh miền Đông Nam Bộ. 
                    Giá cạnh tranh, tư vấn kỹ thuật trồng và chăm sóc miễn phí.
                </p>
                <NuxtLink to="tel:0979072768" class="inline-block bg-white text-primary text-lg font-semibold px-8 py-3 rounded-full hover:bg-green-100 transition-colors shadow-md">
                    Liên hệ ngay: 0979.072.768
                </NuxtLink>
            </div>
        </section>

        <section id="gallery-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Thư viện Ảnh</h2>
                <Gallery :initial-images="latestGalleryImages" :loading="galleryPending" :error="galleryError" />
                <div class="text-center mt-8">
                    <NuxtLink to="/gallery" class="text-primary hover:underline font-medium">Xem toàn bộ thư viện →</NuxtLink>
                </div>
            </div>
        </section>

        <section id="testimonial-section" class="bg-gray-50 py-12 md:py-16">
            <div class="container mx-auto px-4">
                <testimonial />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PlantCard from '~/components/plants/PlantCard.vue';
import PostPreview from '~/components/posts/PostPreview.vue';
import scrollableMenu from '~/components/common/scrollableMenu.vue';
import Gallery from '~/components/common/Gallery.vue';
import banner from '~/components/common/banner.vue';
import testimonial from '~/components/common/testimonial.vue';
import PlantVarietiesTable from '~/components/common/PlantVarietiesTable.vue';
import AboutUs from '~/components/common/AboutUs.vue';

const config = useRuntimeConfig();

const menuItems = ref([
    { id: 1, name: 'Cây nổi bật', data: 'featured-plants-section', isActive: true },
    { id: 2, name: 'Bài viết mới', data: 'recent-posts-section', isActive: false },
    { id: 3, name: 'Khám phá', data: 'cta-section', isActive: false },
    { id: 4, name: 'Thư viện', data: 'gallery-section', isActive: false },
    { id: 5, name: 'Đánh giá', data: 'testimonial-section', isActive: false },
]);

const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const { data: featuredPlants, pending: plantsPending, error: plantsError } = await useAsyncData(
    'featured-plants',
    () => $fetch(`${config.public.apiBase}/plants`, { query: { limit: 6 } }),
    { default: () => [] }
);

const { data: recentHighRatedPosts, pending: postsPending, error: postsError } = await useAsyncData(
    'recent-high-posts',
    () => $fetch(`${config.public.apiBase}/posts`, { query: { limit: 4, rating: 'high' } }),
    { default: () => [] }
);

const { data: latestGalleryImages, pending: galleryPending, error: galleryError } = await useAsyncData(
    'latest-gallery-images',
    () => $fetch(`${config.public.apiBase}/gallery-images`, { query: { limit: 10 } }),
    { default: () => [] }
);

useHead({
    title: 'Cây Cao Su Giống Chất Lượng - Vườn Ươm Tuấn Anh Bình Phước',
    meta: [
        { 
            name: 'description', 
            content: 'Chuyên cung cấp cây cao su giống chất lượng cao các loại: RRIV 209, PB 235, DK4, VM 515. Giống cây cao su F1, kháng bệnh, năng suất mủ cao. Vườn ươm uy tín tại Bình Phước.' 
        },
        { 
            name: 'keywords', 
            content: 'cây cao su giống, bán cây cao su giống, giống cây cao su, giá cây cao su giống 2025, cây giống cao su Bình Phước, vườn ươm cao su giống Chơn Thành, cây cao su giống RRIV 209, cây cao su giống PB 235, kỹ thuật trồng cao su, chăm sóc cây cao su giống' 
        },
        { property: 'og:title', content: 'Cây Cao Su Giống Chất Lượng - Vườn Ươm Tuấn Anh Bình Phước' },
        { 
            property: 'og:description', 
            content: 'Cung cấp cây cao su giống loại 1, giống F1 kháng bệnh, năng suất cao. Giá cạnh tranh, vận chuyển toàn quốc. Uy tín tại Bình Phước.' 
        },
        { property: 'og:image', content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' },
        { property: 'og:url', content: 'https://caosugiongtuananh.com/' },
        { property: 'og:type', content: 'website' },
        
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Cây Cao Su Giống Chất Lượng - Vườn Ươm Tuấn Anh Bình Phước' },
        { name: 'twitter:description', content: 'Chuyên cung cấp cây cao su giống chất lượng cao các loại: RRIV 209, PB 235, DK4, VM 515' },
        { name: 'twitter:image', content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' },
        
        { rel: 'canonical', href: 'https://caosugiongtuananh.com/' },
    ],
    link: [
        { rel: 'canonical', href: 'https://caosugiongtuananh.com/' },
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Vườn Ươm Cao Su Giống Tuấn Anh",
                "url": "https://caosugiongtuananh.com/",
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Vườn Ươm Cây Cao Su Giống Tuấn Anh",
                "url": "https://caosugiongtuananh.com/",
                "logo": "https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png",
                "sameAs": [
                    "https://www.facebook.com/caosugiongtuananh",
                    "https://www.youtube.com/@tailee21417"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+84979072768",
                    "contactType": "sales",
                    "areaServed": "VN",
                    "availableLanguage": "Vietnamese"
                }
            })
        },
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Trang chủ",
                    "item": "https://caosugiongtuananh.com/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Giống cây",
                    "item": "https://caosugiongtuananh.com/plants"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Bài viết",
                    "item": "https://caosugiongtuananh.com/posts"
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Kho ảnh",
                    "item": "https://caosugiongtuananh.com/gallery"
                },
                {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Liên hệ",
                    "item": "https://caosugiongtuananh.com/contract"
                }
                ]
            })
            },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": featuredPlants.value?.map((plant, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": plant.name,
                        "description": plant.description,
                        "url": `https://caosugiongtuananh.com/plants/${plant.id}`,
                        "image": plant.imageUrl,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "VND",
                            "price": plant.price,
                            "availability": plant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "Vườn Ươm Tuấn Anh"
                            }
                        }
                    }
                })) || []
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Nursery",
                "name": "Vườn Ươm Cây Cao Su Giống Tuấn Anh",
                "image": "https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png",
                "description": "Chuyên cung cấp cây cao su giống chất lượng cao tại Bình Phước",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Khu phố 07",
                    "addressLocality": "Chơn Thành",
                    "addressRegion": "Bình Phước",
                    "postalCode": "7711",
                    "addressCountry": "VN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "11.4625",
                    "longitude": "106.6667"
                },
                "telephone": "+84979072768",
                "openingHours": "Mo-Fr 07:00-17:00",
                "priceRange": "$$",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Các giống cao su",
                    "itemListElement": [
                        {
                            "@type": "OfferCatalog",
                            "name": "Giống cao su năng suất cao",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Product",
                                        "name": "Cây cao su giống RRIV 209"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Product",
                                        "name": "Cây cao su giống PB 235"
                                    }
                                }
                            ]
                        }
                    ]
                }
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Giá cây cao su giống 2025 là bao nhiêu?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Giá cây cao su giống năm 2025 tại vườn ươm Tuấn Anh dao động từ X đến Y nghìn đồng/cây tùy giống và số lượng đặt mua. Liên hệ trực tiếp 0979.072.768 để nhận báo giá chi tiết."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Thời điểm tốt nhất để trồng cây cao su?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Thời điểm lý tưởng để trồng cây cao su giống là đầu mùa mưa (tháng 5-7) tại khu vực miền Đông Nam Bộ, giúp cây có đủ độ ẩm để phát triển."
                        }
                    }
                ]
            })
        }
    ]
});
</script>

<style scoped>
</style>

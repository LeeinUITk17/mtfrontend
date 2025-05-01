<template>
    <div>
        <banner />

        <div class="sticky top-0 z-10 bg-gradient-to-r from-green-500 via-green-900 to-green-500 shadow-md">
            <scrollableMenu :menu-items="menuItems" @scrollToSection="handleScrollToSection" />
        </div>

        <section id="featured-plants-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <div v-if="plantsPending" class="text-center">
                    <LoadingSpinner />
                </div>
                <div v-else-if="plantsError" class="text-center text-red-500">
                    <p>Unable to load featured plants: {{ plantsError.message }}</p>
                </div>
                <div v-else-if="featuredPlants && featuredPlants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <PlantCard v-for="plant in featuredPlants" :key="plant.id" :plant="plant" />
                </div>
                <div v-else class="text-center text-gray-600">
                    <p>No featured plants available.</p>
                </div>
            </div>
        </section>

        <section id="recent-posts-section" class="bg-gray-100 rounded-xl py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Recent Posts</h2>
                <div v-if="postsPending" class="text-center">
                    <LoadingSpinner />
                </div>
                <div v-else-if="postsError" class="text-center text-red-500">
                    <p>Unable to load posts: {{ postsError.message }}</p>
                </div>
                <div v-else-if="recentPosts && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <PostPreview v-for="post in recentPosts" :key="post.id" :post="post" />
                </div>
                <div v-else class="text-center text-gray-600">
                    <p>No posts available.</p>
                </div>
            </div>
        </section>

        <section id="cta-section" class="bg-primary py-8 text-white text-center">
            <div class="container mx-auto px-4">
                <p class="text-xl mb-4">Ready to find a new plant or share your experience?</p>
                <NuxtLink to="/plants" class="inline-block border-2 border-white text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-primary transition-colors">
                    Start Exploring
                </NuxtLink>
            </div>
        </section>
        <section id="gallery-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <Gallery />
            </div>
        </section>
        <section id="testimonial-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <testimonial />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PlantCard from '~/components/plants/PlantCard.vue';
import PostPreview from '~/components/posts/PostPreview.vue';
import scrollableMenu from '~/components/common/scrollableMenu.vue';
import Gallery from '~/components/common/Gallery.vue';
import banner from '~/components/common/banner.vue';
import testimonial from '~/components/common/testimonial.vue';

const menuItems = ref([
    { id: 1, name: 'Featured Plants', data: 'featured-plants-section', isActive: true },
    { id: 2, name: 'Recent Posts', data: 'recent-posts-section', isActive: false },
    { id: 3, name: 'Explore More', data: 'cta-section', isActive: false },
    { id: 4, name: 'Gallery', data: 'gallery-section', isActive: false },
    { id: 5, name: 'Customer Reviews', data: 'testimonial-section', isActive: false },
]);

const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const featuredPlants = ref([]);
const plantsPending = ref(true);
const plantsError = ref(null);

const recentPosts = ref([]);
const postsPending = ref(true);
const postsError = ref(null);

const latestTestimonials = ref([]);
const testimonialsPending = ref(true);
const testimonialsError = ref(null);

const samplePlants = [
    { id: '1', name: 'Monstera Deliciosa', description: 'Popular and easy to care for.', price: 250000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '2', name: 'Calathea Orbifolia', description: 'Beautiful round leaves.', price: 180000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '3', name: 'Snake Plant', description: 'Great air purifier.', price: 100000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '4', name: 'Fiddle Leaf Fig', description: 'Miniature Singapore fig.', price: 300000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '5', name: 'ZZ Plant', description: 'Symbol of luck.', price: 150000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
    { id: '6', name: 'Peace Lily', description: 'Beautiful white flowers.', price: 120000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png' },
];

const samplePosts = [
    { id: 'p1', title: '5 Tips for Monstera Care', content: 'Monstera is a very popular plant...', user: { username: 'user1', full_name: 'John Doe' }, createdAt: new Date().toISOString(), rating: 15,images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }], },
    { id: 'p2', title: 'Watering Succulents', content: 'Succulents need just the right amount of water...', user: { username: 'user2' }, createdAt: new Date(Date.now() - 86400000).toISOString(), rating: 8,images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }], },
    { id: 'p3', title: 'Choosing the Right Pot', content: 'Size and material matter...', user: { username: 'user3', full_name: 'Jane Smith' }, createdAt: new Date(Date.now() - 172800000).toISOString(), rating: 5,images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }], },
    { id: 'p4', title: 'Common Pests and Diseases', content: 'Detect and handle pests early...', user: { username: 'user4' }, createdAt: new Date(Date.now() - 259200000).toISOString(), rating: 3,images: [{ id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' }], },
];

const sampleTestimonials = [
    { id: 't1', customerName: 'Alice', customerTitle: 'Customer from Hanoi', content: 'Very satisfied with the plant quality and consultation service!', createdAt: new Date().toISOString() },
    { id: 't2', customerName: 'Bob', customerTitle: 'Loyal Customer', content: 'Carefully packaged, plants arrived fresh and healthy, fast delivery.', createdAt: new Date().toISOString() },
    { id: 't3', customerName: 'Charlie', customerTitle: 'Plant Enthusiast', content: 'Found many unique varieties not available elsewhere.', createdAt: new Date().toISOString() },
];

onMounted(() => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    delay(500).then(() => {
        plantsPending.value = false;
        if (!plantsError.value) {
            featuredPlants.value = samplePlants;
        }
    });

    delay(700).then(() => {
        postsPending.value = false;
        if (!postsError.value) {
            recentPosts.value = samplePosts;
        }
    });

    delay(900).then(() => {
        testimonialsPending.value = false;
        if (!testimonialsError.value) {
            latestTestimonials.value = sampleTestimonials;
        }
    });
});

useHead({
    title: 'Plant Store - Discover Plants, Share Experiences',
    meta: [
        { name: 'description', content: 'A website for plant lovers to find quality plants, share experiences, and read customer reviews.' },
        { property: 'og:title', content: 'Plant Store - Discover Plants, Share Experiences' },
        { property: 'og:description', content: 'A website for plant lovers to find quality plants, share experiences, and read customer reviews.' },
        { property: 'og:image', content: '/social-share-image.jpg' },
        { property: 'og:url', content: 'http://localhost:8080' },
    ],
});
</script>

<style scoped>
</style>

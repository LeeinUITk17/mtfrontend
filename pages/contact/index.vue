<template>
    <div class="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-600 mb-8 md:mb-12">Contact Us</h1>

        <section class="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10 mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2">About Our Plant Shop</h2>
                        <p class="text-gray-700 leading-relaxed opacity-95">
                            We are plant enthusiasts committed to providing you with high-quality, healthy, and diverse plants. With in-depth knowledge and practical experience, we not only supply plants but also share useful care tips to help you nurture your passion for greenery.
                        </p>
                    </div>
                    <div>
                        <h2 class="text-2xl md:text-3xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2">Our Commitment</h2>
                        <p class="text-gray-700 leading-relaxed opacity-95">
                            We are committed to product quality, dedicated consulting services, and an excellent shopping experience. Every plant delivered to you is carefully selected and packaged. Your satisfaction and success in growing plants are our top priorities.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl md:text-3xl font-semibold text-green-700 mb-6 border-b-2 border-green-200 pb-2">Contact Information</h2>
                    <ul class="space-y-6 text-gray-700">
                        <li>
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p class="font-semibold text-green-800">Address:</p>
                                    <p>123 Green Street, Green Ward, Green District, Ho Chi Minh City</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v4a2 2 0 002 2h14a2 2 0 002-2v-4m-18 0l11-7" />
                                </svg>
                                <div>
                                    <p class="font-semibold text-green-800">Email:</p>
                                    <p>
                                        <a href="mailto:contact@yourplantshop.com" class="text-blue-600 hover:underline transition-colors">contact@yourplantshop.com</a>
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p class="font-semibold text-green-800">Phone/Zalo:</p>
                                    <p>
                                        <a href="tel:+84123456789" class="text-blue-600 hover:underline transition-colors">+84 123 456 789</a>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-semibold text-gray-600 mb-6">Connect With Us</h2>
            <div class="flex justify-center space-x-6 md:space-x-8 text-white">
                <a href="https://www.facebook.com/yourplantshop" target="_blank" aria-label="Follow us on Facebook" class="hover:text-white transform hover:scale-110 transition-all duration-300">
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png" alt="Facebook Logo" class="h-8 w-8" />
                </a>
                <a href="https://www.youtube.com/yourplantshop" target="_blank" aria-label="Follow us on YouTube" class="hover:text-white transform hover:scale-110 transition-all duration-300">
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/skrccs2d36g5hmixyfrw.png" alt="Youtube Logo" class="h-8 w-8" />
                </a>
                <a href="https://zalo.me/0356356497" target="_blank" aria-label="Contact on Zalo" class="hover:text-white transform hover:scale-110 transition-all duration-300">
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png" alt="Zalo Logo" class="h-8 w-8 bg-white" />
                </a>
            </div>
        </section>
    </div>
</template>

<script setup>
useHead({
    title: 'Contact - Plant Shop',
    meta: [
        { name: 'description', content: 'Contact information, address, and our commitment at Plant Shop. Connect with us on social media.' },
        { property: 'og:title', content: 'Contact - Plant Shop' },
        { property: 'og:description', content: 'Contact information, address, and our commitment at Plant Shop. Connect with us on social media.' },
        { property: 'og:image', content: '/social-share-image.jpg' },
        { property: 'og:url', content: 'http://localhost:8080/contact' }
    ]
});
</script>

<style scoped>
</style>

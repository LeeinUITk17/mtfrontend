<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Danh mục Cây cảnh</h1>

        <div class="mb-8 flex flex-col md:flex-row justify-center gap-4">
            <div v-if="categoriesPending" class="text-gray-600">Đang tải danh mục...</div>
            <div v-else-if="categoriesError" class="text-red-500">Lỗi tải danh mục: {{ categoriesError.message }}</div>
            <select
                v-else-if="categories && categories.length > 0"
                v-model="selectedCategoryId"
                class="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                aria-label="Lọc cây theo danh mục"
            >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <div v-else class="text-gray-600">Không có danh mục nào.</div>

            <input
                type="text"
                v-model="searchTerm"
                placeholder="Tìm kiếm cây..."
                class="block w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                aria-label="Tìm kiếm cây"
            />
        </div>

        <div v-if="plantsPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải danh sách cây...</p>
        </div>

        <div v-else-if="plantsError" class="text-center text-red-500 py-12">
            <p>Lỗi khi tải danh sách cây: {{ plantsError.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau.</p>
        </div>

        <div v-else-if="paginatedPlants && paginatedPlants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <NuxtLink
                v-for="plant in paginatedPlants"
                :key="plant.slug"
                :to="`/plants/${plant.slug}`"
                class="block"
            >
                <PlantCard :plant="plant" />
            </NuxtLink>
        </div>

        <div v-else-if="!plantsPending && !plantsError && (!paginatedPlants || paginatedPlants.length === 0)" class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không có cây cảnh nào được tìm thấy{{ selectedCategoryId ? ' trong danh mục này' : '' }}{{ searchTerm ? ' với từ khóa "' + searchTerm + '"' : '' }}.</p>
            <p class="mt-2">Hãy thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
        </div>

        <div v-if="totalPages > 1 && !plantsPending && !plantsError && filteredPlants && filteredPlants.length > 0" class="mt-12 flex justify-center items-center space-x-2">
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Trước
            </button>

            <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                    'bg-green-500 text-white': currentPage === page,
                    'bg-white text-gray-700 hover:bg-gray-100': currentPage !== page
                }"
                class="px-3 py-1 border rounded-md transition-colors"
            >
                {{ page }}
            </button>

            <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sau
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PlantCard from '~/components/plants/PlantCard.vue';

const config = useRuntimeConfig();
const selectedCategoryId = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(8);

const { data: categories, pending: categoriesPending, error: categoriesError } = await useFetch(`${config.public.apiBase}/categories`);
const { data: plants, pending: plantsPending, error: plantsError, refresh: fetchPlants } = await useFetch(`${config.public.apiBase}/plants`, {
    query: {
        categoryId: selectedCategoryId,
    },
    watch: [selectedCategoryId],
});

const filteredPlants = computed(() => {
    if (!plants.value) return [];
    let filtered = plants.value;
    const selectedId = selectedCategoryId.value;
    const term = searchTerm.value.toLowerCase().trim();

    if (selectedId !== '') {
        filtered = filtered.filter(plant => plant.categoryId === selectedId);
    }

    if (term !== '') {
        filtered = filtered.filter(plant => {
            const categoryName = categories.value?.find(cat => cat.id === plant.categoryId)?.name;
            const nameMatch = plant.name?.toLowerCase().includes(term);
            const descriptionMatch = plant.description?.toLowerCase().includes(term);
            const categoryMatch = categoryName?.toLowerCase().includes(term);
            return nameMatch || descriptionMatch || categoryMatch;
        });
    }

    return filtered;
});

const totalPages = computed(() => {
    if (!filteredPlants.value) return 0;
    return Math.ceil(filteredPlants.value.length / itemsPerPage.value);
});

const paginatedPlants = computed(() => {
    if (!filteredPlants.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredPlants.value.slice(start, end);
});

watch(filteredPlants, () => {
    currentPage.value = 1;
}, { deep: true });

watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
        currentPage.value = Math.max(1, newTotalPages);
    }
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
    }
};


useHead({
    title: 'Danh Mục Cây Cao Su Giống Chất Lượng - Vườn Ươm Tuấn Anh',
    meta: [
        { 
            name: 'description', 
            content: 'Danh mục đa dạng các giống cây cao su chất lượng cao: RRIV 209, PB 235, DK4, VM 515. Cung cấp cây giống đạt tiêu chuẩn, kháng bệnh tốt, năng suất mủ cao tại Bình Phước.' 
        },
        { 
            name: 'keywords', 
            content: 'cây cao su giống, bán cây cao su giống, giống cây cao su, cây cao su giống Bình Phước, vườn ươm cao su giống, cây cao su RRIV 209, cây cao su PB 235, cây cao su DK4, cây cao su VM 515, địa chỉ mua cây cao su giống' 
        },
        { 
            property: 'og:title', 
            content: 'Danh Mục Cây Cao Su Giống - Vườn Ươm Tuấn Anh Bình Phước' 
        },
        { 
            property: 'og:description', 
            content: 'Cung cấp đa dạng các giống cây cao su chất lượng cao, đạt tiêu chuẩn xuất vườn tại Bình Phước' 
        },
        { 
            property: 'og:image', 
            content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png' 
        },
        { 
            property: 'og:url', 
            content: `${config.public.baseUrl}/plants` 
        },
        { 
            property: 'og:type', 
            content: 'website' 
        },
        
        { 
            name: 'twitter:card', 
            content: 'summary_large_image' 
        },
        { 
            name: 'twitter:title', 
            content: 'Danh Mục Cây Cao Su Giống - Tuấn Anh' 
        },
        { 
            name: 'twitter:description', 
            content: 'Các giống cao su chất lượng cao tại vườn ươm Tuấn Anh Bình Phước' 
        },
        { 
            name: 'twitter:image', 
            content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' 
        },
        
        { 
            rel: 'canonical', 
            href: `${config.public.baseUrl}/plants` 
        },
    ],
    link: [
        { 
            rel: 'canonical', 
            href: `${config.public.baseUrl}/plants` 
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Danh mục cây cao su giống",
                "description": "Cung cấp các giống cây cao su chất lượng cao tại Bình Phước",
                "url": `${config.public.baseUrl}/plants`,
                "publisher": {
                    "@type": "Organization",
                    "name": "Vườn Ươm Cây Cao Su Giống Tuấn Anh",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png"
                    }
                }
            })
        }
    ]
});
</script>

<style scoped>
</style>

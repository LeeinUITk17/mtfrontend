<template>
    <div class="container mx-auto px-4 py-8">

        <div class="mb-8 flex flex-col md:flex-row justify-center gap-4">
            <div v-if="categoriesPending" class="text-gray-600"></div>
            <div v-else-if="categoriesError" class="text-red-500">Error loading categories: {{ categoriesError.message }}</div>
            <select
                v-else-if="categories && categories.length > 0"
                v-model="selectedCategoryId"
                class="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                aria-label="Filter plants by category"
            >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <div v-else class="text-gray-600">No categories available.</div>

            <input
                type="text"
                v-model="searchTerm"
                placeholder="Search plants..."
                class="block w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                aria-label="Search plants"
            />
        </div>

        <div v-if="plantsPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Loading plant list...</p>
        </div>

        <div v-else-if="plantsError" class="text-center text-red-500 py-12">
            <p>Error loading plant list: {{ plantsError.message }}</p>
            <p class="mt-2">Please try again later.</p>
        </div>

        <div v-else-if="displayedPlants && displayedPlants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <NuxtLink
                v-for="plant in displayedPlants"
                :key="plant.id"
                :to="`/plants/${plant.id}`"
                class="block"
            >
                <PlantCard :plant="plant" />
            </NuxtLink>
        </div>

        <div v-else class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">No plants found{{ selectedCategoryId ? ' in this category' : '' }}{{ searchTerm ? ' with the keyword "' + searchTerm + '"' : '' }}.</p>
            <p class="mt-2">Try selecting a different category or changing the search keyword.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PlantCard from '~/components/plants/PlantCard.vue';

const selectedCategoryId = ref('');
const searchTerm = ref('');

const sampleCategories = [
    { id: 'cat1', name: 'Indoor Plants' },
    { id: 'cat2', name: 'Outdoor Plants' },
    { id: 'cat3', name: 'Succulents' },
    { id: '', name: 'Uncategorized' },
];

const samplePlants = [
    { id: '1', name: 'Monstera Deliciosa', description: 'Popular and easy to care for.', price: 250000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '2', name: 'Calathea Orbifolia', description: 'Beautiful round leaves.', price: 180000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '3', name: 'Snake Plant', description: 'Great air purifier.', price: 100000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '4', name: 'Fiddle Leaf Fig', description: 'Miniature Singapore fig.', price: 300000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat2', category: { id: 'cat2', name: 'Outdoor Plants' } },
    { id: '5', name: 'ZZ Plant', description: 'Symbol of luck.', price: 150000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: '', category: null },
    { id: '6', name: 'Peace Lily', description: 'Beautiful white flowers.', price: 120000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '7', name: 'Pothos', description: 'Easy to grow trailing plant.', price: 80000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '8', name: 'Spider Plant', description: 'Produces spiderettes, easy to propagate.', price: 90000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat1', category: { id: 'cat1', name: 'Indoor Plants' } },
    { id: '9', name: 'Aloe Vera', description: 'Known for its medicinal properties.', price: 110000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat3', category: { id: 'cat3', name: 'Succulents' } },
    { id: '10', name: 'Rubber Plant', description: 'Striking foliage and easy care.', price: 170000, imageUrl: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v17046003295/isljuytzamjj4kc2jrzb.png', categoryId: 'cat2', category: { id: 'cat2', name: 'Outdoor Plants' } },
];

const categories = ref([]);
const categoriesPending = ref(true);
const categoriesError = ref(null);

const plants = ref([]);
const plantsPending = ref(true);
const plantsError = ref(null);

const displayedPlants = computed(() => {
    if (!plants.value) return [];
    let filtered = plants.value;
    const selectedId = selectedCategoryId.value;
    const term = searchTerm.value.toLowerCase().trim();

    if (selectedId !== '') {
        filtered = filtered.filter(plant => plant.categoryId === selectedId);
    }

    if (term !== '') {
        filtered = filtered.filter(plant => {
            const nameMatch = plant.name.toLowerCase().includes(term);
            const descriptionMatch = plant.description?.toLowerCase().includes(term);
            const categoryMatch = plant.category?.name?.toLowerCase().includes(term);
            return nameMatch || descriptionMatch || categoryMatch;
        });
    }

    return filtered;
});

onMounted(() => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    delay(300).then(() => {
        categoriesPending.value = false;
        if (!categoriesError.value) {
            categories.value = sampleCategories;
        }
    });

    delay(800).then(() => {
        plantsPending.value = false;
        if (!plantsError.value) {
            plants.value = samplePlants;
        }
    });
});
</script>

<style scoped>
</style>

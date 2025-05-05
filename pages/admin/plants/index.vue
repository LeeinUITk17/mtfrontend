<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-end mb-6">
            <NuxtLink
                to="/admin/plants/create"
                class="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium shadow text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm Cây trồng Mới
            </NuxtLink>
        </div>

        <div
            v-if="deleteMessage"
            class="mb-4 p-3 rounded-md text-sm font-medium"
            :class="deleteError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'"
        >
            {{ deleteMessage }}
        </div>

        <PlantTable
            :plants="paginatedPlants"
            :loading="plantsPending || isDeleting"
            @delete-plant="handleDeletePlant"
        />

        <div
            v-if="!plantsPending && totalPages > 1"
            class="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
            <div class="text-sm text-gray-600">
                Trang <span class="font-medium">{{ currentPage }}</span> / <span class="font-medium">{{ totalPages }}</span> (Tổng số <span class="font-medium">{{ allPlants.length }}</span> cây trồng)
            </div>
            <div class="flex justify-center items-center space-x-1 sm:space-x-2">
                <button
                    @click="goToPage(1)"
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang đầu"
                >
                    «
                </button>
                <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang trước"
                >
                    ‹
                </button>
                <button
                    v-for="page in paginationButtons"
                    :key="page"
                    @click="goToPage(page)"
                    :class="{
                        'bg-blue-600 text-white border-blue-600 z-10': currentPage === page,
                        'bg-white text-gray-700 hover:bg-gray-100 border-gray-300': currentPage !== page
                    }"
                    class="px-3 py-1 border rounded-md text-sm font-medium transition-colors"
                >
                    {{ page }}
                </button>
                <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang sau"
                >
                    ›
                </button>
                <button
                    @click="goToPage(totalPages)"
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang cuối"
                >
                    »
                </button>
            </div>
        </div>
        <div
            v-else-if="!plantsPending && (!allPlants || allPlants.length === 0)"
            class="mt-8 text-center text-gray-500 italic"
        >
            Không có cây trồng nào để hiển thị.
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PlantTable from '~/components/admin/PlantTable.vue';
import Swal from 'sweetalert2';

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
});

const config = useRuntimeConfig();
const isDeleting = ref(false);
const deleteMessage = ref(null);
const deleteError = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12);

const {
    data: allPlants,
    pending: plantsPending,
    error: plantsError,
    refresh: refreshPlants,
} = await useAsyncData(
    'admin-plants-list-all-client-paginated',
    async () => {
        try {
            const fetchedPlants = await $fetch(`${config.public.apiBase}/plants`);
            if (!Array.isArray(fetchedPlants)) {
                Swal.fire('Lỗi!', 'Dữ liệu cây trồng nhận được không hợp lệ.', 'error');
                return [];
            }
            if (fetchedPlants.length > 0 && fetchedPlants[0].createdAt) {
                return fetchedPlants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } else if (fetchedPlants.length > 0 && fetchedPlants[0].name) {
                return fetchedPlants.sort((a, b) => a.name.localeCompare(b.name));
            }
            return fetchedPlants;
        } catch (err) {
            const message = err.data?.message || 'Không thể tải danh sách cây trồng.';
            Swal.fire('Lỗi!', message, 'error');
            return [];
        }
    },
    { default: () => [] }
);

const totalPages = computed(() => {
    if (!allPlants.value || allPlants.value.length === 0) {
        return 0;
    }
    return Math.ceil(allPlants.value.length / itemsPerPage.value);
});

const paginatedPlants = computed(() => {
    if (!allPlants.value || allPlants.value.length === 0) {
        return [];
    }
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return allPlants.value.slice(startIndex, endIndex);
});

const paginationButtons = computed(() => {
    const current = currentPage.value;
    const total = totalPages.value;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    if (total > 1) range.push(total);

    for (let i of range) {
        if (l) {
            if (i - l === 2) rangeWithDots.push(l + 1);
            else if (i - l !== 1) rangeWithDots.push('...');
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots.filter((page) => typeof page === 'number');
});

watch(
    allPlants,
    (newVal, oldVal) => {
        if (newVal && newVal.length !== oldVal?.length) {
            const newTotalPages = Math.ceil(newVal.length / itemsPerPage.value);
            if (currentPage.value > newTotalPages && newTotalPages > 0) {
                currentPage.value = newTotalPages;
            } else if (currentPage.value > 1 && newTotalPages === 0) {
                currentPage.value = 1;
            }
        }
    },
    { deep: true }
);

const handleDeletePlant = async (plantId) => {
    isDeleting.value = true;
    deleteMessage.value = null;
    deleteError.value = false;

    try {
        await $fetch(`${config.public.apiBase}/plants/${plantId}`, { method: 'DELETE' });
        deleteMessage.value = `Cây trồng (ID: ${plantId}) đã được xóa thành công!`;
        deleteError.value = false;
        Swal.fire('Đã xóa!', 'Cây trồng đã được xóa.', 'success');
        await refreshPlants();
    } catch (err) {
        const message = err.data?.message || 'Không thể xóa cây trồng.';
        deleteMessage.value = `Lỗi: ${message}`;
        deleteError.value = true;
        Swal.fire('Lỗi!', message, 'error');
    } finally {
        isDeleting.value = false;
        setTimeout(() => {
            deleteMessage.value = null;
            deleteError.value = false;
        }, 7000);
    }
};

const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value && pageNumber !== currentPage.value) {
        currentPage.value = pageNumber;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

useHead({
    title: 'Quản lý Cây trồng - Admin',
});
</script>

<style scoped>
.container {
    max-width: 1280px;
}
</style>

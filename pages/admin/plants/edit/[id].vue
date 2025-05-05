<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="plantPending" class="text-center py-10">
            <LoadingSpinner /> Loading plant data...
        </div>
        <div v-else-if="plantError" class="text-red-500 bg-red-100 p-4 rounded border border-red-300">
            Lỗi tải dữ liệu cây trồng: {{ plantError.message }}
        </div>
        <div v-else-if="plantData">
            <h1 class="text-2xl font-semibold text-gray-800 mb-6">Chỉnh sửa Cây trồng: {{ plantData.name }}</h1>
            <PlantForm
                :initialData="plantData"
                :isEditMode="true"
                :isSubmitting="isSubmittingDetails"
                :categories="categories"
                @submit="handleUpdatePlantDetails"
                class="mb-10"
            />
            <hr class="my-8 border-gray-300">
            <h2 class="text-xl font-medium text-gray-700 mb-4">Hình ảnh hiện tại</h2>
            <div v-if="deleteImageMessage" class="mb-4 p-3 rounded-md text-sm font-medium"
                :class="deleteImageError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'">
                {{ deleteImageMessage }}
            </div>
            <div v-if="plantData.images && plantData.images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <div v-for="image in plantData.images" :key="image.id" class="relative group aspect-square border rounded-md overflow-hidden">
                    <NuxtImg :src="image.url" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-150 flex items-center justify-center">
                        <button
                            @click="confirmDeleteImage(image.id, image.url)"
                            :disabled="isDeletingImage === image.id"
                            class="p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            aria-label="Xóa ảnh này"
                        >
                            <svg v-if="isDeletingImage === image.id" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="text-sm text-gray-500 italic">Chưa có hình ảnh nào cho cây này.</p>
            <hr class="my-8 border-gray-300">
            <h2 class="text-xl font-medium text-gray-700 mb-4">Thêm hình ảnh mới</h2>
            <PlantImageUploader
                label="Chọn ảnh mới để thêm"
                :multiple="true"
                inputName="newImages"
                v-model="newImageFiles"
                :maxFileSizeMB="5"
                class="mb-4"
            />
            <button
                @click="handleAddNewImages"
                :disabled="newImageFiles.length === 0 || isUploadingNewImages"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                <svg v-if="isUploadingNewImages" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isUploadingNewImages ? 'Đang tải lên...' : 'Thêm ảnh đã chọn' }}
            </button>
        </div>
        <div v-else class="text-center py-10 text-gray-600">
            Không tìm thấy cây trồng.
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import PlantForm from '~/components/admin/PlantForm.vue';
import PlantImageUploader from '~/components/admin/PlantImageUploader.vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const plantId = computed(() => route.params.id);

const isSubmittingDetails = ref(false);
const isDeletingImage = ref(null);
const deleteImageMessage = ref(null);
const deleteImageError = ref(false);
const newImageFiles = ref([]);
const isUploadingNewImages = ref(false);
const categories = ref([]);

const { data: plantData, pending: plantPending, error: plantError, refresh: refreshPlantData } = await useAsyncData(
    `admin-plant-${plantId.value}`,
    async () => {
        if (!plantId.value) return null;
        try {
            return await $fetch(`${config.public.apiBase}/plants/${plantId.value}`);
        } catch (err) {
            console.error("Error fetching plant data:", err);
            throw new Error(err.data?.message || 'Không thể tải dữ liệu cây trồng.');
        }
    },
    { watch: [plantId], default: () => null }
);

const fetchCategories = async () => {
    try {
        const data = await $fetch(`${config.public.apiBase}/categories`);
        if (Array.isArray(data)) {
            categories.value = data;
        } else {
            categories.value = [];
            Swal.fire('Lỗi!', 'Dữ liệu danh mục nhận được không hợp lệ.', 'error');
        }
    } catch (error) {
        categories.value = [];
        Swal.fire('Lỗi!', 'Không thể tải danh mục từ máy chủ.', 'error');
    }
};

onMounted(fetchCategories);

const handleUpdatePlantDetails = async (updatedData) => {
    isSubmittingDetails.value = true;
    try {
        const payload = {
            name: updatedData.name,
            description: updatedData.description,
            price: updatedData.price,
            stock: updatedData.stock,
            categoryId: updatedData.categoryId,
            imageUrl: updatedData.imageUrl
        };
        await $fetch(`${config.public.apiBase}/plants/${plantId.value}`, {
            method: 'PATCH',
            body: payload
        });
        Swal.fire('Thành công!', 'Thông tin cây trồng đã được cập nhật.', 'success');
        await refreshPlantData();
    } catch (err) {
        Swal.fire('Lỗi!', err.data?.message || 'Không thể cập nhật thông tin.', 'error');
    } finally {
        isSubmittingDetails.value = false;
    }
};

const confirmDeleteImage = (imageId, imageUrl) => {
    Swal.fire({
        title: 'Xác nhận xóa ảnh',
        html: `<p>Bạn có chắc chắn muốn xóa ảnh này?</p><img src="${imageUrl}" alt="Xem trước" class="max-w-xs mx-auto my-4 border rounded"/>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đúng, xóa ảnh!',
        cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
        if (result.isConfirmed) {
            handleDeleteImage(imageId);
        }
    });
};

const handleDeleteImage = async (imageId) => {
    isDeletingImage.value = imageId;
    deleteImageMessage.value = null;
    deleteImageError.value = false;
    try {
        await $fetch(`${config.public.apiBase}/images/${imageId}`, { method: 'DELETE' });
        deleteImageMessage.value = 'Ảnh đã được xóa thành công.';
        deleteImageError.value = false;
        await refreshPlantData();
        setTimeout(() => { deleteImageMessage.value = null; }, 5000);
    } catch (err) {
        const message = err.data?.message || 'Không thể xóa ảnh.';
        deleteImageMessage.value = `Lỗi: ${message}`;
        deleteImageError.value = true;
        Swal.fire('Lỗi!', message, 'error');
    } finally {
        isDeletingImage.value = null;
    }
};

const handleAddNewImages = async () => {
    if (newImageFiles.value.length === 0) return;
    isUploadingNewImages.value = true;
    const formData = new FormData();
    newImageFiles.value.forEach(file => {
        formData.append('images', file);
    });
    try {
        await $fetch(`${config.public.apiBase}/images/upload/plant/${plantId.value}`, {
            method: 'POST',
            body: formData,
        });
        Swal.fire('Thành công!', 'Ảnh mới đã được thêm.', 'success');
        newImageFiles.value = [];
        await refreshPlantData();
    } catch (err) {
        const message = err.data?.message || 'Không thể thêm ảnh mới.';
        Swal.fire('Lỗi!', message, 'error');
    } finally {
        isUploadingNewImages.value = false;
    }
};

useHead(() => ({
    title: plantData.value ? `Chỉnh sửa: ${plantData.value.name}` : 'Chỉnh sửa Cây trồng'
}));
</script>

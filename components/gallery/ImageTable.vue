<template>
    <div class="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ảnh xem trước
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL Ảnh
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                    <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        <div class="flex justify-center items-center py-4">
                            <svg class="animate-spin h-5 w-5 text-gray-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tải dữ liệu...
                        </div>
                    </td>
                </tr>
                <tr v-else-if="!images || images.length === 0">
                    <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        Không tìm thấy ảnh nào.
                    </td>
                </tr>
                <tr v-else v-for="image in images" :key="image.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <NuxtImg
                            :src="image.imageUrl"
                            :alt="'Xem trước ' + image.id"
                            class="h-16 w-16 rounded object-cover shadow"
                            loading="lazy"
                            width="64"
                            height="64"
                        />
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700 max-w-xs break-words">
                        <a :href="image.imageUrl" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors duration-150">
                            {{ image.imageUrl }}
                        </a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            @click="confirmDelete(image.id)"
                            class="text-red-600 hover:text-red-800 transition-colors duration-150 inline-flex items-center"
                            aria-label="Xóa ảnh"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const props = defineProps({
    images: {
        type: Array,
        required: true,
        validator: (value) => Array.isArray(value) && value.every(img => typeof img === 'object' && img !== null && 'id' in img && 'imageUrl' in img),
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['delete-image']);

const confirmDelete = (imageId) => {
    if (!imageId) {
        console.error("Image ID is missing, cannot delete.");
        return;
    }

    Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa ảnh này không?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đúng, xóa nó!',
        cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
        if (result.isConfirmed) {
            emit('delete-image', imageId);
        }
    });
};
</script>

<style scoped>
</style>

<template>
    <div class="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Tải ảnh lên Bộ sưu tập
        </h3>

        <div class="mb-4">
            <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 border border-gray-300 px-4 py-2 inline-block">
                <span>Chọn tệp ảnh</span>
                <input id="file-upload" name="files" type="file" class="sr-only" multiple accept="image/*" @change="handleFileChange" :disabled="isUploading">
            </label>
            <span v-if="!selectedFiles.length" class="ml-3 text-sm text-gray-500">Chưa chọn tệp nào.</span>
        </div>

        <div v-if="selectedFiles.length > 0" class="mb-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            <div v-for="(file, index) in selectedFiles" :key="index" class="relative aspect-square border rounded overflow-hidden">
                <img :src="getFilePreviewUrl(file)" :alt="'Xem trước ' + file.name" class="w-full h-full object-cover">
                <button @click="removeFile(index)" class="absolute top-0 right-0 m-0.5 p-0.5 bg-red-500 text-white rounded-full text-xs leading-none hover:bg-red-600" aria-label="Xóa ảnh xem trước">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <button
            @click="uploadImages"
            :disabled="selectedFiles.length === 0 || isUploading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <svg v-if="isUploading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isUploading ? 'Đang tải lên...' : 'Tải lên ảnh đã chọn' }}
        </button>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const emit = defineEmits(['upload-success']);
const config = useRuntimeConfig();
const selectedFiles = ref([]);
const isUploading = ref(false);
const filePreviewUrls = ref({});

const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
        const newFiles = Array.from(files);
        selectedFiles.value = [...selectedFiles.value, ...newFiles];
        newFiles.forEach(file => {
            const key = `${file.name}-${file.lastModified}`;
            filePreviewUrls.value[key] = URL.createObjectURL(file);
        });
    }
};

const getFilePreviewUrl = (file) => {
    const key = `${file.name}-${file.lastModified}`;
    return filePreviewUrls.value[key] || '';
};

const removeFile = (index) => {
    const fileToRemove = selectedFiles.value[index];
    if (fileToRemove) {
        const key = `${fileToRemove.name}-${fileToRemove.lastModified}`;
        if (filePreviewUrls.value[key]) {
            URL.revokeObjectURL(filePreviewUrls.value[key]);
            delete filePreviewUrls.value[key];
        }
    }
    selectedFiles.value.splice(index, 1);
};

const uploadImages = async () => {
    if (selectedFiles.value.length === 0 || isUploading.value) {
        return;
    }

    isUploading.value = true;

    const formData = new FormData();
    selectedFiles.value.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await $fetch(`${config.public.apiBase}/gallery-images/upload`, {
            method: 'POST',
            body: formData,
        });

        Swal.fire({
            title: 'Thành công!',
            text: `Đã tải lên thành công ${response?.length || selectedFiles.value.length} ảnh!`,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
        });

        Object.values(filePreviewUrls.value).forEach(url => URL.revokeObjectURL(url));
        filePreviewUrls.value = {};
        selectedFiles.value = [];
        emit('upload-success');
    } catch (err) {
        const errorMessage = err.data?.message || err.message || 'Đã xảy ra lỗi khi tải ảnh lên.';
        Swal.fire({
            title: 'Lỗi!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Đã hiểu'
        });
    } finally {
        isUploading.value = false;
    }
};

onUnmounted(() => {
    Object.values(filePreviewUrls.value).forEach(url => URL.revokeObjectURL(url));
    filePreviewUrls.value = {};
});
</script>

<style scoped>
</style>

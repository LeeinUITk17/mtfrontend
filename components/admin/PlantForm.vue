<template>
    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
            <label for="plant-name" class="block text-sm font-medium text-gray-700">Tên cây trồng <span class="text-red-500">*</span></label>
            <input type="text" id="plant-name" v-model="formData.name" required maxlength="255"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <div>
            <label for="plant-description" class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea id="plant-description" v-model="formData.description" rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>

        <div>
            <label for="plant-price" class="block text-sm font-medium text-gray-700">Giá (VND) <span class="text-red-500">*</span></label>
            <input type="number" id="plant-price" v-model.number="formData.price" required min="0" step="1000"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <div>
            <label for="plant-stock" class="block text-sm font-medium text-gray-700">Số lượng tồn kho <span class="text-red-500">*</span></label>
            <input type="number" id="plant-stock" v-model.number="formData.stock" required min="0" step="1"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <div>
            <label for="plant-category" class="block text-sm font-medium text-gray-700">Danh mục</label>
            <select id="plant-category" v-model="formData.categoryId"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3">
                <option :value="null">-- Chọn danh mục --</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div>
            <PlantImageUploader
                label="Thêm hình ảnh"
                :multiple="true"
                inputName="images"
                v-model="selectedImageFiles"
                :maxFileSizeMB="5" />
            <p class="mt-1 text-xs text-gray-500">Ảnh đầu tiên sẽ được dùng làm ảnh đại diện nếu bạn không đặt riêng.</p>
        </div>

        <div class="flex justify-end pt-4">
            <NuxtLink to="/admin/plants" class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Hủy bỏ
            </NuxtLink>
            <button type="submit" :disabled="isSubmitting"
                    class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEditMode ? 'Cập nhật Cây trồng' : 'Thêm Cây trồng' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import PlantImageUploader from './PlantImageUploader.vue';

const props = defineProps({
    initialData: {
        type: Object,
        default: () => null
    },
    isEditMode: {
        type: Boolean,
        default: false
    },
    isSubmitting: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['submit']);

const formData = reactive({
    name: '',
    description: '',
    price: null,
    stock: null,
    categoryId: null,
    imageUrl: ''
});

const selectedImageFiles = ref([]);

watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.name = newData.name || '';
        formData.description = newData.description || '';
        formData.price = newData.price != null ? Number(newData.price) : null;
        formData.stock = newData.stock != null ? Number(newData.stock) : null;
        formData.categoryId = newData.categoryId || null;
        formData.imageUrl = newData.imageUrl || '';
        selectedImageFiles.value = [];
    } else {
        Object.assign(formData, { name: '', description: '', price: null, stock: null, categoryId: null, imageUrl: '' });
        selectedImageFiles.value = [];
    }
}, { immediate: true, deep: true });

const submitForm = () => {
    const dataToSubmit = { ...formData };
    emit('submit', dataToSubmit, selectedImageFiles.value);
};
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Thêm Cây trồng Mới</h1>

        <PlantForm
            :isSubmitting="isSubmitting"
            :categories="categories"
            @submit="handleCreatePlant"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import PlantForm from '~/components/admin/PlantForm.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const router = useRouter();
const config = useRuntimeConfig();
const isSubmitting = ref(false);
const categories = ref([]);

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

const handleCreatePlant = async (plantData, imageFiles) => {
    isSubmitting.value = true;
    const formData = new FormData();

    Object.keys(plantData).forEach(key => {
        if (plantData[key] !== null && plantData[key] !== undefined && plantData[key] !== '') {
            formData.append(key, plantData[key]);
        }
    });

    if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });
    }

    try {
        await $fetch(`${config.public.apiBase}/plants`, {
            method: 'POST',
            body: formData,
        });

        Swal.fire({
            title: 'Thành công!',
            text: 'Cây trồng đã được thêm mới.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
        router.push('/admin/plants');
    } catch (err) {
        const message = err.data?.message || 'Không thể thêm cây trồng.';
        Swal.fire('Lỗi!', message, 'error');
    } finally {
        isSubmitting.value = false;
    }
};

useHead({ title: 'Thêm Cây trồng - Admin' });
</script>

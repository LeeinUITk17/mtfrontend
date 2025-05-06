<!-- <template>
    <div class="max-w-sm mx-auto py-8 md:py-12 lg:py-16">
        <div class="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 class="mt-2 text-center text-3xl font-bold text-green-800">
                Create a New Account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Join our plant-loving community!
            </p>
            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div
                    v-if="message"
                    :class="messageType === 'error' ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'"
                    class="rounded-md p-4 border"
                >
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <XCircleIcon
                                v-if="messageType === 'error'"
                                class="h-5 w-5 text-red-500"
                                aria-hidden="true"
                            />
                            <CheckCircleIcon
                                v-else
                                class="h-5 w-5 text-green-500"
                                aria-hidden="true"
                            />
                        </div>
                        <div class="ml-3 flex-1">
                            <p
                                :class="messageType === 'error' ? 'text-red-800' : 'text-green-800'"
                                class="text-sm font-medium"
                            >
                                {{ message }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <input
                            id="username"
                            name="username"
                            v-model="formData.username"
                            type="text"
                            autocomplete="username"
                            required
                            placeholder="Username"
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label for="email-address" class="sr-only">Email Address</label>
                        <input
                            id="email-address"
                            name="email"
                            v-model="formData.email"
                            type="email"
                            autocomplete="email"
                            required
                            placeholder="Email Address"
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            v-model="formData.password"
                            type="password"
                            autocomplete="new-password"
                            required
                            placeholder="Password"
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label for="confirm-password" class="sr-only">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            v-model="formData.confirmPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                            placeholder="Confirm Password"
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div class="text-sm text-center text-gray-700">
                    Already have an account?
                    <NuxtLink
                        to="/login"
                        class="font-medium text-green-600 hover:text-green-800 transition-colors"
                    >
                        Log in
                    </NuxtLink>
                </div>
                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserPlusIcon
                                v-if="!loading"
                                class="h-5 w-5 text-white group-hover:text-gray-100 transition-colors"
                                aria-hidden="true"
                            />
                            <svg
                                v-if="loading"
                                class="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </span>
                        {{ loading ? 'Processing...' : 'Register' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { UserPlusIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/vue/20/solid';
import { useAuth } from '~/composables/useAuth';
import { navigateTo } from '#app';

definePageMeta({
    layout: 'auth',
    middleware: 'guest',
});

const { signup } = useAuth();

const formData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const loading = ref(false);
const message = ref<string | null>(null);
const messageType = ref<'success' | 'error'>('error');

const handleRegister = async () => {
    loading.value = true;
    message.value = null;

    if (formData.password !== formData.confirmPassword) {
        message.value = 'Passwords do not match.';
        messageType.value = 'error';
        loading.value = false;
        return;
    }

    try {
        const result = await signup({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            message.value = 'Registration successful! Redirecting to login page.';
            messageType.value = 'success';
            formData.username = '';
            formData.email = '';
            formData.password = '';
            formData.confirmPassword = '';

            setTimeout(() => {
                navigateTo('/login');
            }, 2500);
        } else {
            message.value = result.error || 'Registration failed.';
            messageType.value = 'error';
        }
    } catch (err: any) {
        console.error('Unexpected registration error:', err);
        message.value = 'An unexpected error occurred. Please try again.';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

useHead({
    title: 'Register - Plant Shop',
    meta: [
        { name: 'description', content: 'Register a new account at Plant Shop to join the community and access exclusive features.' },
        { property: 'og:title', content: 'Register - Plant Shop' },
        { property: 'og:description', content: 'Register a new account at Plant Shop to join the community and access exclusive features.' },
        { property: 'og:url', content: 'http://localhost:8080/register' },
    ],
});
</script>

<style scoped>
</style> -->


<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div class="bg-white p-8 md:p-12 lg:p-16 rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full">
        <!-- Icon Bảo trì (Ví dụ: dùng Heroicons hoặc SVG khác) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 md:h-20 md:w-20 text-yellow-500 mx-auto mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
  
        <!-- Tiêu đề -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Website đang bảo trì
        </h1>
  
        <!-- Nội dung thông báo -->
        <p class="text-lg text-gray-600 leading-relaxed mb-8">
          Chúng tôi đang thực hiện một số nâng cấp để cải thiện hệ thống và mang lại trải nghiệm tốt hơn cho bạn. Website sẽ sớm hoạt động trở lại bình thường.
          <br />
          Xin chân thành xin lỗi vì sự bất tiện này!
        </p>
  
        <!-- (Tùy chọn) Thời gian dự kiến -->
        <!--
        <p class="text-sm text-gray-500 mb-8">
          Dự kiến hoàn thành trong khoảng: <span class="font-medium">[Thời gian dự kiến, ví dụ: 30 phút]</span>
        </p>
        -->
  
        <!-- (Tùy chọn) Thông tin liên hệ -->
        <div class="text-sm text-gray-600 border-t border-gray-200 pt-6">
          <p class="mb-2">Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ:</p>
          <p>
            Email: <a href="mailto:hotro@caygiongtuananh.com" class="text-blue-600 hover:underline">hotro@caygiongtuananh.com</a>
          </p>
          <p>
            Điện thoại/Zalo: <a href="tel:0979072768" class="text-blue-600 hover:underline">0979 072 768</a>
          </p>
           <!-- Thêm link mạng xã hội nếu muốn -->
           <!--
           <div class="mt-4 flex justify-center space-x-4">
               <a href="..." aria-label="Facebook" class="text-gray-400 hover:text-blue-600"> <svg>...</svg> </a>
               <a href="..." aria-label="Zalo" class="text-gray-400 hover:text-blue-500"> <svg>...</svg> </a>
           </div>
           -->
        </div>
      </div>
  
      <!-- Footer nhỏ (Tùy chọn) -->
      <footer class="mt-8 text-xs text-gray-500">
        © {{ new Date().getFullYear() }} Cây Giống Tuấn Anh. All rights reserved.
      </footer>
    </div>
  </template>
  
  <script setup>
  // Đặt layout thành false nếu bạn không muốn header/footer mặc định hiển thị
  // Hoặc tạo một layout riêng 'minimal' chỉ có nội dung chính
  definePageMeta({
    layout: false // Bỏ layout mặc định (nếu có header/footer)
  });
  
  useHead({
    title: 'Website đang bảo trì - Cây Giống Tuấn Anh',
    meta: [
      { name: 'description', content: 'Website đang trong quá trình bảo trì để nâng cấp. Vui lòng quay lại sau.' },
      // Ngăn công cụ tìm kiếm index trang này (quan trọng)
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  });
  </script>
  
  <style scoped>
  /* Thêm style tùy chỉnh nếu cần */
  /* Ví dụ: Animation cho icon */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>
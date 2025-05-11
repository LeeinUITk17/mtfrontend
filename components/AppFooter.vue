<template>
  <footer class="bg-green-800 text-green-100 py-12 md:py-16">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="space-y-4 text-center md:text-left">
          <div class="text-xl md:text-2xl font-bold tracking-wider text-white mb-2">
            <span class="inline-block align-middle mr-2">🌱 Cao su giống Tuấn Anh</span>
          </div>
          <p class="text-sm md:text-base opacity-90">
            Khám phá, Chia sẻ & Nuôi dưỡng niềm đam mê cây xanh của bạn với chúng tôi.
          </p>
          <div class="flex justify-center md:justify-start space-x-6 mt-4">
            <a
              href="https://www.facebook.com/caosugiongtuananh"
              aria-label="Facebook"
              class="hover:text-white transition-colors duration-300"
            >
              <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png"
                alt="Facebook Logo"
                class="h-9 w-9"
              />
            </a>
            <a
              href="https://www.youtube.com/@caosugiongtuananh"
              aria-label="Youtube"
              class="hover:text-white transition-colors duration-300"
            >
              <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/skrccs2d36g5hmixyfrw.png"
                alt="Youtube Logo"
                class="h-9 w-9"
              />
            </a>
            <a
              href="https://zalo.me/0979072768"
              aria-label="Zalo"
              class="hover:text-white transition-colors duration-300"
            >
              <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png"
                alt="Zalo Logo"
                class="h-9 w-9 bg-white rounded"
              />
            </a>
            <a
              href="https://www.google.com/maps/place/Nh%C3%A0+v%C4%83n+h%C3%B3a+khu+ph%E1%BB%91+4/@11.428879,106.3867057,11z/data=!4m9!1m2!2m1!1zS2h1IHBo4buRIDA3LCBIdXnhu4duIENoxqFuIFRow6BuaCwgVOG7iW5oIELDrG5oIFBoxrDhu5tj!3m5!1s0x3174ad003c2c9b23:0x4857ff7ec4e5e056!8m2!3d11.4289184!4d106.5587397!16s%2Fg%2F11xcnjcdlp?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
              aria-label="Google Maps"
              class="hover:text-white transition-colors duration-300"
            >
              <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746093764/q8g8qpomxzkrz6wbr7h1.png"
                alt="Google Maps Logo"
                class="h-9 w-9"
              />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="text-center md:text-left">
          <h3 class="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/"
                class="hover:underline hover:text-white transition-colors duration-300"
              >
                Trang chủ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/plants"
                class="hover:underline hover:text-white transition-colors duration-300"
              >
                Danh mục Cây
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/posts"
                class="hover:underline hover:text-white transition-colors duration-300"
              >
                Bài viết & Mẹo
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/gallery"
                class="hover:underline hover:text-white transition-colors duration-300"
              >
                Về chúng tôi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="hover:underline hover:text-white transition-colors duration-300"
              >
                Liên hệ
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div class="text-center md:text-left">
          <h3 class="text-lg font-semibold mb-4 text-white">Thông tin liên hệ</h3>
          <ul class="space-y-2">
            <li class="opacity-90">
              <strong>Email:</strong> caosugiongtuananh@gmail.com
            </li>
            <li class="opacity-90">
              <strong>Điện thoại:</strong> 0979 072 768
            </li>
            <li class="opacity-90">
              <strong>Địa chỉ:</strong> Khu phố 07, Huyện Chơn Thành, Tỉnh Bình Phước
            </li>
          </ul>
        </div>

        <!-- Consultation Form -->
        <div class="text-center md:text-left">
          <h3 class="text-lg font-semibold mb-4 text-white">Nhận đăng ký tư vấn</h3>
          <p class="text-sm opacity-90 mb-4">Đăng ký tư vấn thông qua Zalo!</p>
          <form @submit.prevent="handlePhoneSubmit" class="flex flex-col sm:flex-row gap-2 mt-4">
            <input
              ref="phoneInputRef"
              type="tel"
              placeholder="Nhập số điện thoại của bạn"
              required
              pattern="(0[3|5|7|8|9])+([0-9]{8})\b"
              title="Nhập số điện thoại Việt Nam hợp lệ (VD: 09xxxxxxxx)"
              class="px-1 py-1 text-gray-800 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-green-600 border border-gray-300"
              aria-label="Nhập số điện thoại để nhận tư vấn qua Zalo"
            />
            <button
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold shadow-sm"
            >
              Nhận tư vấn Zalo
            </button>
          </form>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-12 pt-6 border-t border-green-700 text-center text-sm opacity-70">
        <p>© {{ new Date().getFullYear() }} Cây giống Tuấn Anh. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const phoneInputRef = ref(null);
const recipientZaloNumber = '0979072768';

const handlePhoneSubmit = () => {
  if (!phoneInputRef.value) return;

  const phoneNumber = phoneInputRef.value.value.trim();
  if (!phoneNumber) {
    Swal.fire('Lỗi', 'Vui lòng nhập số điện thoại của bạn.', 'warning');
    return;
  }

  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
  if (!phoneRegex.test(phoneNumber)) {
    Swal.fire('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại (VD: 09xxxxxxxx).', 'warning');
    return;
  }

  const messageText = encodeURIComponent(
    `Tôi muốn được tư vấn về cây giống. Số điện thoại của tôi là: ${phoneNumber}`
  );
  const zaloLink = `https://zalo.me/${recipientZaloNumber}?text=${messageText}`;

  Swal.fire({
    title: 'Mở Zalo?',
    text: `Bạn sẽ được chuyển đến Zalo để gửi tin nhắn tư vấn đến số ${recipientZaloNumber}.`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Mở Zalo',
    cancelButtonText: 'Hủy bỏ',
    customClass: {
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
      cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-3',
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(zaloLink, '_blank');
      if (phoneInputRef.value) {
        phoneInputRef.value.value = '';
      }
    }
  });
};
</script>

<style scoped>
</style>

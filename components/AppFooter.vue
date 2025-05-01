<template>
    <!-- Footer section with dark background and generous padding -->
    <footer class="bg-green-800 text-green-100 py-12 md:py-16">
      <div class="container mx-auto px-6">
        <!-- Grid layout for main footer content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
  
          <!-- Column 1: Brand Info & Social Links -->
          <div class="space-y-4 text-center md:text-left">
            <!-- Shop Name or Logo Area -->
            <div class="text-3xl md:text-4xl font-extrabold tracking-wider text-white mb-2">
               <!-- You can put a small plant icon here -->
               <span class="inline-block align-middle mr-2">🌱</span> Plant Shop
            </div>
            <!-- Tagline or brief description -->
            <p class="text-sm md:text-base opacity-90">
              Khám phá, Chia sẻ & Nuôi dưỡng niềm đam mê cây xanh của bạn với chúng tôi.
            </p>
            <!-- Social Media Links -->
            <!-- Assumes you have Font Awesome or similar installed and linked -->
            <div class="flex justify-center md:justify-start space-x-6 mt-4">
              <!-- Example: Replace # with actual URLs -->
              <a href="#" aria-label="Facebook" class="hover:text-white transition-colors duration-300">
                <i class="fab fa-facebook-f fa-lg"></i> <!-- Adjust size with fa-lg, fa-xl etc. -->
              </a>
              <a href="#" aria-label="Twitter" class="hover:text-white transition-colors duration-300">
                <i class="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" aria-label="Instagram" class="hover:text-white transition-colors duration-300">
                <i class="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" aria-label="Pinterest" class="hover:text-white transition-colors duration-300">
                <i class="fab fa-pinterest fa-lg"></i>
              </a>
            </div>
          </div>
  
          <!-- Column 2: Quick Links -->
          <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="hover:underline hover:text-white transition-colors duration-300">Trang chủ</NuxtLink></li>
              <li><NuxtLink to="/plants" class="hover:underline hover:text-white transition-colors duration-300">Danh mục Cây</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:underline hover:text-white transition-colors duration-300">Bài viết & Mẹo</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:underline hover:text-white transition-colors duration-300">Về chúng tôi</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:underline hover:text-white transition-colors duration-300">Liên hệ</NuxtLink></li>
            </ul>
          </div>
  
          <!-- Column 3: Contact Info -->
          <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 text-white">Thông tin liên hệ</h3>
            <ul class="space-y-2">
              <li class="opacity-90"><strong>Email:</strong> contact@plantshop.com</li>
              <li class="opacity-90"><strong>Điện thoại:</strong> +84 123 456 789</li>
              <li class="opacity-90"><strong>Địa chỉ:</strong> Số 123, Đường Cây Xanh, TP. Hồ Chí Minh</li>
            </ul>
             <!-- Optional: Add a map link -->
             <!-- <div class="mt-4"><a href="#" class="text-white hover:underline">Xem bản đồ</a></div> -->
          </div>
  
          <!-- Column 4: Newsletter Signup -->
          <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold mb-4 text-white">Nhận thông tin mới nhất</h3>
            <p class="text-sm opacity-90 mb-4">Đăng ký nhận bản tin để không bỏ lỡ các loại cây mới, mẹo chăm sóc và ưu đãi đặc biệt!</p>
            <form class="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                class="px-4 py-2 text-gray-800 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label="Enter your email for newsletter"
              />
              <button
                type="submit"
                class="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold"
              >
                Đăng ký
              </button>
            </form>
             <!-- Optional: Privacy text below form -->
             <!-- <p class="text-xs opacity-70 mt-2">We respect your privacy.</p> -->
          </div>
  
        </div>
  
        <!-- Copyright Row -->
        <div class="mt-12 pt-6 border-t border-green-700 text-center text-sm opacity-70">
          <p>© {{ new Date().getFullYear() }} Plant Shop. Tất cả quyền được bảo lưu.</p>
          <!-- Optional: Add 'Powered by...' text here if desired -->
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // In Nuxt 3 with Composition API, <script setup> is sufficient for static components.
  // No specific logic needed here unless you handle form submission etc.
  </script>
  
  <style scoped>
  /*
    Add any custom styles specific to this component here.
    Tailwind CSS utility classes handle most of the styling and responsiveness.
  */
  
  /* Example if you need to target specific elements not covered by Tailwind */
  /*
  footer a {
    // Add custom link styles if needed
  }
  */
  </style>
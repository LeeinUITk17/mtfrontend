<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Transition name="fade">
        <div
          v-if="message"
          :class="[messageContainerClasses]"
          class="rounded-lg p-4 mb-6 transition-all duration-300 ease-in-out"
        >
          {{ message }}
        </div>
      </Transition>
  
      <div class="space-y-6 rounded-xl">
        <div class="space-y-1">
          <label for="post-title" class="block text-sm font-medium text-gray-700">
            Tiêu đề
            <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="post-title"
            v-model="formData.title"
            required
            class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 transition duration-200 sm:text-sm"
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>
  
        <div class="space-y-1">
          <label for="post-content" class="block text-sm font-medium text-gray-700">
            Nội dung
            <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 rounded-lg border border-gray-300 overflow-hidden transition duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <ClientOnly>
              <ClientOnlyTinyMCE
                v-model="formData.content"
                :upload-url="`${config.public.apiBase}/upload/image`"
                :api-key="config.public.tinymceApiKey"
                @editor-ready="handleTinyMCEInitialized"
                @load-error="handleTinyMCELoadError"
                @editor-content-update="handleEditorContentUpdate"
              />
            </ClientOnly>
          </div>
        </div>
  
        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            <span>{{ buttonText }}</span>
            <svg
              v-if="loading"
              class="animate-spin ml-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  import ClientOnlyTinyMCE from '~/components/common/ClientOnlyTinyMCE.vue';
  
  const config = useRuntimeConfig();
  const { user: loggedInUser } = useAuth();
  
  const props = defineProps({
    initialData: {
      type: Object,
      default: null,
    },
  });
  
  const formData = reactive({
    title: '',
    content: '',
  });
  
  const loading = ref(false);
  const message = ref(null);
  const messageType = ref('error');
  const editorRef = ref(null);
  const hasContent = ref(false);
  
  const isFormValid = computed(() => hasContent.value && formData.title.trim());
  const buttonText = computed(() => loading.value ? 'Đang xử lý...' : props.initialData ? 'Cập nhật' : 'Đăng bài');
  const messageContainerClasses = computed(() => [
    'p-4 rounded-md',
    messageType.value === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
  ]);
  
  watch(
    () => props.initialData,
    (newData) => {
      if (newData) {
        formData.title = newData.title || '';
        formData.content = newData.content || '';
      }
    },
    { immediate: true }
  );
  
  const checkContent = (content) => {
    hasContent.value = content.trim() !== '' && content !== '<p></p>';
  };
  
  const handleEditorContentUpdate = (content) => {
    checkContent(content);
  };
  
  const handleTinyMCEInitialized = (editor) => {
    editorRef.value = editor;
    checkContent(editor.getContent());
    
    if (formData.content && editor.getContent() !== formData.content) {
      editor.setContent(formData.content);
    }
  };
  
  const handleTinyMCELoadError = (error) => {
    console.error('TinyMCE load error:', error);
    message.value = 'Lỗi tải trình soạn thảo. Vui lòng tải lại trang.';
    messageType.value = 'error';
  };
  
  const handleSubmit = async () => {
    if (!editorRef.value) {
      showMessage('Trình soạn thảo chưa sẵn sàng. Vui lòng chờ...', 'error');
      return;
    }
  
    loading.value = true;
    message.value = null;
  
    const currentContent = editorRef.value.getContent();
    
    if (!validateForm(currentContent)) {
      loading.value = false;
      return;
    }
  
    try {
      await processFormSubmission(currentContent);
      handleSuccess();
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };
  
  const validateForm = (content) => {
    if (!formData.title.trim() || !content.trim() || content === '<p></p>') {
      showMessage('Vui lòng nhập tiêu đề và nội dung bài viết.', 'error');
      return false;
    }
  
    if (!props.initialData && !loggedInUser.value?.id) {
      showMessage('Vui lòng đăng nhập để đăng bài viết.', 'error');
      return false;
    }
  
    return true;
  };
  
  const processFormSubmission = async (content) => {
    const postData = {
      title: formData.title.trim(),
      content: content,
      ...(props.initialData ? {} : { userId: loggedInUser.value.id }),
    };
  
    const url = props.initialData?.id 
      ? `${config.public.apiBase}/posts/${props.initialData.id}`
      : `${config.public.apiBase}/posts`;
  
    const method = props.initialData?.id ? 'PATCH' : 'POST';
  
    await $fetch(url, {
      method,
      body: postData,
    });
  };
  
  const handleSuccess = () => {
    const successMessage = props.initialData 
      ? 'Cập nhật bài viết thành công!'
      : 'Đăng bài viết thành công!';
  
    showMessage(successMessage, 'success');
  
    if (!props.initialData) {
      resetForm();
    }
  
    setTimeout(() => {
      navigateTo('/admin/posts');
    }, 1500);
  };
  
  const handleError = (error) => {
    console.error('API submission error:', error);
    const errorMessage = error.data?.message || error.message || 'Đã xảy ra lỗi khi gửi bài viết.';
    showMessage(errorMessage, 'error');
  };
  
  const showMessage = (text, type) => {
    message.value = text;
    messageType.value = type;
  };
  
  const resetForm = () => {
    formData.title = '';
    formData.content = '';
    editorRef.value.setContent('');
  };
  </script>

  
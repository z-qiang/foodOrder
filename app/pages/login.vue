<template>
  <v-container fluid class="pa-0 login-page bg-background d-flex align-center justify-center">
    <v-card flat rounded="xl" class="login-card pa-8 bg-white elevation-10" width="90%" max-width="400">
      <div class="logo-circle mx-auto mb-8 elevation-4">
        <span class="logo-text">美味</span>
      </div>
      
      <h2 class="text-h5 font-weight-black text-center text-primary mb-10">
        {{ isLogin ? '登录账号' : '注册账号' }}
      </h2>
      
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.username"
          label="账号"
          placeholder="请输入账号"
          variant="underlined"
          color="primary"
          class="mb-4"
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="form.password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          variant="underlined"
          color="primary"
          class="mb-10"
          hide-details
        ></v-text-field>

        <v-btn
          block
          size="large"
          color="primary"
          variant="flat"
          rounded="pill"
          class="font-weight-black elevation-6 mb-6"
          type="submit"
          ripple
        >
          {{ isLogin ? '登录' : '注册并登录' }}
        </v-btn>
      </v-form>
      
      <div class="text-center">
        <v-btn 
          variant="text" 
          color="secondary" 
          size="small" 
          class="text-caption font-weight-bold"
          @click="isLogin = !isLogin"
        >
          {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#imports';

// In Nuxt, to bypass layout for login
definePageMeta({
  layout: false
});

const isLogin = ref(true);
const form = ref({ username: '', password: '' });
const router = useRouter();

useHead({
  title: isLogin.value ? '登录 - 美味点餐系统' : '注册 - 美味点餐系统',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const authUser = useCookie('authUser');

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    alert('请输入账号和密码');
    return;
  }
  
  const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register';
  
  try {
    const res = await $fetch(endpoint, {
      method: 'POST',
      body: form.value
    });
    
    if (res.success) {
      const authUser = useCookie('authUser');
      const userNickName = useCookie('userNickName');
      authUser.value = res.data.username;
      userNickName.value = res.data.nickName;
      navigateTo('/', { replace: true });
    } else {
      alert(res.error || '失败，请重试');
    }
  } catch (err) {
    alert('网络或服务器错误');
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background-image: radial-gradient(circle at 20% 20%, rgba(var(--v-theme-primary), 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 80% 80%, rgba(var(--v-theme-primary), 0.05) 0%, transparent 40%);
}

.login-card {
  border: 4px solid white !important;
}

.logo-circle {
  width: 72px;
  height: 72px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.05);
}

.logo-text {
  font-size: 24px;
  font-weight: 900;
  color: rgb(var(--v-theme-primary));
  transform: rotate(-5deg);
}

:deep(.v-field__label) {
  font-weight: 800 !important;
  color: rgb(var(--v-theme-secondary)) !important;
  font-size: 14px !important;
}
</style>

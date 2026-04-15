<template>
  <v-container fluid class="pa-0 home-page">
    <!-- Splash Screen -->
    <v-fade-transition>
      <div v-if="showSplash && !isSplashFinished" class="splash-screen">
        <div class="splash-content">
          <div class="logo-circle">
            <span class="logo-text">美味</span>
          </div>
          <h1 class="splash-title text-primary">美味点餐系统</h1>
          <p class="splash-subtitle text-secondary">用心做菜，让您吃得放心</p>
        </div>
        <div class="splash-footer text-primary opacity-30">Powered by Vuetify 3 & Zhongguose</div>
      </div>
    </v-fade-transition>

    <!-- Main Home Content -->
    <div class="home-content" v-show="!showSplash || isSplashFinished">
      <!-- Top Member Header -->
      <header class="home-header px-6 py-10 bg-header-home rounded-b-xl border-b border-white-opacity-20 shadow-sm">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h2 class="text-h5 font-weight-black text-primary">你好，{{ userNickName || '美味食客' }} 👋</h2>
            <p class="text-caption text-secondary">今天想吃点什么？</p>
          </div>
          <v-avatar size="52" border="3 white solid" class="elevation-4">
            <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </v-avatar>
        </div>
      </header>

      <!-- Banner Area -->
      <div class="px-6 my-8">
        <v-img
          src="https://picsum.photos/id/292/600/300"
          height="160"
          cover
          rounded="xl"
          class="elevation-6 border-white border-2"
        />
      </div>

      <!-- Main Order Action Area -->
      <div class="px-6 mb-8">
        <v-card
          flat
          rounded="xl"
          class="order-card-vuetify mb-6 pa-8 d-flex align-center justify-space-between text-white"
          color="primary"
          @click="goToMenu"
          ripple
        >
          <div class="order-content">
            <h3 class="text-h4 font-weight-black mb-1">去点餐</h3>
            <p class="text-body-2 opacity-70">美味不用等，点击即享</p>
          </div>
          <v-avatar color="white" size="64" class="opacity-90">
            <v-icon size="32" color="primary">mdi-shopping-outline</v-icon>
          </v-avatar>
        </v-card>
        
        <!-- Member Points Bar -->
        <v-card flat rounded="xl" class="pa-6 d-flex align-center bg-on-surface-variant elevation-1">
          <div class="d-flex flex-column align-center flex-grow-1 border-e-sm border-grey-lighten-2">
            <span class="text-h6 font-weight-black text-primary">88</span>
            <span class="text-caption text-secondary font-weight-bold">积分</span>
          </div>
          <div class="d-flex flex-column align-center flex-grow-1 border-e-sm border-grey-lighten-2">
            <span class="text-h6 font-weight-black text-primary">2</span>
            <span class="text-caption text-secondary font-weight-bold">优惠券</span>
          </div>
          <div class="d-flex align-center justify-end flex-grow-1 pl-4">
            <v-chip size="default" color="primary" variant="flat" class="font-weight-black rounded-lg elevation-2">
              <v-icon start size="18">mdi-qrcode</v-icon>
              会员码
            </v-chip>
          </div>
        </v-card>
      </div>

      <div class="py-10"></div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useState } from '#imports';

const router = useRouter();

useSeoMeta({
  title: '美味点餐系统 - 开启您的美食之旅',
  ogTitle: '美味点餐系统 - 开启您的美食之旅',
  description: '欢迎来到美味点餐系统。我们为您提供最优质的在线点餐体验，支持快速外送与到店自取。',
  ogDescription: '欢迎来到美味点餐系统。我们为您提供最优质的在线点餐体验，支持快速外送与到店自取。',
  ogImage: 'https://picsum.photos/id/292/600/300',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.sz-fcsk.com/order/' }
  ]
})

// Get user nickName from cookie
const userNickName = useCookie('userNickName');

// Use cookie to track if splash was seen in this session
const splashSeen = useCookie('splash_seen');
const showSplash = ref(!splashSeen.value);

onMounted(() => {
  if (showSplash.value) {
    setTimeout(() => {
      showSplash.value = false;
      splashSeen.value = 'true';
    }, 2500);
  }
});

const goToMenu = () => {
  router.push('/menu');
};
</script>

<style scoped>
.home-page { 
  height: 100vh; 
  background-color: rgb(var(--v-theme-background));
}

/* Splash Screen */
.splash-screen {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgb(var(--v-theme-background));
  z-index: 9999; display: flex; flex-direction: column;
  align-items: center; justify-content: space-between; padding: 60px 20px 40px;
}
.splash-content { display: flex; flex-direction: column; align-items: center; margin-top: 20vh; }
.logo-circle { width: 100px; height: 100px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 24px; border: 1px solid rgba(0,0,0,0.03); }
.logo-text { font-size: 36px; font-weight: 900; color: rgb(var(--v-theme-primary)); transform: rotate(-5deg); }
.splash-title { font-size: 24px; font-weight: 800; margin: 0 0 8px; letter-spacing: 1px; }
.splash-subtitle { font-size: 14px; margin: 0; letter-spacing: 4px; font-weight: 300; }
.splash-footer { font-size: 11px; font-weight: 600; letter-spacing: 1px; }

.home-header { 
  position: sticky; 
  top: 0; 
  z-index: 100;
  border-bottom: 2px solid rgba(0,0,0,0.02);
}
.home-content { height: 100%; overflow-y: auto; }

.order-card-vuetify {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.order-card-vuetify:active {
  transform: scale(0.97);
}
</style>

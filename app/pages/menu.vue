<template>
  <v-container fluid class="pa-0 page-menu bg-background">
    <header class="header bg-header-menu px-6 py-8 rounded-b-xl shadow-sm">
      <div class="shop-info">
        <h1 class="text-h5 font-weight-black mb-1 text-primary">美味点餐系统</h1>
        <div class="d-flex ga-2 mb-2">
          <v-chip size="x-small" color="white" class="text-primary font-weight-bold" variant="flat">支持外送</v-chip>
          <v-chip size="x-small" color="white" class="text-primary font-weight-bold" variant="flat">自取限免</v-chip>
        </div>
        <p class="text-caption text-secondary font-weight-bold opacity-80">公告：用心做菜，让您吃得放心！满减活动进行中！</p>
      </div>
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索菜品名称..."
        variant="solo-filled"
        density="compact"
        flat
        rounded="pill"
        hide-details
        clearable
        class="mt-4 search-field"
        bg-color="white"
      ></v-text-field>
    </header>

    <div class="content-wrapper d-flex" v-if="!pending">
      <!-- Left Sidebar (hidden when searching) -->
      <aside v-if="!isSearching" class="sidebar-vuetify border-e bg-on-surface-variant">
        <v-list density="compact" nav class="pa-0 bg-transparent">
          <v-list-item
            v-for="cat in categories"
            :key="cat.id"
            :active="activeCat === cat.id"
            @click="scrollToCat(cat.id)"
            class="cat-item-vuetify py-5 text-center rounded-0"
            color="primary"
            variant="plain"
          >
            <v-list-item-title class="text-caption font-weight-black">{{ cat.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </aside>

      <!-- Right Dishes Area -->
      <main class="dishes-area flex-grow-1 px-4" ref="scrollArea" @scroll="onScroll">
        <!-- Search Results Mode -->
        <template v-if="isSearching">
          <div v-if="filteredDishes.length === 0" class="d-flex flex-column align-center justify-center py-16 text-secondary">
            <v-icon size="48" class="opacity-20 mb-4">mdi-magnify</v-icon>
            <p class="text-subtitle-2 font-weight-bold">未找到"{{ searchQuery }}"相关菜品</p>
          </div>
          <div v-else>
            <h2 class="text-overline font-weight-black text-secondary my-8 px-2">搜索结果 ({{ filteredDishes.length }})</h2>
            <div v-for="dish in filteredDishes" :key="dish.id" class="dish-card-vuetify mb-6 pa-3 bg-white rounded-xl shadow-sm d-flex align-center">
              <v-img :src="dish.image" width="94" height="94" cover rounded="lg" class="bg-grey-lighten-4 flex-shrink-0 elevation-2" />
              <div class="dish-info flex-grow-1 ml-4 d-flex flex-column h-full">
                <h3 class="text-subtitle-1 font-weight-black text-primary">{{ dish.name }}</h3>
                <p class="text-caption text-secondary line-clamp-2 mb-2" style="height: 32px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ dish.desc }}</p>
                <div class="d-flex justify-space-between align-end mt-auto">
                  <span class="text-h6 font-weight-black text-primary">
                    <small class="text-caption mr-0.5">¥</small>{{ dish.price }}
                  </span>
                  <v-btn icon="mdi-plus" size="x-small" color="primary" rounded="lg" variant="flat" elevation="2" @click.stop="addToCart(dish)"></v-btn>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Normal Category Mode -->
        <template v-else>
          <div v-for="cat in categories" :key="cat.id" :id="'cat-' + cat.id" class="cat-section">
            <h2 class="text-overline font-weight-black text-secondary my-8 px-2">{{ cat.name }}</h2>
            <div v-for="dish in getDishesByCat(cat.id)" :key="dish.id" class="dish-card-vuetify mb-6 pa-3 bg-white rounded-xl shadow-sm d-flex align-center">
              <v-img :src="dish.image" width="94" height="94" cover rounded="lg" class="bg-grey-lighten-4 flex-shrink-0 elevation-2" />
              <div class="dish-info flex-grow-1 ml-4 d-flex flex-column h-full">
                <h3 class="text-subtitle-1 font-weight-black text-primary">{{ dish.name }}</h3>
                <p class="text-caption text-secondary line-clamp-2 mb-2" style="height: 32px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ dish.desc }}</p>
                <div class="d-flex justify-space-between align-end mt-auto">
                  <span class="text-h6 font-weight-black text-primary">
                    <small class="text-caption mr-0.5">¥</small>{{ dish.price }}
                  </span>
                  <v-btn icon="mdi-plus" size="x-small" color="primary" rounded="lg" variant="flat" elevation="2" @click.stop="addToCart(dish)"></v-btn>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="bottom-padding"></div>
      </main>
    </div>
    <!-- Random Recommend FAB -->
    <v-btn
      icon="mdi-dice-multiple"
      color="accent"
      size="large"
      class="fab-recommend elevation-8"
      @click="randomRecommend"
    ></v-btn>

    <!-- Random Recommend Dialog -->
    <v-dialog v-model="showRecommendDialog" max-width="380" persistent>
      <v-card rounded="xl" class="pa-2 recommend-card">
        <v-card-title class="text-h6 font-weight-black text-center pt-6 d-flex align-center justify-center ga-2">
          <v-icon color="accent" size="24">mdi-silverware-fork-knife</v-icon>
          今日推荐
        </v-card-title>
        <v-card-subtitle class="text-center text-secondary pb-2">为您随机推荐两道美味</v-card-subtitle>
        <v-card-text class="pt-4 pb-2">
          <div v-for="dish in recommendedDishes" :key="dish.id" class="d-flex align-center mb-4 pa-3 bg-background rounded-xl">
            <v-img :src="dish.image" width="72" height="72" cover rounded="lg" class="bg-grey-lighten-4 flex-shrink-0 elevation-1" />
            <div class="ml-4 flex-grow-1">
              <h4 class="text-subtitle-2 font-weight-black text-primary">{{ dish.name }}</h4>
              <p class="text-caption text-secondary font-weight-bold mt-1 text-truncate">{{ dish.desc }}</p>
              <span class="text-subtitle-2 font-weight-black text-primary mt-1 d-block">
                <small class="text-caption">¥</small>{{ dish.price }}
              </span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pb-6 ga-2 flex-wrap px-4">
          <v-btn
            variant="text"
            color="secondary"
            class="px-4 font-weight-bold"
            @click="showRecommendDialog = false"
          >取消</v-btn>
          <v-btn
            variant="outlined"
            color="accent"
            rounded="pill"
            class="px-6 font-weight-black border-2"
            @click="randomRecommend"
          >
            <v-icon size="18" class="mr-1">mdi-dice-3</v-icon>
            换一换
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="px-6 font-weight-black elevation-2"
            @click="addRecommendToCart"
          >
            <v-icon size="18" class="mr-1">mdi-cart-plus</v-icon>
            加入购物车
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Cart :cartItems="cartItems" @update="updateCart" @clear="clearCart" @submit="onSubmit" />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useFetch, useState } from '#imports';

const router = useRouter();

useSeoMeta({
  title: '美食菜单 - 美味点餐系统',
  ogTitle: '美食菜单 - 美味点餐系统',
  description: '浏览我们的精选菜单，发现各种美味佳肴。在这里下订单，享受快捷的派送服务。',
  ogDescription: '浏览我们的精选菜单，发现各种美味佳肴。在这里下订单，享受快捷的派送服务。',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.sz-fcsk.com/order/menu' }
  ]
})

const { data, pending } = await useFetch('/api/menu');

const categories = computed(() => data.value?.data?.categories || []);
const dishes = computed(() => data.value?.data?.dishes || []);

// ==================== Search ====================
const searchQuery = ref('');
const isSearching = computed(() => !!searchQuery.value?.trim());
const filteredDishes = computed(() => {
  const q = searchQuery.value?.trim().toLowerCase();
  if (!q) return [];
  return dishes.value.filter(d =>
    d.name.toLowerCase().includes(q) || (d.desc && d.desc.toLowerCase().includes(q))
  );
});

const activeCat = ref(null);

watch(categories, (newCats) => {
  if (newCats.length > 0 && !activeCat.value) {
    activeCat.value = newCats[0].id;
  }
}, { immediate: true });

const getDishesByCat = (catId) => {
  return dishes.value.filter(d => d.categoryId === catId);
};

const scrollArea = ref(null);
const isScrollingProgrammatically = ref(false);

const scrollToCat = (catId) => {
  activeCat.value = catId;
  isScrollingProgrammatically.value = true;
  const el = document.getElementById('cat-' + catId);
  if (el && scrollArea.value) {
    scrollArea.value.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    setTimeout(() => {
      isScrollingProgrammatically.value = false;
    }, 500); 
  }
};

const onScroll = () => {
  if (isScrollingProgrammatically.value || !scrollArea.value) return;
  const containerTop = scrollArea.value.scrollTop;
  let currentActive = categories.value[0]?.id;
  
  categories.value.forEach((cat) => {
    const el = document.getElementById('cat-' + cat.id);
    if (el && (el.offsetTop - 10 <= containerTop)) {
      currentActive = cat.id;
    }
  });
  
  activeCat.value = currentActive;
};

const cartItems = useState('cartItems', () => []);

const addToCart = (dish) => {
  const exist = cartItems.value.find(item => item.id === dish.id);
  if (exist) {
    exist.count += 1;
  } else {
    cartItems.value.push({ ...dish, count: 1 });
  }
};

const updateCart = (dish, delta) => {
  const idx = cartItems.value.findIndex(item => item.id === dish.id);
  if (idx > -1) {
    cartItems.value[idx].count += delta;
    if (cartItems.value[idx].count <= 0) {
      cartItems.value.splice(idx, 1);
    }
  }
};

const clearCart = () => {
  cartItems.value = [];
};

const onSubmit = async (payload) => {
  const res = await $fetch('/api/order', {
    method: 'POST',
    body: payload
  });
  
  if (res.success) {
    clearCart();
    router.push({ path: '/order-success', query: { id: res.data.orderId } });
  } else {
    alert('下单失败：' + res.error);
  }
};

// ==================== Random Recommend ====================
const showRecommendDialog = ref(false);
const recommendedDishes = ref([]);

const randomRecommend = () => {
  const allDishes = dishes.value;
  if (allDishes.length < 2) {
    recommendedDishes.value = [...allDishes];
  } else {
    const shuffled = [...allDishes].sort(() => Math.random() - 0.5);
    recommendedDishes.value = shuffled.slice(0, 2);
  }
  showRecommendDialog.value = true;
};

const addRecommendToCart = () => {
  recommendedDishes.value.forEach(dish => addToCart(dish));
  showRecommendDialog.value = false;
};
</script>

<style scoped>
.page-menu { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
.header { border-bottom: 1px solid rgba(0,0,0,0.05); z-index: 10; border-radius: 0 0 24px 24px; }
.content-wrapper { flex: 1; overflow: hidden; }

.search-field :deep(.v-field) {
  font-size: 14px;
  font-weight: 600;
}

.sidebar-vuetify { width: 96px; height: 100%; overflow-y: auto; }
.cat-item-vuetify { opacity: 0.5; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.cat-item-vuetify.v-list-item--active { opacity: 1; background: rgb(var(--v-theme-background)) !important; }
.cat-item-vuetify.v-list-item--active::before { content: ''; position: absolute; left: 0; top: 18px; bottom: 18px; width: 4px; background: rgb(var(--v-theme-primary)); border-radius: 0 4px 4px 0; }

.dishes-area { height: 100%; overflow-y: auto; scroll-behavior: smooth; }
.dish-card-vuetify { transition: transform 0.2s; border: 1px solid rgba(0,0,0,0.02); }
.dish-card-vuetify:active { transform: scale(0.98); }

.bottom-padding { height: 160px; }
.shadow-sm { box-shadow: 0 2px 10px rgba(0,0,0,0.02) !important; }
.border-2 { border-width: 2px !important; }

.fab-recommend {
  position: fixed;
  bottom: 100px;
  right: 16px;
  z-index: 50;
}

.recommend-card {
  overflow: visible;
}
</style>

<template>
  <div class="order-success-page">
    <div class="result-card">
      <div class="icon-success">✓</div>
      <h2 class="title">下单成功</h2>
      <p class="order-id">订单号：{{ orderId }}</p>
      <p class="desc">您的订单已经飞速传送至厨房，即将为您烹饪！</p>
    </div>
    
    <div class="actions">
      <button class="btn primary" @click="backHome">继续点单</button>
      <button class="btn secondary" @click="viewOrders">查看订单</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

useHead({
  title: '下单成功 - 美味点餐系统',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const orderId = computed(() => route.query.id);

const backHome = () => {
  router.push('/');
};

const viewOrders = () => {
  router.push('/order');
};
</script>

<style scoped>
.order-success-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 80vh; background: #f5f5f5; padding: 20px; }
.result-card { background: #fff; width: 100%; max-width: 400px; padding: 40px 20px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
.icon-success { width: 64px; height: 64px; background: #07c160; color: #fff; border-radius: 50%; font-size: 40px; display: flex; justify-content: center; align-items: center; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3); }
.title { font-size: 24px; font-weight: bold; color: #333; margin: 0 0 12px; }
.order-id { font-size: 14px; color: #666; margin: 0 0 16px; background: #f8f8f8; padding: 4px 12px; border-radius: 4px; }
.desc { font-size: 14px; color: #999; text-align: center; line-height: 1.5; }
.actions { margin-top: 40px; width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 12px; }
.btn { width: 100%; height: 48px; border-radius: 24px; font-size: 16px; font-weight: bold; border: none; cursor: pointer; outline: none; }
.btn.primary { background: #ffd161; color: #333; box-shadow: 0 4px 12px rgba(255, 209, 97, 0.3); }
.btn.secondary { background: #fff; color: #666; border: 1px solid #ddd; }
</style>

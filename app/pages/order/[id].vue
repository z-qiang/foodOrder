<template>
  <v-container fluid class="pa-0 order-detail-page bg-background">
    <header class="header bg-header-order px-4 py-6 border-b border-faint rounded-b-xl shadow-sm d-flex align-center">
      <v-btn icon="mdi-chevron-left" variant="text" color="primary" @click="router.back()"></v-btn>
      <h1 class="text-h6 font-weight-black flex-grow-1 text-center pr-10 text-primary">订单详情</h1>
    </header>

    <div class="content px-5 py-6" v-if="!pending && order">
      <!-- Status Card -->
      <v-card flat rounded="xl" class="mb-6 pa-6 bg-white shadow-sm border-sm border-white">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="d-flex align-center ga-2">
            <v-icon size="24" :color="order.status === 'PAY_SUCCESS' ? 'success' : 'secondary'">
              {{ order.status === 'PAY_SUCCESS' ? 'mdi-check-circle' : 'mdi-clock-outline' }}
            </v-icon>
            <span class="text-h6 font-weight-black text-primary">{{ statusText(order.status) }}</span>
          </div>
          <span class="text-caption text-secondary font-weight-bold">感谢您的使用</span>
        </div>
        
        <v-divider class="my-4 border-faint"></v-divider>
        
        <div class="d-flex flex-column ga-2">
          <div class="d-flex justify-space-between text-caption font-weight-bold">
            <span class="text-secondary">订单编号</span>
            <span class="text-primary">{{ order.orderId }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption font-weight-bold">
            <span class="text-secondary">下单时间</span>
            <span class="text-primary">{{ formatDate(order.timestamp) }}</span>
          </div>
        </div>
      </v-card>

      <!-- Items List -->
      <v-card flat rounded="xl" class="mb-6 pa-6 bg-white shadow-sm border-sm border-white">
        <h3 class="text-subtitle-1 font-weight-black text-primary mb-4">订单商品</h3>
        
        <div class="order-items d-flex flex-column ga-6">
          <div v-for="item in order.items" :key="item.id" class="d-flex align-center">
            <v-img :src="item.image" width="64" height="64" cover rounded="lg" class="bg-grey-lighten-4 elevation-1" />
            <div class="item-info ml-4 flex-grow-1">
              <div class="d-flex justify-space-between align-start">
                <h4 class="text-subtitle-2 font-weight-black text-primary">{{ item.name }}</h4>
                <span class="text-subtitle-2 font-weight-black text-primary">¥{{ item.price * item.count }}</span>
              </div>
              <div class="text-caption text-secondary font-weight-bold mt-1">x{{ item.count }}</div>
            </div>
          </div>
        </div>

        <v-divider class="my-6 border-faint"></v-divider>

        <div class="price-details d-flex flex-column ga-3">
          <div class="d-flex justify-space-between text-caption font-weight-bold text-secondary">
            <span>商品合计</span>
            <span>¥{{ order.totalAmount }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption font-weight-bold text-secondary">
            <span>配送费</span>
            <span>¥0</span>
          </div>
          <div class="d-flex justify-space-between align-center mt-2">
            <span class="text-subtitle-1 font-weight-black text-primary">实付金额</span>
            <span class="text-h5 font-weight-black text-primary">¥{{ order.totalAmount }}</span>
          </div>
        </div>
      </v-card>

      <!-- Action Buttons -->
      <div class="d-flex ga-4 mb-10">
        <v-btn block color="primary" variant="flat" rounded="pill" height="52" class="font-weight-black elevation-2" @click="router.push('/menu')">
          再来一单
        </v-btn>
      </div>
      
      <div class="py-10"></div>
    </div>

    <div v-else-if="pending" class="d-flex justify-center align-center py-20">
      <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
    </div>

    <div v-else class="text-center py-20 text-secondary">
      <p>订单信息加载失败</p>
      <v-btn color="primary" variant="text" @click="router.back()" class="mt-4">返回列表</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, useFetch } from '#imports';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const { data, pending } = await useFetch(`/api/order/${id}`);
const order = computed(() => data.value?.data);

const formatDate = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const statusText = (status) => {
  const map = {
    'PAY_SUCCESS': '已完成',
    'PENDING': '进行中',
    'CANCELLED': '已取消'
  };
  return map[status] || status;
};
</script>

<style scoped>
.order-detail-page { min-height: 100vh; overflow-y: auto; }
.header { position: sticky; top: 0; z-index: 10; }
.border-faint { border-color: rgba(0,0,0,0.03) !important; }
.shadow-sm { box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important; }
</style>

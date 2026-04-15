<template>
  <v-container fluid class="pa-0 orders-page bg-background">
    <header class="header bg-header-order px-6 py-8 border-b border-faint rounded-b-xl shadow-sm">
      <h1 class="text-h6 font-weight-black text-center text-primary">我的订单</h1>
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索订单号、菜品名..."
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

    <div class="content px-5 py-6">
      <div v-if="pending" class="d-flex justify-center align-center py-20">
        <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
      </div>
      
      <div v-else-if="filteredOrders.length === 0 && searchQuery" class="empty-state d-flex flex-column align-center justify-center py-20 text-secondary">
        <v-icon size="48" class="opacity-20 mb-4">mdi-magnify</v-icon>
        <p class="text-subtitle-2 font-weight-bold">未找到相关订单</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="empty-state d-flex flex-column align-center justify-center py-20 text-secondary">
        <v-icon size="80" class="opacity-20 mb-6">mdi-package-variant-closed</v-icon>
        <p class="text-subtitle-1 font-weight-bold">暂无订单记录</p>
        <v-btn to="/menu" color="primary" variant="flat" rounded="pill" class="mt-6 px-10 font-weight-black elevation-2">去点餐</v-btn>
      </div>

      <div v-else class="order-list">
        <v-card v-for="order in filteredOrders" :key="order.orderId" flat rounded="xl" class="mb-5 pa-5 bg-white border-sm border-white shadow-sm" @click="goToDetail(order.orderId)" ripple>
          <div class="d-flex justify-space-between align-center mb-5 pb-4 border-faint-b">
            <span class="text-caption font-weight-bold text-secondary">{{ formatDate(order.timestamp) }}</span>
            <v-chip
              size="x-small"
              :color="order.status === 'PAY_SUCCESS' ? 'success' : 'secondary'"
              variant="flat"
              class="font-weight-black px-3"
            >
              {{ statusText(order.status) }}
            </v-chip>
          </div>

          <div class="d-flex justify-space-between align-center px-1">
            <div class="d-flex ga-3 overflow-hidden">
              <v-img
                v-for="item in order.items.slice(0, 3)"
                :key="item.id"
                :src="item.image"
                width="52"
                height="52"
                cover
                rounded="lg"
                class="bg-on-surface-variant elevation-1"
              />
              <div v-if="order.items.length > 3" class="d-flex align-center text-secondary text-h6 font-weight-black ml-1">...</div>
            </div>
            
            <div class="text-right">
              <div class="text-caption text-secondary font-weight-black mb-1">共 {{ order.items.reduce((acc, i) => acc + i.count, 0) }} 件</div>
              <div class="text-h6 font-weight-black text-primary">¥{{ order.totalAmount }}</div>
            </div>
          </div>

          <div class="d-flex justify-end ga-3 mt-8 pt-4 border-faint-t">
            <v-btn
              variant="text"
              color="secondary"
              size="small"
              rounded="pill"
              class="px-6 font-weight-black"
              :loading="deletingId === order.orderId"
              @click.stop="openDeleteDialog(order.orderId)"
            >删除</v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              rounded="pill"
              class="px-6 font-weight-black border-2"
              @click.stop="reOrder(order)"
            >再来一单</v-btn>
          </div>
        </v-card>
      </div>
    </div>
    
    <div class="py-12"></div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="320" persistent>
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-black text-center pt-4">确认删除？</v-card-title>
        <v-card-text class="text-center text-secondary py-4">
          删除后将无法找回此订单记录。
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn
            variant="text"
            color="secondary"
            class="px-6 font-weight-bold"
            @click="showConfirmDialog = false"
          >取消</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="px-8 font-weight-black elevation-2"
            @click="confirmDelete"
          >确定删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
      color="primary"
      rounded="pill"
      class="mb-12"
      elevation="12"
    >
      <div class="text-center font-weight-black py-1">
        <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useFetch } from '#imports';

const { data, pending, refresh } = await useFetch('/api/order');

const orders = computed(() => data.value?.data || []);

const formatDate = (ts) => {
  const date = new Date(ts);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const statusText = (status) => {
  const map = {
    'PAY_SUCCESS': '已完成',
    'PENDING': '进行中',
    'CANCELLED': '已取消'
  };
  return map[status] || status;
};

// ==================== Search ====================
const searchQuery = ref('');
const filteredOrders = computed(() => {
  const q = searchQuery.value?.trim().toLowerCase();
  if (!q) return orders.value;
  return orders.value.filter(order => {
    // Match order ID
    if (order.orderId.toLowerCase().includes(q)) return true;
    // Match item names
    if (order.items.some(item => item.name.toLowerCase().includes(q))) return true;
    // Match date/time (e.g. "2026-04", "04-15", "14:30")
    if (formatDate(order.timestamp).includes(q)) return true;
    // Match status text (e.g. "已完成")
    if (statusText(order.status).includes(q)) return true;
    return false;
  });
});

const router = useRouter();
const goToDetail = (orderId) => {
  router.push(`/order/${orderId}`);
};
const reOrder = (order) => {
  router.push('/menu');
};

const showConfirmDialog = ref(false);
const targetOrderId = ref(null);
const deletingId = ref(null);
const showSnackbar = ref(false);
const snackbarText = ref('');

const openDeleteDialog = (orderId) => {
  targetOrderId.value = orderId;
  showConfirmDialog.value = true;
};

const confirmDelete = async () => {
  if (!targetOrderId.value) return;
  
  const orderId = targetOrderId.value;
  showConfirmDialog.value = false;
  deletingId.value = orderId;
  
  try {
    const res = await $fetch(`/api/order/${orderId}`, {
      method: 'DELETE'
    });
    if (res.success) {
      snackbarText.value = '订单已删除';
      showSnackbar.value = true;
      await refresh();
    } else {
      alert('删除失败: ' + res.error);
    }
  } catch (err) {
    alert('网络操作失败');
  } finally {
    deletingId.value = null;
    targetOrderId.value = null;
  }
};


</script>

<style scoped>
.orders-page { min-height: 100vh; overflow-y: auto; }
.header { position: sticky; top: 0; z-index: 10; }
.search-field :deep(.v-field) { font-size: 14px; font-weight: 600; }
.border-faint { border-color: rgba(0,0,0,0.03) !important; }
.border-faint-b { border-bottom: 1px solid rgba(0,0,0,0.03); }
.border-faint-t { border-top: 1px solid rgba(0,0,0,0.03); }
.border-2 { border-width: 2px !important; }
.shadow-sm { box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important; }
</style>

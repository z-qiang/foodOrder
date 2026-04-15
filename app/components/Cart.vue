<template>
  <div class="cart-container-vuetify" v-if="totalCount > 0">
    <!-- Selection List Bottom Sheet -->
    <v-bottom-sheet v-model="showList" inset max-width="600">
      <v-card rounded="t-xl" class="pa-4">
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-subtitle-1 font-weight-black">已选商品</span>
          <v-btn variant="text" size="small" color="grey" @click="$emit('clear')">清空购物车</v-btn>
        </div>
        
        <v-list class="pa-0 overflow-y-auto" max-height="45vh">
          <v-list-item v-for="item in cartItems" :key="item.id" class="px-0 py-2 border-b-sm border-faint">
            <template v-slot:prepend>
               <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">{{ item.name }}</div>
            </template>
            
            <template v-slot:append>
              <div class="d-flex align-center ga-4">
                <span class="text-subtitle-2 font-weight-black text-orange-darken-3">¥{{ item.price }}</span>
                <div class="d-flex align-center ga-2">
                  <v-btn icon="mdi-minus" size="x-small" variant="outlined" density="comfortable" color="grey-lighten-1" @click="$emit('update', item, -1)"></v-btn>
                  <span class="text-subtitle-2 font-weight-black" style="min-width: 20px; text-align: center;">{{ item.count }}</span>
                  <v-btn icon="mdi-plus" size="x-small" variant="flat" density="comfortable" color="primary" @click="$emit('update', item, 1)"></v-btn>
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
        
        <!-- Spacer to avoid being covered by the TabBar when sheet is open -->
        <div class="py-12 pb-16"></div>
      </v-card>
    </v-bottom-sheet>
    
    <!-- Floating Cart Bar -->
    <v-card 
      class="cart-bar-floating mx-4 rounded-pill d-flex align-center px-0 overflow-hidden elevation-10"
      color="#333"
      height="56"
      @click="showList = !showList"
    >
      <div class="icon-wrap-vuetify ml-3">
        <v-avatar color="primary" size="56" class="border-4-dark">
          <v-icon size="28">mdi-cart-outline</v-icon>
        </v-avatar>
        <v-badge
          :content="totalCount"
          color="error"
          overlap
          offset-x="-12"
          offset-y="-12"
          class="count-badge"
        ></v-badge>
      </div>

      <div class="flex-grow-1 ml-4 d-flex flex-column justify-center text-white">
        <div class="text-h6 font-weight-black leading-tight">¥{{ totalPrice }}</div>
        <div class="text-caption text-grey-lighten-1" style="font-size: 10px !important;">包含基本配送费</div>
      </div>

      <v-btn
        height="100%"
        width="110"
        color="primary"
        variant="flat"
        class="rounded-0 text-button font-weight-black"
        @click.stop="submitOrder"
      >
        去结算
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  cartItems: { type: Array, default: () => [] }
});
const emit = defineEmits(['update', 'clear', 'submit']);

const showList = ref(false);

const totalCount = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + item.count, 0);
});

const totalPrice = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
});

const submitOrder = () => {
  if (props.cartItems.length > 0) {
    showList.value = false;
    emit('submit', { items: props.cartItems, totalAmount: totalPrice.value });
  }
};
</script>

<style scoped>
.cart-container-vuetify {
  position: fixed;
  bottom: 72px; /* Above TabBar (60px + 12px margin) */
  left: 0;
  right: 0;
  z-index: 2000;
  max-width: 600px;
  margin: 0 auto;
}

.cart-bar-floating {
  position: relative;
  z-index: 2001;
}

.icon-wrap-vuetify {
  position: relative;
  z-index: 2002;
  margin-top: -8px; /* Lift the icon slightly */
}

.border-4-dark {
  border: 4px solid #333 !important;
}

.count-badge :deep(.v-badge__badge) {
  font-size: 10px !important;
  height: 18px !important;
  min-width: 18px !important;
  padding: 0 4px !important;
  font-weight: 800 !important;
  border: 2px solid #333 !important;
}

.border-faint {
  border-color: rgba(0,0,0,0.05) !important;
}

.leading-tight {
  line-height: 1.2;
}

:deep(.v-overlay__scrim) {
  max-width: 600px;
  margin: 0 auto;
}
</style>

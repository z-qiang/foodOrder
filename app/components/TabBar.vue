<template>
  <v-bottom-navigation grow density="comfortable" color="primary" class="tab-bar-vuetify">
    <v-btn to="/?v=1" exact value="index">
      <v-icon>mdi-home-variant-outline</v-icon>
      <span>首页</span>
    </v-btn>

    <v-btn to="/menu" value="menu">
      <v-icon>mdi-silverware-variant</v-icon>
      <span>点餐</span>
    </v-btn>

    <v-btn to="/order" value="order">
      <v-icon>mdi-clipboard-text-outline</v-icon>
      <span>订单</span>
    </v-btn>

    <v-btn to="/me" value="me">
      <v-icon>mdi-account-outline</v-icon>
      <span>我的</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.tab-bar-vuetify {
  border-top: 1px solid #f5f5f5 !important;
  box-shadow: none !important;
  height: 64px !important;
}
:deep(.v-btn__content) {
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0 !important;
}
:deep(.v-icon) {
  margin-bottom: 2px !important;
  font-size: 24px !important;
}
</style>

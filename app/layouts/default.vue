<template>
  <v-layout class="layout-default">
    <v-main class="main-content">
      <slot />
    </v-main>
    <TabBar />
  </v-layout>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(64px + env(safe-area-inset-bottom)); /* Space for TabBar (64px) + Safe Area */
}
</style>

<template>
  <v-app class="h5-app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<style>
/* 简单的全局样式复位与底色 */
html, body {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f2ecde; /* 缟色 (Gǎo) */
  -webkit-font-smoothing: antialiased;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

.h5-app-container {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  max-width: 600px;
  background: #f2ecde;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>

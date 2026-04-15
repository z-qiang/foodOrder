<template>
  <v-container fluid class="pa-0 me-page bg-background">
    <div class="user-section bg-header-me px-6 pt-12 pb-10 mb-4 rounded-b-xl shadow-sm">
      <div class="user-info-bar d-flex align-center mb-10">
        <v-avatar size="72" class="elevation-4 border-3 border-white">
          <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
        </v-avatar>
        <div class="info ml-5 flex-grow-1">
          <h2 class="text-h5 font-weight-black mb-1 text-primary">{{ userNickName || '美味食客' }}</h2>
          <p class="text-caption text-secondary font-weight-black">会员等级：至尊金卡</p>
        </div>
        <v-btn icon="mdi-cog-outline" variant="text" color="secondary" size="small" ripple @click="openEditDialog"></v-btn>
      </div>
      
      <div class="stats-card-vuetify d-flex justify-space-around py-2">
        <div class="text-center">
          <div class="text-h5 font-weight-black text-primary mb-1">12</div>
          <div class="text-caption text-secondary font-weight-black">红包/卡券</div>
        </div>
        <div class="text-center">
          <div class="text-h5 font-weight-black text-primary mb-1">0</div>
          <div class="text-caption text-secondary font-weight-black">津贴</div>
        </div>
        <div class="text-center">
          <div class="text-h5 font-weight-black text-primary mb-1">88</div>
          <div class="text-caption text-secondary font-weight-black">积分</div>
        </div>
      </div>
    </div>

    <div class="px-5">
      <v-card flat rounded="xl" class="mb-5 bg-on-surface-variant elevation-0">
        <v-list density="comfortable" class="bg-transparent pa-2">
          <v-list-item link class="py-4 rounded-lg mb-1" ripple>
            <template v-slot:prepend>
              <v-icon color="secondary" size="22">mdi-map-marker-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-black text-primary">我的地址</v-list-item-title>
            <template v-slot:append>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
          
          <v-list-item link class="py-4 rounded-lg mb-1" ripple>
            <template v-slot:prepend>
              <v-icon color="secondary" size="22">mdi-gift-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-black text-primary">邀请有礼</v-list-item-title>
            <template v-slot:append>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>

          <v-list-item link class="py-4 rounded-lg" ripple @click="router.push('/admin/dishes')">
            <template v-slot:prepend>
              <v-icon color="secondary" size="22">mdi-food-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-black text-primary">菜品管理 (管理员)</v-list-item-title>
            <template v-slot:append>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card flat rounded="xl" class="mb-10 bg-white elevation-1 shadow-sm">
        <v-list density="comfortable" class="bg-transparent pa-2">
          <v-list-item link class="py-4 rounded-lg mb-1" ripple>
            <template v-slot:prepend>
              <v-icon color="secondary" size="22">mdi-headphones</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-black text-primary">联系客服</v-list-item-title>
            <template v-slot:append>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
          
          <v-list-item link class="py-4 rounded-lg" ripple>
            <template v-slot:prepend>
              <v-icon color="secondary" size="22">mdi-file-document-outline</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-black text-primary">用户协议</v-list-item-title>
            <template v-slot:append>
              <v-icon size="small" color="grey-lighten-2">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <v-btn
        variant="text"
        block
        class="text-secondary font-weight-black mt-4 ripple-none"
        @click="logout"
      >
        退出登录
      </v-btn>
    </div>
    
    <div class="py-12"></div>

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="showEditDialog" max-width="400" persistent>
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-black text-center pt-4">编辑个人资料</v-card-title>
        <v-card-text class="pt-6">
          <v-text-field
            v-model="editForm.nickName"
            label="昵称"
            variant="underlined"
            color="primary"
            placeholder="请输入新昵称"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="editForm.password"
            label="修改密码 (可选)"
            type="password"
            variant="underlined"
            color="primary"
            placeholder="不修改请留空"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center pb-4 ga-2">
          <v-btn variant="text" color="secondary" class="px-6 font-weight-bold" @click="showEditDialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" rounded="pill" class="px-8 font-weight-black elevation-2" :loading="loading" @click="handleUpdate">保存修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSnackbar" :timeout="2000" color="success" rounded="pill" elevation="10">
      <div class="text-center font-weight-black">个人资料已更新</div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#imports';

const router = useRouter();
const authUser = useCookie('authUser');
const userNickName = useCookie('userNickName');

useHead({
  title: '个人中心 - 美味点餐系统',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const showEditDialog = ref(false);
const showSnackbar = ref(false);
const loading = ref(false);
const editForm = ref({ nickName: '', password: '' });

const openEditDialog = () => {
  editForm.value.nickName = userNickName.value || '';
  editForm.value.password = '';
  showEditDialog.value = true;
};

const handleUpdate = async () => {
  if (!editForm.value.nickName) {
    alert('昵称不能为空');
    return;
  }
  
  loading.value = true;
  try {
    const res = await $fetch('/api/auth/update', {
      method: 'POST',
      body: {
        username: authUser.value,
        nickName: editForm.value.nickName,
        password: editForm.value.password || undefined
      }
    });
    
    if (res.success) {
      userNickName.value = res.data.nickName;
      showEditDialog.value = false;
      showSnackbar.value = true;
    } else {
      alert(res.error || '更新失败');
    }
  } catch (err) {
    alert('网络或服务器错误');
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  authUser.value = null;
  userNickName.value = null;
  router.push('/login');
};
</script>

<style scoped>
.me-page { min-height: 100vh; overflow-y: auto; }
.user-section { 
  position: sticky; 
  top: 0; 
  z-index: 10;
  border-bottom: 2px solid rgba(0,0,0,0.02); 
}
.stats-card-vuetify { border-top: 1px solid rgba(0,0,0,0.03); }
.shadow-sm { box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important; }
</style>

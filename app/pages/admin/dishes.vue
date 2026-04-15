<template>
  <v-container fluid class="pa-0 admin-page bg-background">
    <header class="header bg-header-admin px-6 py-8 rounded-b-xl shadow-sm d-flex align-center">
      <v-btn icon="mdi-chevron-left" variant="text" color="primary" @click="router.back()" class="mr-2"></v-btn>
      <h1 class="text-h6 font-weight-black text-primary flex-grow-1 text-center pr-10">菜品管理</h1>
    </header>

    <!-- Search Bar -->
    <div class="px-5 pt-5 pb-1">
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
        class="search-field"
        bg-color="white"
      ></v-text-field>
    </div>

    <main class="content px-5 py-4">
      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center align-center py-20">
        <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
      </div>

      <!-- Empty State -->
      <div v-else-if="dishes.length === 0" class="empty-state d-flex flex-column align-center justify-center py-20 text-secondary">
        <v-icon size="80" class="opacity-20 mb-6">mdi-food-off-outline</v-icon>
        <p class="text-subtitle-1 font-weight-bold">暂无菜品数据</p>
        <v-btn color="primary" variant="flat" rounded="pill" class="mt-6 px-10 font-weight-black elevation-2" @click="openAddDialog">添加菜品</v-btn>
      </div>

      <!-- Search No Results -->
      <div v-else-if="filteredAdminDishes.length === 0" class="d-flex flex-column align-center justify-center py-16 text-secondary">
        <v-icon size="48" class="opacity-20 mb-4">mdi-magnify</v-icon>
        <p class="text-subtitle-2 font-weight-bold">未找到"{{ searchQuery }}"相关菜品</p>
      </div>

      <!-- Dish List -->
      <div v-else class="dish-list">
        <v-card
          v-for="dish in filteredAdminDishes"
          :key="dish.id"
          flat
          rounded="xl"
          class="mb-4 pa-4 bg-white border-sm border-white shadow-sm"
        >
          <div class="d-flex align-center">
            <v-img
              :src="dish.image"
              width="72"
              height="72"
              cover
              rounded="lg"
              class="bg-grey-lighten-4 flex-shrink-0 elevation-1"
            />
            <div class="ml-4 flex-grow-1 overflow-hidden">
              <div class="d-flex justify-space-between align-start">
                <h3 class="text-subtitle-1 font-weight-black text-primary text-truncate">{{ dish.name }}</h3>
                <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold ml-2 flex-shrink-0">
                  {{ getCategoryName(dish.categoryId) }}
                </v-chip>
              </div>
              <p class="text-caption text-secondary font-weight-bold mt-1 text-truncate">{{ dish.desc || '暂无描述' }}</p>
              <div class="d-flex justify-space-between align-center mt-2">
                <span class="text-subtitle-2 font-weight-black text-primary">
                  <small class="text-caption">¥</small>{{ dish.price }}
                </span>
                <span class="text-caption text-secondary font-weight-bold">库存: {{ dish.stock }}</span>
              </div>
            </div>
          </div>

          <div class="d-flex justify-end ga-2 mt-4 pt-3 border-faint-t">
            <v-btn
              variant="text"
              color="error"
              size="small"
              rounded="pill"
              class="px-5 font-weight-black"
              :loading="deletingId === dish.id"
              @click="openDeleteDialog(dish)"
            >
              <v-icon size="16" class="mr-1">mdi-delete-outline</v-icon>
              删除
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              rounded="pill"
              class="px-5 font-weight-black border-2"
              @click="openEditDialog(dish)"
            >
              <v-icon size="16" class="mr-1">mdi-pencil-outline</v-icon>
              编辑
            </v-btn>
          </div>
        </v-card>
      </div>

      <div class="py-16"></div>
    </main>

    <!-- FAB: Add Dish -->
    <v-btn
      icon="mdi-plus"
      color="primary"
      size="large"
      class="fab-add elevation-8"
      @click="openAddDialog"
    ></v-btn>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="showFormDialog" max-width="420" persistent>
      <v-card rounded="xl" class="pa-2">
        <v-card-title class="text-h6 font-weight-black text-center pt-6">
          {{ isEditing ? '编辑菜品' : '新增菜品' }}
        </v-card-title>
        <v-card-text class="pt-4 pb-0">
          <v-text-field
            v-model="form.name"
            label="菜品名称"
            placeholder="例如：多肉葡萄"
            variant="underlined"
            color="primary"
            class="mb-3"
          ></v-text-field>

          <v-select
            v-model="form.categoryId"
            :items="categoryOptions"
            item-title="name"
            item-value="id"
            label="所属分类"
            variant="underlined"
            color="primary"
            class="mb-3"
          ></v-select>

          <v-text-field
            v-model="form.price"
            label="价格 (元)"
            type="number"
            placeholder="例如：29"
            variant="underlined"
            color="primary"
            class="mb-3"
          ></v-text-field>

          <div class="upload-section mb-4">
            <label class="text-subtitle-2 font-weight-black text-secondary mb-2 d-block">菜品图片</label>
            <div
              class="upload-box rounded-xl d-flex flex-column align-center justify-center"
              @click="triggerUpload"
              :class="{ 'has-image': form.image }"
            >
              <template v-if="!form.image">
                <v-icon color="primary" size="32" class="mb-2">mdi-camera-plus-outline</v-icon>
                <span class="text-caption text-grey">点击拍摄或在相册选择</span>
              </template>
              <template v-else>
                <v-img :src="form.image" cover class="rounded-xl w-100 h-100">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-row>
                  </template>
                  <div class="change-overlay">
                    <v-icon color="white">mdi-camera-flip</v-icon>
                    <span class="ml-1 text-white text-caption font-weight-bold">更换图片</span>
                  </div>
                </v-img>
              </template>
              <v-overlay :model-value="uploading" persistent contained class="align-center justify-center rounded-xl">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-overlay>
            </div>
            <input
              ref="fileInput"
              type="file"
              hidden
              accept="image/*"
              @change="handleFileChange"
            >
            <v-text-field
              v-model="form.image"
              label="或输入图片 URL"
              placeholder="上传图片后自动填充"
              variant="underlined"
              color="primary"
              class="mt-2"
              density="compact"
              hide-details
            ></v-text-field>
          </div>

          <v-text-field
            v-model="form.desc"
            label="描述 (选填)"
            placeholder="例如：果肉满满，清甜多汁"
            variant="underlined"
            color="primary"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.stock"
            label="库存"
            type="number"
            placeholder="例如：100"
            variant="underlined"
            color="primary"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-center pb-6 ga-2">
          <v-btn
            variant="text"
            color="secondary"
            class="px-6 font-weight-bold"
            @click="showFormDialog = false"
          >取消</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="px-8 font-weight-black elevation-2"
            :loading="submitting"
            @click="submitForm"
          >{{ isEditing ? '保存修改' : '确认添加' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="320" persistent>
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-black text-center pt-4">确认删除？</v-card-title>
        <v-card-text class="text-center text-secondary py-4">
          删除「<strong class="text-primary">{{ deletingDish?.name }}</strong>」后将无法恢复，关联的上传图片也会被清理。
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn
            variant="text"
            color="secondary"
            class="px-6 font-weight-bold"
            @click="showDeleteDialog = false"
          >取消</v-btn>
          <v-btn
            color="error"
            variant="flat"
            rounded="pill"
            class="px-8 font-weight-black elevation-2"
            :loading="deletingId !== null"
            @click="confirmDelete"
          >确定删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
      :color="snackbarColor"
      rounded="pill"
      class="mb-12"
      elevation="12"
    >
      <div class="text-center font-weight-black py-1">
        <v-icon :icon="snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2"></v-icon>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Bypass the global tabbar layout
definePageMeta({
  layout: false
});

const router = useRouter();

useHead({
  title: '菜品管理 - 美味点餐系统',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});

const categoryOptions = [
  { id: 1, name: '招牌必点' },
  { id: 2, name: '折扣套餐' },
  { id: 3, name: '美味小吃' },
  { id: 4, name: '酒水饮料' }
];

const getCategoryName = (catId) => {
  const cat = categoryOptions.find(c => c.id === Number(catId));
  return cat ? cat.name : '未分类';
};

// ==================== State ====================
const dishes = ref([]);
const searchQuery = ref('');
const filteredAdminDishes = computed(() => {
  const q = searchQuery.value?.trim().toLowerCase();
  if (!q) return dishes.value;
  return dishes.value.filter(d =>
    d.name.toLowerCase().includes(q) || (d.desc && d.desc.toLowerCase().includes(q))
  );
});
const loading = ref(true);
const submitting = ref(false);
const showFormDialog = ref(false);
const isEditing = ref(false);
const editingDishId = ref(null);
const showDeleteDialog = ref(false);
const deletingDish = ref(null);
const deletingId = ref(null);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const uploading = ref(false);
const fileInput = ref(null);

const defaultForm = {
  name: '',
  categoryId: 1,
  price: '',
  image: '',
  desc: '',
  stock: 100
};

const form = ref({ ...defaultForm });

// ==================== Data Loading ====================
const fetchDishes = async () => {
  loading.value = true;
  try {
    const res = await $fetch('/api/menu');
    if (res.success) {
      dishes.value = res.data?.dishes || [];
    }
  } catch (err) {
    showToast('加载菜品失败', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDishes);

// ==================== Toast ====================
const showToast = (text, color = 'success') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  showSnackbar.value = true;
};

// ==================== Add ====================
const openAddDialog = () => {
  isEditing.value = false;
  editingDishId.value = null;
  form.value = { ...defaultForm };
  showFormDialog.value = true;
};

// ==================== Edit ====================
const openEditDialog = (dish) => {
  isEditing.value = true;
  editingDishId.value = dish.id;
  form.value = {
    name: dish.name,
    categoryId: Number(dish.categoryId),
    price: String(dish.price),
    image: dish.image || '',
    desc: dish.desc || '',
    stock: dish.stock ?? 100
  };
  showFormDialog.value = true;
};

// ==================== Submit (Add / Edit) ====================
const submitForm = async () => {
  if (!form.value.name || !form.value.price) {
    showToast('请填写名称和价格', 'error');
    return;
  }

  submitting.value = true;
  try {
    if (isEditing.value) {
      // Edit
      const res = await $fetch('/api/admin/dish', {
        method: 'PUT',
        body: { ...form.value, id: editingDishId.value }
      });
      if (res.success) {
        showFormDialog.value = false;
        showToast('菜品已更新');
        await fetchDishes();
      } else {
        showToast('编辑失败: ' + res.error, 'error');
      }
    } else {
      // Add
      const res = await $fetch('/api/admin/dish', {
        method: 'POST',
        body: form.value
      });
      if (res.success) {
        showFormDialog.value = false;
        showToast('菜品已添加');
        await fetchDishes();
      } else {
        showToast('添加失败: ' + res.error, 'error');
      }
    }
  } catch (err) {
    showToast('网络错误，请重试', 'error');
  } finally {
    submitting.value = false;
  }
};

// ==================== Delete ====================
const openDeleteDialog = (dish) => {
  deletingDish.value = dish;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deletingDish.value) return;

  const dish = deletingDish.value;
  showDeleteDialog.value = false;
  deletingId.value = dish.id;

  try {
    const res = await $fetch('/api/admin/dish', {
      method: 'DELETE',
      body: { id: dish.id }
    });
    if (res.success) {
      showToast('菜品已删除');
      await fetchDishes();
    } else {
      showToast('删除失败: ' + res.error, 'error');
    }
  } catch (err) {
    showToast('网络操作失败', 'error');
  } finally {
    deletingId.value = null;
    deletingDish.value = null;
  }
};

// ==================== Image Upload ====================
const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB', 'error');
    return;
  }

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await $fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    if (res.success) {
      form.value.image = res.url;
    } else {
      showToast('上传失败: ' + res.error, 'error');
    }
  } catch (err) {
    showToast('上传出错，请重试', 'error');
  } finally {
    uploading.value = false;
    if (e.target) e.target.value = '';
  }
};
</script>

<style scoped>
.admin-page { min-height: 100vh; overflow-y: auto; }
.header { position: sticky; top: 0; z-index: 10; border-bottom: 2px solid rgba(0,0,0,0.02); }
.shadow-sm { box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important; }
.search-field :deep(.v-field) { font-size: 14px; font-weight: 600; }
.border-faint-t { border-top: 1px solid rgba(0,0,0,0.04); }
.border-2 { border-width: 2px !important; }

.fab-add {
  position: fixed;
  bottom: 28px;
  right: 20px;
  z-index: 100;
}

/* Form dialog field labels */
:deep(.v-field__label) {
  font-weight: 800 !important;
  color: rgb(var(--v-theme-secondary)) !important;
  font-size: 14px !important;
}

.upload-box {
  width: 100%;
  height: 140px;
  background-color: #f8f9fa;
  border: 2px dashed #e9ecef;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.upload-box.has-image {
  border: none;
}

.change-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
</style>

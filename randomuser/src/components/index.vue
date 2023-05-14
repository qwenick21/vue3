<template lang="pug">
div
    //- topBar
    header.flex.justify-between
      el-menu(:default-active="typeIndex" class="el-menu-demo" mode="horizontal" @select="changeType")
        el-menu-item(index="1") ALL
        el-menu-item(index="2") Favorite 
      el-menu.flex-initial(:default-active="modeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#ffd04b" @select="changeMode")
        el-menu-item(index="1") 
          el-icon 
            Menu
        el-menu-item(index="2") 
          el-icon
            List 
    //- main data
    main.mt-10
      .grid.grid-cols-5.gap-5.w-full(v-if="modeIndex === '1'")
        .user-box(v-for="user in filteredUsers" :key="user.id.value" @click="openUserModal(user)")
          img.w-24.h-24.rounded-full.m-auto(:src="user.picture.medium", :alt="user.name.first")
          .ml-2.flex.items-center.justify-center
            p {{ user.name.first }} {{ user.name.last }}
            img.ml-2.w-6.h-6(v-if="isFavorite(user)" src="../assets/heart-icon.jpg")
      div(v-else)
        .user-list.flex.items-center.bg-gray-500.text-white.rounded-lg.my-2.px-3.mx-auto.relative(class="w-4/5" v-for="user in filteredUsers" :key="user.id.value" @click="openUserModal(user)")
          img.w-8.h-8.absolute.left-2(class = "top-1/2 transform -translate-y-1/2" v-if="isFavorite(user)" src="../assets/heart-icon.jpg")
          img.w-16.h-16.rounded-full.ml-10(:src="user.picture.medium", :alt="user.name.first")
          .ml-4.flex.flex-row.justify-between.w-full
            h2 {{ user.name.first }} {{ user.name.last }}
            p {{ user.email }}
            p {{ user.phone }}
    //- paginator
    footer.mt-10(class="demo-pagination-block")
      el-pagination(
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 30, 50]"
        layout="sizes, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      )                 
    //- user modal
    el-dialog(v-model="userModalVisible" :before-close="handleClose" width="50%")
      img.w-32.h-32.rounded-full.m-auto.mb-5(:src="currentUser.picture.large", :alt="currentUser.name.first")
      h2 Name: {{ currentUser.name.first }} {{ currentUser.name.last }}
      p Email: {{ currentUser.email }}
      p Phone: {{ currentUser.phone }}
      p Gender: {{ currentUser.gender }}
      p Username: {{ currentUser.login.username }}
      p {{ currentUser.location.street.number }} {{ currentUser.location.street.name }}
      p {{ currentUser.location.city }} {{ currentUser.location.state }} {{ currentUser.location.country }}
      .mt-5
        el-button(@click="toggleFavorite") {{ favoriteButtonText }}
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

const typeIndex = ref('1');
const modeIndex = ref(sessionStorage.getItem('modeIndex') || '1');
const pageSize = ref(Number(sessionStorage.getItem('pageSize')) || 30);
const currentPage = ref(Number(sessionStorage.getItem('currentPage')) || 1);
const totalData = ref(3010);
const users = ref([]);
const favorites = ref([]);
const currentUser = ref(null);
const userModalVisible = ref(false);

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  const response = await axios.get('https://randomuser.me/api/', {
    params: {
      results: totalData.value,
    },
  });
  users.value = response.data.results;
};

const changeType = (key: string) => {
  typeIndex.value = key;
};

const changeMode = (key: string) => {
  modeIndex.value = key;
};

const openUserModal = (user) => {
  currentUser.value = user;
  userModalVisible.value = true;
};

const isFavorite = (user) => {
  return favorites.value.some((f) => f.id.value === user.id.value);
};

const toggleFavorite = () => {
  const index = favorites.value.findIndex((f) => f.id.value === currentUser.value.id.value);
  if (index >= 0) favorites.value.splice(index, 1);
  else favorites.value.push(currentUser.value);
};

const handleCurrentChange = async (newPage) => {
  currentPage.value = newPage;
  window.scrollTo(0, 0);
};

const handleClose = () => {
  userModalVisible.value = false;
};
const favoriteButtonText = computed(() => {
  return isFavorite(currentUser.value) ? 'Remove from Favorites' : 'Add to Favorites';
});

const filteredUsers = computed(() => {
  const usersToShow = typeIndex.value === '2' ? favorites.value : users.value;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return usersToShow.slice(startIndex, startIndex + pageSize.value);
});

const total = computed(() => {
  return typeIndex.value === '2' ? favorites.value.length : totalData.value;
});

watch(typeIndex, () => {
  currentPage.value = 1;
});

watch(modeIndex, (newModeIndex) => {
  sessionStorage.setItem('modeIndex', newModeIndex);
});

watch(pageSize, (newPageSize) => {
  sessionStorage.setItem('pageSize', newPageSize);
});

watch(currentPage, (newCurrentPage) => {
  sessionStorage.setItem('currentPage', newCurrentPage);
});
</script>

<style scoped>
.user-box:hover,
.user-list:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}
</style>

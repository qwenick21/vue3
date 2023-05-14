<template lang="pug">
.container.flex
    .input-area.flex.flex-col
      .flex.flex-row-reverse
        el-button(type="primary" @click="addPair") Add New Pair
      .my-2.flex.items-center(v-for="(pair, index) in pairs" :key="index")
        el-input(v-model="pair.key" placeholder="Key").flex-1.mr-2
        el-input(v-model="pair.value" placeholder="Value").flex-1.mr-2
        el-button(icon="el-icon-delete" @click="deletePair(index)")
    .preview-area.flex.flex-col.items-start.justify-start
      .ml-4
        el-tree(:data="parsedObject" :props="defaultProps" node-key="id")
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const pairs = ref([{ key: '', value: '' }]);

const addPair = () => {
  pairs.value.push({ key: '', value: '' });
};

const deletePair = (index) => {
  pairs.value.splice(index, 1);
};

const defaultProps = ref({
  children: 'children',
  label: 'label',
});

const parsedObject = computed(() => {
  let result = [];
  pairs.value.forEach((pair) => {
    let keys = pair.key.split('.');
    keys = keys.filter((keyPart) => keyPart !== ''); // Ignore empty parts of key
    if (keys.length === 0) return; // Ignore pairs with empty key
    let currentLevel = result;
    keys.forEach((key, index) => {
      let existingObject = currentLevel.find((x) => x.label.split(':')[0] === key);
      if (existingObject) {
        if (!existingObject.children) existingObject.children = [];
        currentLevel = existingObject.children;
      } else {
        let newObject = { label: key };
        if (index === keys.length - 1) newObject.label += `: ${pair.value}`;
        else newObject.children = [];
        currentLevel.push(newObject);
        currentLevel = newObject.children;
      }
    });
  });
  return result;
});
</script>

<style scoped>
.container {
  @apply flex justify-between p-5 bg-gray-200 h-screen;
}
.input-area {
  @apply flex-1 mr-5 relative;
}
.preview-area {
  @apply flex-1 bg-white p-5 rounded-lg;
}
</style>

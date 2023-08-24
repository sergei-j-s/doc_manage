<template>
  <div class="">
    <div class="border-0 border-b border-solid border-[#DFE4EF]">
      <n-input v-model:value="listStore.search" placeholder="Поиск" clearable :theme-overrides="searchThemeOverrides">
        <template #prefix>
          <Search />
        </template>
        <template #clear-icon>
          <Clear />
        </template>
      </n-input>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useListStore } from '@/store';
import { Search, Clear } from '@/components/icons';

const searchThemeOverrides = {
  borderRadius: '0px',
  boxShadow: 'none',
  boxShadowHover: 'none',
  boxShadowFocus: 'none',
  border: '0px',
  borderHover: '0px',
  borderFocus: '0px',
  caretColor: '#0066ff',
};

const listStore = useListStore();
</script>

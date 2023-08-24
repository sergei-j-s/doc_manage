<template>
  <div class="flex flex-row items-center justify-between">
    <div class="text-[22px] font-bold">Документы</div>
    <div class="flex flex-row gap-[10px]">
      <n-button quaternary circle :theme-overrides="buttonThemeOverrides" class="group">
        <template #icon>
          <Favorites />
        </template>
      </n-button>
      <n-button v-on:click="emit('update:showModalType', true)" round ghost :theme-overrides="buttonThemeOverrides">
        <template #icon>
          <Plus />
        </template>
        Новый тип
      </n-button>
      <n-button v-on:click="emit('update:showModalDoc', true)" round ghost :theme-overrides="buttonThemeOverrides">
        <template #icon>
          <Plus />
        </template>
        Новый документ
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Favorites, Plus } from '@/components/icons';

const buttonThemeOverrides = {
  border: '1px solid #D3D8DF',
  borderHover: '1px solid #0066ff',
  borderPressed: '1px solid #0066ff',
  borderFocus: '1px solid #0066ff',
  fontWeight: 'bold',
  fontSize: '12px',
  textColor: '#000',
  textColorHover: '#0066ff',
  textColorPressed: '#0066ff',
  textColorFocus: '#0066ff',
};

const emit = defineEmits(['update:showModalType', 'update:showModalDoc']);
</script>

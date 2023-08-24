<template>
  <draggable v-model="list" v-on:start="emit('start:Drag')" v-on:end="endDrag()" v-bind="dragOptionsDoc" :component-data="{ tag: 'div', type: 'transition-group', name: !dragging ? 'flip-list' : null }" item-key="id" handle=".handle" :disabled="listStore.search" :class="{ 'h-[35px] border-[1px] border-solid border-[#DFE4EF]': list.length == 0 && withoutParent }" class="list-group after:content-['Документы_без_типа'] after:flex after:justify-center after:w-full after:text-[11px] after:text-[#8E9CBB] after:italic after:select-none after:absolute after:top-[26px] after:z-[-1]">
    <template #item="{ element }">
      <div class="flex items-center justify-between h-[35px] bg-white border-[1px] border-solid border-[#DFE4EF] px-[16px] mt-[-1px]">
        <div class="flex items-center gap-[15px]">
          <div class="text-[13px]">{{ element.title }}</div>
          <div class="flex items-center gap-[5px]">
            <n-badge v-for="(color, i) in element.color_tag" :key="i" :color="color" dot></n-badge>
          </div>
          <div v-if="element.required" class="text-[11px] text-[#FF238D]">Обязательный</div>
          <div class="text-[11px] text-[#8E9CBB]">{{ element.description }}</div>
        </div>
        <div class="flex items-center gap-[23px]">
          <div v-on:click.stop="emit('edit:Doc', element.id)" class="group flex items-center cursor-pointer">
            <Pencil />
          </div>
          <div v-on:click.stop="emit('remove:Doc', element.id)" class="group flex items-center cursor-pointer">
            <Trash />
          </div>
          <div :class="{ 'cursor-no-drop': listStore.search }" class="group handle flex items-center cursor-move">
            <Drag />
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { useListStore } from '@/store';
import { Pencil, Trash, Drag } from '@/components/icons';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  dragOptionsDoc: {
    type: Object,
    required: true,
  },
  dragging: {
    type: Boolean,
    required: true,
  },
  withoutParent: {
    type: Boolean,
  },
});

const emit = defineEmits(['update:modelValue', 'start:Drag', 'end:Drag', 'edit:Doc', 'remove:Doc']);

const listStore = useListStore();
const list = ref(props.modelValue);

const endDrag = () => {
  emit('update:modelValue', list.value);
  emit('end:Drag');
};

watch(
  () => props.modelValue,
  (newValue) => {
    list.value = newValue;
  }
);

watch(
  () => props.dragging,
  (newValue) => {
    if(!newValue){
      emit('update:modelValue', list.value);
      listStore.saveSettings();
    };
  }
);
</script>

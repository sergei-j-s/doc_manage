<template>
  <div class="flex flex-col pt-[20px] px-[20px]">
    <draggable v-model="list" v-on:start="emit('start:Drag')" v-on:end="endDrag()" v-bind="dragOptionsType" :component-data="{ tag: 'div', type: 'transition-group', name: !dragging ? 'flip-list' : null }" item-key="id" handle=".handle" :disabled="listStore.search" class="list-group">
      <template #item="{ element }">
        <div class="w-full">
          <div v-on:click="collapseType(element.id)" class="flex items-center justify-between h-[48px] bg-white border-[1px] border-solid border-[#DFE4EF] px-[16px] mt-[-1px] cursor-pointer">
            <div class="flex items-center gap-[15px] relative z-10">
              <div class="group flex items-center">
                <ArrowUp v-if="element.active" />
                <ArrowDown v-else />
              </div>
              <div class="text-[15px] font-bold">{{ element.title }}</div>
              <div class="flex items-center gap-[5px]">
                <n-badge v-for="(color, i) in element.color_tag" :key="i" :color="color" dot></n-badge>
              </div>
              <div class="text-[11px] text-[#8E9CBB]">{{ element.description }}</div>
            </div>
            <div class="flex items-center gap-[23px]">
              <div v-on:click.stop="emit('edit:Type', element.id)" class="group flex items-center cursor-pointer">
                <Pencil />
              </div>
              <div v-on:click.stop="emit('remove:Type', element.id)" class="group flex items-center cursor-pointer">
                <Trash />
              </div>
              <div :class="{ 'cursor-no-drop': listStore.search }" class="group handle flex items-center cursor-move">
                <Drag />
              </div>
            </div>
          </div>
          <transition name="expand" @enter="enter" @after-enter="afterEnter" @leave="leave">
            <div v-show="element.active" class="pl-[16px]">
              <ListDoc v-model="element.children" v-on:start:Drag="emit('start:Drag')" v-on:end:Drag="emit('end:Drag')" v-on:edit:Doc="emit('edit:Doc', $event)" v-on:remove:Doc="emit('remove:Doc', $event)" :dragging="dragging" :dragOptionsDoc="dragOptionsDoc" />
            </div>
          </transition>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useListStore } from '@/store';
import draggable from 'vuedraggable';
import ListDoc from '@/components/ListDoc.vue';
import { Pencil, Trash, Drag } from '@/components/icons';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  dragOptionsType: {
    type: Object,
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
});

const emit = defineEmits(['update:modelValue', 'start:Drag', 'end:Drag', 'edit:Type', 'remove:Type', 'edit:Doc', 'remove:Doc']);

const listStore = useListStore();
const list = ref(props.modelValue);

const endDrag = () => {
  emit('update:modelValue', list.value);
  emit('end:Drag');
};

// TRANSITION COLLAPSE
const collapseType = (id) => {
  if (!listStore.search) {
    let parent = listStore.listType.find((e) => e.id == id);
    if (parent) {
      parent.active = !parent.active;
    }
    listStore.saveSettings();
  }
};

const enter = (e) => {
  let width = getComputedStyle(e).width;

  e.style.width = width;
  e.style.position = 'absolute';
  e.style.visibility = 'hidden';
  e.style.height = 'auto';

  let height = getComputedStyle(e).height;

  e.style.width = null;
  e.style.position = null;
  e.style.visibility = null;
  e.style.height = 0;

  getComputedStyle(e).height;

  requestAnimationFrame(() => {
    e.style.height = height;
  });
};

const afterEnter = (e) => {
  e.style.height = 'auto';
};

const leave = (e) => {
  let height = getComputedStyle(e).height;

  e.style.height = height;

  getComputedStyle(e).height;

  requestAnimationFrame(() => {
    e.style.height = 0;
  });
};
// TRANSITION COLLAPSE

watch(
  () => props.modelValue,
  (newValue) => {
    list.value = newValue;
  }
);

watch(
  () => props.dragging,
  (newValue) => {
    if (!newValue) {
      emit('update:modelValue', list.value);
      listStore.saveSettings();
    }
  }
);
</script>

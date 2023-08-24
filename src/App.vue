<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col gap-[10px] pt-[20px] px-[20px]">
      <TopPanel v-on:update:showModalType="showModalType = $event" v-on:update:showModalDoc="showModalDoc = $event" />
      <SearchPanel />
    </div>
    <n-scrollbar class="h-[calc(100vh-100px)]">
      <ListType v-model="listStore.listType" v-on:start:Drag="startDrag" v-on:end:Drag="endDrag" v-on:edit:Type="editType($event)" v-on:remove:Type="removeType($event)" :dragging="dragging" v-on:edit:Doc="editDoc($event)" v-on:remove:Doc="removeDoc($event)" :dragOptionsType="dragOptionsType" :dragOptionsDoc="dragOptionsDoc" />
      <div class="flex flex-col pt-[16px] pb-[20px] px-[20px] relative">
        <ListDoc v-model="listStore.listDoc" v-on:start:Drag="startDrag" v-on:end:Drag="endDrag" v-on:edit:Doc="editDoc($event)" v-on:remove:Doc="removeDoc($event)" :dragging="dragging" :dragOptionsDoc="dragOptionsDoc" :withoutParent="true" />
      </div>
    </n-scrollbar>
    <n-modal v-model:show="showModalType" :on-after-leave="modalClose()">
      <n-card style="width: 600px" title="Добавить тип" :bordered="false" closable v-on:close="showModalType = false" size="medium">
        <div>
          <n-form ref="formRef" :label-width="80" :model="formModalType" :rules="rules" size="medium">
            <n-form-item label="Название" path="type.title">
              <n-input v-model:value="formModalType.type.title" placeholder="Название" />
            </n-form-item>
            <n-form-item label="Описание" path="type.description">
              <n-input v-model:value="formModalType.type.description" placeholder="Описание" />
            </n-form-item>
            <n-form-item path="type.color" :show-label="false">
              <div class="flex flex-col w-full relative">
                <div class="flex items-center gap-[5px] mb-[5px]">
                  <div>Цветовой тэг</div>
                  <div class="w-max">
                    <n-button v-on:click="formModalType.type.color_tag.push('#000000')" quaternary circle>
                      <template #icon>
                        <Plus />
                      </template>
                    </n-button>
                  </div>
                </div>
                <div v-for="(color, i) in formModalType.type.color_tag" :key="i" class="flex items-center gap-[5px] mb-[5px]">
                  <n-color-picker v-model:value="formModalType.type.color_tag[i]" :show-alpha="false" :modes="['hex']" />
                  <n-button v-on:click.stop="formModalType.type.color_tag.splice(i, 1)" quaternary circle>
                    <template #icon>
                      <Clear />
                    </template>
                  </n-button>
                </div>
              </div>
            </n-form-item>
          </n-form>
        </div>
        <template #footer>
          <div class="flex justify-end gap-[10px]">
            <n-button v-on:click="showModalType = false" ghost :theme-overrides="buttonThemeOverrides">Отмена</n-button>
            <n-button v-on:click="saveType()" type="primary" :disabled="!formModalType.type.title" ghost :theme-overrides="buttonThemeOverrides">Сохранить</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showModalDoc" :on-after-leave="modalClose()">
      <n-card style="width: 600px" title="Добавить документ" :bordered="false" closable v-on:close="showModalDoc = false" size="medium">
        <div>
          <n-form ref="formRef" :label-width="80" :model="formModalDoc" :rules="rules" size="medium">
            <n-form-item label="Название" path="doc.title">
              <n-input v-model:value="formModalDoc.doc.title" placeholder="Название" />
            </n-form-item>
            <n-form-item label="Название" path="doc.type">
              <n-select v-model:value="formModalDoc.doc.parent" filterable clearable placeholder="Тип документа" :options="selectTypeBuild" />
            </n-form-item>
            <n-form-item label="Описание" path="doc.description">
              <n-input v-model:value="formModalDoc.doc.description" placeholder="Описание" />
            </n-form-item>
            <n-form-item path="doc.color" :show-label="false">
              <div class="flex flex-col w-full relative">
                <div class="flex items-center gap-[5px] mb-[5px]">
                  <div>Цветовой тэг</div>
                  <div class="w-max">
                    <n-button v-on:click="formModalDoc.doc.color_tag.push('#000000')" quaternary circle>
                      <template #icon>
                        <Plus />
                      </template>
                    </n-button>
                  </div>
                </div>
                <div v-for="(color, i) in formModalDoc.doc.color_tag" :key="i" class="flex items-center gap-[5px] mb-[5px]">
                  <n-color-picker v-model:value="formModalDoc.doc.color_tag[i]" :show-alpha="false" :modes="['hex']" />
                  <n-button v-on:click.stop="formModalDoc.doc.color_tag.splice(i, 1)" quaternary circle>
                    <template #icon>
                      <Clear />
                    </template>
                  </n-button>
                </div>
              </div>
            </n-form-item>
          </n-form>
        </div>
        <template #footer>
          <div class="flex justify-between">
            <div class="w-full">
              <n-checkbox v-model:checked="formModalDoc.doc.required"> Обязательный </n-checkbox>
            </div>
            <div class="flex justify-end gap-[10px]">
              <n-button v-on:click="showModalDoc = false" ghost :theme-overrides="buttonThemeOverrides">Отмена</n-button>
              <n-button v-on:click="saveDoc()" type="primary" :disabled="!formModalDoc.doc.title" ghost :theme-overrides="buttonThemeOverrides">Сохранить</n-button>
            </div>
          </div>
        </template>
      </n-card>
    </n-modal>
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { useListStore } from '@/store';
import TopPanel from '@/components/TopPanel.vue';
import SearchPanel from '@/components/SearchPanel.vue';
import ListType from '@/components/ListType.vue';
import ListDoc from '@/components/ListDoc.vue';
import { Clear, Plus } from '@/components/icons';

const themeOverrides = {
  common: {
    primaryColor: '#0066ff',
    primaryColorHover: '#0066ff',
    primaryColorPressed: '#0066ff',
  },
};

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

const listStore = useListStore();

// MANAGE FORM
const formRef = ref(null);

const rules = {
  type: {
    title: {
      required: true,
      message: 'Введите название типа',
      trigger: ['input', 'blur'],
    },
  },
  doc: {
    title: {
      required: true,
      message: 'Введите название документа',
      trigger: ['input'],
    },
  },
};

const showModalType = ref(false);
const formModalType = ref({
  type: {
    title: '',
    description: '',
    color_tag: [],
  },
});

const showModalDoc = ref(false);
const formModalDoc = ref({
  doc: {
    title: '',
    parent: '',
    description: '',
    color_tag: [],
    required: false,
  },
});

const modalClose = () => {
  if (!showModalType.value) {
    formModalType.value = {
      type: {
        title: '',
        description: '',
        color_tag: [],
      },
    };
  }
  if (!showModalDoc.value) {
    formModalDoc.value = {
      doc: {
        title: '',
        description: '',
        color_tag: [],
        parent: '',
      },
    };
  }
  formRef.value?.restoreValidation();
};

const selectTypeBuild = computed(() => {
  let listType = [...listStore.listType];

  return listType.map((e) => {
    return {
      label: e.title,
      value: e.id,
    };
  });
});
// MANAGE FORM

// MANAGE TYPE
const saveType = () => {
  let { id, title, description, color_tag } = formModalType.value.type;
  if (!id) {
    listStore.listType.push({
      id: Date.now(),
      active: false,
      children: [],
      title,
      description,
      color_tag
    });
  } else {
    let type = listStore.listType.find((e) => e.id == id);
    type.title = title;
    type.description = description;
    type.color_tag = color_tag;
  }
  listStore.saveSettings();
  showModalType.value = false;
};

const editType = (id) => {
  let type = { ...listStore.listType.find((e) => e.id == id) };
  formModalType.value.type = type;
  showModalType.value = true;
};

const removeType = (id) => {
  let index = listStore.listType.findIndex((e) => e.id == id);
  listStore.listType.splice(index, 1);
  listStore.saveSettings();
};
// MANAGE TYPE

// MANAGE DOC
const saveDoc = () => {
  let { id, title, description, parent, color_tag, required } = formModalDoc.value.doc;
  if (!id) {
    if (parent) {
      let type = listStore.listType.find((e) => e.id == parent);
      if (type) {
        type.children.push({
          id: Date.now(),
          title,
          description,
          color_tag,
          required,
        });
      }
    } else {
      listStore.listDoc.push({
        id: Date.now(),
        title,
        description,
        color_tag,
        required,
      });
    }
  } else {
    let doc = listStore.listDoc.find((e) => e.id == id);

    if (doc) {
      if (!parent && !doc.parent) {
        doc.title = title;
        doc.description = description;
        doc.color_tag = color_tag;
        doc.required = required;
      } else {
        let index = listStore.listDoc.findIndex((e) => e.id == id);
        listStore.listDoc.splice(index, 1);
        let type = listStore.listType.find((e) => e.id == parent);
        if (type) {
          type.children.push({
            id,
            title,
            description,
            color_tag,
            required,
          });
        }
      }
    } else {
      if (parent) {
        listStore.listType.forEach((e) => {
          let doc_child = e.children.find((c) => c.id == id);
          if (e.id == parent && !doc_child) {
            e.children.push({
              id,
              title,
              description,
              required,
            });
          }
          e.children.forEach((c, i) => {
            if (e.id == parent && c.id == id) {
              c.title = title;
              c.description = description;
            } else if (e.id != parent && c.id == id) {
              e.children.splice(i, 1);
            }
          });
        });
      } else {
        listStore.listType.forEach((e) => {
          let index = e.children.findIndex((c) => c.id == id);
          if (index > -1) {
            e.children.splice(index, 1);
          }
        });
        listStore.listDoc.push({
          id,
          title,
          description,
          color_tag,
          required,
        });
      }
    }
  }
  listStore.saveSettings();
  showModalDoc.value = false;
};

const editDoc = (id) => {
  let doc = { ...listStore.listDoc.find((e) => e.id == id) };
  if (doc.id) {
    formModalDoc.value.doc = doc;
  } else {
    listStore.listType.forEach((e) => {
      let doc_child = { ...e.children.find((c) => c.id == id) };
      if (doc_child.id) {
        formModalDoc.value.doc = { ...doc_child, parent: e.id };
      }
    });
  }
  showModalDoc.value = true;
};

const removeDoc = (id) => {
  let doc = listStore.listDoc.find((e) => e.id == id);
  if (doc) {
    let index = listStore.listDoc.findIndex((e) => e.id == id);
    listStore.listDoc.splice(index, 1);
  } else {
    listStore.listType.forEach((e) => {
      let index = e.children.findIndex((c) => c.id == id);
      if (index > -1) {
        e.children.splice(index, 1);
      }
    });
  }
  listStore.saveSettings();
};
// MANAGE DOC

// DRAG AND DROP
const dragging = ref(false);

const dragOptionsType = computed(() => {
  return {
    animation: 200,
    group: 'type',
    disabled: false,
    ghostClass: 'ghost',
  };
});

const dragOptionsDoc = computed(() => {
  return {
    animation: 200,
    group: 'doc',
    disabled: false,
    ghostClass: 'ghost',
  };
});

const startDrag = (e) => {
  dragging.value = true;
};

const endDrag = (e) => {
  listStore.saveSettings();
  dragging.value = false;
};
// DRAG AND DROP
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  border: 1px solid #dfe4ef;
  box-shadow: 0px 3px 16px rgba(0, 102, 255, 0.7);
  position: relative;
  z-index: 100000;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.expand-enter-active,
.expand-leave-active {
  transition: height 0.25s ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>

import { ref, computed, watch, onMounted, onBeforeMount } from 'vue';
import { defineStore } from 'pinia';

export const useListStore = defineStore('listStore', () => {
  const search = ref('');

  const listType = ref([
    {
      id: 1692829897501,
      title: 'Обязательные для всех',
      description: 'Документы, обязательные для всех сотрудников без исключения',
      color_tag: [],
      active: true,
      children: [
        {
          id: 1692829941783,
          title: 'Паспорт',
          description: '',
          color_tag: [],
          required: true
        },
        {
          id: 1692829946186,
          title: 'ИНН',
          description: '',
          color_tag: [],
          required: true
        },
      ],
    },
    {
      id: 1692829904672,
      title: 'Обязательные для трудоустройства',
      description: 'Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от гражданства',
      color_tag: [],
      active: false,
      children: [
        {
          id: 1692829951270,
          title: 'Трудовой договор',
          description: '',
          color_tag: [],
          required: false
        },
      ],
    },
    {
      id: 1692829916437,
      title: 'Специальные',
      description: '',
      color_tag: [],
      active: false,
      children: [
        {
          id: 1692829956589,
          title: 'Военный билет',
          description: '',
          color_tag: [],
          required: false
        },
      ],
    },
  ]);

  const listDoc = ref([
    {
      id: 1692829923199,
      title: 'Мед. книжка',
      description: '',
      color_tag: ['#8F0EB7FF', '#DA2485FF'],
      required: false
    },
    {
      id: 1692829927629,
      title: 'Тестовое задание кандидата',
      description: 'Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха',
      color_tag: ['#24DA45FF'],
      required: false
    },
    {
      id: 1692829934087,
      title: 'Временный договор',
      description: '',
      color_tag: ['#C3F281FF', '#CB1B1BFF'],
      required: false
    }
  ]);

  const loadSettings = () => {
    let listTypeStorage = localStorage.getItem('listType');
    if (JSON.stringify(listType.value) != listTypeStorage) {
      listType.value = JSON.parse(listTypeStorage);
    };

    let listDocStorage = localStorage.getItem('listDoc');
    if (JSON.stringify(listDoc.value) != listDocStorage) {
      listDoc.value = JSON.parse(listDocStorage);
    };
  };

  const saveSettings = () => {
    let listTypeStorage = localStorage.getItem('listType');
    if (JSON.stringify(listType.value) != listTypeStorage) {
      localStorage.setItem('listType', JSON.stringify(listType.value));
    };

    let listDocStorage = localStorage.getItem('listDoc');
    if (JSON.stringify(listDoc.value) != listDocStorage) {
      localStorage.setItem('listDoc', JSON.stringify(listDoc.value));
    };
  };

  const listTypeBuild = computed({
    get() {
      if (search.value) {
        return listType.value.filter((e) => {
          if (e.title.toLowerCase().includes(search.value.toLowerCase())) {
            let children = e.children.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()));
            e.children = children;
            e.active = true;
            return e;
          };
          if (!e.title.toLowerCase().includes(search.value.toLowerCase())) {
            let children = e.children.filter((c) => c.title.toLowerCase().includes(search.value.toLowerCase()));
            if (children.length > 0) {
              e.children = children;
              e.active = true;
              return e;
            };
          };
        });
      }
      return listType.value;
    },
    set(newValue) {
      if (!search.value) {
        listType.value = newValue;
      };
    }
  });

  const listDocBuild = computed({
    get() {
      if (search.value) {
        return listDoc.value.filter((e) => e.title.toLowerCase().includes(search.value.toLowerCase()));
      };
      return listDoc.value;
    },
    set(newValue) {
      if (!search.value) {
        listDoc.value = newValue;
      };
    }
  });

  watch(search, (newValue) => {
    if (!newValue) {
      loadSettings();
    }
  });

  onBeforeMount(() => {
    let listTypeStorage = localStorage.getItem('listType');
    if (!listTypeStorage) {
      localStorage.setItem('listType', JSON.stringify(listType.value));
    } else if (JSON.stringify(listType.value) != listTypeStorage) {
      listType.value = JSON.parse(listTypeStorage);
    };

    let listDocStorage = localStorage.getItem('listDoc');
    if (!listDocStorage) {
      localStorage.setItem('listDoc', JSON.stringify(listDoc.value));
    } else if (JSON.stringify(listDoc.value) != listDocStorage) {
      listDoc.value = JSON.parse(listDocStorage);
    };
  });

  return {
    listType: listTypeBuild,
    listDoc: listDocBuild,
    search,
    saveSettings,
    loadSettings
  };
});
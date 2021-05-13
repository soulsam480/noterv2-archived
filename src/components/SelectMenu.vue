<script setup lang="ts">
import { computed, defineEmit, defineProps, onBeforeUnmount, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { allowedTags } from '../utils/constants';
import { matchSorter } from '../utils';
import type { MenuItem } from '../types';
defineProps({
  position: {
    type: Object as PropType<{ left?: number; top?: number }>,
    required: true,
  },
});
const emit = defineEmit(['transform-block', 'close-menu']);
const selected = ref(0);
const command = ref('');
const filteredMenu = ref([...allowedTags]);
const isSelected = computed((): MenuItem => filteredMenu.value[selected.value]);
document.addEventListener('keydown', keyHandlers);
onBeforeUnmount(() => document.removeEventListener('keydown', keyHandlers));
watch(
  () => command.value,
  (val, oldVal) => {
    if (val !== oldVal) {
      const items = matchSorter(allowedTags, command.value, 'label');
      filteredMenu.value = [...items];
    }
  },
);
function keyHandlers(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      emit('transform-block', allowedTags[selected.value]);
      emit('close-menu');
      break;
    case 'Backspace':
      if (command.value.length === 1) emit('close-menu');
      command.value = command.value.substring(0, command.value.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      const prevSelected = selected.value === 0 ? allowedTags.length - 1 : selected.value - 1;
      selected.value = prevSelected;
      break;
    case 'ArrowDown':
    case 'Tab':
      e.preventDefault();
      const nextSelected = selected.value === allowedTags.length - 1 ? 0 : selected.value + 1;
      selected.value = nextSelected;
      break;
    case 'Escape':
      e.preventDefault();
      emit('close-menu');
      break;
    default:
      if (!e.code.match(/Key([A-Z])/)) break;
      command.value = command.value + e.key;
      break;
  }
}
function handleClick(tag: string) {
  emit('transform-block', { tag: tag });
  emit('close-menu');
}
</script>
<template>
  <div
    class="w-50 max-h-50 overflow-auto bg-green-50 rounded-lg p-1 absolute"
    id="select-menu"
    :style="{ top: `${position.top}px`, left: `${position.left}px` }"
  >
    <button
      class="hover:bg-green-100 p-2 block w-full text-left"
      v-for="Tag in filteredMenu"
      :key="Tag.id"
      @click="handleClick(Tag.tag)"
      :class="{ 'bg-green-100': isSelected.id === Tag.id }"
    >
      {{ Tag.label }}</button
    ><span class="hover:bg-green-100 p-2 block w-full text-left" v-if="filteredMenu.length === 0"> Nothing found </span>
  </div>
</template>

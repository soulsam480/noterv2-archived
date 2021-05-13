<script lang="ts" setup>
import { ref, onMounted, watch, defineEmit, defineProps, nextTick } from 'vue';
import { getCaretCoordinates } from '../utils';
import SelectMenu from './SelectMenu.vue';

function replaceAll(str: string, search: string, replacement: string) {
  return str.split(search).join(replacement);
}
const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
  contenteditable: {
    type: Boolean,
    default: true,
  },
  modelValue: String,
  noHTML: {
    type: Boolean,
    default: true,
  },
  noNL: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmit([
  'update:modelValue',
  'keydown',
  'add-block',
  'delete-block',
  'arrowup',
  'arrowdown',
  'trans-block',
]);

const element = ref<HTMLElement | null>(null);
const position = ref<{ left?: number; top?: number }>({ left: 20, top: 10 });
const isSelect = ref(false);
const previousKey = ref('');
function currentContent(): string {
  if (!element.value) return '';
  return props.noHTML
    ? (element.value as any).innerText
    : (element.value as any).innerHTML;
}
function updateContent(newcontent: string) {
  if (props.noHTML) {
    element.value!.innerText = newcontent;
  } else {
    element.value!.innerHTML = newcontent;
  }
}
function update(event: KeyboardEvent) {
  emit('update:modelValue', currentContent());
  if (isSelect.value) {
    getPostion();
  }
}
function onPaste(event: any) {
  event.preventDefault();
  let text = (event.originalEvent || event).clipboardData.getData('text/plain');
  if (props.noNL) {
    text = replaceAll(text, '\r\n', ' ');
    text = replaceAll(text, '\n', ' ');
    text = replaceAll(text, '\r', ' ');
  }
  window.document.execCommand('insertText', false, text);
}

function getPostion() {
  const { x, y } = getCaretCoordinates();
  position.value = { left: (x as number) + 10, top: y };
}
function onKeypress(event: KeyboardEvent) {
  if (event.key === '/') {
    getPostion();
    isSelect.value = true;
    nextTick(() => document.getElementById('select-menu')?.focus());
  } else if (event.key == 'Enter' && !isSelect.value) {
    if (previousKey.value !== 'Shift') {
      event.preventDefault();
      emit('add-block');
    }
  } else if (event.key == 'Backspace') {
    if (currentContent().length === 0) {
      event.preventDefault();
      emit('delete-block', element);
    }
  } else if (event.key === 'ArrowUp') {
    emit('arrowup', element);
  } else if (event.key === 'ArrowDown') {
    emit('arrowdown', element);
  }
  previousKey.value = event.key;
}
onMounted(() => {
  updateContent(props.modelValue ?? '');
});
watch(
  () => props.tag,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      nextTick(() => updateContent(props.modelValue ?? ''));
    }
  },
);
watch(
  () => props.modelValue,
  (newval, oldval) => {
    if (newval != currentContent()) {
      updateContent(newval ?? '');
    }
  },
);
</script>
<template>
  <SelectMenu
    v-if="isSelect"
    :position="position"
    @close-menu="isSelect = false"
    @transform-block="$emit('trans-block', { tag: $event.tag })"
    v-bind="$attrs"
  />

  <component
    :is="tag"
    :contenteditable="contenteditable"
    @input="update"
    @blur="update"
    @paste="onPaste"
    @keydown="onKeypress"
    ref="element"
    class="n-block bg-gray-50 focus:bg-gray-100 hover:bg-gray-100 rounded"
    v-bind="$attrs"
  >
  </component>
</template>

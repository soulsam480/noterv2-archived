<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue';
import { v4 as uuid } from 'uuid';
import type { Block as BlockModel } from '../types';
import { setCaretToEnd } from '../utils/index';
import Block from './Block.vue';
const blocks = ref<BlockModel[]>([
  {
    cntent: '',
    id: uuid(),
    tag: 'h1',
  },
]);
function addBlock(isTransform: boolean = true, e: { tag: string; id: string }) {
  if (isTransform) {
    const newBlock: BlockModel = {
      cntent: ' ',
      id: uuid(),
      tag: 'p',
    };
    blocks.value.push({ ...newBlock });
    nextTick(() => {
      document.getElementById(newBlock.id)?.focus();
    });
    return;
  } else {
    let prevBlock = blocks.value.filter((el) => el.id === e.id)[0];
    if (prevBlock.tag === e.tag) return;
    prevBlock = { ...prevBlock, tag: e.tag };
    blocks.value.splice(
      blocks.value.findIndex((el) => el.id === e.id),
      1,
      { ...prevBlock },
    );
    nextTick(() => {
      document.getElementById(prevBlock.id)?.focus();
    });
  }
}
function deleteBlock(bid: string) {
  if (blocks.value.length === 1) return;
  const removedBlock = [...blocks.value.filter((el) => el.id !== bid)];
  blocks.value = [...removedBlock];
  nextTick(() => {
    setCaretToEnd(
      document.getElementById(
        blocks.value[blocks.value.length - 1].id,
      ) as HTMLElement,
    );
  });
}
function arrowHandler(type: string, id: string) {
  const index = blocks.value.map((el) => el.id).indexOf(id);
  if (type === 'up') {
    if (!blocks.value[index - 1]) return;
    setCaretToEnd(
      document.getElementById(blocks.value[index - 1].id) as HTMLElement,
    );
  } else {
    if (!blocks.value[index + 1]) return;
    setCaretToEnd(
      document.getElementById(blocks.value[index + 1].id) as HTMLElement,
    );
  }
}
watchEffect(() => {
  if (blocks.value.length === 0) {
    blocks.value.push({
      cntent: '',
      id: uuid(),
      tag: 'h1',
    });
  }
});
</script>
<template>
  <div>
    <Block
      v-for="block in blocks"
      :tag="block.tag"
      :key="block.id"
      v-model="block.cntent"
      @add-block="addBlock"
      @trans-block="addBlock(false, { tag: $event.tag, id: block.id })"
      :id="block.id"
      @delete-block="deleteBlock(block.id)"
      tabindex="0"
      @arrowup="arrowHandler('up', block.id)"
      @arrowdown="arrowHandler('down', block.id)"
    />
  </div>
</template>

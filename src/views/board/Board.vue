<template>
  <BoardDrawer
    :boardColor="board.color"
    v-model:showDrawer="showDrawer"
    @onChange="onChangeBoard"
  ></BoardDrawer>

  <BoardView    
    :board="board"
    v-model:showDrawer="showDrawer"
    @onChange="onChangeBoard"
  ></BoardView>
</template>

<script setup>
import { ref } from 'vue';

import BoardDrawer from './BoardDrawer.vue';
import BoardView from './BoardView.vue';

const showDrawer = ref(false)
const board = ref({
  id: 1,
  name: "Board 1",
  color: "#4E5754",
  favorite: true,
  background: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
})

function onChangeBoard(obj) {
  // spread both objects and overrides 'board' with values incoming from 'obj'
  board.value = {...board.value, ...obj}
}
</script>
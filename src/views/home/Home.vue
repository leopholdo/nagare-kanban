<template>
  <v-main>
    <v-container>
      <BoardWrapper
        :list="boardsFavorites"
        name="Quadros favoritos"
        icon="mdi-heart"
        :showNewBoard="false"
        @onFavorite="onFavorite"
      ></BoardWrapper>

      <BoardWrapper
        :list="boards"
        name="Meus quadros"
        @onFavorite="onFavorite"
      ></BoardWrapper>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import BoardWrapper from './components/BoardWrapper.vue';

// #region data
const newBoard = ref(false)
const newBoardName = ref("")
const boardsFavorites = ref([])
const boards = ref([
    { id: 1, name: "Board 1", color: "#4E5754", background: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80", favorite: true },
    { id: 2, name: "Board 2", color: "#25221B", background: "https://images.unsplash.com/photo-1665596553785-15f7b2004771?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", favorite: false },
    { id: 3, name: "Board 3", color: "#434B4D", background: "https://images.unsplash.com/photo-1665419557618-749581be72ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80", favorite: false },
    { id: 4, name: "Board 4", color: "#A52019", background: "https://images.unsplash.com/photo-1659535857317-9378cb28736e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80", favorite: false },
    { id: 5, name: "Board 5", color: "#23282B", background: "https://images.unsplash.com/photo-1662581872342-3f8e0145668f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80", favorite: true },
    { id: 6, name: "Board 6", color: "#6D3F5B", background: "https://images.unsplash.com/photo-1665513325803-51c55fbb5689?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80", favorite: false },
    { id: 7, name: "Board 7", color: "#E7EBDA", background: "https://images.unsplash.com/photo-1665391837905-74d250172dd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80", favorite: false },
    { id: 8, name: "Board 8", color: "#6D6552", background: "https://images.unsplash.com/photo-1665606855702-144fd49af552?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", favorite: false },
    { id: 9, name: "Board 9", color: "#287233", background: "https://images.unsplash.com/photo-1664575197229-3bbebc281874?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", favorite: false },
])
// #endregion data

// #region lifecycle
onMounted(() => {
  boardsFavorites.value = boards.value.filter(b => b.favorite);
})
// #region lifecycle

// #region methods
function onFavorite(board) {
  boards.value.find(b => b.id == board.id).favorite = !board.favorite;
  refreshList();
}

function refreshList() {
  // get boardlist
  boardsFavorites.value = boards.value.filter(b => b.favorite);
}
// #endregion methods
</script>

<style lang="scss" scoped>

</style>
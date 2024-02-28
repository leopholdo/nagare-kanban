<template>
  <v-fade-transition>
    <v-main v-if="!isLoading.boards">
      <v-container>
        <div class="d-flex justify-center">
          <div class="board-wrapper">
            <v-row no-gutters class="mx-4 mt-8 mb-4">
              <v-col cols="12" sm="5" md="4" class="my-2">
                <v-text-field
                  clearable
                  variant="solo"
                  prepend-inner-icon="mdi-magnify"
                  label="Pesquisar quadros"
                  v-model="filter"
                ></v-text-field>
              </v-col>

              <v-spacer></v-spacer>

              <v-col cols="12" sm="4" md="3" class="my-2 text-end">
                <v-btn
                  height="48"
                  class="font-weight-regular"
                  @click="showModalClosedBoards = true">
                  Ver quadros fechados
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>

        <BoardWrapper
          v-if="boardsFavorites.length && !filter"
          :list="boardsFavorites"
          :showNewBoard="false"
          name="Quadros favoritos"
          icon="mdi-heart"
          class="my-4"
          @onFavorite="onFavorite"
          @onClickBoard="updateLog"
        ></BoardWrapper>

        <BoardWrapper
          v-if="boardsLog.length  && !filter"
          :list="boardsLog"
          :showNewBoard="false"
          name="Visualizado recentemente"
          icon="mdi-clock-outline"
          class="my-4"
          @onFavorite="onFavorite"
          @onClickBoard="updateLog"
        ></BoardWrapper>

        <BoardWrapper
          :list="boards"
          name="Meus quadros"
          class="my-4"
          @onFavorite="onFavorite"
          @onClickNew="showModalNewBoard = true"
          @onClickBoard="updateLog"
        ></BoardWrapper>
      </v-container>

      <ModalNewBoard
        v-if="showModalNewBoard"
        v-model:show="showModalNewBoard"
      ></ModalNewBoard>

      <ModalClosedBoards
        v-if="showModalClosedBoards"
        v-model:show="showModalClosedBoards"
        @onReopenBoard="getBoards"
      ></ModalClosedBoards>
    </v-main>

    <Loader v-else/>
  </v-fade-transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import { useCallerStore } from '@/store/caller';

import { debounce } from '@/utils/helpers';

import Loader from '@/components/Loader.vue';
import BoardWrapper from './components/BoardWrapper.vue';
import ModalNewBoard from './components/ModalNewBoard.vue';
import ModalClosedBoards from './components/ModalClosedBoards.vue';

const callerStore = useCallerStore();

// Refs
const isLoading = ref({
  boards: true
})

const showModalClosedBoards = ref(false)
const showModalNewBoard = ref(false)

const filter = ref('')

const boardsFavorites = ref([])
const boardsLog = ref([])
const boards = ref([])

var boardsLogFixed = []
var boardsFixed = []

// Hooks
onMounted(async () => {
  isLoading.value.boards = true

  await getBoards(false)

  await getLog()

  isLoading.value.boards = false
})

watch(filter, (val) => {
  filterBoards(val)
})

// Methods
async function getBoards() {
  await callerStore.fetchData({
    url: 'Board/GetBoards?isClosed=false'
  }).then((response) => {
    if(callerStore.hasError) return

    boardsFixed = response
    boards.value = response

    boardsFavorites.value = boards.value.filter(b => b.favorite);
  })
}

async function getLog() {
  isLoading.value.boards = true

  await callerStore.fetchData({
    url: 'Board/GetUserLog'
  }).then((response) => {
    if(callerStore.hasError) return

    boardsLogFixed = response ?? []
    boardsLog.value = boardsLogFixed

    isLoading.value.boards = false
  })
}

const filterBoards = debounce((name) => {
  if(!name){
    boards.value = boardsFixed
  } else {
    boards.value = boardsFixed.filter(b =>
     b.name.toLowerCase().includes(name.toLowerCase())
    )
  }
}, 250)

function updateLog(boardId) {
  callerStore.fetchData({
    method: 'put',
    url: `Board/UpdateLog/${boardId}`
  })
}

async function onFavorite(board) {
  board.favorite = !board.favorite

  await callerStore.fetchData({
    method: 'put',
    url: 'Board/UpdateBoard',
    data: board
  })

  boards.value.find(b => b.id == board.id).favorite = board.favorite;

  boardsFavorites.value = boards.value.filter(b => b.favorite);
}
</script>

<style lang="scss" scoped>
:deep(.board-wrapper) {
  width: 1128px;
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 1264px) {
  :deep(.board-wrapper) {
    width: 846px;
  }
}
@media screen and (max-width: 886px) {
  :deep(.board-wrapper) {
    width: 564px;
  }
}
@media screen and (max-width: 604px) {
  :deep(.board-wrapper *:not(.wrapper-title *):not(.v-card-actions   *)) {
    width: 100% !important;
  }
}
</style>
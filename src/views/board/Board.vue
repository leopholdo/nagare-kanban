<template>
  <BoardDrawer
    :boardColor="board.color"
    :background="board.backgroundImage ?? board.color"
    v-model:showDrawer="showDrawer"
    @onChangeBackground="onChangeBackground"
    @onCloseBoard="onCloseBoard"
  ></BoardDrawer>

  <Loader v-if="isLoading.board"></Loader>

  <v-main   
    id="board-main-wrapper">
    <div class="toolbar d-flex px-3 mb-3" id="toolbar">
      <input 
        class="board-name-input"
        type="text" 
        :value="board.name"
        @blur="evt => onChangeBoard({name: evt.target.value})">
        
      <IconBtn @click="onFavorite(board)">
        <v-icon>
          {{ board.favorite ? 'mdi-star' : 'mdi-star-outline' }}
        </v-icon>  
      </IconBtn>

      <v-btn
        icon 
        variant="text"
        title="Opções"
        size="large"
        density="compact"
        @click="showDrawer = true"
        class="ml-auto">
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
    </div>

    <div class="board-view-wrapper">
      <VueDraggable
        v-model="boardLists"
        ghostClass="ghost"
        animation="150"
        target=".board-list-target"
        @start="onStartDragList"
        @update="onEndDragList">
        <TransitionGroup
          type="transition"
          tag="div"
          :name="!drag ? 'fade' : null"
          class="board-list-target d-flex">
          <div 
            class="board-list-wrapper d-flex" 
            v-for="list in boardLists" 
            :key="list.id">
            <v-card 
              color="#242527f7" 
              width="300" 
              class="ma-2"
              style="flex-shrink: 0;">
              <v-card-title class="d-flex w-100">
                <input 
                  class="w-100 mr-2 font-weight-bold"
                  type="text" 
                  v-model="list.name"
                  @keyup.enter="evt => evt.target.blur()"
                  @blur="updateList(list)"
                >
                <v-menu 
                  :close-on-content-click="!showModalDeleteList"
                  @update:modelValue="showModalDeleteList = false">
                  <template v-slot:activator="{ props }">
                    <v-icon class="ml-auto" v-bind="props">
                      mdi-menu
                    </v-icon>
                  </template>

                  <template v-slot:default>
                    <v-list density="compact" v-if="!showModalDeleteList">
                      <v-list-item
                        value="delete"
                        title="Excluir lista"
                        prepend-icon="mdi-delete"
                        @click="deleteList(list.id)">
                      </v-list-item>
                    </v-list>
                    <ModalDeleteList
                      v-else
                      :boardLists="boardLists"
                      :selectedBoardList="list"
                      v-model:show="showModalDeleteList"
                      @onTransferCards="onTransferCards"
                    ></ModalDeleteList>
                  </template>
                </v-menu>
              </v-card-title>

              <v-card-text class="mb-2 pb-1" :id="list.id">
                <VueDraggable
                  v-model="list.cards"
                  animation="150"
                  group="card"
                  ghostClass="ghostCard"
                  :style="{'min-height': !list.control.showAddCard ? '30px': '0px'}"
                  @start="onStartDragCard"
                  @end="onEndDragCard">
                  <BoardListCard                        
                    v-for="card in list.cards" 
                    :key="card.id"                        
                    :name="card.name"
                    @click="selectedCard = card">
                  </BoardListCard>
                </VueDraggable>

                <v-card 
                  v-if="list.control.showAddCard"
                  :id="'input-add-card-' + list.id">
                  <v-card-text>
                    <v-form 
                      :ref="(el) => (formAddCard[list.id] = el)" 
                      @submit.prevent="addCard(list)"
                      @keydown.esc="list.control.showAddCard = false">
                      <v-text-field
                        hide-details
                        class="mb-3"                  
                        variant="plain"
                        placeholder="Insira o título do cartão"
                        :rules="[required]"
                        :ref="(el) => (inputNewCardRef = el)"
                        v-model="list.control.newCardName"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-card-text>

              <v-card-actions class="mx-2 mb-2">
                <div v-if="list.control.showAddCard"
                  class="d-flex align-center"
                  style="gap: 10px">
                  <v-btn 
                    color="success" 
                    variant="tonal"
                    style="flex: 1"
                    :loading="list.control.isLoading"
                    @click.stop="addCard(list)">
                    Adicionar cartão
                  </v-btn>
                  
                  <CloseBtn
                    color="error"
                    size="large"
                    variant="plain"
                    density="compact"
                    class="ml-0"
                    @click="cancelAddCard(list)"
                  ></CloseBtn>
                </div>

                <div v-else>
                  <v-btn 
                    variant="tonal"
                    @click="handleShowAddCard(list)">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                    Adicionar cartão
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </TransitionGroup>
      </VueDraggable>

      <v-card 
        id="card-add-list"
        class="ma-2"
        color="#242527f7" 
        width="300" 
        :hover="!showAddList"
        style="flex-shrink: 0; height: fit-content;">
        <v-card-text class="pb-4" @click="handleShowAddList">
          <div 
            v-if="showAddList" 
            v-on-click-outside="() => cancelAddList()">
            <v-form 
              ref="formAddList" 
              @submit.prevent="addList"
              @keydown.esc="showAddList = false">
              <v-text-field
                density="compact"
                bg-color="#19191cf5"
                placeholder="Insira o nome da lista"
                :rules="[required]"
                :ref="(el) => (inputNewListNameRef = el)"
                v-model="newListName"
              ></v-text-field>

              <div 
                class="d-flex align-center mt-4"
                style="gap: 10px">
                <v-btn 
                  color="#216dc28c" 
                  type="submit"
                  :loading="isLoading.btnAddList">
                  Adicionar lista
                </v-btn>

                <CloseBtn
                  size="large"
                  density="compact"
                  class="ml-0"
                  @click.stop="cancelAddList"
                ></CloseBtn>
              </div>
            </v-form>
          </div>

          <div 
            v-else
            class="flex-center cursor-pointer font-weight-bold" 
            style="gap: 5px">
            <v-icon>
              mdi-plus
            </v-icon> 
            
              Adicionar lista
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-fade-transition>
      <Card
        v-if="selectedCard != null"
        :card="selectedCard"
        :boardLists="boardLists"
        @onClose="selectedCard = null"
        @cardHasChanged="cardHasChanged"
        @positionHasChanged="cardPositionHasChanged"
      ></Card>
    </v-fade-transition>
  </v-main>
</template>

<script setup>
import { ref, onBeforeMount, nextTick } from 'vue';
import { vOnClickOutside } from '@vueuse/components'
import { required } from '@/utils/validations'

import { useRouter } from 'vue-router';
import { useCallerStore } from "@/store/caller";
import { useAlertStore } from '@/store/alert';

import { VueDraggable } from 'vue-draggable-plus'
import Loader from '@/components/Loader.vue';
import BoardDrawer from './BoardDrawer.vue';
import BoardListCard from "./components/BoardListCard.vue"
import ModalDeleteList from './components/ModalDeleteList.vue';
import Card from "./components/Card.vue";

// Props
const props = defineProps([
  'id'
])

// Stores
const callerStore = useCallerStore()

const router = useRouter();

// Refs
const drag = ref(false)
const dragCard = ref(false)

const showDrawer = ref(false)
const showCard = ref(false)
const showAddList = ref(false)
const showModalDeleteList = ref(false)

const board = ref({})

const formAddCard = ref({})
const formAddList = ref({})
const inputNewCardRef = ref()
const inputNewListNameRef = ref()

const newListName = ref("")

const isLoading = ref({
  board: true,
  btnAddList: false
})

const boardLists = ref([])
const selectedCard = ref(null)

// Hooks 
onBeforeMount(async () => {
  await getBoard()

  await setBackground()

  await getBoardLists()

  isLoading.value.board = false
})

// Methods
// #region Board
async function getBoard() {
  await callerStore.fetchData({
    url: `Board/GetBoard/${props.id}`
  }).then((response) => {
    if(callerStore.hasError || !response) {
      return
    }

    board.value = response
  })
}

async function onChangeBoard(obj) {
  // spread both objects and overrides 'board' with values incoming from 'obj'
  board.value = {...board.value, ...obj}

  await callerStore.fetchData({
    method: 'put',
    url: 'Board/UpdateBoard',
    data: {
      id: board.value.id,
      name: board.value.name,
      backgroundImage: board.value.backgroundImage,
      color: board.value.color,
      favorite: board.value.favorite
    }
  })
}

async function onFavorite(board) {
  board.favorite = !board.favorite

  await callerStore.fetchData({
    method: 'put',
    url: `Board/UpdateBoardUserFavorite/${board.id}/${board.favorite}`
  })
}

async function setBackground() {
  const element = document.getElementById('board-main-wrapper')

  if(board.value.backgroundImage) {
    let image = new Image()
    image.src = board.value.backgroundImage
  
    // preload image
    await new Promise((resolve) => {
      image.onload = () => {
        const background = `url(${image.src}fit=max&fm=jpg&q=100&w=1800`
        
        element.style['background-image'] = background
        element.classList.add('has-background-image')
        resolve()
      }

      image.onerror = () => resolve()
    })
  } else {
    element.classList.remove('has-background-image')
    element.style['background-image'] = 'none'
    element.style['background-color'] = board.value.color
  }
}

async function onChangeBackground(payload) {
  await onChangeBoard(payload.obj)

  await setBackground()

  payload.callback()
}

async function onCloseBoard() {
  await callerStore.fetchData({
    method: 'put',
    url: `Board/CloseBoard/${board.value.id}`,
  })

  if(callerStore.hasError) return

  const { newAlert } = useAlertStore()

  newAlert({
    text: 'Quadro fechado com sucesso.'
  })

  router.push({
    name: 'Home'
  })  
}
// #endregion Board

// #region BoardList
async function getBoardLists() {
  await callerStore.fetchData({
    url: `BoardList/GetBoardLists/${props.id}`
  }).then((response) => {
    if(callerStore.hasError || !response) {
      return
    }

    response.map(bl => {
      bl.control = {
        showAddCard: false,
        isLoading: false,
        newCardName: '',
      }

      return bl
    })

    boardLists.value = response
  })
}

async function onTransferCards(payload) {
  await getBoardLists()

  payload.callback()
}

function handleShowAddList() {
  showAddList.value = true

  nextTick(() => {
    inputNewListNameRef.value.focus();
  })
}

async function addList() {
  const { valid } = await formAddList.value.validate()
  if(!valid) return

  isLoading.value.btnAddList = true

  await callerStore.fetchData({
    method: 'post',
    url: 'BoardList/CreateBoardList',
    data: {
      name: newListName.value,
      boardId: props.id,
      position: boardLists.value.length
    }
  }).then((response) => {
    if(callerStore.hasError || !response) {
      isLoading.value.btnAddList = false
      return
    }

    response.cards = []

    response.control = {
      showAddCard: false,
      isLoading: false,
      newCardName: '',
    }

    boardLists.value.push(response)

    isLoading.value.btnAddList = false

    cancelAddList()
  })
}

function cancelAddList() {
  formAddList.value.reset()

  showAddList.value = false
}

async function updateList(boardList) {
  await callerStore.fetchData({
    method: 'put',
    url: 'BoardList/UpdateBoardList',
    data: {
      id: boardList.id,
      name: boardList.name,
      boardId: props.id,
      position: boardLists.value.indexOf(boardList)
    }
  }).then((response) => {
    if(callerStore.hasError || !response) {
      return
    }
  })
}

function deleteList(id) {
  const list = boardLists.value.find(bl => bl.id == id)

  if(list.cards.length) {
    if(boardLists.value.length === 1) {
      const { newAlert } = useAlertStore()
      newAlert({
        timeout: 5000,
        type: 'warning',
        text: 'Esvazie os cards da lista antes de excluí-la.'
      })

      return
    }

    showModalDeleteList.value = true
    return
  }

  callerStore.fetchData({
    method: 'delete',
    url: `BoardList/DeleteBoardList/${id}`,
  })  

  const index = boardLists.value.findIndex(list => list.id === id)
  boardLists.value.splice(index, 1)
}

function onStartDragList() {
  drag.value = true
}

function onEndDragList(evt) {
  updateList(boardLists.value[evt.newIndex])

  nextTick(() => {
    drag.value = false
  })
}
// #endregion BoardList

// #region Card
function handleShowAddCard(list) {
  list.control.showAddCard = true

  nextTick(() => {
    inputNewCardRef.value.focus();
  })
}

async function addCard(list) {  
  const { valid } = await formAddCard.value[list.id].validate()
  if(!valid) { 
    const element = document.getElementById(`input-add-card-${list.id}`)
    element.classList.add('shake-horizontal')

    setTimeout(() => {
      element.classList.remove('shake-horizontal')
    }, 300)
    return
  }

  list.control.isLoading = true

  await callerStore.fetchData({
    method: 'post',
    url: 'Card/CreateCard',
    data: {
      name: list.control.newCardName,
      boardListId: list.id
    }
  }).then((response) => {
    list.control.isLoading = false
    cancelAddCard(list)

    if(callerStore.hasError || !response) {
      return
    }

    list.cards.push(response)
  })
}

function cancelAddCard(list) {
  formAddCard.value[list.id].reset()

  list.control.showAddCard = false
}

function onStartDragCard() {
  dragCard.value = true
}

function onEndDragCard(evt) {
  const board = boardLists.value.find(b => b.id == evt.to.offsetParent.id)
  const cardId = board.cards[evt.newIndex].id  

  changeCardPosition(cardId, board.id, evt.newIndex)

  dragCard.value = false
}

async function changeCardPosition(cardId, boardListId, position) {
  await callerStore.fetchData({
    method: 'put',
    url: 'Card/UpdateCardPosition',
    data: {
      id: cardId,
      boardListId: boardListId,
      position: position
    }
  })
}

function cardHasChanged(card) {
  const boardListIndex = boardLists.value.findIndex(bl => bl.id === card.boardListId);
  const cardIndex = boardLists.value[boardListIndex].cards.findIndex(c => c.id === card.id);

  boardLists.value[boardListIndex].cards[cardIndex] = card;
  selectedCard.value = card;
}

async function cardPositionHasChanged(payload) {
  await getBoardLists()

  selectedCard.value = boardLists.value
    .map(bl => bl.cards)
    .flat()
    .find(c => c.id === selectedCard.value.id)

  payload.callback()
}
// #endregion Card
</script>

<style lang="scss" scoped>
.toolbar {
  height: 50px;
  background-color: #0000003d;
  backdrop-filter: blur(2px);
  align-items: center;

  input {
    font-size: 1.3rem;
    font-weight: bold;
  }
}

.board-name-input {
  transition: background-color 0.2s;
  border-radius: 5px;
}
.board-name-input:hover {
  background-color: #5b5b5b3d;
}

.v-main {
  background-size: cover;
  background-position: 50%;
}

.has-background-image {  
  background-blend-mode: darken;
  background-color: #0000004d !important;
}

.board-view-wrapper {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  height: calc(100% - 70px);
}

.ghost {
  .v-card {
    background: #2f3033f7 !important;
  }
}
.ghostCard {
  background: #716e73 !important;
}

.board-list-wrapper {
  .v-card {
    display: flex;
    flex-direction: column;
    height: fit-content;
    max-height: calc(100vh - 170px);
  }

  .v-card-text {
    overflow-y: auto;
    overflow-x: hidden;
    transform: translate3d(0, 0, 0);
    scrollbar-color: #A6C5E229 #A1BDD914;
    scrollbar-width: thin;
  }
}

// ANIMATION
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

.shake-horizontal {
  animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@keyframes shake-horizontal {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70% {
    transform: translateX(-10px);
  }
  20%, 40%, 60% {
    transform: translateX(10px);
  }
  80% {
    transform: translateX(8px);
  }
  90% {
    transform: translateX(-8px);
  }
}

</style>
<template>
  <v-main :style="[{'background-color': props.board.color}]">
    <div class="toolbar d-flex px-3 mb-3" id="toolbar">
      <input 
        class="board-name-input"
        type="text" 
        :value="props.board.name"
        @change="evt => emits('onChange', {name: evt.target.value})">
        
      <IconBtn @click="onClickFavorite">
        <v-icon>
          {{ props.board.favorite ? 'mdi-star' : 'mdi-star-outline' }}
        </v-icon>  
      </IconBtn>

      <v-btn
        icon 
        variant="text"
        title="Opções"
        size="large"
        density="compact"
        @click="emits('update:showDrawer', true)"
        class="ml-auto">
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
    </div>

    <div class="d-flex board-view-wrapper">
      <v-card 
        color="#333333" 
        width="300" 
        class="ma-2"
        style="flex-shrink: 0;"
        v-for="list in boardLists" 
        :key="list.id">
        <v-card-title class="d-flex w-100">
          <input 
            class="w-100 mr-2 font-weight-bold"
            type="text" 
            v-model="list.name"
          >
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon class="ml-auto" v-bind="props">
                mdi-menu
              </v-icon>
            </template>
            <v-list density="compact">
              <v-list-item
                value="delete"
                title="Excluir lista"
                prepend-icon="mdi-delete"
                @click="deleteList(list.id)">
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>

        <v-card-text class="pb-2">
          <BoardListCard
            v-for="card in list.cards" 
            :key="card.id" 
            :name="card.name">
          </BoardListCard>

          <v-card 
            v-if="list.control.showAddCard"
            :id="'input-add-card-' + list.id">
            <v-card-text>
              <v-form :ref="(el) => (formAddCard[list.id] = el)">
                <v-text-field
                  hide-details
                  class="mb-3"                  
                  variant="plain"
                  placeholder="Insira o título do cartão"
                  :rules="[required]"
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
              @click="list.control.showAddCard = true">
              <v-icon>
                mdi-plus
              </v-icon>
              Adicionar cartão
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>

      <v-card 
        id="card-add-list"
        class="ma-2"
        color="#3336" 
        width="300" 
        :hover="!showAddList"
        style="flex-shrink: 0">
        <v-card-text class="pb-2" @click="showAddList = true">
          <div 
            v-if="showAddList" 
            v-on-click-outside="() => cancelAddList()">
            <v-form ref="formAddList">
              <v-text-field
                variant="solo"
                density="compact"
                bg-color="#3336"
                placeholder="Insira o nome da lista"
                :rules="[required]"
                v-model="newListName"
              ></v-text-field>

              <div 
                class="d-flex align-center mt-4 mb-2"
                style="gap: 10px">
                <v-btn 
                  color="success" 
                  variant="tonal"
                  :loading="isLoading.btnAddList"
                  @click.stop="addList">
                  Adicionar lista
                </v-btn>

                <CloseBtn
                  color="error"
                  size="large"
                  variant="plain"
                  density="compact"
                  class="ml-0"
                  @click.stop="cancelAddList"
                ></CloseBtn>
              </div>
            </v-form>
          </div>

          <div 
            v-else
            class="d-flex align-center justify-center font-weight-bold" 
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
        v-if="showCard"
        name="Asd"
        listName="qqq"
        @onClose="showCard = false"
      ></Card>
    </v-fade-transition>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { vOnClickOutside } from '@vueuse/components'
import { required } from '@/utils/validations'

// import { useBoardStore } from "@/store/board";

import BoardListCard from "./components/BoardListCard.vue"
import Card from "@/components/Card.vue";

const props = defineProps([
  'board'
])
const emits = defineEmits([
  'onChange',
  'update:showDrawer'
])

// const boardStore = useBoardStore()

// #region data
const showCard = ref(true)
const showAddList = ref(false)

const formAddCard = ref({})
const formAddList = ref({})

const newListName = ref("")

const isLoading = ref({
  btnAddList: false
})

const boardLists = ref([])
// #region data

onMounted(() => {
  // boardStore.getBoards().then((response) => {
  //   console.log(response);
  // })

  // TODO - GET board lists
  let response = [
    {
      id: 1,
      name: "Lista 1",
      cards: [
        {
          id: 1,
          name: "Tarefa 1",
        },
        {
          id: 2,
          name: "Tarefa 2",
        },
        {
          id: 3,
          name: "Tarefa 3",
        },
      ]
    },
    {
      id: 2,
      name: "Lista 2",
      cards: [
      ]
    }
  ]

  response.forEach((list) => {
    list.control = {
      showAddCard: false,
      isLoading: false,
      newCardName: ''
    }
  })

  boardLists.value = response
})

// #region methods
function onClickFavorite() {
  emits('onChange', {favorite: !props.board.favorite})
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

  //TODO - API
  setTimeout(() => {
    let id = 0

    if(list.cards.length)
      id = Math.max(...list.cards.map(t => t.id)) + 1

    list.cards.push({
      id: id,
      name: list.control.newCardName
    })

    list.control.isLoading = false

    cancelAddCard(list)
  }, 300);
}

function cancelAddCard(list) {
  formAddCard.value[list.id].reset()

  list.control.showAddCard = false
}

async function addList() {
  const { valid } = await formAddList.value.validate()
  if(!valid) return

  isLoading.value.btnAddList = true

  //TODO - API
  setTimeout(() => {
    let id = 0

    if(boardLists.value.length)
      id = Math.max(...boardLists.value.map(t => t.id)) + 1

    boardLists.value.push({
      id: id,
      name: newListName.value,
      control: {
        showAddCard: false,
        isLoading: false,
        newCardName: '',
      }
    })

    isLoading.value.btnAddList = false
  }, 300);
}

function cancelAddList() {
  formAddList.value.reset()

  showAddList.value = false
}

function deleteList(id) {
  const index = boardLists.value.findIndex(list => list.id === id)
  boardLists.value.splice(index, 1)
}
// #endregion methods
</script>

<style lang="scss" scoped>
.toolbar {
  height: 50px;
  background-color: #0000003d;
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

.board-view-wrapper {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  height: calc(100% - 70px);

  .v-card {
    height: fit-content;
  }
}

// ANIMATION
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
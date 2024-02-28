<template>
  <v-dialog 
    persistent scrollable
    v-model="props.show" 
    width="auto"
    :fullscreen="smAndDown"
    @update:model-value="emits('update:show', false)">
    <v-fade-transition hide-on-leave>
      <v-card 
        v-if="showDeleteConfirm"
        class="pb-4"
        :width="smAndDown ? '100vw' : 405">
        <div class="flex-center pa-4">
          <span class="mx-auto">
            Excluir quadro
          </span>

          <CloseBtn
            @click="onLeaveDelete"
          ></CloseBtn>
        </div>

        <v-card-text>
          Você tem certeza que deseja excluir o quadro? Esta ação não pode ser desfeita.

          <v-btn
            block 
            color="error"
            class="mt-5"
            :loading="isLoading.btnDelete"
            @click="onConfirmDelete">
            Excluir
          </v-btn>
        </v-card-text>
      </v-card>

      <v-card 
        v-else
        :width="smAndDown ? '100vw' : 800"
        :height="smAndDown ? '100vh' : null">
        <div class="flex-center pa-4">
          <span class="mx-auto">
            Quadros fechados
          </span>

          <CloseBtn
            @click="emits('update:show', false)"
          ></CloseBtn>
        </div>

        <v-card-text class="pb-8 px-0">
          <v-skeleton-loader
            v-if="isLoading.boards"
            type="list-item, list-item-two-line, list-item-two-line, list-item-two-line"
          ></v-skeleton-loader>

          <v-list 
            v-else-if="boards.length && !isLoading.boards"
            lines="two">
            <v-list-item
              v-for="board in boards"
              :key="board.id"
              :title="board.name"
              :subtitle="'Fechado em ' + board.closingDate">
              <template v-slot:append>
                <v-list-item-action style="gap: 10px;">
                  <v-btn 
                    variant="tonal"
                    prepend-icon="mdi-trash-can"
                    @click="onClickDelete(board)">
                    Excluir
                  </v-btn>

                  <v-btn 
                    color="primary"
                    :loading="isLoading.btnReopen"
                    @click="reopenBoard(board)">
                    Reabrir
                  </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>

          <div 
            v-else
            class="text-center">
            <h3 class="font-weight-regular">
              Nenhum quadro fechado.
            </h3>
            <h2 class="font-weight-regular">
              ¯\_(ツ)_/¯
            </h2>
          </div>
        </v-card-text>
      </v-card>    
    </v-fade-transition>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useDisplay } from 'vuetify';
import { useCallerStore } from '@/store/caller';
import { useAlertStore } from '@/store/alert';

// Refs
const emits = defineEmits([
  'update:show',
  'onReopenBoard'
])

// Props
const props = defineProps([
  'show'
])

const { smAndDown } = useDisplay()
const { newAlert } = useAlertStore();  
const callerStore = useCallerStore()

// Refs
const isLoading = ref({
  boards: false,
  btnDelete: false,
  btnReopen: false
})

const showDeleteConfirm = ref(false)

let selectedBoard = null
const boards = ref([])

// Hooks
onMounted(() => {
  getBoards()
})

// Methods
async function getBoards() {
  isLoading.value.boards = true

  await callerStore.fetchData({
    url: 'Board/GetBoards?isClosed=true'
  }).then((response) => {
    if(callerStore.hasError) return

    if(response?.length) {
      response.forEach(board => {
        board.closingDate = new Date(board.closingDate).toLocaleDateString('pt-BR')
      });
    }

    boards.value = response

    isLoading.value.boards = false
  })
}

function onClickDelete(board) {
  selectedBoard = board
  showDeleteConfirm.value = true
}

function onLeaveDelete() {
  selectedBoard = null
  showDeleteConfirm.value = false
}

async function onConfirmDelete() {
  isLoading.btnDelete = true

  await callerStore.fetchData({
    method: 'delete',
    url: `Board/DeleteBoard/${selectedBoard.id}`
  })

  if(callerStore.hasError) {
    isLoading.btnDelete = false
    return
  }

  let index = boards.value.indexOf(selectedBoard)
  boards.value.splice(index, 1)

  newAlert({
    text: 'Quadro excluído com sucesso.'
  })

  isLoading.btnDelete = false  

  onLeaveDelete()
}

async function reopenBoard(board) {
  isLoading.value.btnReopen = true

  await callerStore.fetchData({
    method: 'put',
    url: `Board/ReopenBoard/${board.id}`
  })

  if(callerStore.hasError) {
    isLoading.value.btnReopen = false
    return
  }

  emits('onReopenBoard')

  let index = boards.value.indexOf(board)
  boards.value.splice(index, 1)

  newAlert({
    text: 'Quadro reaberto com sucesso.'
  })

  isLoading.value.btnReopen = false
}
</script>
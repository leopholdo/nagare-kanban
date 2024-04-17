<template>
  <v-card :width="xs ? '' : 400">
    <div class="flex-center pa-4">
      <span class="mx-auto">
        Mover cartão
      </span>

      <CloseBtn
        @click="emits('update:show', false)"
      ></CloseBtn>
    </div>

    <v-card-text class="pb-8">
      <v-label>
        Selecionar destino
      </v-label>

      <v-row dense>
        <v-col cols="12">
          <v-select
            class="mt-2"
            item-value="id"
            item-title="name"
            :items="boards"
            :item-props="boardProps"
            label="Quadro"
            density="default"
            v-model="selectedBoardId"
            @update:model-value="getBoardLists"
          ></v-select>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" sm="9">
          <v-select
            class="mt-2"
            item-value="id"
            :items="boardLists"
            :item-props="boardListProps"
            label="Lista"
            density="default"
            no-data-text="Não há listas disponíveis"
            v-model="selectedBoardListId"
            @update:model-value="getPositions"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="3">
          <v-select
            class="mt-2"
            :items="positions"
            label="Posição"
            density="default"
            :item-props="positionProps" 
            no-data-text="Não há posições disponíveis"
            v-model="selectedPosition"         
          ></v-select>
        </v-col>
      </v-row>

      <v-row dense class="mt-5">
        <v-col cols="12" sm="4">
          <v-btn 
            block
            width="100%"
            height="45"
            color="primary"
            type="submit"
            :disabled="btnIsDisabled"
            :loading="isLoading.btnSubmit"
            @click="updateCardPosition">
            Mover
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

import { useDisplay } from 'vuetify';
import { useCallerStore } from '@/store/caller';
import { useAlertStore } from '@/store/alert';

// Props
const props = defineProps([
  'cardId',
  'boardId',
  'boardLists',
  'boardListId',
  'position'
])

//Emits 
const emits = defineEmits([
  'onClose',
  'positionHasChanged',
])

// Refs 
const isLoading = ref({
  btnSubmit: false
})
const boards = ref([]);
const boardLists = ref(props.boardLists);
const positions = ref([]);

const selectedBoardId = ref(props.boardId);
const selectedBoardListId = ref(props.boardListId);
const selectedPosition = ref();

const callerStore = useCallerStore();
const alertStore = useAlertStore();
const { xs } = useDisplay();

// Computed
const btnIsDisabled = computed(() => {
  return (
    selectedBoardId.value == null || 
    selectedBoardListId.value == null || 
    selectedPosition.value == null
  )
})

// Hooks
onMounted(async () => {
  await getBoards();

  getPositions();

  selectedPosition.value = props.position +1
})

// Methods
async function getBoards() {
  await callerStore.fetchData({
    url: 'Board/GetBoards?isClosed=false'
  }).then((response) => {
    if(callerStore.hasError || !response) return

    boards.value = response
  })
}

async function getBoardLists() {  
  selectedBoardListId.value = null;
  selectedPosition.value = null;
  positions.value = [];

  await callerStore.fetchData({
    url: `BoardList/GetBoardLists/${selectedBoardId.value}`
  }).then((response) => {
    if(callerStore.hasError || !response) {
      return
    }

    boardLists.value = response

    if(response.length) { 
      selectedBoardListId.value = response[0].id
      getPositions()
    }
  })
}

function getPositions() {
  const selectedBoardList = boardLists.value.find(bl => bl.id === selectedBoardListId.value)

  const availablePositions = selectedBoardList.cards.map(c => c.position +1)
  
  positions.value = availablePositions.length ? availablePositions : [1]

  selectedPosition.value = 1
}

function boardProps(item) {
  return {
    title: item.name,
    subtitle: item.id === props.boardId ? '(Quadro atual)' : ''
  }
}

function boardListProps(item) {
  if(selectedBoardId.value === props.boardId) {
    return {
      title: item.name,
      subtitle: item.id === props.boardListId ? '(Lista atual)' : ''
    }
  } else {
    return {
      title: item.name
    }
  }
}

function positionProps(position) {
  if(selectedBoardId.value === props.boardId && selectedBoardListId.value === props.boardListId){
    return {
      title: position,
      subtitle: position === (props.position +1) ? '(Posição atual)' : ''
    }
  } else {
    return {
      title: position
    }
  }
}

async function updateCardPositionCallback() {
  isLoading.value.btnSubmit = false;

  alertStore.newAlert({
    text: 'Posição atualizada com sucesso'
  })

  emits('onClose');
}

async function updateCardPosition() {
  isLoading.value.btnSubmit = true;

  if(selectedBoardId.value == props.boardId && 
    selectedBoardListId.value == props.boardListId &&
    selectedPosition.value == props.position) {
    updateCardPositionCallback();

    return;
  }

  await callerStore.fetchData({
    method: 'put',
    url: 'Card/UpdateCardPosition',
    data: {
      id: props.cardId,
      boardListId: selectedBoardListId.value,
      position: selectedPosition.value - 1
    }
  })

  emits('positionHasChanged', {
    callback: updateCardPositionCallback
  })
}
</script>

<style lang="scss" scoped>
</style>
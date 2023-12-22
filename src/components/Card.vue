<template>
  <v-dialog 
    width="750"
    v-model="props.show">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col sm="11" class="d-flex flex-column">
            <input 
              class="board-name-input w-100"
              type="text" 
              :value="props.name"
              @change="evt => emits('onChange', {name: evt.target.value})">

              <span class="text-caption ml-1">
                na lista {{ props.listName }}
              </span>
          </v-col>

          <v-col sm="1" class="d-flex justify-end">
            <CloseBtn></CloseBtn>
          </v-col>
        </v-row>

        <v-textarea
          no-resize
          class="mt-5"
          variant="solo-filled"
        ></v-textarea>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script setup>
  
const props = defineProps([
  'show',
  'name',
  'listName'
])
</script>

<style scoped>
.board-name-input {
  transition: background-color 0.2s;
  border-radius: 5px;
}
.board-name-input:hover {
  background-color: #5b5b5b3d;
}
</style>
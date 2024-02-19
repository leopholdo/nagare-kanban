<template>
  <div class="d-flex align-center" :class="{'sm': props.sm}">
    <div class="kanji">
      流れ
    </div>
    <span>
      Nagare
    </span>
  </div>
</template>

<script setup>
const props = defineProps([
  'sm'
])

</script>

<style lang="scss" scoped>
  .kanji {
    writing-mode: vertical-lr;
    font-size: 1.2rem;
    color: #1FAEFF;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
  }

  span {
    font-family: 'Marcellus', serif;
    font-size: 3rem;
  }

  .sm {
    .kanji {
      font-size: 1rem !important;
    }
    span {
      font-size: 2rem !important;
    }
  }
</style>
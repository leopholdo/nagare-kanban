<template>
  <div class="d-flex align-center" :class="{'sm': props.sm}">
    <!-- <div class="kanji">
      流れ
    </div> -->
    <img class="logo-img" src="@/assets/logo.webp"/>
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
  .logo-img {
    width: 50px;
    margin-right: 5px;
  }

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
    .logo-img {
      width: 40px !important;
    }

    .kanji {
      font-size: 1rem !important;
    }

    span {
      font-size: 2rem !important;
    }
  }
</style>
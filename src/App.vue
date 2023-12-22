<template>
  <router-view />
</template>

<script setup>
  //
</script>

<style>
  html { 
    overflow-y: auto !important;
  }

  input {
    padding: 0 5px;
    outline-color: transparent;
    transition: outline-color 0.3s ease-in;
  }
  input:focus {
    outline: solid;
    outline-width: 1px;
    outline-color: #666;
    border-radius: 5px;
  }

  .btn-icon {
    transition: color 0.1s ease-in-out;
  }
  .btn-icon:hover {
    color: #1867C0;
  }

  /* .w-100 {
    width: 100%;
  } */
</style>
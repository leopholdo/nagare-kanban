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

  .action-hover {
    transition: filter 0.1s ease;
    cursor: pointer;
  }
  .action-hover:hover {
    filter:brightness(1.2)
  }

  .action-hover-primary {
    transition: color 0.1s ease-in-out;
    cursor: pointer;
  }
  .action-hover-primary:hover {
    color: #1FAEFF;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cursor-pointer {
    cursor: pointer;
  }
</style>
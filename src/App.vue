<template>
  <div class="d-flex justify-center align-center main">
    <ListVue v-if="store.isOpen === 'list'"/>
    <CreateVue v-if="store.isOpen === 'edit'"/>
  </div>
</template>

<script lang="ts" setup>
  import ListVue from './components/ListVue.vue'
  import CreateVue from './components/CreateVue.vue'
  import { useUserStore } from './store/userStore'

  const store = useUserStore()
</script>

<style lang="scss">
  .main {
    height: 100vh;
  }
</style>
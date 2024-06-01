<template>
  <top-menu />

  <router-view />

  <custom-footer />
</template>

<script lang="ts" setup>
import CustomFooter from '../components/CustomFooter.vue';
import TopMenu from '../components/TopMenu.vue';
</script>

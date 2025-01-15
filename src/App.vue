<template>
  <v-app>
    <router-view></router-view>
    <snackbar-component></snackbar-component>
  </v-app>
</template>

<script>
// @ is an alias to /src
import SnackbarComponent from '@/components/layout/SnackbarComponent.vue'

export default {
  name: 'App',
  components: {
    SnackbarComponent
  }
}
</script>

<template>
  <div class="nav-bar">
    <nav-bar-component></nav-bar-component>
    <v-main>
        <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBarComponent from '@/components/layout/NavBarComponent.vue'

export default {
  name: 'Sidebar',
  components: {
    NavBarComponent
  }
}
</script>

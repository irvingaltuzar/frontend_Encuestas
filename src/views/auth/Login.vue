<template>
  <div class="login">
    <login-component></login-component>
    <snackbar-component></snackbar-component>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginComponent from '@/components/auth/LoginComponent.vue'
import SnackbarComponent from '@/components/layout/SnackbarComponent.vue'

export default {
  name: 'Login',
  components: {
    LoginComponent,
    SnackbarComponent,
  }
}
</script>

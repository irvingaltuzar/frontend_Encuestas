<template>
	<div class="create-user">
		<create-user-component></create-user-component>
    <user-list-component></user-list-component>
	</div>
</template>

<script>
// @ is an alias to /src
/* import CreateUserComponent from '@/components/users/CreateUserComponent.vue'
import UserListComponent from '@/components/users/UserListComponent.vue' */

export default {
  name: 'CreateUser',
  components: {
    /* CreateUserComponent,
    UserListComponent, */
  }
}
</script>

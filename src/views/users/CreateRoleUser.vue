<template>
	<div class="create-user">
		<create-role-user-component></create-role-user-component>
	</div>
</template>

<script>
// @ is an alias to /src
import CreateRoleUserComponent from '@/components/users/CreateRoleUserComponent.vue'

export default {
  name: 'CreateRoleUser',
  components: {
    CreateRoleUserComponent,
  }
}
</script>

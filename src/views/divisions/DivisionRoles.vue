<template>
	<div class="create-division-role">
		<create-division-role-component />
		<division-role-list-component />
	</div>
</template>

<script>
// @ is an alias to /src
import CreateRoleUserComponent from '@/components/users/CreateRoleUserComponent.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'CreateRoleUser',
  components: {
    CreateRoleUserComponent,
  },
}
</script>

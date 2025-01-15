<template>
	<div class="create-poll">
		<div v-if="roles != 0">
			<create-poll-component></create-poll-component>
			<poll-list-component></poll-list-component>
		</div>
		<div v-else>
			<poll-list-component></poll-list-component>
		</div>
	</div>
</template>

<script>
	// @ is an alias to /src
	import CreatePollComponent from '@/components/polls/CreatePollComponent.vue'
	import PollListComponent from '@/components/polls/PollListComponent.vue'
	import { mapMutations, mapState } from 'vuex'


	export default {
		name: 'CreatePoll',
		components: {
			CreatePollComponent,
			PollListComponent,
		},
		computed: {
			...mapState('user', ['roles']),
		},
	}
</script>

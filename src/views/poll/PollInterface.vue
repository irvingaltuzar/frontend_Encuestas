<template>
	<div v-if="!!isEnabled">
		<div v-if="!!!data_response" align="center" class="my-auto">
			<v-app style="background-color:white">
				<div align="center" class="my-auto">
					<!-- <pulse-loader ></pulse-loader> -->
					<ring-loader :loading="isLoading" color="#FF5722" width="100px"></ring-loader>
				</div>
			</v-app>
		</div>
		<div v-else>
			<v-app :style="{ backgroundImage: `url(${poll_by_advisor.poll.poll_background_url})`, backgroundSize: size, backgroundPositionX: position_x, backgroundPositionY: position_y}">
				<poll-interface-component :poll_detail="poll_by_advisor" color="white"></poll-interface-component>
			</v-app>
		</div>
	</div>
	<div v-else>
		<div v-if="!!!data_response" align="center" class="my-auto">
			<v-app style="background-color:white">
				<div align="center" class="my-auto">
					<!-- <pulse-loader ></pulse-loader> -->
					<ring-loader :loading="isLoading" color="#FF5722" width="100px"></ring-loader>
				</div>
			</v-app>
		</div>
		<div v-else>
			<div align="center" class="my-auto">
				<disabled-poll-component></disabled-poll-component>
			</div>
		</div>
	</div>
</template>

<script>
	// @ is an alias to /src
	import PollInterfaceComponent from '@/components/polls/PollInterfaceComponent.vue'
	import RingLoader from 'vue-spinner/src/RingLoader.vue'
	import { mapState, mapMutations } from 'vuex'
	import moment from 'moment'


	export default {
		name: 'PollInterface',
		components: {
			PollInterfaceComponent,
			RingLoader
		},
		data () {
			return {
				id: this.$route.params.id,
				size: 'cover',
				position_x: 'center',
				position_y: 'center'
			}
		},
		methods: {
			...mapMutations('answers', ['getPollAdvisor']),
		},
		computed: {
			...mapState('answers', ['poll_by_advisor', 'isLoading', 'data_response', 'isEnabled']),
			setEnabledPoll () {
				let now = new Date()

				if (moment(now).format('YYYY-MM-DD') >= moment(this.poll_by_advisor.poll.start).format('YYYY-MM-DD') && moment(now).format('YYYY-MM-DD') <= moment(this.poll_by_advisor.poll.end).format('YYYY-MM-DD')) {
					return true
				} else {
					return false
				}
			}
		},
		mounted () {
			this.getPollAdvisor(this.$route.params.id)
		}
	}
</script>

<!-- style --->

<style lang="css" scoped>
	.bg-poll {
		background-image: url('~@/assets/img/background/bg2.jpg');
		background-size: cover;
		background-position-x: center;
	}
</style>

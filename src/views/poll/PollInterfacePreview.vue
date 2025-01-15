<template>
	<v-app style="background-color: #54616e;">
		<poll-interface-preview-component color="white"></poll-interface-preview-component>
	</v-app>
</template>

<script>
	// @ is an alias to /src
	import { mapState, mapMutations } from 'vuex'

	export default {
		name: 'PollInterfacePreview',
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

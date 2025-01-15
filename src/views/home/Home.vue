<template>
	<div class="home">
		<v-row row wrap justify-end fill-heigh>
			<v-col  xs="12" md="12" lg="12">
				<header-component></header-component>
			</v-col>
			<v-col  xs="12" md="12" lg="12" v-if="!!has_text">
				<answers-text-list-component />
			</v-col>
		</v-row>
	</div>
</template>

<script>
// @ is an alias to /src
import HeaderComponent from '@/components/home/HeaderComponent.vue'
import { mapState, mapMutations } from 'vuex'

export default {
	name: 'Home',
	components: {
    HeaderComponent,
	},
	computed: {
		...mapState('chart',['polls', 'has_text']),
	},
}
</script>

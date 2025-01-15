<template>
	<div class="text-center">
		<v-pagination
			v-model="currentPage"
			:length="lastPage"
			:total-visible="5"
			circle
			color="primary"
		></v-pagination>
	</div>
</template>

<script>
import UndrawProblemSolving from 'vue-undraw/UndrawProblemSolving';
import { mapState, mapMutations } from 'vuex'
import Api from "@/store/modules/Api"
import moment from 'moment'

export default {
	name: 'PaginateDivisionRole',
	components: { UndrawProblemSolving },
	props: {
		store: {
			required: true
		},
		collection: {
			required: true
		},
		search: {
			required: true
		}
	},
	data () {
		return {

		}
	},
	watch: {
		currentPage (newVal, oldVal) {
			this.paginatePage( newVal )
		}
	},
	computed: {
		...mapState('division', ['division_roles']),
		currentPage: {
			get() {
				return this.$store.state[this.store][this.collection].current_page
			},
			set (value) {
				this.setCurrentPage(value)
			}
		},
		lastPage: {
			get() {
				return this.$store.state[this.store][this.collection].last_page
			},
			set (value) {

			}
		}
	},
	methods: {
		...mapMutations('division', ['getDivisionRoles', 'setCurrentPage']),
		paginatePage ( pageNumber) {
			this.getDivisionRoles([pageNumber, this.search])
		}
	}
}
</script>

<template>
	<v-row row wrap>
		<v-col hidden-sm-and-down md="4">
			<UndrawNoteList height="180" width="100%" primary-color="#435363" class="my-4"/>
			<div class="caption font-weight-regular text-xs-center grey--text">
				Crea tus tipos de encuestas
			</div>
		</v-col>
		<v-col xs="12" md="8">
			<v-form  @submit.prevent="store">
				<v-text-field :error-messages="v.description" v-model="description" label="Descripción" />
				<v-row row wrap class="mt-4">
					<v-col xs="12">
						<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary">
							<span v-if="!disabled" class="white--text">Guardar</span>
							<div v-else><v-icon class="white--text spin">mdi-sync</v-icon></div>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>
</template>

<!-- script -->

<script>
import { mapState , mapMutations } from 'vuex'
import UndrawNoteList from 'vue-undraw/UndrawNoteList';
import Api from "@/store/modules/Api"

export default {
  name: "ChangePasswordComponent",
  components: {
    UndrawNoteList
  },
	data () {
		return {
			description: '',
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('snackbar', ['showSnackbar']),
		...mapMutations('poll', ['pushTypePoll']),
		store () {
			this.disabled = true

			Api.post('api/poll/type/store', {
				description: this.description,
			})
			.then(res => {
				this.showSnackbar('Guardado correctamente')
				this.pushTypePoll(res.data)
				Object.assign(this.$data, this.$options.data.call(this))
			})
			.catch(error => {
				this.v = new Object()
				setTimeout(() => {
					this.v = error.response.data.errors
				}, 50)
				this.showSnackbar(error.response.data.errors.description)
			})
			.finally(() => {
				this.disabled = false
			})
		}
	}
}
</script>

<style lang="css" scoped>

	.v-text-field >>> input {
			font-size: 0.875rem;
			font-weight: 100;
	}
	.v-text-field >>> label {
			font-size: 0.875rem;
	}
	.v-text-field >>> button {
			font-size: 0.875rem;
	}
</style>

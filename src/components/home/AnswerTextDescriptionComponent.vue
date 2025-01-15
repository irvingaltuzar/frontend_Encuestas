<template>
	<v-row justify="center">
		<v-dialog v-model="dialog" scrollable max-width="60vw" >
			<template v-slot:activator="{ on }">
				<v-btn depressed small rounded color="primary" v-on="on">
						<v-icon small class="white--text">mdi-account-eye</v-icon>
						<span class="white--text">Ver</span>
				</v-btn>
			</template>
			<v-card>
				<v-card-title class="primary white--text">Respuestas</v-card-title>
				<v-divider></v-divider>
				<v-card style="height: auto">
				 <v-card-text>
					 <v-container>
							<v-row justify="center">
								<v-col>
									<v-list dense>
											<v-list-item
											v-for="(answer, index) in answers"
											:key="index"
											class="answer-item"
											>
											<v-list-item-icon>
												<v-icon color="primary">mdi-star-box</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title class="answer-text">
												{{ answer.value }}
												</v-list-item-title>
											</v-list-item-content>
											</v-list-item>
											<v-divider v-if="index < answers.length - 1" :key="'divider-' + index"></v-divider>
										</v-list>
								</v-col>
							</v-row>
						</v-container>
				  </v-card-text>
  			</v-card>
		</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
	import UndrawTransferFiles from 'vue-undraw/UndrawTransferFiles';
	import { mapMutations, mapState } from 'vuex'
	import Api from "@/store/modules/Api"
	import moment from 'moment'

	export default {
		name: 'AnswerTextDescriptionComponent',
		components: { UndrawTransferFiles },
		props: {
		 answers: {
			type: Array,
			required: true
			}
		},
		data () {
			return {
				dialogm1: '',
				dialog: false,
				message_text: null
			}
		},
	
		methods: {
			...mapMutations('snackbar', ['showSnackbar']),
		}
	}
</script>
<style scoped>
.v-card {
  max-width: 100%;
}

.answer-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px;
}

.answer-text {
  white-space: normal;
  word-break: break-word;
}
</style>
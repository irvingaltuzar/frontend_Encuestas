<template>
	<v-container>
		<v-row row wrap v-if="!isSigned">
			<v-col xs="4" md="4" offset-md="4">
				<VueSignaturePad ref="signaturePad" width="100%" height="200px" :customStyle="styles" :options="options"/>
			</v-col>
			<!-- v-col -->
			<v-col xs="12" md="8" offset-md="4" class="text-xs-right" mt-2>
				<a href="#" class="clickable error--text" @click.prevent="clear">Limpiar</a>
			</v-col>
			<!-- v-col -->
			<v-col xs="12" md="6" offset-md="3">
				<v-btn block rounded color="andaresBrand" :disabled="disabled" @click="sign(false)">
					<span class="white--text">Firmar</span>
				</v-btn>
			</v-col>
			<!-- v-col -->
		</v-row>
		<v-row row wrap v-else>
			<div class="justify-center mx-auto mt-2">
				<v-img :src="signature"></v-img>
			</div>
		</v-row>
	</v-container>
</template>

<!-- Script -->
<script>
import { mapState, mapMutations } from 'vuex'
import Api from "@/store/modules/Api"

	export default {
		data () {
			return {
				styles: {
					border: '2px dashed rgba(37, 37, 37, 1)'
				},
				options: {
					penColor: '#0054a0',
					onBegin: this.onBegin
				},
				responsable: '',
				sheet: false,
				disabled: false
			}
		},
		methods: {
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('signature', ['changeStatus', 'getSignature']),
			onBegin () { this.$refs.signaturePad.resizeCanvas() },
			clear () {
				this.$refs.signaturePad.clearSignature()
			},
			handleClick() {
				this.$emit('click')
			},
			sign () {
				this.disabled = true
				const { isEmpty, data } = this.$refs.signaturePad.saveSignature()

				if (isEmpty) {
					this.showSnackbar('Se produjo un error, inténtalo de nuevo más tarde')
					this.disabled = false

					return false
				} else {
					Api.post('/api/signature/store', {
						signature: data
					})
					.then ((res) => {
						this.showSnackbar('Firma guardada, correctamente.')
						this.changeStatus([true, res.data])
						this.disabled = false
					})
					.catch (error => {
						this.showSnackbar('Se produjo un error, inténtalo de nuevo más tarde')
						this.disabled = false
					})
				}
			}
		},
		computed: {
			...mapState('signature', ['isSigned', 'signature']),
		},
		mounted() {
			this.getSignature()
		}
	}
</script>

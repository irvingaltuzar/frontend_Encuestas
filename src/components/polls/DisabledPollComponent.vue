<template>
	<v-container>
		<v-row row wrap justify="center">
			<v-col xs="12">
				<UndrawMaintenance height="300" primary-color="#FF3D00" class="my-4"/>				<div class="text-h4 font-weight-regular text-xs-justify grey--text" align="center">
					Lo sentimos, la encuesta a la que deseas acceder, no está disponible en este momento.
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- script -->
<script>
	import UndrawMaintenance from 'vue-undraw/UndrawMaintenance'
	import UndrawHello from 'vue2-undraw/src/components/UndrawHello'
	export default {
		name: 'DisabledPollComponent',
		components: {
			UndrawMaintenance,
			UndrawHello		
		},
	}
</script>

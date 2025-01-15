<template>
	<v-snackbar multi-line bottom right v-model="show" shaped>
		{{ message }}
	</v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'SnackbarComponent',
	computed: {
		...mapState('snackbar', ['message', 'show'])
	}
}
</script>

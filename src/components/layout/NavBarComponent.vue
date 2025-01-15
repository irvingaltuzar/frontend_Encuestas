<template>
  <div>
    <v-app-bar app :color="this.$vuetify.theme.themes.light.primary" class="white--text" dark>
      <v-app-bar-nav-icon @click="toogleSidebar()"></v-app-bar-nav-icon>
      <v-toolbar-title class="subtitle-2">Encuestas</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
		<left-sidebar-component :status="leftSidebar"></left-sidebar-component>
  </div>
</template>

<!-- script -->

<script>
	import { mapMutations, mapState } from 'vuex'

	export default {

		name:'NavBarComponent',
    data () {
      return {
				leftSidebar: true,
        user: null
      }
    },
    watch: {
      'mobile' (value) {
        !!value ? this.leftSidebar = !this.leftSidebar : this.leftSidebar = !this.leftSidebar
      },
    },
    computed: {
      mobile() {
      return this.$vuetify.breakpoint.xs
      }
    },
		methods: {
			toogleSidebar() {
				this.leftSidebar = !this.leftSidebar
			}
		},
    mounted() {
      this.mobile
    }
	}

</script>

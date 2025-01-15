import Vue from 'vue';
import colors from 'vuetify/lib/util/colors';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#435363',
				secondary: '#405364',
				accent: colors.deepOrange.accent1
			},
		},
	},
});

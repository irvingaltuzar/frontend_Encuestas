<template>
  <v-row >
    <v-dialog v-model="code_dialog" persistent hide-overlay transition="dialog-bottom-transition" max-width="200px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn depressed small rounded color="primary" v-bind="attrs" v-on="on">
					<v-icon small class="white--text">mdi-qrcode-edit</v-icon>
        </v-btn>
      </template>
      <v-card class="text-subtitle-2">
        <v-toolbar dark color="primary" class="subtitle-1">
          <v-btn icon dark @click="code_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="subtitle-1">Externos</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text style="height: 200px;">
					<v-row row wrap justify="center">
						<v-col xs="12" class="text-center">
							<UndrawNewMessage height="80" primary-color="#FF3D00" class="my-4"/>
							<div class="subtitle-2 font-weight-regular text-xs-center grey--text" align="center">
								Ingresa el número de teléfono a 10 digitos
							</div>
						</v-col>
					</v-row>
        </v-card-text>
        <v-card-actions>
					<v-text-field type="number" counter maxLength="11" min=0 max=20 :rules="rules" single-line hide-details hint="Pulse enter para envíar mensaje" label="Enter para envíar mensaje" color="andaresBrand" @keydown.enter.prevent="whatsapp()" v-model="message_phone" prepend-icon="mdi-phone"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<!-- script -->

<script>
import UndrawNewMessage from 'vue-undraw/UndrawNewMessage';
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import Api from "@/store/modules/Api"

export default {
	name: 'PollAccessCodeComponent',
	components: { UndrawNewMessage },
	props: {
		code: {
			required: true
		}
	},
	data () {
		return {
			code_dialog: false,
			rules: [v => v.length <= 10 || 'Máximo 10 caracteres'],
			origin: 'Tasks',
			message_phone: null
		}
	},
	methods: {
		expandRow (index) {
			this.dt.expanded = index == this.dt.expanded[0] ? [] : [index]
		},
		whatsapp () {
			var welcome_message = `¡Para nosotros es muy importante escucharte!
Cuéntanos cómo fue tu experiencia dando clic en el siguiente enlace:

`
			var app_url = `https://encuestas.grupodmi.com.mx:11083/clientes/encuestas/${this.code}`

			var messageText = welcome_message + "("+app_url+")"

			// var url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(advisor.contact_phone) +
			// 					'&text=' + encodeURIComponent(messageText);

			var url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(this.message_phone) +
								'&text=' + encodeURIComponent(messageText);

			window.open(url);

			this.code_dialog = false
			this.message_phone = null
		}
	}
}
</script>

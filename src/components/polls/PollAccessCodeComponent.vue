<template>
  <v-row >
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn depressed small rounded color="primary" v-bind="attrs" v-on="on">
					<v-icon small class="white--text">mdi-qrcode-edit</v-icon>
        </v-btn>
      </template>
      <v-card class="text-subtitle-2">
        <v-toolbar dark color="primary" class="subtitle-1">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="subtitle-1">Códigos de acceso</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
				<v-card-text>
					<v-container>
						<v-row row wrap justify-end fill-heigh>
							<v-col xs="12" md="6" lg="4">
								<v-text-field single-line hide-details label="Buscar" v-model="dt.search" append-icon="search"/>
							</v-col>
						</v-row>
					</v-container>
					<v-data-table :headers="dt.headers" :items="bucket" :search="dt.search" mobile-breakpoint="0">
						<template v-slot:body="{ items }">
							<tbody>
								<tr v-for="(item, index) in items" :key="index">
									<td class="text-center">{{ item.advisor.advisor_name }}</td>
									<td class="text-center">
										{{ item.qr_code }}
									</td>
									<td class="text-center">
										<v-btn depressed small rounded color="primary" @click="whatsapp([item.advisor.advisor, item.qr_code])">
											<v-icon small class="white--text">mdi-whatsapp</v-icon>
										</v-btn>
									</td>
									<td class="text-center">
										<access-code-sender-component :code="item.qr_code"></access-code-sender-component>
									</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<!-- script -->

<script>
import UndrawProfile from 'vue-undraw/UndrawProfile';
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import Api from "@/store/modules/Api"

export default {
	name: 'PollAccessCodeComponent',
	props: {
		bucket: {
			required: true
		}
	},
	data () {
		return {
			dt: {
				headers: [
					{ text: 'Asesor', sortable: false, align: 'center', value: 'advisor.advisor_name' },
					{ text: 'Acceso', sortable: false, align: 'center' },
					{ text: '', sortable: false, align: 'center' },
					{ text: 'Externos', sortable: false },
				],
        expanded: [],
        singleExpand: false,
				toolsIndex: null,
				search: '',
				quotes: [
					'Aún no hay registro.'
				]
			},
			dateParsers: [
				'YYYY-MM-DDHH:mm:ss',
				'YYYY-MM-DDHH:mm',
				'YYYY-MM-DD'
			],
			dialog: false,
			origin: 'Tasks'
		}
	},
	methods: {
		expandRow (index) {
			this.dt.expanded = index == this.dt.expanded[0] ? [] : [index]
		},
		whatsapp (payload) {
			var [advisor, code] = payload

			var welcome_message = `¡Para nosotros es muy importante escucharte!
Cuéntanos cómo fue tu experiencia dando clic en el siguiente enlace:

`

			// var app_url = `${process.env.VUE_APP_BASE_URL}/clientes/encuestas/${code}`
			var app_url = `https://encuestas.grupodmi.com.mx:11083/clientes/encuestas/${code}`

			var messageText = welcome_message + "("+app_url+")"

			// var url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(advisor.contact_phone) +
			// 					'&text=' + encodeURIComponent(messageText);

			var url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(advisor.contact_phone) +
								'&text=' + encodeURIComponent(messageText);

			window.open(url);
		}
	}
}
</script>

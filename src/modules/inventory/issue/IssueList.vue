<template>
  <div style="margin-left: 3%; margin-right: 3%;">
    <issueListCard style="width: 70%;" />

    <v-row>
      <v-col cols="12" sm="4"></v-col>
      <v-col cols="12" sm="2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" range>
            <v-spacer />
            <v-btn text color="red" @click="menu = false">Cancel</v-btn>
            <v-spacer />
            <v-btn
              text
              color="green"
              @click="$refs.menu.save(date), loadData()"
            >
              Ok
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2">
        <v-autocomplete
          :items="['New', 'Approved', 'Rejected']"
          v-model="issueState"
          label="Issue State"
          @change="loadData()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="2">
        <v-autocomplete
          :items="['sm', 'fi', 'gm', 'sk']"
          v-model="roleLogin"
          label="Role"
          @change="loadData()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn
          small
          outlined
          rounded
          color="amber"
          @click="$router.push({ name: 'create-issue' })"
        >
          <v-icon class="amber--text">mdi-loupe</v-icon>
          {{ $t('request new') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-flex mx12 ms12 md12 lg12>
      <v-card>
        <v-data-table
          class="mt-6"
          :headers="headers"
          :items-per-page="10"
          :search="search"
          :items="issue"
        >
          <template v-slot:item.issueDate="{ item }">
            <span>
              {{ new Date(item.issueDate).toISOString().substr(0, 10) }}
            </span>
          </template>

          <template v-slot:item.approve="{ item }">
            <div v-if="roleLogin === 'sm'">
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state == 'pendding'"
                @click="issueForm(item.id)"
              >
                <v-icon class="white--text">mdi-check</v-icon>
                Approve
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state == 'approved'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="red darken-3 text-capitalize"
                v-if="item.state == 'rejected'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
            </div>

            <div v-if="roleLogin === 'fi'">
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state1 == 'pendding'"
                @click="issueForm(item.id)"
              >
                <v-icon class="white--text">mdi-check</v-icon>
                Approve
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state1 == 'approved'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="red darken-3 text-capitalize"
                v-if="item.state1 == 'rejected'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
            </div>

            <div v-if="roleLogin === 'gm'">
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state2 == 'pendding'"
                @click="issueForm(item.id)"
              >
                <v-icon class="white--text">mdi-check</v-icon>
                Approve
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state2 == 'approved'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="red darken-3 text-capitalize"
                v-if="item.state2 == 'rejected'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
            </div>

            <div v-if="roleLogin === 'sk'">
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state3 == 'pendding'"
                @click="issueForm(item.id)"
              >
                <v-icon class="white--text">mdi-check</v-icon>
                Approve
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="green text-capitalize"
                v-if="item.state3 == 'approved'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
              <v-btn
                text
                rounded
                small
                color="white"
                class="red darken-3 text-capitalize"
                v-if="item.state3 == 'rejected'"
                @click="
                  $router.push({
                    name: 'issue-detail',
                    params: { issueId: item.id, roleLogin: roleLogin },
                  })
                "
              >
                <v-icon class="white--text">mdi-information-variant</v-icon>
                Details
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <v-dialog v-model="dialog" scrollable height="900px" max-width="900px">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h2 class="lime--text darken-4">Issuing form</h2>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 600px;">
              <v-form
                @submit.prevent="save"
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-card-text>
                  <v-layout row justify-center>
                    <v-flex xs12 sm12 md10 lg10>
                      <v-layout row wrap justify-center>
                        <v-flex class="mt-7" xs12 sm12 md7 lg7>
                          <v-text-field
                            dense
                            :label="$t('fullName')"
                            v-model="approvedBy"
                            outlined
                            disabled
                            :rules="inputRule"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-layout row justify-center>
                  <v-flex xs12 sm12 md10 lg10>
                    <v-card outlined>
                      <v-data-table
                        class="mb-3"
                        :headers="selecteHeaders"
                        :items="itemData"
                      />
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-spacer />
                <v-layout justify-center>
                  <v-card
                    v-if="roleLogin === 'sk'"
                    width="335"
                    outlined
                    class="rounded-card mt-6 ml-11"
                  >
                    <v-layout justify-center>
                      <h1 class="mt-3">Issued By</h1>
                    </v-layout>
                    <v-divider class="mt-3"></v-divider>
                    <v-layout class="mt-2 mb-2" row justify-center>
                      <Editor
                        :canvasWidth="200"
                        :canvasHeight="150"
                        ref="editorIssued"
                      />
                    </v-layout>
                    <v-layout row>
                      <v-spacer />
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="success"
                        @click="this.pen"
                      >
                        <v-icon left>mdi-pencil</v-icon>
                        Pen
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="info"
                        @click="this.redo"
                      >
                        Redo
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="pink"
                        @click="this.undo"
                      >
                        Undo
                      </v-btn>
                      <v-spacer />
                    </v-layout>
                  </v-card>

                  <v-card width="335" outlined class="rounded-card mt-6 ml-11">
                    <v-layout justify-center>
                      <h1 class="mt-3">Sign here</h1>
                    </v-layout>
                    <v-divider class="mt-3"></v-divider>
                    <v-layout class="mt-2 mb-2" row justify-center>
                      <Editor
                        :canvasWidth="200"
                        :canvasHeight="150"
                        ref="editor"
                      />
                    </v-layout>
                    <v-layout row>
                      <v-spacer />
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="success"
                        @click="this.pen"
                      >
                        <v-icon left>mdi-pencil</v-icon>
                        Pen
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="info"
                        @click="this.redo"
                      >
                        Redo
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        tile
                        small
                        outlined
                        color="pink"
                        @click="this.undo"
                      >
                        Undo
                      </v-btn>
                      <v-spacer />
                    </v-layout>
                  </v-card>
                </v-layout>
                <v-layout row>
                  <v-spacer />
                  <v-spacer />
                  <v-flex class="mt-9" xs12 sm12 md3 lg3 pa-2>
                    <v-btn
                      class="lime darken-4 ml-5 white--text text-capitalize"
                      text
                      @click="saved"
                    >
                      {{ $t('approve') }}
                      <v-icon>mdi-chevron-double-right</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex class="mt-9" xs12 sm12 md3 lg3 pa-2>
                    <v-btn
                      class="red darken-3 white--text text-capitalize"
                      text
                      @click="rejectes"
                    >
                      {{ $t('reject') }}
                      <v-icon>mdi-chevron-double-right</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { path, api } from '@/api'
import Editor from '@/modules/quality/src/Editor'
import AccountService from '@/shared/services'
import { tableMixin } from '@/shared/mixins'
import { csvDownloadMixin } from '@/shared/mixins'
import issueListCard from './issueListCard'
export default {
  name: 'list',
  mixins: [tableMixin, csvDownloadMixin],
  components: {
    Editor,
    issueListCard,
  },
  data() {
    return {
      menu: false,
      date: [
        new Date().toISOString().substr(0, 7) + '-01',
        new Date().toISOString().substr(0, 10),
      ],
      roleLogin: 'sm',
      issueState: 'New',
      resource: api,
      path: path.issue,
      valid: false,
      inputRule: [(v) => !!v || 'This field is required'],
      type: '',
      state: '',
      skill: 20,
      item: {},
      search: '',
      overlay: false,
      dialog: false,
      total: 1000,
      itemData: [],
      sum: 0,
      approvedBy: '',
      approvedDate: '',
      inventoryId: '',
      approvedPerTotal: 0,
      penddingPerTotal: 0,
      rejectedPerTotal: 0,
      approvedLength: 0,
      user: AccountService.getProfile(),
      itemval: ['approved', 'rejected', 'pendding'],

      selecteHeaders: [
        {
          text: this.$t('itemName'),
          value: 'itemName',
        },
        {
          text: this.$t('Material type'),
          value: 'materialType',
        },
        {
          text: this.$t('Material status'),
          value: 'materialStatus',
        },
        {
          text: this.$t('unitPrice'),
          value: 'unitPrice',
        },
        {
          text: 'Item anout',
          value: 'issueSize',
        },
      ],

      years: [],

      headers: [
        {
          text: this.$t('date'),
          value: 'issueDate',
        },
        {
          text: this.$t('issueCode'),
          value: 'issueCode',
        },

        {
          text: this.$t('Issued by'),
          value: 'issuedBy.fullName',
        },

        {
          text: this.$t('type'),
          value: 'type',
        },

        {
          text: this.$t('reason'),
          value: 'reason',
        },

        {
          text: this.$t('Issued By'),
          value: 'issuedBy.fullName',
        },

        {
          text: 'Action',
          value: 'approve',
          sortable: false,
          align: 'center',
        },
      ],
      idno: '',
      issueId: '',
      issueitem: [],
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    ...mapState('inventory', ['issue', 'issueData']),
  },
  methods: {
    ...mapActions('inventory', [
      'getIssue',
      'approveIssue',
      'updateIssuedItemValue',
    ]),
    async loadData() {
      if (this.date.length === 1) this.date[1] = this.date[0]
      await this.getIssue([
        this.issueState,
        this.roleLogin,
        this.date,
      ]).then(() => {})
    },

    async issueForm(issueId) {
      this.issueId = issueId
      this.issueitem = await api.get(issueId, path.issue)
      this.itemData = []
      await api
        .create({ issueId: issueId }, path.getItemLists)
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            this.itemData.push({
              itemName: result[i].itemName,
              materialType: result[i].materialType,
              materialStatus: result[i].materialStatus,
              unitPrice: result[i].unitPrice,
              issueSize: result[i].available,
            })
          }
          this.idno = issueId
        })
      this.dialog = true
    },

    async saved() {
      this.processingIssue('approved')
      if (this.date.length === 1) this.date[1] = this.date[0]
      await this.getIssue([this.issueState, this.roleLogin, this.date]).then(
        (res) => {
          res
        },
      )
      this.dialog = false
      this.loadData()
    },

    processingIssue(request) {
      this.item = {}
      const blob = this.$refs.editor.saveImage()

      this.item.storeManagerId = this.user.id
      if (this.roleLogin === 'sm') {
        this.item.storeManagerSignature = blob.replace(
          /^data:image.+;base64,/,
          '',
        )
        this.item.state = request
        if (request === 'approved') this.item.state1 = 'pendding'
        this.item.storeManaDate = new Date().toISOString().substr(0, 10)
      } else if (this.roleLogin === 'fi') {
        this.item.financeSignature = blob.replace(/^data:image.+;base64,/, '')
        this.item.state1 = request
        if (request === 'approved') this.item.state2 = 'pendding'
        this.item.financeDate = new Date().toISOString().substr(0, 10)
      } else if (this.roleLogin === 'gm') {
        this.item.generalManagerSignature = blob.replace(
          /^data:image.+;base64,/,
          '',
        )
        this.item.state2 = request
        if (request === 'approved') this.item.state3 = 'pendding'
        this.item.generalManadate = new Date().toISOString().substr(0, 10)
      } else {
        const sig = this.$refs.editorIssued.saveImage()
        this.item.storeSignature = blob.replace(/^data:image.+;base64,/, '')
        this.item.issueSignature = sig.replace(/^data:image.+;base64,/, '')
        this.item.state3 = request
        this.item.storeDate = new Date().toISOString().substr(0, 10)
      }
      this.item.id = this.idno
      this.approveIssue(this.item).then(() => {
        this.$router.push({
          name: 'issue-list',
        })
      })
      if (request === 'rejected') {
        this.updateIssuedItemValue(this.item.id)
        this.$notify({
          type: 'danger',
          title: 'Rejected!!',
          message: 'Issue request rejected!',
        })
      } else {
        this.$notify({
          type: 'success',
          title: 'Successful!!',
          message: 'Issue request aproved!',
        })
      }
    },

    async rejectes() {
      this.processingIssue('rejected')
      if (this.date.length === 1) this.date[1] = this.date[0]
      await this.getIssue([this.issueState, this.roleLogin, this.date]).then(
        (res) => {
          res
        },
      )
      this.dialog = false
      this.loadData()
    },

    redo() {
      this.$refs.editor.redo()
    },
    pen() {
      this.$refs.editor.set('freeDrawing', { stroke: 'red' })
    },
    undo() {
      this.$refs.editor.undo()
    },
  },
}
</script>
<style scoped>
.rounded-card {
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
</style>

<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize primary--text"
            @click="
              $router.push({
                name: 'item-list',
                params: { inventoryId: inventoryId },
              })
            "
          >
            <v-icon class="mx-3">arrow_back</v-icon>
            {{ $t('go_back') }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout wrap row justify-center>
          <v-flex xs12 sm12 md10 lg10 pa-2>
            <v-card outlined>
              <v-card-text>
                <v-form
                  @submit.prevent="save"
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-layout row justify-center>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-layout column wrap>
                        <v-flex xs12 sm12 md6 lg6 pa-2>
                          <v-text-field
                            v-model="item.issueCode"
                            :label="$t('Issue code')"
                            name="issueCode"
                            outlined
                            dense
                            :rules="inputRule"
                          />
                        </v-flex>
                        <v-flex xs12 pa-2>
                          <v-text-field
                            v-model="item.type"
                            :label="$t('Issue type')"
                            name="type"
                            outlined
                            dense
                            :rules="inputRule"
                          />
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6 pa-2>
                          <v-text-field
                            v-model="item.issueDate"
                            :label="$t('Issue date')"
                            name="issueDate"
                            outlined
                            dense
                            type="date"
                            :rules="inputRule"
                          />
                        </v-flex>

                        <v-flex xs12 sm12 md6 lg6 pa-2>
                          <v-autocomplete
                            :label="$t('Items')"
                            :items="items"
                            item-text="itemName"
                            item-value="id"
                            name="employeeId"
                            outlined
                            dense
                            multiple
                            :rules="inputRule"
                            v-model="item.items"
                          />
                        </v-flex>

                        <!-- <v-flex xs12 sm12 md6 lg6 pa-2>
                      <v-text-field
                        dense
                        label="Approved by"
                        v-model="item.approvedBy"
                        outlined
                        disabled
                        :rules="inputRule"
                      ></v-text-field>
                    </v-flex> -->
                        <v-flex xs12 sm12 md6 lg6 pa-2>
                          <v-autocomplete
                            :label="$t('Inventory')"
                            :items="inventory"
                            item-text="inventoryName"
                            item-value="id"
                            name="inventoryId"
                            outlined
                            dense
                            :rules="inputRule"
                            v-model="item.inventoryId"
                          />
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 sm12 md6 lg6 pa-2>
                      <v-layout row justify-center>
                        <v-card outlined class="primary">
                          <v-layout row justify-center class="primary">
                            <h2 class="white--text">Sign</h2>
                          </v-layout>
                          <Editor
                            :canvasWidth="350"
                            :canvasHeight="245"
                            ref="editor"
                          />
                        </v-card>
                      </v-layout>
                      <v-layout row justify-center>
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
                      </v-layout>
                      <v-flex xs12 pa-2>
                        <v-text-field
                          :label="$t('Issued by')"
                          outlined
                          dense
                          disabled
                          :rules="inputRule"
                          v-model="issuedBy"
                        />
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md5 lg5 pa-2>
                      <v-btn
                        outlined
                        color="primary"
                        rounded
                        class="text-capitalize"
                        block
                        @click="save"
                      >
                        {{ $t('save') }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { path } from '@/api'
import AccountService from '@/shared/services'
import Editor from '@/modules/quality/src/Editor'

export default {
  data() {
    return {
      issuedBy: '',
      user: AccountService.getProfile(),
      item: {},
      inputRule: [(v) => !!v || 'This field is required'],
    }
  },
  async created() {
    const { issueId } = this.$route.params
    this.getItemById([issueId, path.issue]).then(() => {
      this.item = this.itemById
      this.item.issuedById = this.user.id
    })
    // this.item = await api.get(issueId, path.issue);
    // this.item.issuedById = this.user.id;
    this.issuedBy = this.user.fullName
    this.getItem()
    this.getInventory()
    this.getEmployee()
  },
  computed: {
    ...mapState('inventory', ['inventory', 'employee', 'items', 'itemById']),
  },
  components: {
    Editor,
  },
  methods: {
    ...mapActions('inventory', [
      'getInventory',
      'getEmployee',
      'getItem',
      'getItemById',
      'updateData',
    ]),
    save() {
      if (this.$refs.form.validate()) {
        this.updateData([this.item, path.issue])
          .then(() => {
            this.item = {}
            this.$router.push({
              name: 'issue-list',
            })
            this.$notify({
              type: 'success',
              title: this.$t('  Update issue'),
              message: `${this.$t('Issue')} ${this.$t('updated Successfully')}`,
            })
          })
          .catch((err) => {
            this.showErrors(err)
          })
      }
    },
  },
}
</script>

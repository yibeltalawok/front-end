<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row justify-center>
        <v-flex xs12 sm12 md11 lg11>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <v-card outlined style="border-radius: 12px;">
              <v-toolbar dense flat>
                <h4>Issue details</h4>
                <v-spacer />
              </v-toolbar>
              <v-divider></v-divider>
              <v-layout row justify-center>
                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-text-field
                    :label="$t('Full name')"
                    outlined
                    dense
                    disabled
                    :rules="inputRule"
                    v-model="issuedBy"
                  />
                </v-flex>
                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-text-field
                    :label="$t('Email')"
                    outlined
                    dense
                    disabled
                    :rules="inputRule"
                    v-model="user.email"
                  />
                </v-flex>
                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-select
                    v-model="item.type"
                    :label="$t('Issue type')"
                    name="type"
                    outlined
                    :items="['Returnable', 'Non-returnable']"
                    dense
                    :rules="inputRule"
                  />
                </v-flex>
                <v-flex xs12 sm12 md4 lg4 pa-2>
                  <v-text-field
                    v-model="item.issueCode"
                    :label="$t('Issue code')"
                    name="issueCode"
                    outlined
                    dense
                    :rules="inputRule"
                  />
                </v-flex>
                <v-flex xs12 sm12 md6 lg6 pa-2>
                  <v-textarea
                    rows="2"
                    :label="$t('Reason')"
                    v-model="item.reason"
                    outlined
                    :rules="inputRule"
                  />
                </v-flex>
                <v-spacer></v-spacer>
              </v-layout>
            </v-card>

            <v-layout row justify-center class="mt-5">
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-autocomplete
                  :label="$t('Inventory')"
                  :items="inventory"
                  item-text="inventoryName"
                  item-value="id"
                  name="inventoryId"
                  outlined
                  dense
                  class="ml-5"
                  :rules="inputRule"
                  v-model="item.inventoryId"
                  @input="getRelatedItem(item.inventoryId)"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-autocomplete
                  :label="$t('Items')"
                  :items="relatedItem"
                  item-text="itemName"
                  name="ItemId"
                  :disabled="showItemField"
                  outlined
                  dense
                  multiple
                  :rules="inputRule"
                  return-object
                  v-model="itemData"
                  filled
                  chips
                >
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      outlined
                      color="orange"
                      @click="data.select"
                      @click:close="remove(data.item)"
                    >
                      <span class="black--text">{{ data.item.itemName }}</span>
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-btn
                outlined
                rounded
                style="width: 100px;"
                class="mt-3 text-capitalize white--text green text-capitalize"
                @click="addToTable"
              >
                Add
              </v-btn>
              <v-spacer></v-spacer>
            </v-layout>

            <v-data-table
              :headers="headers"
              :items="tableItem"
              item-key="id"
              style="border: Gainsboro 2px solid;"
            >
              <template v-slot:item.maxSize="{ item }">
                <v-text-field
                  type="number"
                  min="1"
                  :max="item.available"
                  dense
                  v-model="item.maxSize"
                ></v-text-field>
              </template>

              <template v-slot:item.available="{ item }">
                {{ item.available }}
              </template>

              <template slot="headerCell" slot-scope="props">
                <span class="table-header-text caption font-weight-bold">
                  {{ $t(props.header.text) }}
                </span>
              </template>

              <template v-slot:item.action="{ item }">
                <v-btn
                  text
                  small
                  color="success"
                  class="text-capitalize"
                  @click="deleteItem(item.index)"
                >
                  <v-icon small class="red--text">delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>

            <v-layout row wrap justify-center>
              <v-flex xs6 sm6 md4 lg pa-2>
                <v-btn
                  outlined
                  block
                  class="text-capitalize white--text lime darken-4"
                  @click="save"
                >
                  {{ $t('Submit') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { path } from '@/api'
import AccountService from '@/shared/services'
export default {
  data() {
    return {
      user: AccountService.getProfile(),
      path: path.issue,
      item: {},
      ItemId: [],
      showItemField: true,
      headers: [
        {
          text: this.$t('bin card'),
          value: 'binCardNumber',
        },
        {
          text: this.$t('item name'),
          value: 'itemName',
        },
        {
          text: this.$t('Inventory'),
          value: 'inventory.inventoryName',
        },
        {
          text: this.$t('total qt'),
          value: 'maxSize',
        },
        {
          text: 'Aveliable',
          value: 'available',
        },
        {
          text: '',
          value: 'action',
        },
      ],
      itemData: [],
      issuedBy: '',
      inputRule: [(v) => !!v || 'This field is required'],
    }
  },
  mounted() {
    this.pen()
  },
  async created() {
    this.item.issuedById = this.user.id
    this.item.state = 'pendding'
    this.issuedBy = this.user.fullName
    this.item.issueDate = new Date()
    this.getInventory()
    this.getEmployee()
    this.getItem()
  },
  computed: {
    ...mapState('inventory', [
      'inventory',
      'employee',
      'items',
      'relatedItem',
      'tableItem',
      'regiterIssueRequestResponse',
    ]),
  },
  methods: {
    ...mapActions('inventory', [
      'getInventory',
      'getEmployee',
      'getItem',
      'getInventoryRelatedItem',
      'postData',
      'addToCreateIssueTable',
      'regiterIssueRequest',
    ]),
    ...mapMutations('inventory', [
      'addToCreateIssueTable',
      'deleteSelecteIssueItem',
      'makeTableItemNull',
    ]),
    remove(item) {
      let tempData = this.itemData.map((x) => x.id)
      const index = tempData.indexOf(item.id)
      if (index >= 0) this.itemData.splice(index, 1)
    },
    async addToTable() {
      await this.addToCreateIssueTable(this.itemData)
      this.itemData = []
    },
    deleteItem(issueId) {
      this.deleteSelecteIssueItem(issueId)
    },
    getRelatedItem(inventoryId) {
      this.getInventoryRelatedItem(inventoryId)
      this.showItemField = false
    },
    async save() {
      var items = []
      if (this.$refs.form.validate()) {
        for (let i = 0; i < this.tableItem.length; i++) {
          items.push({
            itemId: this.tableItem[i].id,
            issueSize: this.tableItem[i].maxSize,
          })
        }
        this.item.items = items
        await this.regiterIssueRequest({
          common: this.item,
          tableItem: this.tableItem,
        })

        if (this.regiterIssueRequestResponse === true) {
          this.makeTableItemNull()
          this.item = {}
          this.$router.push({
            name: 'issue-list',
          })
          this.$notify({
            type: 'success',
            title: this.$t('  New issue'),
            message: `${this.$t('Issue')} ${this.$t('created Successfully')}`,
          })
        } else {
          this.$notify({
            type: 'danger',
            title: 'Invalid Input!',
            message: `Please correct your Input!`,
          })
        }
      }
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

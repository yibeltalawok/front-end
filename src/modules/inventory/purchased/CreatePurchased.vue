<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize primary--text"
            @click="$router.push({ name: 'purchased-list' })"
          >
            <v-icon class="mx-3">arrow_back</v-icon>
            {{ $t('go_back') }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form">
            <v-layout row justify-center>
              <v-flex xs12 sm12 md8 lg8>
                <v-layout row justify-center>
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
                      return-object
                      @input="getInventoryName"
                      @change="fetchData"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      :label="$t('Purchased date')"
                      placeholder="yyyy-mm-dd"
                      dense
                      outlined
                      v-model="items.purchaseDate"
                      hide-details
                      name="date"
                      type="date"
                      @input="fetchData"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-autocomplete
                      :label="$t('customor')"
                      :items="customer"
                      item-text="customerName"
                      item-value="id"
                      name="customorId"
                      outlined
                      dense
                      :rules="inputRule"
                      return-object
                      @input="getCustomerName"
                      @change="fetchData"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-combobox
                      :label="$t('type')"
                      :items="type"
                      item-value="id"
                      name="type"
                      outlined
                      dense
                      v-model="items.type"
                      :rules="inputRule"
                      return-object
                      @input="fetchData"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      type="number"
                      min="0"
                      outlined
                      :rules="inputRules"
                      dense
                      v-model="items.totalQuantity"
                      label="totalQuantity"
                      @input="fetchData"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      dense
                      label="Approved by"
                      v-model="items.approvedBy"
                      outlined
                      disabled
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout row wrap justify-center>
              <!-- size-->
              <v-flex xs12>
                <table>
                  <tr>
                    <th>item name</th>
                    <th>state</th>
                    <th>location</th>
                    <th>description</th>
                    <th>gm number</th>
                    <th>siv number</th>
                    <th>code</th>
                    <th>addition</th>
                  </tr>
                  <tr v-for="(item, i) in itemData" :key="i">
                    <td>{{ itemData[i].itemName }}</td>
                    <td>
                      <v-text-field
                        type="string"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].state"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="string"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].location"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="string"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].description"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="number"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].gmnum"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="number"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].sivnum"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="string"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].code"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        type="string"
                        dense
                        hide-details
                        v-validate="'required'"
                        v-model="itemData[i].addition"
                        :error-messages="errors.collect('no')"
                      />
                    </td>
                  </tr>
                </table>
              </v-flex>
            </v-layout>
            <br />
            <v-layout row justify-center>
              <v-flex xs6 sm6 md5 lg5>
                <v-btn
                  outlined
                  color="amber"
                  v-show="purchaseBtn"
                  class="text-capitalize white--text"
                  @click="purchase"
                >
                  purchase
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AccountService from '@/shared/services'
export default {
  data() {
    return {
      items: {},
      itemList: [],
      user: AccountService.getProfile(),
      inventoryName: '',
      customorName: '',
      size: 0,
      type: ['Compacted', 'single'],
      inputRule: [(v) => !!v || 'This field is required'],
      purchaseBtn: false,
    }
  },
  async created() {
    this.items.approvedBy = this.user.fullName
    this.getCustomer()
    this.getInventory()
  },
  computed: {
    ...mapState('inventory', ['customer', 'inventory', 'itemData']),
  },
  methods: {
    ...mapActions('inventory', [
      'getCustomer',
      'getInventory',
      'getDataLists',
      'registerPurchase',
    ]),
    purchase() {
      this.registerPurchase(this.itemData)
      this.$notify({
        type: 'success',
        title: 'Successful!!',
        message: 'Purchased item saved successfully!',
      })

      //Bellow commented code used ot reset the form value, but now route to purchasedList page
      // this.items.totalQuantity = undefined
      // this.inventoryName = ''
      // this.customorName = ''
      // this.items.type = undefined
      // this.items.purchaseDate = undefined
      // this.fetchData()
      this.$router.push({ name: 'purchased-list' })
    },
    dataLoad(itemLists) {
      itemLists = this.itemList
      this.getDataLists(itemLists)
    },
    getInventoryName(item) {
      this.items.inventoryId = item.id
      this.inventoryName = item.inventoryName
    },
    getCustomerName(item) {
      this.items.customorId = item.id
      this.customorName = item.id
    },
    fetchData() {
      this.getDataLists([
        this.inventoryName + '-' + Math.floor(Math.random() * 10000 + 1),
        this.items,
        this.customorName,
      ])
      if (
        this.items.totalQuantity === undefined ||
        this.inventoryName === '' ||
        this.customorName === '' ||
        this.items.type === undefined ||
        this.items.purchaseDate === undefined
      )
        this.purchaseBtn = false
      else {
        this.purchaseBtn = true
      }
    },
  },
}
</script>
<style lang="css" scoped>
table {
  border-collapse: collapse;
  width: 100%;
  height: 100%;
}

td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 10px 5px 5px 5px;
}
</style>

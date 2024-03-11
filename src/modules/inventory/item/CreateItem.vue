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

        <div>
          <v-layout wrap row>
            <v-flex
              class="d-flex flex-row errbox"
              xs12
              sm6
              md4
              lg4
              pa-3
              v-for="msg in this.error"
              :key="msg"
            >
              <v-alert type="error" class="erroralert">
                {{ msg }}
              </v-alert>
            </v-flex>
          </v-layout>
          <v-layout wrap row pa-4>
            <h4 class="">Create Item</h4>
            <!-- <v-divider style="width: 50%;"></v-divider> -->
            <br />
          </v-layout>
        </div>

        <ItemComponent
          :item="item"
          :supplier="this.supplier"
          :items="this.items"
          :priceValue="this.priceValue"
          v-on:sendErrorMsg="onError"
        />

        <v-layout row wrap float-right>
          <v-flex style="margin-top: -80px; margin-right: 90px;">
            <v-btn
              small
              rounded
              color="amber"
              class="text-capitalize white--text"
              style="margin-left: 30%;"
              width="100px"
              @click="addToItem"
            >
              {{ $t('add') }}
            </v-btn>
          </v-flex>
        </v-layout>
        <!-- ========== List  of items ==========-->
        <v-layout row justify-center mt-15>
          <v-data-table
            :headers="headers"
            :items="this.tableItem"
            item-key="index"
            style="width: 70%;"
          >
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
        </v-layout>

        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md2 lg2 mb-15>
            <v-btn
              outlined
              small
              rounded
              color="amber"
              class="text-capitalize"
              @click="saveItem"
            >
              {{ $t('save') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
/* eslint-disable no-console */
import { mapActions, mapState, mapMutations } from 'vuex'
import { path } from '@/api'
import AccountService from '@/shared/services'
import ItemComponent from './ItemComponent'
export default {
  components: {
    ItemComponent,
  },
  data() {
    return {
      user: AccountService.getProfile(),
      item: {
        purchasedDate: new Date().toISOString().substr(0, 10),
      },
      items: ['Available', 'Not Available', 'Maintenance'],
      isItemExist: false,
      inventoryId: '',
      inputRule: [(v) => !!v || 'This field is required'],
      error: '',
      headers: [
        {
          text: this.$t('item num'),
          value: 'itemNumber',
        },
        {
          text: this.$t('bin card'),
          value: 'binCardNumber',
        },
        {
          text: this.$t('item name'),
          value: 'itemName',
        },
        {
          text: this.$t('total qt'),
          value: 'totalQuantity',
        },
        {
          text: this.$t(''),
          value: 'action',
        },
      ],
    }
  },
  async created() {
    const { inventoryId } = this.$route.params
    this.inventoryId = inventoryId
    this.item.inventoryId = inventoryId
    this.getSupplier()
  },
  computed: {
    ...mapState('inventory', ['customer', 'supplier', 'tableItem']),
  },
  mounted() {
    this.item.createdById = this.user.id
    this.userName = this.user.fullName
    this.item.stock = this.tableItem.length
    this.getSupplier()
    this.changeExpState(this.item.expirable)
  },
  methods: {
    ...mapActions('inventory', [
      'getCustomer',
      'getSupplier',
      'postData',
      'saveItemToInventory',
    ]),
    ...mapMutations('inventory', [
      'addToCreateInventoryItem',
      'deleteSelecteIssueItem',
      'changeExpState',
    ]),

    onError(value) {
      this.error = value
    },
    savearray() {
      this.inventorItemList(this.item)
      this.$router.push({ name: 'inventory-list' })
    },

    async addToItem() {
      this.item.inventoryId = this.inventoryId
      await this.addToCreateInventoryItem(this.item)
      this.item = { purchasedDate: new Date().toISOString().substr(0, 10) }
      this.item.stock = this.tableItem.length
      console.log('Adding Item.')
    },

    priceValue() {
      this.seItem.available = this.seItem.totalQuantity
      this.item.totalPrice =
        parseFloat(this.item.totalQuantity) * parseFloat(this.item.unitPrice)
    },

    saveItem() {
      this.saveItemToInventory(this.tableItem).then(() => {
        this.$router.push({ name: 'inventory' })
        this.$notify({
          type: 'success',
          title: this.$t('Add Item'),
          message: `${this.$t('Items')} ${this.$t('Added Successfully')}`,
        }).catch((err) => {
          this.showErrors(err)
        })
      })
    },

    save() {
      this.postData([this.item, path.item])
        .then(() => {
          this.item = {}
          this.$router.push({
            name: 'item-list',
            params: { inventoryId: this.inventoryId },
          })
          this.$notify({
            type: 'success',
            title: this.$t('Add New item'),
            message: `${this.$t('item')} ${this.$t('registered Successfully')}`,
          })
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
  },
}
</script>

<style scoped>
.erroralert {
  font-size: 11px;
  padding: 10px;
}
</style>

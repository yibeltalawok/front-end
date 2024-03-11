<template>
  <div>
    <v-card-text>
      <v-form @submit.prevent="save" ref="form" lazy-validation>
        <v-layout row justify-center my-3>
          <v-flex xs12 sm12 md12 lg12 pa-2>
            <v-layout column wrap my-3>
              <v-layout row wrap justify-center>
                <!-- COL - 1 -->
                <v-flex xs12 sm12 md3 lg3 pr-2>
                  <v-layout column justify-center>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.itemNumber"
                        :label="$t('Item no')"
                        name="itemNumber"
                        outlined
                        dense
                        min="0"
                        type="string"
                        @input="checkItemNo(item.itemNumber)"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.binCardNumber"
                        :label="$t('Bin card no')"
                        name="binCardNumber"
                        outlined
                        dense
                        min="0"
                        type="string"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.itemName"
                        :label="$t('Item name')"
                        name="itemName"
                        outlined
                        dense
                        min="0"
                        type="string"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.invoiceNo"
                        :label="$t('Invoice no')"
                        name="invoiceNo"
                        outlined
                        dense
                        min="0"
                        type="number"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.color"
                        :label="$t('Color')"
                        name="color"
                        outlined
                        dense
                        min="0"
                        type="string"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <!-- COL - 2 -->
                <v-flex xs12 sm12 md3 lg3 pr-2>
                  <v-layout column justify-center>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.poNo"
                        :label="$t('poNo')"
                        name="poNo"
                        outlined
                        dense
                        min="0"
                        type="string"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.materialType"
                        :items="items"
                        :label="$t('Material type')"
                        name="type"
                        outlined
                        dense
                        type="string"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.unitOfMeasure"
                        :label="$t('unitOfMeasure')"
                        name="unitOfMeasure"
                        outlined
                        dense
                        type="string"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.totalQuantity"
                        :label="$t('QTY')"
                        name="totalQuantity"
                        outlined
                        dense
                        type="number"
                        @input="priceValue"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.unitPrice"
                        :label="$t('unit price')"
                        name="price"
                        outlined
                        dense
                        min="0"
                        type="number"
                        @input="priceValue"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <!-- COL - 3 -->
                <v-flex xs12 sm12 md3 lg3 pr-2>
                  <v-layout column justify-center>
                    <v-flex xs12 sm12 md4 lg12>
                      <v-text-field
                        v-model="item.totalPrice"
                        :label="$t('totalPrice')"
                        name="value"
                        outlined
                        disabled
                        dense
                        min="0"
                        type="number"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md4 lg12>
                      <v-combobox
                        v-model="item.materialStatus"
                        :items="items"
                        :label="$t('state')"
                        outlined
                        dense
                      ></v-combobox>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-autocomplete
                        :label="$t('Supplier')"
                        :items="supplier"
                        item-text="supplierName"
                        item-value="id"
                        name="supplierId"
                        outlined
                        dense
                        v-model="item.supplierId"
                      >
                        <div slot="prepend-item">
                          <v-btn
                            text
                            block
                            color="amber"
                            class="text-capitalize"
                            @click="createSupplier"
                          >
                            {{ 'Add New Supplier' }}
                          </v-btn>
                        </div>
                      </v-autocomplete>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.inHouseDate"
                        :label="$t('In house date')"
                        name="inHouseDate"
                        outlined
                        dense
                        type="date"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <!-- COL - 4 -->
                <v-flex xs12 sm12 md3 lg3 pr-2>
                  <v-layout column justify-center>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.purchasedDate"
                        :label="$t('Purchased date')"
                        name="purchasedDate"
                        outlined
                        dense
                        type="date"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-text-field
                        v-model="item.GRNno"
                        :label="$t('GRN no')"
                        name="GRNno"
                        outlined
                        dense
                        type="number"
                      />
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12>
                      <v-textarea
                        rows="3"
                        cols="50"
                        label="Description"
                        v-model="item.description"
                        outlined
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>

    <!-- ========= THE DIALOG =========== -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card wrap outlined style="border-radius: 1px;">
          <v-app-bar color="amber">
            <v-card-subtitle>
              <span style="color: white;">Create Supplier</span>
            </v-card-subtitle>

            <v-spacer />

            <v-btn icon dark @click="dialog = false" color="red">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>

          <SupplierComponent
            :item="this.supplierItem"
            :location="this.location"
          />

          <v-card-actions>
            <v-btn class="mr-2" small color="red" text @click="dialog = false">
              Cancel
            </v-btn>

            <v-spacer></v-spacer>
            <div>
              <v-btn small color="amber" text @click="save">
                {{ $t('save') }}
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SupplierComponent from '../suplier/SupplierComponent'
export default {
  components: {
    SupplierComponent,
  },

  data() {
    return {
      inputRule: [(v) => !!v || 'This field is required'],
      dialog: false,
      location: [0, 0],
      supplierItem: {
        location: [],
      },
      errormsg: [],
    }
  },
  name: 'ItemComponent',
  props: ['item', 'supplier', 'items', 'priceValue'],
  computed: {
    ...mapState('inventory', ['itemNumbers']),
  },

  created() {
    this.getItemNumbers()
  },

  methods: {
    ...mapActions('inventory', [
      'getSupplier',
      'postsuplier',
      'getItemNumbers',
    ]),

    createSupplier() {
      this.dialog = true
    },

    checkItemNo(itemno) {
      //  alert(this.orderNumbers)
      this.errormsg = []

      // if the item number entered is in the itemNumbers array, duplicated cutNumber
      if (this.itemNumbers.includes(itemno)) {
        // cutNumbers array contains cutnum
        this.errormsg.push('Item No. ' + itemno + ' already exists')
      }
      this.$emit('sendErrorMsg', this.errormsg)
    },

    async save() {
      if (this.profileDone) {
        this.uploadPicture(this.selectedFileSupplier)
        // alert(this.selectedFileSupplier[0])
      }
      this.supplierItem.location = [
        parseFloat(this.location[0]),
        parseFloat(this.location[1]),
      ]
      //alert(this.item.location[0])
      this.postsuplier([this.supplierItem]).then(() => {
        this.dialog = false
        this.getSupplier()
        // this.$router.push({ name: "suplier-list" });
      })
    },
  },
}
</script>

<style scoped></style>

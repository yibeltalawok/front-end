<template>
  <div>
    <v-form @submit.prevent="save">
      <!-- <form-error-messages :messages="errorMessage" /> -->
      <v-container grid-list-xs fluid>
        <v-layout row wrap justify-center>
          <v-flex 3 xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.shippingMark"
              dense
              v-validate="'required'"
              :error-messages="errors.collect('shippingMark')"
              name="shippingMark"
              :label="$t('shippingMark')"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.codeArticle"
              dense
              v-validate="'required'"
              :error-messages="errors.collect('codeArticle')"
              name="codeArticle"
              :label="$t('codeArticle')"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.talle"
              dense
              v-validate="'required'"
              :error-messages="errors.collect('talle')"
              name="talle"
              :label="$t('talle')"
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              v-model="item.quantity"
              type="number"
              dense
              :label="$t('quantity')"
              v-validate="'required'"
              :error-messages="errors.collect('quantity')"
              name="quantity"
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-combobox
              v-model="item.orderNumber"
              dense
              :label="$t('select-order')"
              :items="orders"
              item-text="orderNumber"
              item-value="orderNumber"
              v-validate="'required'"
              :error-messages="errors.collect('orderNumber')"
              name="orderNumber"
              @input="selectOrder"
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              disabled
              v-model="item.styleNumber"
              dense
              :label="$t('styleNumber')"
              v-validate="'required'"
              :error-messages="errors.collect('styleNumber')"
              name="styleNumber"
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              v-model="item.orderQuantity"
              type="number"
              disabled
              min="0"
              dense
              :label="$t('orderQuantity')"
              v-validate="'required'"
              :error-messages="errors.collect('orderQuantity')"
              name="orderQuantity"
            />
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-container>
      <v-container grid-list-xs fluid>
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-card flat class="mx-2">
            <v-text-field
              type="number"
              min="1"
              dense
              hide-details
              :label="$t('how_many_sizes')"
              v-model="totalSizes"
              v-validate="'required'"
              :error-messages="errors.collect('how_many_sizes')"
              name="how_many_sizes"
            />
          </v-card>
          <v-card flat class="mx-2">
            <v-text-field
              type="number"
              min="1"
              dense
              hide-details
              :label="$t('how_many_colors')"
              v-validate="'required'"
              :error-messages="errors.collect('Color')"
              name="Color"
              v-model="totalColors"
            />
          </v-card>
        </v-toolbar>
        <v-layout row wrap justify-center>
          <v-flex xs7>
            <table>
              <tr>
                <th rowspan="2">{{ $t("color") }}</th>
                <th :colspan="parseInt(totalSizes)">{{ $t("size") }}</th>
                <td colspan="4"></td>
              </tr>
              <tr>
                <td v-for="(size, i) in parseInt(totalSizes)" :key="i">
                  <v-text-field
                    flat
                    dense
                    hide-details
                    v-model="sizes[i]"
                    :label="$t('size') + '-' + (i + 1)"
                    v-validate="'required'"
                    :error-messages="errors.collect('Size_ratio')"
                    name="Size_ratio"
                  />
                </td>
                <th>{{ $t("PCS/CTN") }}</th>
              </tr>
              <tr v-for="(color, i) in parseInt(totalColors)" :key="i">
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    v-model="colors[i]"
                    :label="$t('color') + '-' + (i + 1)"
                    v-validate="'required'"
                    :error-messages="errors.collect('color')"
                    name="color"
                  />
                </td>
                <td v-for="(ts, j) in parseInt(totalSizes)" :key="j">
                  <v-text-field
                    flat
                    type="number"
                    min="0"
                    dense
                    hide-details
                    v-model="sizeValues[j + i * totalSizes]"
                    v-validate="'required'"
                    :error-messages="errors.collect('size_values')"
                    name="size_values"
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    type="number"
                    min="0"
                    v-model="ctnPcs[i]"
                    v-validate="'required'"
                    :error-messages="errors.collect('ctnPcs')"
                    name="ctnPcs"
                  />
                </td>
              </tr>
              <tr>
                <td>{{ $t("total") }}</td>
                <td v-for="(ts, i) in parseInt(totalSizes)" :key="i">
                  <v-text-field
                    flat
                    type="number"
                    min="0"
                    dense
                    hide-details
                    v-model="totalOfSizes[i]"
                    disabled
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    type="number"
                    min="0"
                    dense
                    hide-details
                    v-model="item.ctnPcsTotal"
                  />
                </td>
              </tr>
            </table>
          </v-flex>
          <v-flex xs3>
            <table>
              <tr>
                <th>{{ $t("CTN-NO") }}</th>
                <th>{{ $t("TTL-CTN") }}</th>
              </tr>
              <tr>
                <td>
                  <v-text-field
                    flat
                    v-model="ctnNo"
                    v-validate="'required'"
                    :error-messages="errors.collect('ctnNo')"
                    name="ctnNo"
                    @input="getTotalCarton(ctnNo)"
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    v-model="ttlOtn"
                    v-validate="'required'"
                    :error-messages="errors.collect('TTL_CTN')"
                    name="TTL_CTN"
                    disabled
                  />
                </td>
              </tr>
            </table>
          </v-flex>
          <v-flex xs2>
            <table>
              <tr>
                <td>
                  <span style="visibility:hidden">{{ $t("total") }}</span>
                </td>
              </tr>
              <tr>
                <th>
                  <v-text-field
                    flat
                    disabled
                    dense
                    hide-details
                    :label="$t('TTL-PCS')"
                  />
                </th>
              </tr>
              <tr v-for="(color, i) in parseInt(totalColors)" :key="i">
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    type="number"
                    min="0"
                    v-model="totalPcs[i]"
                    name="totalPcs"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <v-text-field
                    flat
                    type="number"
                    min="0"
                    dense
                    hide-details
                    disabled
                    v-model="item.totalPcsTotal"
                  />
                </td>
              </tr>
            </table>
          </v-flex>
          <v-flex xs12></v-flex>
        </v-layout>

        <v-layout row wrap justify-center>
          <!-- <v-flex xs12 pt-2>
            <h3 class="text-center info--text">{{ $t("summary") }}</h3>
          </v-flex> -->
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              :label="$t('total')"
              dense
              hide-details
              type="number"
              min="0"
              v-model="summary.total"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              type="number"
              min="0"
              :label="$t('totalCTNs')"
              dense
              hide-details
              v-model="summary.totalCTNs"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              type="number"
              min="0"
              :label="$t('grossWeight')"
              dense
              hide-details
              v-model="summary.grossWeight"
              v-validate="'required'"
              :error-messages="errors.collect('grossWeight')"
              name="grossWeight"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              type="number"
              min="0"
              :label="$t('netWeight')"
              dense
              hide-details
              v-model="summary.netWeight"
              v-validate="'required'"
              :error-messages="errors.collect('netWeight')"
              name="netWeight"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              :label="$t('ctnMEAS')"
              dense
              hide-details
              v-model="summary.ctnMEAS"
              v-validate="'required'"
              :error-messages="errors.collect('ctnMEAS')"
              name="ctnMEAS"
            />
          </v-flex>
          <v-flex xs12></v-flex>

          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-btn color="primary" class="text-capitalize" @click="save">
              <v-icon class="mr-2">save</v-icon>
              {{ $t("save") }}
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md1 lg1 pa-2>
            <!-- <v-btn class="text-capitalize" @click="save">{{
              $t("clear")
            }}</v-btn> -->
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      vals: {},
      sizeValues: [],
      errorMessage: {},
      totalColors: 1,
      totalSizes: 4,
      item: {},
      summary: {},
      sizes: [],
      totalOfSizes: [],
      colors: [],
      ctnPcs: [],
      ctnNo: "1-",
      ttlOtn: "",
      totalPcs: [],
      // orders: [],
      orderId: ""
    };
  },
  async created() {
    this.orderItem();
    // this.orders = (await api.all(path.order)).rows.map(x => {
    //   return {
    //     id: x.id,
    //     orderNumber: x.orderNumber,
    //     styleNumber: x.styleNumber,
    //     quantity: x.quantity
    //   };
    // });
  },
  computed: {
    ...mapState("SelectItem", ["orders"])
  },
  methods: {
    ...mapActions("SelectItem", ["orderItem"]),

    ...mapActions("inventory", ["postData"]),
    selectOrder(arg) {
      this.orderId = arg.id;
      this.item.orderNumber = arg.orderNumber;
      this.item.styleNumber = arg.styleNumber;
      this.item.orderQuantity = arg.quantity;
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          let sum = 0;
          this.totalOfSizes = [];
          for (let i = 0; i < parseInt(this.totalSizes); i++) {
            for (let j = 0; j < this.colors.length; j++) {
              sum +=
                parseInt(this.sizeValues[i + j * this.totalSizes]) *
                parseInt(this.ttlOtn);
            }
            this.totalOfSizes.push(sum);
            sum = 0;
          }

          this.totalPcs = [];
          let tpcs = 0;
          for (let i = 0; i < this.colors.length; i++) {
            for (let j = 0; j < parseInt(this.totalSizes); j++) {
              tpcs +=
                parseInt(this.sizeValues[j + i * this.totalSizes]) *
                parseInt(this.ttlOtn);
            }
            this.totalPcs.push(tpcs);
            tpcs = 0;
          }

          //sum of all PCS
          this.item.totalPcsTotal = this.totalPcs.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );
          //set summary totals
          this.summary.total = this.item.totalPcsTotal;
          this.summary.totalCTNs = this.ttlOtn;

          //total of ctnPCS
          this.item.ctnPcsTotal = this.ctnPcs.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );
          //values collection to send to a database
          this.vals = {
            type: 1,
            createdAt: new Date(),
            orderId: this.orderId,
            heading: {
              shippingMark: this.item.shippingMark,
              codeArticle: this.item.codeArticle,
              talle: this.item.talle,
              quantity: this.item.quantity,
              styleNumber: this.item.styleNumber,
              orderNumber: this.item.orderNumber,
              orderQuantity: this.item.orderQuantity
            },
            summary: this.summary,
            data: this.colors.map((x, i) => {
              return {
                color: x,
                ctnPcs: this.ctnPcs[i],
                ctnNo: this.ctnNo,
                ttlOtn: this.ttlOtn,
                totalPcs: this.totalPcs[i],
                values: this.sizes.map((y, j) => {
                  return {
                    size: y,
                    value: this.sizeValues[j + i * this.totalSizes]
                  };
                })
              };
            }),
            totalValues: this.sizes.map((x, i) => {
              return {
                size: x,
                // total: this.totalOfSizes[i]
                total: this.totalOfSizes[i]
              };
            }),
            total: {
              ctnPcs: this.item.ctnPcsTotal,
              ctnNo: this.item.ctnNoTotal,
              ttlOtn: this.item.ttlOtnTotal,
              totalPcs: this.item.totalPcsTotal
            }
          };

          // api
          //   .create(this.vals, path.packingList)
          this.postData([this.vals, path.packingList])
            .then(() => {
              this.$notify({
                type: "success",
                title: "Success",
                message: `Packing List information saved successfully.`
              });
              this.$router.push({ name: "packing" });
            })
            .catch(() => {
              this.$notify({
                type: "danger",
                title: "Failure",
                message: `Unable to save your packing list information right now.`
              });
            });
        } else {
          this.$notify({
            type: "danger",
            title: "Validation Failed",
            message: `Please check your inputs`
          });
        }
      });
    },
    getTotalCarton(ctnNo) {
      this.ttlOtn = 0;
      if (ctnNo.indexOf("-") !== -1) {
        let temp = ctnNo.split("-");
        if (temp[1] !== "") {
          this.ttlOtn = parseInt(temp[1]) - parseInt(temp[0]) + 1;
        }
      }
    }
  }
};
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
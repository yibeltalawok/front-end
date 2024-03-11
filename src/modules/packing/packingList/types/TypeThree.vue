<template>
  <div>
    <v-form @submit.prevent="save">
      <form-error-messages :messages="errorMessage" />
      <v-container grid-list-xs fluid>
        <v-layout row wrap justify-center>
          <v-flex 3 xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.shippingMark"
              dense
              :label="$t('shippingMark')"
              v-validate="'required'"
              :error-messages="errors.collect('shippingMark')"
              name="shippingMark"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.codeArticle"
              dense
              :label="$t('codeArticle')"
              v-validate="'required'"
              :error-messages="errors.collect('codeArticle')"
              name="codeArticle"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.talle"
              dense
              :label="$t('talle')"
              v-validate="'required'"
              :error-messages="errors.collect('talle')"
              name="talle"
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
              :label="$t('orderNumber')"
              :items="orders"
              item-text="orderNumber"
              item-value="orderNumber"
              @input="selectOrder"
              v-validate="'required'"
              :error-messages="errors.collect('orderNumber')"
              name="orderNumber"
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
              v-model="totalColors"
              v-validate="'required'"
              :error-messages="errors.collect('how_many_colors')"
              name="how_many_colors"
            />
          </v-card>
        </v-toolbar>
        <table>
          <tr>
            <th rowspan="2">{{ $t("color") }}</th>
            <th :colspan="parseInt(totalSizes)">{{ $t("size") }}</th>
            <td colspan="4"></td>
          </tr>
          <tr>
            <td v-for="(size, i) in parseInt(totalSizes)" :key="i">
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="sizes[i]"
                :label="$t('size') + '-' + (i + 1)"
                v-validate="'required'"
                :error-messages="errors.collect('Size')"
                name="Size"
              />
            </td>
            <th>{{ $t("PCS/CTN") }}</th>
            <th>{{ $t("CTN-NO") }}</th>
            <th>{{ $t("TTL-CTN") }}</th>
            <th>{{ $t("TTL-PCS") }}</th>
          </tr>
          <tr v-for="(color, i) in parseInt(totalColors)" :key="i">
            <td>
              <v-text-field
                dense
                hide-details
                solo
                flat
                v-model="colors[i]"
                :label="$t('color') + '-' + (i + 1)"
                v-validate="'required'"
                :error-messages="errors.collect('Color')"
                name="Color"
              />
            </td>
            <td v-for="(ts, j) in parseInt(totalSizes)" :key="j">
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                hide-details
                v-model="sizeValues[j + i * totalSizes]"
                v-validate="'required'"
                :error-messages="errors.collect('sizeValues')"
                name="sizeValues"
              />
            </td>
            <td>
              <v-text-field
                solo
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
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="ctnNo[i]"
                v-validate="'required'"
                :error-messages="errors.collect('ctnNo')"
                @input="getTotalCarton(ctnNo[i], i)"
                name="ctnNo"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                disabled
                dense
                hide-details
                type="number"
                min="0"
                v-model="ttlOtn[i]"
                name="TTL_CTN"
              />
            </td>
            <td>
              <v-text-field
                solo
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
            <th>{{ $t("total") }}</th>
            <td v-for="(ts, i) in parseInt(totalSizes)" :key="i">
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                hide-details
                disabled
                v-model="totalOfSizes[i]"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                hide-details
                v-model="item.ctnPcsTotal"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                disabled
                hide-details
                v-model="item.ctnNoTotal"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                hide-details
                v-model="item.ttlOtnTotal"
                disabled
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                type="number"
                min="0"
                dense
                hide-details
                v-model="item.totalPcsTotal"
                disabled
              />
            </td>
          </tr>
        </table>

        <v-layout row wrap justify-center>
          <!-- <v-flex xs12 pt-2>
            <h3 class="text-center info--text">{{ $t("summary") }}</h3>
          </v-flex> -->
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              label="Total"
              dense
              hide-details
              type="number"
              min="0"
              disabled
              v-model="summary.total"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              type="number"
              min="0"
              disabled
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
            <v-btn class="text-capitalize" @click="save">{{
              $t("clear")
            }}</v-btn>
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
      totalColors: 1,
      totalSizes: 4,
      item: {},
      summary: {},
      sizes: [],
      totalOfSizes: [],
      colors: [],
      ctnPcs: [],
      ctnNo: ["1-"],
      ttlOtn: [],
      totalPcs: [],
      // orders: [],
      orderId: ""
    };
  },
  computed: {
    ...mapState("SelectItem", ["orders"])
  },
  async created() {
    // this.orders = (await api.all(path.order)).rows.map(x => {
    //   return {
    //     id: x.id,
    //     orderNumber: x.orderNumber,
    //     styleNumber: x.styleNumber,
    //     quantity: x.quantity
    //   };
    // });
    this.orderItem();
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
      this.ctnNo.pop();
      this.$validator.validateAll().then(valid => {
        if (valid) {
          let sum = 0;
          this.totalOfSizes = [];
          for (let i = 0; i < parseInt(this.totalSizes); i++) {
            for (let j = 0; j < this.colors.length; j++) {
              sum +=
                parseInt(this.sizeValues[i + j * this.totalSizes]) *
                parseInt(this.ttlOtn[j]);
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
                parseInt(this.ttlOtn[i]);
            }
            this.totalPcs.push(tpcs);
            tpcs = 0;
          }

          //sum of all PCS
          this.item.totalPcsTotal = this.totalPcs.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );
          //total of ctnPCS
          this.item.ctnPcsTotal = this.ctnPcs.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );

          //set summary totals
          this.summary.total = this.item.totalPcsTotal;
          //total os total ctn
          this.item.ttlOtnTotal = this.ttlOtn.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );
          this.summary.totalCTNs = this.item.ttlOtnTotal;

          //values collection to send to a database
          this.vals = {
            type: 3,
            orderId: this.orderId,
            createdAt: new Date(),
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
                ctnNo: this.ctnNo[i],
                ttlOtn: this.ttlOtn[i],
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
        }
      });
    },
    getTotalCarton(ctnNo, i) {
      this.ttlOtn[i] = 0;
      if (ctnNo.indexOf("-") !== -1) {
        let temp = ctnNo.split("-");
        if (temp[1] !== "") {
          this.ttlOtn[i] = parseInt(temp[1]) - parseInt(temp[0]) + 1;
          if (this.ctnNo.length <= this.totalSizes) {
            this.ctnNo[i + 1] = parseInt(temp[1]) + 1 + "-";
          }
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
}
td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 10px 5px 5px 5px;
}
</style>
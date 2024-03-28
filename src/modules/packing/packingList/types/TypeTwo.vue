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
            <th rowspan="2">{{ $t("size") }}</th>
            <th :colspan="parseInt(totalColors)">{{ $t("color") }}</th>
            <td colspan="4"></td>
          </tr>
          <tr>
            <td v-for="(color, i) in parseInt(totalColors)" :key="i">
              <v-text-field
                solo
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
            <th>{{ $t("PCS/CTN") }}</th>
            <th>{{ $t("CTN-NO") }}</th>
            <th>{{ $t("TTL-CTN") }}</th>
            <th>{{ $t("TTL-PCS") }}</th>
          </tr>
          <tr v-for="(size, i) in parseInt(totalSizes)" :key="i">
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="sizes[i]"
                :label="$t('size') + '-' + (i + 1)"
                v-validate="'required'"
                :error-messages="errors.collect('sizes')"
                name="sizes"
              />
            </td>
            <td v-for="(clr, j) in parseInt(totalColors)" :key="j">
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="colorValues[j + i * totalColors]"
                v-validate="'required'"
                :error-messages="errors.collect('colorValues')"
                name="colorValues"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
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
                name="ctnNo"
                @input="getTotalCarton(ctnNo[i], i)"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="ttlOtn[i]"
                v-validate="'required'"
                :error-messages="errors.collect('TTL_CTN')"
                name="TTL_CTN"
                disabled
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="totalPcs[i]"
                name="totalPcs"
                disabled
              />
            </td>
          </tr>
          <tr>
            <th>{{ $t("total") }}</th>
            <td v-for="(tc, i) in parseInt(totalColors)" :key="i">
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="totalOfColors[i]"
                disabled
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="item.ctnPcsTotal"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="item.ctnNoTotal"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="item.ttlOtnTotal"
              />
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                v-model="item.totalPcsTotal"
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
              :label="$t('total')"
              dense
              hide-details
              v-model="summary.total"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              :label="$t('totalCTNs')"
              dense
              hide-details
              v-model="summary.totalCTNs"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
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
      totalColors: 2,
      totalSizes: 4,
      item: {},
      summary: {},
      sizes: [],
      totalOfColors: [],
      colors: [],
      vals: {},
      colorValues: [],
      ctnPcs: [],
      ctnNo: ["1-"],
      ttlOtn: [],
      totalPcs: [],
      totals: [],
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
          this.totalOfColors = [];
          for (let i = 0; i < parseInt(this.totalColors); i++) {
            for (let j = 0; j < parseInt(this.totalSizes); j++) {
              sum +=
                parseInt(this.colorValues[i + j * this.totalColors]) *
                parseInt(this.ttlOtn[j]);
            }
            this.totalOfColors.push(sum);
            sum = 0;
          }
          this.totalPcs = [];
          let tpcs = 0;
          for (let i = 0; i < parseInt(this.totalSizes); i++) {
            for (let j = 0; j < parseInt(this.totalColors); j++) {
              tpcs +=
                parseInt(this.colorValues[j + i * parseInt(this.totalColors)]) *
                parseInt(this.ttlOtn[j]);
            }
            this.totalPcs.push(tpcs);
            tpcs = 0;
          }
          // store aggregates on an array
          let items = this.sizes.map((x, i) => {
            return {
              size: x,
              values: this.colors.map((y, j) => {
                return {
                  color: y,
                  value: this.colorValues[j + i * this.totalColors]
                };
              }),
              ctnPcs: this.ctnPcs[i],
              ctnNo: this.ctnNo[i],
              ttlOtn: this.ttlOtn[i],
              totalPcs: this.totalPcs[i]
            };
          });

          //sum of all PCS
          this.item.totalPcsTotal = this.totalPcs.reduce(
            (acc, val) => parseInt(acc) + parseInt(val),
            0
          );
          //set summary totals
          this.summary.total = this.item.totalPcsTotal;
          this.item.ttlOtnTotal = this.ttlOtn.reduce(
            (acc, val) => acc + parseInt(val),
            0
          );
          this.summary.totalCTNs = this.item.ttlOtnTotal;

          this.vals = {
            type: 2,
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
            data: items,
            totalValues: this.colors.map((x, i) => {
              return {
                size: x,
                total: this.totalOfColors[i]
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
  padding: 10px 8px 8px 8px;
}
</style>
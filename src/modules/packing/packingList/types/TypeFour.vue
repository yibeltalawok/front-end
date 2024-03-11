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
            <th>{{ $t("size") }}</th>
            <th>{{ $t("color") }}</th>
            <th>{{ $t("value") }}</th>
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
                :placeholder="$t('size') + '-' + (i + 1)"
                v-validate="'required'"
                :error-messages="errors.collect('Size')"
                name="Size"
              />
            </td>
            <td>
              <tr v-for="(color, j) in parseInt(totalColors)" :key="j">
                <td style="border:0px solid red;padding:0">
                  <!-- {{j+i*parseInt(totalSizes)}} -->
                  <v-text-field
                    dense
                    hide-details
                    :placeholder="$t('color') + '-' + (j + 1)"
                    v-model="colors[j + i * parseInt(totalColors)]"
                    v-validate="'required'"
                    :error-messages="errors.collect('Color')"
                    name="Color"
                  />
                </td>
              </tr>
            </td>

            <td>
              <tr v-for="(color, j) in parseInt(totalColors)" :key="j">
                <td style="border:0px solid red;padding:0">
                  <v-text-field
                    dense
                    hide-details
                    v-model="sizesValue[j + i * parseInt(totalSizes)]"
                    v-validate="'required'"
                    :error-messages="errors.collect('sizesValue')"
                    name="sizesValue"
                  />
                </td>
              </tr>
            </td>

            <td>
              <tr v-for="(ctnPc, a) in parseInt(totalColors)" :key="a">
                <td style="border:0px solid red;padding:0">
                  <v-text-field
                    dense
                    hide-details
                    v-model="ctnPcs[a + i * parseInt(totalSizes)]"
                    v-validate="'required'"
                    :error-messages="errors.collect('ctnPcs')"
                    name="ctnPcs"
                  />
                </td>
              </tr>
            </td>

            <td>
              <tr v-for="(ctnno, b) in parseInt(totalColors)" :key="b">
                <td style="border:0px solid red;padding:0">
                  <v-text-field
                    dense
                    hide-details
                    v-model="ctnNo[b + i * parseInt(totalSizes)]"
                    v-validate="'required'"
                    :error-messages="errors.collect('ctnNo')"
                    name="ctnNo"
                    @input="
                      getTotalCarton(
                        ctnNo[b + i * parseInt(totalSizes)],
                        b + i * parseInt(totalSizes)
                      )
                    "
                  />
                </td>
              </tr>
            </td>

            <td>
              <tr v-for="(ttlOTN, c) in parseInt(totalColors)" :key="c">
                <td style="border:0px solid red;padding:0">
                  <v-text-field
                    dense
                    hide-details
                    v-model="ttlOtn[c + i * parseInt(totalSizes)]"
                    name="TTL_CTN"
                    disabled
                  />
                </td>
              </tr>
            </td>

            <td>
              <tr v-for="(totalPc, d) in parseInt(totalColors)" :key="d">
                <td style="border:0px solid red;padding:0">
                  <v-text-field
                    type="number"
                    dense
                    hide-details
                    v-model="totalPcs[d + i * parseInt(totalSizes)]"
                    disabled
                    name="totalPcs"
                  />
                </td>
              </tr>
            </td>
          </tr>
          <tr>
            <th colspan="2">{{ $t("total") }}</th>
            <td>
              <v-text-field
                type="number"
                dense
                hide-details
                v-model="totalOfSizes"
                disabled
              />
            </td>
            <td>
              <v-text-field
                type="number"
                dense
                hide-details
                v-model="item.ctnPcsTotal"
                disabled
              />
            </td>
            <td>
              <v-text-field
                type="number"
                dense
                hide-details
                v-model="item.ctnNoTotal"
                disabled
              />
            </td>
            <td>
              <v-text-field
                type="number"
                dense
                hide-details
                v-model="item.ttlOtnTotal"
                disabled
              />
            </td>
            <td>
              <v-text-field
                type="number"
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
              type="number"
              dense
              hide-details
              v-model="summary.total"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-2>
            <v-text-field
              :label="$t('Total-CTNs')"
              type="number"
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
              <v-icon class="mr-3">save</v-icon>
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
      sizes: [],
      sizesValue: [],
      totalOfSizes: 0,
      colors: [],
      heading: {},
      summary: {},
      vals: {},
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
      this.$validator.validateAll().then(valid => {
        if (valid) {
          let items = [];
          for (let i = 0; i < this.totalSizes; i++) {
            for (let j = 0; j < this.totalColors; j++) {
              this.totalPcs[j + i * this.totalSizes] =
                parseInt(this.sizesValue[j + i * this.totalSizes]) *
                parseInt(this.ttlOtn[j + i * this.totalSizes]);
              items.push({
                size: this.sizes[i],
                color: this.colors[j + i * this.totalColors],
                value: this.sizesValue[j + i * this.totalSizes],
                ctnPcs: this.ctnPcs[j + i * this.totalSizes],
                ctnNo: this.ctnNo[j + i * this.totalSizes],
                ttlOtn: this.ttlOtn[j + i * this.totalSizes],
                totalPcs: this.totalPcs[j + i * this.totalSizes]
              });
            }
          }
          this.totalOfSizes = items.reduce(
            (acc, val) => parseInt(acc) + parseInt(val.value),
            0
          );
          this.item.ttlOtnTotal = this.ttlOtn.reduce(
            (acc, val) => parseInt(acc) + parseInt(val),
            0
          );
          this.item.totalPcsTotal = items.reduce(
            (acc, val) => parseInt(acc) + parseInt(val.totalPcs),
            0
          );

          this.summary.total = this.item.totalPcsTotal;
          this.summary.totalCTNs = this.item.ttlOtnTotal;
          this.vals = {
            type: 4,
            orderId: this.orderId,
            createdAt: new Date(),
            totalSize: this.totalSizes,
            totalColor: this.totalColors,
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
            totalValues: [{ total: this.totalOfSizes }],
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
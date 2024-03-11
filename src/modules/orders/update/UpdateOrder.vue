<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize"
            @click="$router.push({ name: 'order' })"
          >
            <v-icon class="mx-3">mdi-chevron-left</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <form-error-messages :messages="errorMessage" />
            <!-- basic fields  -->

            <v-layout row wrap justify-center>
              <table>
                <tr>
                  <td>
                    <v-text-field
                      :label="$t('date')"
                      placeholder="yyyy-mm-dd"
                      dense
                      v-validate="'required'"
                      :error-messages="errors.collect('date')"
                      v-model="item.date"
                      hide-details
                      name="date"
                      type="date"
                      :rules="inputRules"
                    />
                  </td>
                  <td>
                    <v-text-field
                      :label="$t('shipmentDate')"
                      placeholder="yyyy-mm-dd"
                      dense
                      v-validate="'required'"
                      :error-messages="errors.collect('date')"
                      v-model="item.shipmentDate"
                      hide-details
                      name="date"
                      type="date"
                      :rules="inputRules"
                    />
                  </td>
                  <td>
                    <v-autocomplete
                    :items="customer"
                    dense
                    flat
                    hide-details
                    :rules="inputRules"
                    :label="$t('customer')"
                    v-model="item.CustomerId"
                    item-text="customerName"
                    item-value="id"
                    @input="selectCustomer"                  
                  ></v-autocomplete> 
                  </td>
                  <td>
                    <v-autocomplete
                    :items="product"
                    dense
                    flat
                    hide-details
                    :rules="inputRules"
                    :label="$t('product')"
                    v-model="item.productId"
                    item-text="productName"
                    item-value="id"
                    @input="selectProduct"                  
                  ></v-autocomplete> 
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('styleName')"
                      v-model="item.styleName"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('styleName')"
                      name="styleName"
                    />
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('styleNumber')"
                      v-model="item.styleNumber"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('styleNumber')"
                      name="styleNumber"
                    />
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('orderQuantity')"
                      v-model="item.quantity"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('orderQuantity')"
                      name="orderQuantity"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('orderNumber')"
                      v-model="item.orderNumber"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('orderNumber')"
                      name="orderNumber"
                    />
                  </td>
                  <!---->
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('po_number')"
                      v-model="item.poNo"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('poNo')"
                      name="poNo"
                    />
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('fabricDescription')"
                      v-model="item.fabricDescription"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('fabricDescription')"
                      name="fabricDescription"
                    />
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('extra')"
                      v-model="item.extra"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('poNo')"
                      name="poNo"
                    />
                  </td>
                  <td>
                    <v-text-field
                      dense
                      hide-details
                      :label="$t('design')"
                      v-model="item.design"
                      :rules="inputRules"
                      v-validate="'required'"
                      :error-messages="errors.collect('design')"
                      name="design"
                    />
                  </td>

                  <td>
                    <v-text-field
                      dense
                      hide-details
                      label="Actual Order"
                      v-model="item.actualOrder"
                      :disabled="true"
                      v-validate="'required'"
                      :error-messages="errors.collect('design')"
                      name="actual"
                    />
                  </td>


                </tr>
              </table>

              <v-flex xs12 sm12 md2 lg2 pa-2></v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  type="number"
                  min="0"
                  :label="$t('how_many_sizes')"
                  outlined
                  :rules="inputRules"
                  dense
                  v-model="size"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  type="number"
                  min="0"
                  :label="$t('how_many_colors')"
                  outlined
                  :rules="inputRules"
                  dense
                  v-model="color"
                />
              </v-flex>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <div class="text-right">
                  <v-btn
                    outlined
                    color="primary"
                    class="text-capitalize"
                    @click="computeOrder"
                    :rules="inputRules"
                    >{{ $t("compute") }}</v-btn
                  >

                  <!-- <v-btn
                    outlined
                    color="primary"
                    class="text-capitalize"
                    @click="test"
                    :rules="inputRules"
                    > test</v-btn
                  > -->
                </div>
              </v-flex>
            </v-layout>
            <!-- basic fields -->

            <!-- computable fields -->
            <v-layout row wrap justify-center>
              <!-- size-->

              <v-flex xs12>
                <table>
                  <thead>
                    <th colspan="2" class="title">{{ $t("size") }}</th>
                    <th v-for="(size, i) in parseInt(size)" :key="i">
                      <v-text-field
                        dense
                        flat
                        hide-details
                        :placeholder="$t('size') + '-' + (i + 1)"
                        v-model="sizes[i]"
                        :rules="inputRules"
                        v-validate="'required'"
                        :error-messages="errors.collect('size')"
                        name="size"
                      />
                    </th>
                  </thead>

                  <tr>
                    <td></td>
                    <td>{{ $t("ratio") }}</td>
                    <td v-for="(size, i) in parseInt(size)" :key="i">
                      <v-text-field
                        type="number"
                        dense
                        hide-details
                        :placeholder="$t('ratio') + '-' + (i + 1)"
                        v-model="sizeRatios[i]"
                        :rules="inputRules"
                        v-validate="'required'"
                        :error-messages="errors.collect('ratio')"
                        name="ratio"
                      />
                    </td>
                  </tr>
                  <tr v-for="(color, i) in parseInt(color)" :key="i">
                    <th>
                      <v-text-field
                        v-validate="'required'"
                        :error-messages="errors.collect('color')"
                        name="color"
                        flat
                        dense
                        hide-details
                        :rules="inputRules"
                        :placeholder="$t('color') + '-' + (i + 1)"
                        v-model="colors[i]"
                      />
                    </th>
                    <td>
                      <v-text-field
                        type="number"
                        flat
                        dense
                        hide-details
                        :placeholder="$t('ratio') + '-' + (i + 1)"
                        v-model="colorRatios[i]"
                        :rules="inputRules"
                        v-validate="'required'"
                        :error-messages="errors.collect('colorRatio')"
                        name="colorRatio"
                      />
                    </td>
                    <td v-for="(size, j) in parseInt(size)" :key="j">
                      <!--   Value text box -->
                      <v-text-field
                        type="number"
                        flat
                        dense
                        hide-details
                        v-model="tempValue[j + i * sizeRatios.length]"
                      />
                      <!-- {{ j + i * sizeRatios.length }} -->
                    </td>
                  </tr>
                  <tr>
                    <th colspan="2" class="title">{{ $t("total") }}</th>
                    <td v-for="(order, k) in orders" :key="k">
                      {{ order.total }}
                    </td>
                  </tr>
                </table>
              </v-flex>
              <v-flex xs12></v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <input
                  type="file"
                  @change="onFileSelected"
                  style="display:none"
                  ref="fileInput"
                />
                <v-btn
                  text
                  class="text-capitalize"
                  @click="$refs.fileInput.click()"
                >
                  <v-btn text small>
                    <v-icon>attachment</v-icon>
                  </v-btn>
                  {{ $t("attachement") }}
                </v-btn>
                <br />
                <em class="text-capitalize primary--text">
                  <v-icon v-if="done">done</v-icon>
                  {{ fileName }}
                </em>
              </v-flex>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <v-btn
                  :disabled="disabled"
                  rounded
                  outlined
                  block
                  color="primary"
                  class="text-capitalize"
                  @click="save"
                  >{{ $t("save") }}</v-btn
                >
              </v-flex>
              <!-- size-->
              <!-- color and color ratio  -->
            </v-layout>
            <!-- computable fields  -->
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      done: false,
      selectedFile: null,
      fileName: "",
      disabled: true,
      item: {},
      size: 0,
      color: 0,
      orders: [],
      sizes: [],
      sizeRatios: [],
      colors: [],
      colorRatios: [],
      values: [],
      index: 0,
      tempValue: [],
      finalOrders: [],
      moreQuantity: true
    };
  },
  async created() {
    const { orderId } = this.$route.params;
        let items = (await api.all(path.customer)).rows;
      this.customer = items.map(x => {
      return {
        id: x.id,
        customerName: x.customerName, 
      };   
    });
     let filter = { include: ["category"] }
     await api.all(path.product, filter).then(result => {
            let productItem=result
           this.product = productItem.map(x => {
            return {
            id: x.id,
            productName: x.productName, 
              };  
            })
     });
    this.orderId = orderId;
    this.item = await api.get(this.orderId, path.order);
    for (let i = 0; i < this.item.data[0].colors.length; i++) {
      for (let j = 0; j < this.item.data.length; j++) {
        this.tempValue.push(this.item.data[j].colors[i].value);
      }
    }
    this.size = this.item.data.length;
    this.color = this.item.data[0].colors.length;
    for (let i = 0; i < this.item.data[0].colors.length; i++) {
      this.colors.push(this.item.data[0].colors[i].color);
      this.colorRatios.push(this.item.data[0].colors[i].ratio);
    }
    for (let i = 0; i < this.item.data.length; i++) {
      this.sizes.push(this.item.data[i].size);

      this.sizeRatios.push(this.item.data[i].ratio);
    }
    for (let i = 0; i < this.item.data.length; i++) {
      this.tempValue.push(this.item.data[i].colors[0].value);
    }
    // this.computeOrder();
    this.orders = this.item.data;
    this.computeAndSave(this.tempValue);
  },

  methods: {
    ...mapActions("inventory", ["updateData"]),
    changeVal(tempVal, index) {
      this.tempValue[index] = tempVal;
      this.computeAndSave(this.tempValue);
    },
    //manage file upload
    async onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile.name;
      this.done = true;

      //upload file
      const formData = new FormData();
      formData.append("Image", this.selectedFile, this.item.orderNumber);
      await api
        .upload("orders", formData, path.container)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Order Attachement",
            message: `Attachement uploaded successfully.`
          });
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            title: "Failure",
            message: `Unable to upload your attachement right now. Try again.`
          });
        });
    },
    //select Customer name using customerId
     selectCustomer(val) {
      this.CustomerId = val.id;
      this.customerName=val.customerName
     },
   //select product name using productId 
     selectProduct(val) {
      this.productId = val.id;
      this.productName=val.productName
     },

    //manipulate order
    computeOrder() {
      if (this.$refs.form.validate()) {
        this.orders = [];
        this.tempValue = [];
        let quantity =
          parseFloat(this.item.quantity) 
          // + (parseFloat(this.item.extra) * parseFloat(this.item.quantity)) / 100;
        this.orders = this.sizes.map((x, i) => {
          let total = this.sizeRatios.reduce(
            (acc, ratio) => parseFloat(acc) + parseFloat(ratio)
          );
          return {
            size: x,
            ratio: this.sizeRatios[i],
            total:
              parseFloat(this.item.quantity) > 0
                ? this.roundUp(
                    (quantity * parseFloat(this.sizeRatios[i])) / total
                  )
                : 0,
            colors: this.colors.map((y, j) => {
              return {
                color: y,
                ratio: this.colorRatios[j],
                value: this.tempValue[j + i * this.sizeRatios.length]
              };
            })
          };
        });
        this.calculateValue();
      }
    },
    roundUp(number) {
      return parseFloat(Math.ceil(number));
    },
    calculateValue() {
      this.index = 0;
      for (let i = 0; i < this.colors.length; i++) {
        for (let j = 0; j < this.sizes.length; j++) {
          this.tempValue[this.index] = this.roundUp(
            (this.colorRatios[i] * this.orders[j].total) /
              this.colorRatios.reduce(
                (acc, ratio) => parseFloat(acc) + parseFloat(ratio)
              )
          );
          this.index += 1;
        }
      }

      this.computeAndSave(this.tempValue);
    },

    async computeAndSave(items) {
      this.finalOrders = this.orders.map((x, i) => {
        return {
          size: x.size,
          ratio: x.ratio,
          total: x.total,
          colors: this.colors.map((y, j) => {
            return {
              color: y,
              ratio: this.colorRatios[j],
              value: items[i + j * this.sizeRatios.length]
            };
          })
        };
      });
      this.item.actualOrder = 0;
      // Iteration for manual entry of orders from local markets
      for (let i = 0; i < this.finalOrders.length; i++) {
        this.finalOrders[i].total = 0;
        for (let j = 0; j < this.finalOrders[i].colors.length; j++) {
          this.finalOrders[i].total += parseInt(
            this.finalOrders[i].colors[j].value
          );
        }

        this.orders[i].total = this.finalOrders[i].total;
        this.item.actualOrder += this.finalOrders[i].total;
      }

      // eslint-disable-next-line no-console
      console.log((this.item.extra / 100) * this.item.quantity);

      // eslint-disable-next-line no-console
      console.log(parseInt(this.item.quantity));

      // eslint-disable-next-line no-console
      console.log(
        parseInt(this.item.quantity) +
          (parseInt(this.item.extra) / 100) * parseInt(this.item.quantity)
      );

      if (
        this.item.actualOrder >
        parseInt(this.item.quantity) +
          (parseInt(this.item.extra) / 100) * parseInt(this.item.quantity)
      ) {
        this.$notify({
          type: "danger",
          title: "Order Error",
          message: this.$t("total_order_exceed_error")
        });

        return false;
      } else if (this.item.actualOrder < parseInt(this.item.quantity)) {
        this.$notify({
          type: "danger",
          title: "Order Error",
          message: this.$t("total_order_low_error")
        });
        return false;
      }

      this.disabled =
        this.finalOrders.length > 0 && this.item.quantity > 0 ? false : true;
      return true;
    },

    async save() {
      if (this.moreQuantity) {
        this.item.data = this.finalOrders;
        // this.item.actualOrder = this.item.actualOrder;
        this.updateData([this.item, path.order])
          .then(() => {
            this.$notify({
              type: "success",
              title: "Order",
              message: `Order information edited successfully.`
            });
            this.$router.push({ name: "order" });
          })
          .catch(() => {
            this.$notify({
              type: "danger",
              title: "Failure",
              message: `Unable to save your order right now.`
            });
          });
        // await api
        //   .update(this.item, path.order)
        //   .then(() => {
        //     this.$notify({
        //       type: "success",
        //       title: "Order",
        //       message: `Order information edited successfully.`
        //     });
        //     this.$router.push({ name: "order" });
        //   })
        //   .catch(() => {
        //     this.$notify({
        //       type: "danger",
        //       title: "Failure",
        //       message: `Unable to save your order right now.`
        //     });
        //   });
      } else {
        this.$notify({
          type: "danger",
          title: "Order quantity",
          message: `The order quantity is less than the total.`
        });
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
table {
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 10px 2px 0px 2px;
}
</style>
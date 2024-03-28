
<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-layout wrap row>
          <v-flex class="d-flex flex-row errbox" xs12 sm6 md3 lg3 pa-3 v-for="msg in this.errormsg" :key="msg">
            <v-alert type="error" class="erroralert">
              {{msg}}
            </v-alert>
          </v-flex>
          
        </v-layout>

        <v-toolbar dense hide-details flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'laysheet-list' })"
          >
            <v-icon class="mr-3">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <form-error-messages :messages="errorMessage" />
            <!-- basic fields  -->
            <table>
              <tr>
                <td>
                  <v-text-field
                    :label="$t('date')"
                    placeholder="yyyy-mm-dd"
                    dense
                    v-validate="'required'"
                    :error-messages="errors.collect('date')"
                    v-model="item.laysheet.date"
                    hide-details
                    name="date"
                    type="date"
                    :rules="inputRules"
                  />
                </td>

                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :label="$t('cutNumber')"
                    disabled
                    :rules="inputRules"
                    v-model="item.laysheet.cutNumber"
                  />
                </td>
                <td>
                  <v-combobox
                    flat
                    dense
                    hide-details
                    :items="orders"
                    item-text="orderNumber"
                    :label="$t('orderNumber')"
                    disabled
                    :rules="inputRules"
                    v-model="item.laysheet.orderNumber"
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :rules="inputRules"
                    flat
                    :label="$t('orderQuantity')"
                    disabled
                    v-model="item.laysheet.quantity"
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :rules="inputRules"
                    :label="$t('extra')"
                    disabled
                    v-model="item.laysheet.extra"
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :rules="inputRules"
                    flat
                    :label="$t('noOfBundles')"
                    v-model="item.laysheet.noOfBundles"
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :rules="inputRules"
                    flat
                    :label="$t('bundleQuantity')"
                    v-model="item.laysheet.bundleQty"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :rules="inputRules"
                    :label="$t('styleName')"
                    v-model="item.laysheet.styleName"
                    disabled
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :rules="inputRules"
                    :label="$t('styleNumber')"
                    v-model="item.laysheet.styleNumber"
                    disabled
                  />
                </td>
                 <td>
                  <v-text-field
                    dense
                    flat
                    hide-details
                    :rules="inputRules"
                    :label="$t('customer')"
                    v-model="item.laysheet.customerName"
                    disabled
                  />
                </td>
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :rules="inputRules"
                    :label="$t('po_number')"
                    v-model="item.laysheet.poNo"
                    disabled
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :rules="inputRules"
                    flat
                    :label="$t('design')"
                    v-model="item.laysheet.design"
                    disabled
                  />
                </td>
                <td>
                  <v-combobox
                    flat
                    :items="colorOptions"
                    multiple
                    dense
                    hide-details
                    :rules="inputRules"
                    :label="$t('color')"
                    v-model="item.laysheet.colors"
                  />
                </td>
              </tr>
            </table>

            <!-- table -->
            <div class="my-3">
              <table>
                <thead>
                  <th colspan="2">{{ $t("size") }}</th>
                  <th v-for="(size, i) in sizes" :key="i">
                    <v-text-field
                      :label="$t('size') + '-' + (i + 1)"
                      hide-details
                      :rules="inputRules"
                      disabled
                      dense
                      flat
                      :value="size"
                    />
                  </th>
                </thead>
                <tr>
                  <th colspan="2">{{ $t("ratio") }}</th>

                  <th v-for="(ratio, i) in ratios" :key="i">
                    <v-text-field
                      :label="$t('ratio') + '-' + (i + 1)"
                      hide-details
                      :rules="inputRules"
                      dense
                      flat
                      :value="ratio"
                      @input="fillTable"
                      v-model="ratios[i]"
                    />
                  </th>
                </tr>
                <tr v-for="(color, i) in item.laysheet.colors" :key="i">
                  <th>
                    <v-text-field
                      disabled
                      hide-details
                      :rules="inputRules"
                      dense
                      flat
                      :value="color"
                    />
                  </th>
                  <td>
                    <v-text-field
                      :label="$t('no-of-plies')"
                      hide-details
                      :rules="inputRules"
                      dense
                      v-model="plyValues[i]"
                      @input="fillTable"
                    />
                  </td>
                  <td v-for="(val, j) in ratios" :key="j">
                    <v-text-field
                      hide-details
                      :rules="inputRules"
                      dense
                      flat
                      v-model="colorValues[j + i * ratios.length]"
                    />
                  </td>
                </tr>
              </table>
            </div>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md8 lg8 pa-2>
                <v-combobox
                  v-model="chips"
                  :rules="inputRules"
                  :items="[
                    $t('back'),
                    $t('front'),
                    $t('pocket'),
                    $t('placket'),
                    $t('r_sleeve'),
                    $t('l_sleeve')
                  ]"
                  clearable
                  :label="$t('parts-name')"
                  multiple
                  dense
                  outlined
                />
              </v-flex>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <v-btn
                  outlined
                  color="#d19917"
                  class="text-capitalize"
                  @click="save"
                  >{{ $t("save-and-exit") }}</v-btn
                >
              </v-flex>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <v-btn
                  small
                  outlined
                  color="#d19917"
                  class="text-capitalize"
                  @click="generateBundles"
                  >Generate</v-btn
                >
              </v-flex>
            </v-layout>
          </v-form>
          <!-- tickets  -->
          <v-layout row wrap justify-center v-if="items.length > 0">
            <!-- {{ allTkts }} -->
            <v-flex xs12 sm12 md4 lg4 pa-2 v-for="(val, i) in allTkts" :key="i">
              <v-card outlined flat>
                <v-toolbar dark dense flat height="30px" color="primary">
                  Bundle Tkt {{ val.val.count }}
                  <v-spacer></v-spacer>
                  <span class="text-uppercase">{{ val.label }}</span>
                </v-toolbar>

                <table width="100%">
                  <tr>
                    <th class="text-left">No</th>
                    <th class="text-left" colspan="2">Serial Number</th>
                    <th class="text-left">B.Qty</th>
                    <th class="text-left">Shade Group</th>
                  </tr>
                  <tr v-for="(no, index) in val.No" :key="index">
                    <td>{{ no.count }}</td>
                    <td>{{ no.from }}</td>
                    <td>{{ no.to }}</td>
                    <td>{{ no.bq }}</td>
                    <td>
                      <span class="mx-1">{{ val.color }}</span>
                    </td>
                  </tr>
                </table>

                <v-toolbar dark dense flat height="26px" color="success">
                  <v-spacer></v-spacer>
                  {{ val.rSum }}
                </v-toolbar>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <v-layout row>
      <div
        class="bndlscards"
        v-for="bndl in this.bundlesList"
        :key="bndl.bundleNo"
      >
        <bundleCards :bndl="bndl" />
      </div>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { api, path } from "@/api";
// eslint-disable-next-line no-unused-vars
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import bundleCards from "./bundlesCard";
export default {
  data() {
    return {
      orderId: "",
      laysheetId: "",
      customerName:"",
      disableBtn: true,
      saveStatus: true,
      path: path.laysheet,
      orderNo: "",
      sizes: [],
      allbndls: [],
      ratios: [],
      quantities: [],
      plyValues: [],
      colorValues: [],
      itemb: [],
      test: {},
      color: [],
      items: [],
      disableColor: true,
      item: { laysheet: {} },
      tkt: {},
      colorOptions: [],
      orders: [],
      chips: [],
      parts: [
        this.$t("back"),
        this.$t("front"),
        this.$t("pocket"),
        this.$t("placket"),
        this.$t("R.Slv"),
        this.$t("L.Slv")
      ],
      errormsg: [],
      tempClrArr: [],
      tempClrqtyArr: [],
      totalClrArr: [],
      totalQtyArr: [],
      inputRules: [v => !!v || "This field is required"]
    };
  },

  components: {
    // eslint-disable-next-line vue/no-unused-components
    bundleCards,
  },
  computed: {
    ...mapState("laysheet", ["bundlesList", "ScanedOrderData", "bCSheetId"]),
    ...mapState("order", ["totalCuts", "actualOrders", 'cuttedClrsArr', 'cuttedQtyArr', 'actualClrsArr', 'actualQtyArray']),
  
    pl() {
      return this.plyValues;
    },

    lsizes() {
      return this.sizes;
    },

    bndls() {
      return this.bundles;
    },

    clrs() {
      return this.item.laysheet.colors;
    },

    lallbndls() {
      return this.allbndls;
    },

    clrsval() {
      return this.colorValues;
    },

    allTkts() {
      return this.$store.getters.allItems;
    },
    allSizes() {
      return this.$store.getters.sizes;
    },

    ...mapGetters("laysheet", ["allItems"]),
    ...mapState("order", ["treechartdata"]),
  },
  async created() {
    const { laysheetId } = this.$route.params;
    this.laysheetId = laysheetId;
    let f = { include: ["order"] };
    let items = (await api.all(path.order)).rows;
    this.orders = items.map((x) => {
      return {
        id: x.id,
        allbndls: [],
        orderNumber: x.orderNumber,
        quantity: x.quantity,
        CustomerId: x.CustomerId,
        styleName: x.styleName,
        styleNumber: x.styleNumber,
        extra: x.extra,
        poNo: x.poNo,
        design: x.design,
        size: x.data.map((s) => s.size),
        ratio: x.data.map((r) => r.ratio),
        color: x.data[0].colors.map((a) => a.color),
      };
    });

    this.itemb = await api.get(laysheetId, this.path, f);
    this.selectOrder(this.itemb.order);
    this.getScanedOrder(this.orderId);
    this.getCutData(this.orderId);
    this.getActualOrders(this.orderId);
    this.getCutQtyofColor(this.orderId)
  },
  methods: {
    ...mapMutations("laysheet", ["manageState", "manageParts", "manageLaysheet", "manageColor", "setBundles", "pushBundles"]),
    ...mapActions("laysheet", ["createBundlesStatus","getScanedOrder", "updateBCSheet"]),
    ...mapActions('order', ['fetchBundleData','getCutData', 'getActualOrders', 'getCutQtyofColor']),

    selectOrder(val) {
      this.orderId = val.id;

      this.items = [];
      this.item.laysheet.cutNumber = this.itemb.cutNo;
      this.item.laysheet.noOfBundles = this.itemb.noOfBundle;
      this.item.laysheet.bundleQty = this.itemb.bQty;
      this.item.laysheet.orderNumber = val.orderNumber;
      this.item.laysheet.quantity = val.quantity;
      this.item.laysheet.styleName = val.styleName;
      this.item.laysheet.styleNumber = val.styleNumber;
      this.item.laysheet.extra = val.extra;
      this.item.laysheet.design = val.extra;
      this.item.laysheet.poNo = val.poNo;
      this.colorOptions = this.itemb.colors.map(x => x.color);
      this.colors = this.colorOptions;
      this.item.laysheet.colors = this.colors;
      this.sizes = this.itemb.colors[0].sizes.map(x => x.label);
      this.ratios = this.itemb.colors[0].sizes.map(x => x.ratio);
      this.chips = this.itemb.parts;
      this.item.laysheet.customerName = this.itemb.customerName;
      this.plyValues = this.itemb.colors.map(x => x.ply);
      let totalRatio = this.ratios.reduce(
        (acc, ratio) => parseInt(acc) + parseInt(ratio)
      );

      this.quantities = this.ratios.map(x =>
        this.roundUp(
          (parseInt(x) * parseInt(this.item.laysheet.quantity)) / totalRatio
        )
      );

      this.fillTable();
    },
    fillTable() {
      this.items = [];
      this.index = 0;
      for (let i = 0; i < this.plyValues.length; i++) {
        for (let j = 0; j < this.ratios.length; j++) {
          this.colorValues[this.index] = this.roundUp(
            this.ratios[j] * this.plyValues[i]
          );
          this.index += 1;
        }
      }

      let items = this.plyValues.map((c, i) => {
        return {
          color: this.item.laysheet.colors[i],
          ply: this.plyValues[i],
          sizes: this.sizes.map((size, j) => {
            return {
              size: size,
              ratio: this.ratios[i],
              quantity: this.colorValues[j + i * this.ratios.length],
              //this.colorValues[j + i * this.ratios.length]
              nB: this.roundUp(
                parseInt(this.colorValues[j + i * this.ratios.length]) /
                  (parseInt(this.item.laysheet.noOfBundles) *
                    parseInt(this.item.laysheet.bundleQty))
              )
            };
          })
        };
      });

      this.disableBtn = false;
      this.generateTks(items);
    },

    generateBundles() {
      // console.log(this.$route.params)
      this.setBundles([]);
      if (this.clrs != undefined && this.clrs.length > 0) {
        var cnt = 0;
        var bndl = parseInt(this.ScanedOrderData) + 1;
        // eslint-disable-next-line no-unused-vars
        this.clrs.map((color, cidx) => {
          // eslint-disable-next-line no-unused-vars
          this.lsizes.map((size, sidx) => {
            for (
              var i = 0;
              i < this.clrsval[cnt] / parseInt(this.item.laysheet.bundleQty);
              i++
            ) {
              this.pushBundles({
                type: "ci",
                date: new Date(),
                OrderId: this.orderId,
                color: color,
                label: size,
                from: (bndl - 1) * parseInt(this.item.laysheet.bundleQty),
                to:
                  (bndl - 1) * parseInt(this.item.laysheet.bundleQty) +
                  parseInt(this.item.laysheet.bundleQty) -
                  1,
                bundleNo: bndl++,
                bCSheetId: this.laysheetId
              });
            }

            cnt++;
          });
        });
      } else {
        this.$notify({
          title: "Input Error",
          type: "danger",
          text: "Please check your inputs",
        });
      }
    },
    generateTks(items) {
      this.items = [];

      let nRows = parseInt(this.item.laysheet.noOfBundles);
      let bQ = parseInt(this.item.laysheet.bundleQty);
      let rSum = 0;
      let cnRows = 0;
      let count = 0;
      let iterator = 0;
      let arr = items;

      for (let index = 0; index < arr.length; index++) {
        for (let i = 0; i < arr[index].sizes.length; i++) {
          for (let j = 1; j <= arr[index].sizes[i].nB; j++) {
            rSum =
              j < arr[index].sizes[i].nB
                ? nRows * bQ
                : arr[index].sizes[i].quantity -
                  nRows * bQ * (arr[index].sizes[i].nB - 1);
            cnRows = j < arr[index].sizes[i].nB ? nRows : rSum / bQ;
            iterator = j - 1;
            this.items.push({
              label: arr[index].sizes[i].size,
              val: { count: count + j, iterator: iterator },
              nb: this.roundUp(cnRows),
              rSum: rSum,
              tQ: bQ,
              cardCounter: j - 1,
              color: arr[index].color
            });
          }
          iterator = 0;
          count += arr[index].sizes[i].nB;
        }
      }
      this.manageState(this.items);
    },
    manageState(v) {
      this.$store.commit("manageState", v);
    },
    // generateBundles() {
    //   const laysheet = {
    //     cutNo: this.item.laysheet.cutNumber,
    //     noOfBundle: this.item.laysheet.noOfBundles,
    //     bQty: this.item.laysheet.bundleQty,
    //     styleName: this.item.laysheet.styleName,
    //     styleNo: this.item.laysheet.styleNumber,
    //     buyer: this.item.laysheet.customer,
    //     design: this.item.laysheet.design
    //   };
    //   this.manageBCSheet(this.chips, laysheet, this.item.laysheet.colors);
    // },
    manageBCSheet(chips, laysheet, color) {
      this.$store.commit("manageParts", chips);
      this.$store.commit("manageLaysheet", laysheet);
      this.$store.commit("manageColor", color);
      this.$router.push({ name: "bcsheet" });
    },
    async save() {
      this.errormsg = [];
      this.tempClrArr = [];
      this.tempClrqtyArr = [];
      this.totalClrArr = [];
      this.totalQtyArr = [];
      if (this.$refs.form.validate()) {
        var currentCutqty = 0;

        let item = {
          id: this.laysheetId,
          date: this.item.laysheet.date,
          orderId: this.orderId,
          cutNo: this.item.laysheet.cutNumber,
          noOfBundle: this.item.laysheet.noOfBundles,
          bQty: this.item.laysheet.bundleQty,
          colors: this.plyValues.map((c, i) => {
            return {
              color: this.item.laysheet.colors[i],
              ply: this.plyValues[i],
              sizes: this.sizes.map((size, j) => {
                return {
                  label: size,
                  ratio: this.ratios[j],
                  qty: this.colorValues[j + i * this.ratios.length],
                  nB: this.roundUp(
                    parseInt(this.colorValues[j + i * this.ratios.length]) /
                      (parseInt(this.item.laysheet.noOfBundles) *
                        parseInt(this.item.laysheet.bundleQty))
                  )
                };
              })
            };
          }),
          parts: this.chips
        };

        // get the quantity of the cut about to be made
        for (let i = 0; i < item.colors.length; i++) {
          var clr = item.colors[i].color;
          var tmpclrqty = 0;
          this.tempClrArr.push(clr);
          var size = item.colors[i].sizes
          for (let j = 0; j < size.length; j++) {
            currentCutqty += size[j].qty;
            tmpclrqty += size[j].qty;
          }
          this.tempClrqtyArr.push(tmpclrqty)
        }

        // add the quantities of the current cut about to be made and the cuts already made 
        // with their corresponding colors... copying to another array
        for (let i = 0; i < this.tempClrArr.length; i++) {
          // check if it (tempClrArr[i]) is available in the totalClrArr[]
          if(this.totalClrArr.indexOf(this.tempClrArr[i]) == -1){ // if it is not in the list
            this.totalClrArr.push(this.tempClrArr[i])
            this.totalQtyArr.push(this.tempClrqtyArr[i])
          }
          else{ // if it is already in the array, we don't have to put reapeated values
            // get the index of the color in the totalClrArr[]
            for (let j = 0; j < this.totalClrArr.length; j++) {
              if(this.totalClrArr[j] == this.tempClrArr[i]){
                this.totalQtyArr[i] += this.tempClrqtyArr[i]
              }
            }
          }
          
        }

        for (let j = 0; j < this.cuttedClrsArr.length; j++) {
          // is cuttedClrsArr[j] available in the totalClrArr[]?
          if(this.totalClrArr.indexOf(this.cuttedClrsArr[j]) == -1){ // if it is not in the totalClrArr array
            this.totalClrArr.push(this.cuttedClrsArr[j])
            this.totalQtyArr.push(this.cuttedQtyArr[j])
          }
          else{ // if it is already in the array
            // get the index the color in the totalClrArr
            for (let k = 0; k < this.totalClrArr.length; k++) {
              if(this.totalClrArr[k] == this.cuttedClrsArr[j]){
                this.totalQtyArr[k] += this.cuttedQtyArr[j]
              }
            }
          }
        }

        //NOW, let's compare the quantities with respect to the colors with appropriate error messages.
        for (let i = 0; i < this.actualClrsArr.length; i++) {
          for (let j = 0; j < this.totalClrArr.length; j++) {
            if(this.actualClrsArr[i] == this.totalClrArr[j]){
              if(this.actualQtyArray[i] < this.totalQtyArr[j]){
                // the total of the cut about to be made & the cuts already made is greater than the actual orders
                this.errormsg.push("Max. cut for color " + this.actualClrsArr[i] + " is: " + this.actualQtyArray[i])

                // get information for the cuts that are already made to display the user in the error message
                for (let k = 0; k < this.cuttedClrsArr.length; k++) {
                  if(this.actualClrsArr[i] == this.cuttedClrsArr[k]){
                    this.errormsg.push("Already made " + this.cuttedQtyArr[k] + " Cuts for " + this.actualClrsArr[i])
                  }                  
                }

                // get the information for the cut about to be made to display for the user in the error message.
                for (let m = 0; m < this.tempClrArr.length; m++) {
                  if(this.actualClrsArr[i] == this.tempClrArr[m]){
                    this.errormsg.push("About to make " + this.tempClrqtyArr[m] + " Cuts for " +this.actualClrsArr[i])
                  }                  
                }

              }
            }            
          }
        }

        // if the sum of the quantity of the cut made and the current cut to be made is greater than the actual orders,
        // give an error message including information about the cuts you made, the cuts you are about to make, and the actual orders

        // The quantity of the cuts that are made earlier plus the cut about to be made.
        var totalCurrentCuts = currentCutqty + this.totalCuts

        if(totalCurrentCuts > this.actualOrders){
          this.errormsg.push("Already made " + this.totalCuts + " total Cuts");
          this.errormsg.push("About to make " + currentCutqty + " additional Cuts");
          this.errormsg.push("Actual order quantity is: " + this.actualOrders);
        }

        if(this.errormsg.length == 0){

          this.test = item;
          this.updateBCSheet(item).then(() => {
            this.$notify({
              type: "success",
              title: "Laysheet",
              message: `bundle lay sheet information saved successfully.`
            });
            this.generateBundles();
            this.createBundlesStatus(this.bundlesList);
            this.$router.push({ name: "laysheet-list" });
          })
          .catch(err => {
            this.$notify({
              type: "error",
              title: this.$t("Failure"),
              message: `Failed to save information.` + err
            });
          });
          
        }


        


      }
    },
    clearFields() {
      this.item.laysheet = {};
      this.sizes = [];
      this.ratios = [];
      this.quantities = [];
      this.plyValues = [];
      this.colorValues = [];
    },
    roundUp(number) {
      return parseInt(Math.ceil(number));
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
  padding: 10px 2px 0px 2px;
}
.erroralert{
  font-size: 11px;
  padding: 10px;
}
</style>
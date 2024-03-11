<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 13px">
        <div
          v-if="this.orderId && treechartdata.length > 0"
          class="chrt"
          id="chartdiv"
        ></div>
        <h3
          v-if="this.orderId && treechartdata.length == 0"
          style="margin-left: 25%; margin-top: 2%"
        >
          No Cut data available for this order yet
        </h3>

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
            @click="$router.push({ name: 'laysheet-list'})">
            <v-icon class="mr-3">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <!-- <form-error-messages :messages="errorMessage" /> -->
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
                  <v-combobox
                    flat
                    dense
                    hide-details
                    :items="orders"
                    item-text="orderNumber"
                    :label="$t('orderNumber')"
                    :rules="inputRules"
                    v-model="item.laysheet.orderNumber"
                    @input="selectOrder"
                  />
                </td>
                
                <td>
                  <v-text-field
                    flat
                    dense
                    hide-details
                    :label="$t('cutNumber')"
                    :rules="inputRules"
                    :disabled="!this.orderSelected"
                    v-model="item.laysheet.cutNumber"
                    @input="checkCutNumber(item.laysheet.cutNumber)"
                  />
                </td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :rules="inputRules"
                    flat
                    :label="$t('orderQuantity')"
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
                    :disabled="disableColor"
                  />
                </td>
              </tr>
            </table>

            <div class="my-3">
              <table>
                <thead>
                  <th colspan="2">{{ $t("size") }}</th>
                  <th v-for="(size, i) in sizes" :key="i">
                    <v-text-field
                      :label="$t('size') + '-' + (i + 1)"
                      hide-details
                      :rules="inputRules"
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
                    $t('l_sleeve'),
                  ]"
                  clearable
                  :label="$t('parts-name')"
                  multiple
                  dense
                  outlined
                  small-chips
                  hide-selected
                />
              </v-flex>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <v-btn
                  small
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
        </v-card-text>
      </v-card>
    </v-container>

    <v-layout row>
      <div
        class="bndlscards"
        v-for="bndl in this.bundlesList"
        :key="bndl.id"
      >
        <bundleCards :bndl="bndl" />
      </div>
    </v-layout>
    <!-- <v-layout row>
      <div
        class="bndlscards"
        v-for="bndl in this.bundlesList"
        :key="bndl.bndlnum"
      >
        <bundleCards :bndl="bndl" />
      </div>
    </v-layout> -->
  </div>
</template>
<script>
/* eslint-disable no-console */
import { api, path } from "@/api";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import bundleCards from "./bundlesCard";
export default {
  data() {
    return {
      orderId: "",
      customerName:"",
      CustomerId:"",
      orderNumber: "",
      disableBtn: true,
      saveStatus: true,
      dialog: false,
      path: path.laysheet,
      orderNo: "",
      sizes: [],
      allbndls: [],
      bundles: [],
      ratios: [],
      quantities: [],
      plyValues: [],
      colorValues: [],
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
        this.$t("L.Slv"),
      ],
      test: [],
      inputRules: [(v) => !!v || "This field is required"],

      chartData: [],
      errormsg: [],
      tempClrArr: [],
      tempClrqtyArr: [],
      totalClrArr: [],
      totalQtyArr: [],
      duplicateCutNo: false,
      orderSelected: false
    };
  },

  components: {
    // eslint-disable-next-line vue/no-unused-components
    bundleCards,
  },

  computed: {
    ...mapState("laysheet", ["bundlesList", "ScanedOrderData", "cutNumbers", "bCSheetId"]),
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

    ...mapGetters("laysheet", ["allItems"]),
    ...mapState("order", ["treechartdata"]),
  },
    allTkts() {
      // return this.$store.getters.allItems;
      return this.allItems;
  },
  async created() {
    
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
    this.colorOptions = this.orders.map((x) => x.color);

    
  },
  methods: {
    ...mapMutations("laysheet", ["manageState", "manageParts", "manageLaysheet", "manageColor", "setBundles", "pushBundles"]),
    ...mapActions("laysheet", ["createBundlesStatus","postLaysheet","getScanedOrder", "getCutNums"]),
    ...mapActions('order', ['fetchTreeChartData', 'fetchBundleData','getCutData', 'getActualOrders', 'getCutQtyofColor']),

    async fetchBundle(){
      // eslint-disable-next-line no-unused-vars
      await this.fetchBundleData(this.orderId).then((res) => {});
    },

    ...mapActions("order", ["fetchTreeChartData"]),

    async fetchTCD() {
      // eslint-disable-next-line no-unused-vars
      await this.fetchTreeChartData(this.orderId).then((res) => {
        this.treeChartData();
      });
    },
    treeChartData() {
      let chart = am4core.create(
        "chartdiv",
        am4plugins_forceDirected.ForceDirectedTree
      );
      let networkSeries = chart.series.push(
        new am4plugins_forceDirected.ForceDirectedSeries()
      );

      chart.data = this.treechartdata;
      chart.data = [
        {
          name: this.orderNumber,
          children: this.treechartdata,
        },
      ];
      networkSeries.dataFields.value = "value";
      networkSeries.dataFields.name = "name";
      networkSeries.dataFields.children = "children";
      networkSeries.nodes.template.tooltipText = "{name}:{value}";
      networkSeries.nodes.template.fillOpacity = 1;

      networkSeries.nodes.template.label.text = "{name}";
      networkSeries.fontSize = 10;
      networkSeries.links.template.strokeWidth = 1;
      networkSeries.minRadius = 20;

      let hoverState = networkSeries.links.template.states.create("hover");
      hoverState.properties.strokeWidth = 3;
      hoverState.properties.strokeOpacity = 1;

      networkSeries.nodes.template.events.on("over", function (event) {
        event.target.dataItem.childLinks.each(function (link) {
          link.isHover = true;
        });
        if (event.target.dataItem.parentLink) {
          event.target.dataItem.parentLink.isHover = true;
        }
      });
      networkSeries.nodes.template.events.on("out", function (event) {
        event.target.dataItem.childLinks.each(function (link) {
          link.isHover = false;
        });
        if (event.target.dataItem.parentLink) {
          event.target.dataItem.parentLink.isHover = false;
        }
      });
    },
   async selectOrder(val) {
      this.orderSelected = true;
      this.orderId = val.id;
      this.CustomerId=val.CustomerId
           await api.get(this.CustomerId,path.customer).then( item => {
             item;
             this.customerName=item.customerName
             });
      this.items = [];
      this.orderNumber = val.orderNumber;
      this.item.laysheet.quantity = val.quantity;
      this.item.laysheet.customerName = this.customerName;
      this.item.laysheet.styleName = val.styleName;
      this.item.laysheet.styleNumber = val.styleNumber;
      this.item.laysheet.extra = val.extra;
      this.item.laysheet.design = val.extra;
      this.item.laysheet.poNo = val.poNo;
      this.colorOptions = val.color;
       
      this.disableColor = this.colorOptions.length > 0 ? false : true;
      this.sizes = val.size;
      this.ratios = val.ratio;
      this.colors = this.item.laysheet.colors;
      let totalRatio = this.ratios.reduce(
        (acc, ratio) => parseInt(acc) + parseInt(ratio)
      );

      this.quantities = this.ratios.map((x) =>
        this.roundUp(
          (parseInt(x) * parseInt(this.item.laysheet.quantity)) / totalRatio
        )
      );

      this.fillTable();
      this.getScanedOrder(this.orderId);
      this.fetchTCD();
      this.getCutData(this.orderId);
      this.getActualOrders(this.orderId);
      this.getCutQtyofColor(this.orderId);

      this.getCutNums(this.orderId); // for cross-reference of the cut numbers
    },

    fillTable() {
      this.colorValues = [];
      this.items = [];
      this.index = 0;
      for (let i = 0; i < this.plyValues.length; i++) {
        for (let j = 0; j < this.ratios.length; j++) {
          this.colorValues[this.index] = this.roundUp(
            this.ratios[j] * this.plyValues[i]
          );
          
          // this.currentCutqty += this.colorValues[j]
          
          this.index += 1;
          
        }
      }
      this.disableBtn = false;
    },

    generateBundles() {
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
                bCSheetId: this.bCSheetId
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

    checkCutNumber(cutnum){
      this.errormsg = [];
      // if the cut number entered is in the cutNumbers array, duplicated cutNumber
      if(this.cutNumbers.includes(cutnum)){ // cutNumbers array contains cutnum
        this.errormsg.push("Cut No. " + cutnum + " already exists in this Order")
      }
    },

    async save() {
      this.errormsg = [];
      this.tempClrArr = [];
      this.tempClrqtyArr = [];
      this.totalClrArr = [];
      this.totalQtyArr = [];
      if (this.$refs.form.validate()) {
        var currentCutqty = 0;
        // this.duplicateCutNo = false;

        let item = {
          date: this.item.laysheet.date,
          orderId: this.orderId,
          customerName:this.item.laysheet.customerName,
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
                  ),
                };
              }),
            };
          }),
          parts: this.chips,
        };

        if(item.colors.length <= 0){
          this.errormsg.push("You didn't select the color for a cut!")
        }

        // Check if the cut number to be registered is already available in the cuts made earlier in a given order.
        var cutno = item.cutNo; // current cut number for the cut about to be made.
        if(this.cutNumbers.includes(cutno)){ // cutNumbers array contains cutnum
          // this.duplicateCutNo = true;
          this.errormsg.push("Cut No. " + cutno + " already exists")
        }

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
          this.postLaysheet([item]).then(() => {
            // using the id of the bcsheet which is just created, which is this.bCSheetId
            // alert(this.bCSheetId)
            // console.log("BCSheet Id: " + this.bCSheetId)
            this.generateBundles();
            this.createBundlesStatus(this.bundlesList);
            this.$router.push({ name: "laysheet-list" });
          });
        }
        
      }
    },
    saveAndContinue() {
      if (this.$refs.form.validate()) {
        this.saveStatus = false;
        try {
          this.save();
          this.dialog = true;
        } catch (error) {
          alert(error);
        }
      }
    },

    roundUp(number) {
      return parseInt(Math.ceil(number));
    },
  },
  mounted() {
    this.fetchTCD();
  },
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

.chrt {
  width: 100%;
  height: 350px;
}
.erroralert{
  font-size: 11px;
  padding: 10px;
}
</style>
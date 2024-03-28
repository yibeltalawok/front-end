
<template>
  <div>
    <!-- TODO add loading animation -->
    <div id="tableDiv">
      <div style="display: flex">
        <h4 id="nameQuantity"></h4>
        <label id="packed"></label>
        
      </div>

      <table id="tabelOrderSingle">
        <tr>
          <th rowspan="2">Color</th>
          <th rowspan="2">Label</th>

          <th colspan="2">Cut</th>
          <th colspan="2">Sew</th>
          <th colspan="2">Finshing</th>
          <th colspan="2">Pack</th>
        </tr>
        <tr>
          <th>In</th>
          <th>Out</th>
          <th>In</th>
          <th>Out</th>
          <th>In</th>
          <th>Out</th>
          <th>In</th>
          <th>Out</th>
        </tr>
      </table>
    </div>

    <div v-if="this.bundles.length > 0" class="totalbundles">
      <h3>Total bundles: {{ this.bundles.length }}</h3>
    </div>

    <v-container fluid style="padding-top: 3%">
      <v-row>
        <!-- Select Order -->
        <v-col cols="3">
          <v-combobox
            :items="orders"
            :label="$t('selectOrder')"
            item-text="orderNumber"
            item-value="id"
            outlined
            dense
            solo
            @input="selectOrder"
          >
          </v-combobox>
        </v-col>

        <!-- Select Process -->
        <v-col cols="3">
          <v-combobox
            :items="processes"
            :label="$t('process')"
            outlined
            dense
            solo
            ref="processDropdown"
            @input="selectProcess"
          ></v-combobox>
        </v-col>

        <!-- Select Color -->
        <v-col cols="3">
          <v-combobox
            :items="this.colors"
            :label="$t('color')"
            outlined
            dense
            solo
            ref="colorDropdown"
            @input="selectColor"
          ></v-combobox>
        </v-col>

        <!-- Select Size -->
        <v-col cols="3">
          <v-combobox
            :items="this.sizes"
            :label="$t('size')"
            outlined
            dense
            solo
            ref="sizeDropdown"
            @input="selectSize"
          ></v-combobox>
        </v-col>
      </v-row>
    </v-container>
    <v-layout row>
      <div v-for="bndl in this.bundles" :key="bndl.bundleNo" v-bind="bndl.id">
        <div class="maincontainer">
          <div class="mainrow">
            <div class="avatar">
              <div class="avtext">
                {{ bndl.bndlnum }}
              </div>
            </div>

            <div class="content">
              <div v-if="bndl.color.length <= 16" class="maincolor">
                Color: {{ bndl.color }}
              </div>
              <div v-if="bndl.color.length > 16" class="secondColor">
                Color: {{ bndl.color }}
              </div>

              <div class="newHolder">
                <div class="mainsize">Size: {{ bndl.label }}</div>
                <div class="statustxt">
                  <v-btn
                    text
                    color="#e91e63"
                    @click="changeStatus(bndl.id, bndl.type)"
                  >
                    {{ bndl.type }}
                  </v-btn>
                </div>
              </div>
              <div class="mainserial">
                from: {{ bndl.from }} to: {{ bndl.to }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4
        v-if="this.bundles.length == 0 && this.orderId"
        style="margin-left: 25%; margin-top: 4%"
      >
        No Bundle Data!
      </h4>
      <h4 v-if="!this.orderId" style="margin-left: 25%; margin-top: 4%">
        {{ message }}
      </h4>

      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"> Change Status </v-card-title>

          <v-card-text style="margin-top: 5%">
            Current Status:
            <span style="color: green"
              ><b>{{ bundle.status }}</b></span
            >
            <v-text-field 
              label = "Line number"
              prepend-icon = "mdi-chart-line-stacked"
              v-model="item.lineNumber"
              type="number"
              required
              />
              <p style="color: red">{{ this.message}}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="#e91e63"
              text
              style="text-transform: none"
              :disabled="bundle.status == 'Cut In'"
              @click="stepdown(bundle.id, bundle.status, item.lineNumber)"
            >
              &larr; Step down
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="#e91e63"
              text
              style="text-transform: none"
              :disabled="bundle.status == 'Packed Out'"
              @click="stepUp(bundle.id,bundle.status,item.lineNumber)"
              >
              Step up &rarr;
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-console */
import $ from "jquery";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "bundlesList",
  props: ["bndl"],
  data() {
    return {
      dialog: false,
      orderId: "",
      bndlnum: "",
      item: {},
      processes: [
        "Cut In",
        "Cut Out",
        "Sew In",
        "Sew Out",
        "Finishing In",
        "Finishing Out",
        "Packed In",
        "Packed Out",
      ],
      bundle: {},
      type: "",
      step: "",
      bundleid: "",
      bundlestatus: "",
      message: "",
      selectedColor: "",
      totalPacked: "",
      selectedSize: "",
      selectedProcess: "",
      
    };
  },

  computed: {
    ...mapState("order", [
      "orders",
      "bundlesInOrder",
      "bundles",
      "updatedStatus",
      "colors",
      "sizes",
    ]),
  },
  async created() {
    this.getOrders();
  },

  watch: {
    dialog(val) {
      if (val) {
        document.addEventListener("mousedown", this.mousedownHandler);
      } else {
        document.removeEventListener("mousedown", this.mousedownHandler);
      }
    },
  },

  methods: {
    ...mapMutations("order", [
      "setBundleData",
      "pushBundleData",
      "updateBndlStatus",
      "setColor",
    ]),
    ...mapActions("order", [
      "bundlesStatusInOrder",
      "getOrders",
      "fetchBundleData",
      "fetchByTypeandOrderId",
      "updateBundleStatus",
      "fetchColorData",
      "fetchSizeData",
      "filterByProcessandColor",
      "filterByProcessandSize",
      "filterByColorandSize",
      "filterByColor",
      "filterBySize",
      "filterByAll",
    ]),
    ...mapActions("bundlehistory", ["postBundleHistory"]),

    mousedownHandler(e) {
      if (e.target.classList.contains("v-overlay__scrim")) this.dialog = false;
    },
    async fetchBundle() {
      // eslint-disable-next-line no-unused-vars
      await this.fetchBundleData(this.orderId).then((res) => {
        this.bndlnum = this.bundles[0].bndlnum;
      });
      this.$refs.processDropdown.value = null;
      this.$refs.colorDropdown.value = null;
      this.$refs.sizeDropdown.value = null;
      this.selectedProcess = "";
      this.selectedColor = "";
      this.selectedSize = "";
    },

    async fetchColors() {
      await this.fetchColorData(this.orderId);
    },

    async fetchSizes() {
      await this.fetchSizeData(this.orderId);
    },

    selectOrder(val) {
      this.initiateSingleOrderStatus(val.id);
      this.orderId = val.id;
      // this.orderNumber = val.orderNumber;
      // this.orderQuantity = val.orderQuantity;
      this.fetchBundle();
      this.fetchColors();
      this.fetchSizes();
    },
    async drawGraph(i) {
      var rowInserted = 2;
      var table = document.getElementById("tabelOrderSingle");
      var row = table.insertRow(rowInserted);
      row.insertCell(0).innerHTML = this.bundlesInOrder[i][0];
      table.rows[rowInserted].cells[0].rowSpan =this.bundlesInOrder[i].length - 1;
      row.insertCell(1).innerHTML = this.bundlesInOrder[i][1][0];
      row.insertCell(2).innerHTML = this.bundlesInOrder[i][1][1];
      row.insertCell(3).innerHTML = this.bundlesInOrder[i][1][2];
      row.insertCell(4).innerHTML = this.bundlesInOrder[i][1][3];
      row.insertCell(5).innerHTML = this.bundlesInOrder[i][1][4];
      row.insertCell(6).innerHTML = this.bundlesInOrder[i][1][5];
      row.insertCell(7).innerHTML = this.bundlesInOrder[i][1][6];
      row.insertCell(8).innerHTML = this.bundlesInOrder[i][1][7];
      row.insertCell(9).innerHTML = this.bundlesInOrder[i][1][8];
      this.totalPacked = this.totalPacked + this.bundlesInOrder[i][1][8];
      for (var j = 2; j < this.bundlesInOrder[i].length; j++) {
        rowInserted = rowInserted + 1;
        row = table.insertRow(rowInserted);
        row.insertCell(0).innerHTML = this.bundlesInOrder[i][j][0];
        row.insertCell(1).innerHTML = this.bundlesInOrder[i][j][1];
        row.insertCell(2).innerHTML = this.bundlesInOrder[i][j][2];
        row.insertCell(3).innerHTML = this.bundlesInOrder[i][j][3];
        row.insertCell(4).innerHTML = this.bundlesInOrder[i][j][4];
        row.insertCell(5).innerHTML = this.bundlesInOrder[i][j][5];
        row.insertCell(6).innerHTML = this.bundlesInOrder[i][j][6];
        row.insertCell(7).innerHTML = this.bundlesInOrder[i][j][7];
        row.insertCell(8).innerHTML = this.bundlesInOrder[i][j][8];
        this.totalPacked = this.totalPacked + this.bundlesInOrder[i][j][8];

      }
      rowInserted = rowInserted + 1;

    },
    async initiateSingleOrderStatus(id) {
      this.bundlesStatusInOrder(id).then(() => {
        if (this.bundlesInOrder.length > 0) {
          $("#orderNotstarted").hide();
          $("#tableDiv").show();
          var table = document.getElementById("tabelOrderSingle");
          //to delete old table rows before reload
          while (table.rows.length > 2) {

            table.deleteRow(2);
          }
          var i = 0;
          while (i < this.bundlesInOrder.length) {
            this.drawGraph(i);
            i += 1;
          }
        } else {
          $("#orderNotstarted").show();
          $("#tableDiv").hide();
        }
      });
    },

    async fetchbndlByProcess() {
      await this.fetchByTypeandOrderId([this.type, this.orderId]);
    },

    async fetchByProcessandColor() {
      await this.filterByProcessandColor([
        this.orderId,
        this.type,
        this.selectedColor,
      ]);
    },

    async fetchByProcessandSize() {
      await this.filterByProcessandSize([
        this.orderId,
        this.type,
        this.selectedSize,
      ]);
    },

    async fetchByColorandSize() {
      await this.filterByColorandSize([
        this.orderId,
        this.selectedColor,
        this.selectedSize,
      ]);
    },

    async fetchByColor() {
      await this.filterByColor([this.orderId, this.selectedColor]);
    },

    async fetchByAll() {
      await this.filterByAll([
        this.orderId,
        this.type,
        this.selectedColor,
        this.selectedSize,
      ]);
    },

    async fetchBySize() {
      this.filterBySize([this.orderId, this.selectedSize]);
    },

    selectProcess(val) {
      if (this.orderId) {
        this.selectedProcess = val;
        switch (val) {
          case "Cut In":
            this.type = "ci";
            break;
          case "Cut Out":
            this.type = "co";
            break;
          case "Sew In":
            this.type = "si";
            break;
          case "Sew Out":
            this.type = "so";
            break;
          case "Finishing In":
            this.type = "fi";
            break;
          case "Finishing Out":
            this.type = "fo";
            break;
          case "Packed In":
            this.type = "pi";
            break;
          case "Packed Out":
            this.type = "po";
            break;
        }
        if (this.selectedColor && this.selectedSize) {
          this.fetchByAll();
        } else if (this.selectedColor) {
          this.fetchByProcessandColor();
        } else if (this.selectedSize) {
          this.fetchByProcessandSize();
        } else {
          this.fetchbndlByProcess();
        }
      } else {
        this.message = "You have to select an Order first!";
      }
    },

    selectColor(val) {
      this.selectedColor = val;
      if (this.selectedProcess && this.selectedSize) {
        this.fetchByAll();
      } else if (this.selectedProcess) {
        this.fetchByProcessandColor();
      } else if (this.selectedSize) {
        this.fetchByColorandSize();
      } else {
        this.fetchByColor();
      }
    },

    selectSize(val) {
      this.selectedSize = val;
      if (this.selectedProcess && this.selectedColor) {
        this.fetchByAll();
      } else if (this.selectedProcess) {
        this.fetchByProcessandSize();
      } else if (this.selectedColor) {
        this.fetchByColorandSize();
      } else {
        this.fetchBySize();
      }
    },

    // eslint-disable-next-line no-unused-vars
    changeStatus(id, type) {
      this.dialog = true;
      this.bundle.id = id;
      switch (type) {
        case "ci":
          this.bundle.status = "Cut In";
          break;
        case "co":
          this.bundle.status = "Cut Out";
          break;
        case "si":
          this.bundle.status = "Sew In";
          break;
        case "so":
          this.bundle.status = "Sew Out";
          break;
        case "fi":
          this.bundle.status = "Finishing In";
          break;
        case "fo":
          this.bundle.status = "Finishing Out";
          break;
        case "pi":
          this.bundle.status = "Packed In";
          break;
        case "po":
          this.bundle.status = "Packed Out";
          break;
      }
    },

    async stepUpTo(id, status) {
      // change the status of the bundle(identified by the id) to the provided status.
      await this.updateBundleStatus([id, status]).then(() => {
        this.fetchBundle();
        this.initiateSingleOrderStatus(this.orderId);
      });
    },                


    stepUp(id,type,linenumber) {
     
     // what is the id of the bundle clicked...?
      this.bundleid = id;
      // what is the current status of the bundle
      this.bundle.status = type;

      this.item.scannedOrderStatusId = id;
      this.item.lineNumber = linenumber;

      if(this.item.lineNumber){
        // update the status information for this bundle based on the current status.
        switch (this.bundle.status) {
          case "Cut In":
            this.stepUpTo(id, "co");
            this.item.oldStatus = 'ci';
            this.item.newStatus = 'co';
            break;
          case "Cut Out":
            this.stepUpTo(id, "si");
            this.item.oldStatus = 'co';
            this.item.newStatus = 'si';
            break;
          case "Sew In":
            this.stepUpTo(id, "so");
            this.item.oldStatus = 'si';
            this.item.newStatus = 'so';
            break;
          case "Sew Out":
            this.stepUpTo(id, "fi");
            this.item.oldStatus = 'so';
            this.item.newStatus = 'fi';
            break;
          case "Finishing In":
            this.stepUpTo(id, "fo");
            this.item.oldStatus = 'fi';
            this.item.newStatus = 'fo';
            break;
          case "Finishing Out":
            this.stepUpTo(id, "pi");
            this.item.oldStatus = 'fo';
            this.item.newStatus = 'pi';
            break;
          case "Packed In":
            this.stepUpTo(id, "po");
            this.item.oldStatus = 'pi';
            this.item.newStatus = 'po';
            break;
        }
        var dt = new Date();
        var isoFormat = dt.toISOString();
        var substringedDt = isoFormat.substr(0,19);
        var tRemovedDt = substringedDt.replace('T', ' ');
        this.item.date = tRemovedDt;
        this.postBundleHistory(this.item);
        this.dialog = false;
      }
      
      else{
        this.message = "Please enter the line number!"
      } 
      

    },
    async stepDownTo(id,status){
      // change the status of the bundle(identified by the id) to the provided status.
      await this.updateBundleStatus([id, status]).then(() => {
        this.fetchBundle();
        this.initiateSingleOrderStatus(this.orderId);
      });
    },
    stepdown(id, type, linenumber) {
      this.bundleid = id;
      this.bundlestatus = type;
      this.item.scannedOrderStatusId = id;
      this.item.lineNumber = linenumber;
      
      if(this.item.lineNumber){
        switch (this.bundlestatus) {
          case "Cut Out":
            this.stepDownTo(id, "ci");
            this.item.oldStatus = 'co';
            this.item.newStatus = 'ci';
            break;
          case "Sew In":
            this.stepDownTo(id, "co");
            this.item.oldStatus = 'si';
            this.item.newStatus = 'co';
            break;
          case "Sew Out":
            this.stepDownTo(id, "si");
            this.item.oldStatus = 'so';
            this.item.newStatus = 'si';
            break;
          case "Finishing In":
            this.stepDownTo(id, "so");
            this.item.oldStatus = 'fi';
            this.item.newStatus = 'so';
            break;
          case "Finishing Out":
            this.stepDownTo(id, "fi");
            this.item.oldStatus = 'fo';
            this.item.newStatus = 'fi';
            break;
          case "Packed In":
            this.stepDownTo(id, "fo");
            this.item.oldStatus = 'pi';
            this.item.newStatus = 'fo';
            break;
          case "Packed Out":
            this.stepDownTo(id, "pi");
            this.item.oldStatus = 'po';
            this.item.newStatus = 'pi';
            break;
        }

        var dt = new Date();
        var isoFormat = dt.toISOString();
        var substringedDt = isoFormat.substr(0,19);
        var tRemovedDt = substringedDt.replace('T', ' ');
        this.item.date = tRemovedDt;
        this.postBundleHistory(this.item);
        this.dialog = false;
      }

      else{
        this.message = "Please enter the line number!"
      }
      
    },
  },
};
</script>
<style>
.maincontainer {
  width: 240px;
  height: 100px;
  border: 1px solid #ffda82;
  border-radius: 10px;
  margin-top: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 15px;
  background-color: #ffda82;
  box-shadow: 2px 4px 10px 0px #b89a54;
}

.mainrow,
.newHolder {
  display: flex;
}

.avatar {
  width: 30%;
  height: 55px;
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 100px;
  text-align: center;
}
.avtext {
  margin-top: 13px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}
.statustxt {
  font-size: 13px;
  color: white;
}
.content {
  width: 100%;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
}

.maincolor {
  color: white;
  font-weight: bold;
  font-size: 15px;
}
.secondColor {
  color: white;
  font-size: 12px;
}

.mainsize {
  width: 100%;
  color: white;
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
}

.mainserial {
  color: white;
  font-weight: lighter;
  font-size: 13px;
  margin-top: 0px;
}
.headline {
  background-color: #ffda82;
  color: white;
}

#tableDiv {
  display: none;
  margin-top: 3%;
  margin-bottom: 1%;
  border: groove;
}

#tabelOrderSingle {
  width: 100%;
}
#tabelOrderSingle tr:nth-child(even) {
  background-color: #efeeed;
}
#tabelOrderSingle tr:nth-child(odd) {
  background-color: #fff;
}

#tabelOrderSingle th {
  background-color: #a8ccd4;
  color: black;
}

#tabelOrderSingle td {
  text-align: center;
}

.required label::after {
    content: "*";
}
.totalbundles {
  margin-top: 3%;
  padding-left: 1%;
}
</style>
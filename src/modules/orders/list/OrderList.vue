<template>
  <div>
    <v-fab-transition>
      <div class="box" v-if="this.singleOrderStausData.length > 0">
        <img class="cimg" :src="this.getimg" />

        <div class="textcol">
          <div class="maintext green--text boldtxt">{{ this.getcustomer }}</div>
          <div class="subtext">Order #: {{ this.getOrderNumber }}</div>
          <div class="subtext">Order Quantity: {{ this.getquantity }}</div>
          <div class="subtext green--text boldtxt">
            Total packed: {{ this.gettotalPacked }}
          </div>
        </div>
      </div>
    </v-fab-transition>

    <v-container grid-list-xs>
      <div id="orderNotstarted" style="display: none">
        <h3 style="color: red; text-align: center">
          Selected order not start in garment!
        </h3>
      </div>
      <v-slide-x-transition>
        <v-card
          v-if="this.singleOrderStausData.length > 0"
          style=""
        >
          <div id="tableDiv">
            <div style="display: flex">
              <!-- <h4 id="nameQuantity"></h4> -->
              <!-- <label id="packed"></label> -->
            </div>

            <table border="1" id="tabelOrderSingle">
              <tr>
                <th rowspan="2">Color</th>
                <th rowspan="2">Label</th>
                <th rowspan="2">Order</th>

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
        </v-card>
      </v-slide-x-transition>
      <v-card outlined style="border-radius: 13px">
        <v-toolbar dense flat>
          <v-text-field
            solo
            flat
            dense
            hide-details
            :label="$t('searchBy') + ' ' + $t('orderNumber')"
            prepend-inner-icon="search"
            v-model="search"
            @input="loadData"
          />
          <v-spacer></v-spacer>
          <!-- <v-btn
            text
            outlined
            small
            rounded
            class="text-capitalize mainbtn mx-2"
            @click="generateStatusQrcode"
          >
            <v-icon class="ma-1 mainbtn" >camera</v-icon>
            {{ $t("order-status-qr-code") }}
          </v-btn> -->

          <v-btn
            rounded
            small
            outlined
            color="#ecbb44"
            class="text-capitalize mainbtn"
            @click="$router.push({ name: 'create-order' })"
            >{{ $t("addNew") }}</v-btn
          >

          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>

        <v-data-table
          :headers="headers"
          :rows-per-page="10"
          :loading="loading"
          :items="orderData"
          item-key="id"
          footer-props.items-per-page-text="`Order rec per page`"
        >
          <template v-slot:item.attachement="{ item }">
            <v-icon
              text
              color="purple"
              class="text-capitalize"
              @click="
                initiateSingleOrderStatus(
                  item.id,
                  item.Customer.customerName,
                  item.quantity,
                  item.orderNumber,
                  item.Customer.imagePath
                )
              "
            >
              mdi-information-variant
            </v-icon>
            <v-btn
              @click.stop="downloadFile(item.attachment)"
              text
              color="green"
              class="text-capitalize"
              target="_blank"
              ><v-icon>mdi-download</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.action="{ item }">
            <v-menu bottom left transition="slide-x-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  rounded
                  small
                  v-on="on"
                  color="#ecbb44"
                  class="text-capitalize"
                  >{{ $t("clickHere") }}</v-btn
                >
              </template>

              <v-card>
                <v-card-text>
                  <v-btn
                    text
                    small
                    color="info"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'order-info',
                        params: { orderId: item.id },
                      })
                    "
                    >{{ $t("more_detail") }}</v-btn
                  >
                  <v-btn
                    text
                    small
                    color="info"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'update-order',
                        params: { orderId: item.id },
                      })
                    "
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn
                    text
                    small
                    color="purple"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'status-list',
                        params: { orderId: item.id },
                      })
                    "
                    >{{ $t("order-status") }}</v-btn
                  >
                  <v-btn
                    small
                    text
                    color="red"
                    @click="deleteItem(item.id, path)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>


<script>
import $ from "jquery";
import { api, path, API_ROOT } from "@/api";
import { tableMixin } from "@/shared/mixins";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [tableMixin],
  data() {
    return {
      customer: "",
      orderNumber: 0,
      quantity: "",
      totalPacked: 0,
      path: path.order,
      resource: api,
      resourceName: "Order",
      searchField: "orderNumber",
      test: "",
      apipath: API_ROOT,
      customerImg: "",
      headers: [
        {
          text: this.$t("date"),
          value: "date",
        },
        {
          text: this.$t("customer"),
          value: "Customer.customerName",
        },
        {
          text: this.$t("styleName"),
          value: "styleName",
        },
        {
          text: this.$t("styleNumber"),
          value: "styleNumber",
        },
        {
          text: this.$t("orderNumber"),
          value: "orderNumber",
        },
        {
          text: this.$t("orderQuantity"),
          value: "quantity",
        },
        {
          text: this.$t("attachement"),
          value: "attachement",
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "action",
        },
      ],
    };
  },
  created() {
    this.getOrder();
  },
  computed: {
    ...mapState("order", ["orderData", "singleOrderStausData"]),
    getimg() {
      return (
        this.apipath + "/Containers/customer/download/" + this.getcustomerImg
      );
    },
    getcustomer() {
      return this.customer;
    },
    getOrderNumber() {
      return this.orderNumber;
    },
    getquantity() {
      return this.quantity;
    },
    getcustomerImg() {
      return this.customerImg;
    },
    gettotalPacked() {
      return this.totalPacked;
    },
  },
  methods: {
    ...mapActions("order", ["getOrder", "loadSingleOrderStatus"]),


    async downloadFile(val) {
      
      try {
        window.open(API_ROOT + "/Containers/orders/download/"+val, '_blank');

        // api.download("orders", val, "/containers").then(response => {
        //   const url = window.URL.createObjectURL(new Blob([response]))
        //   const link = document.createElement('a')
        //   link.href = url
        //   link.setAttribute('download', val) //or any other extension
        //   document.body.appendChild(link)
        //   link.click()
        //   URL.revokeObjectURL(link.href)
        // });
      } catch (error) {
        alert(error);
      }
    },
    generateStatusQrcode() {
      this.loading = !this.loading;
      this.$router.push({ name: "status-qrcode" });
    },
    async drawGraph(i) {
      var rowInserted = 2;
      var table = document.getElementById("tabelOrderSingle");
      var row = table.insertRow(rowInserted);

      row.insertCell(0).innerHTML = this.singleOrderStausData[i][0];
      table.rows[rowInserted].cells[0].rowSpan =
        this.singleOrderStausData[i].length - 1;

      row.insertCell(1).innerHTML = this.singleOrderStausData[i][1][0];
      row.insertCell(2).innerHTML = this.singleOrderStausData[i][1][1];
      row.insertCell(3).innerHTML = this.singleOrderStausData[i][1][2];
      row.insertCell(4).innerHTML = this.singleOrderStausData[i][1][3];
      row.insertCell(5).innerHTML = this.singleOrderStausData[i][1][4];
      row.insertCell(6).innerHTML = this.singleOrderStausData[i][1][5];
      row.insertCell(7).innerHTML = this.singleOrderStausData[i][1][6];
      row.insertCell(8).innerHTML = this.singleOrderStausData[i][1][7];
      row.insertCell(9).innerHTML = this.singleOrderStausData[i][1][8];
      row.insertCell(10).innerHTML = this.singleOrderStausData[i][1][9];
      this.totalPacked = this.totalPacked + this.singleOrderStausData[i][1][8];

      for (var j = 2; j < this.singleOrderStausData[i].length; j++) {
        rowInserted = rowInserted + 1;
        row = table.insertRow(rowInserted);
        row.insertCell(0).innerHTML = this.singleOrderStausData[i][j][0];
        row.insertCell(1).innerHTML = this.singleOrderStausData[i][j][1];
        row.insertCell(2).innerHTML = this.singleOrderStausData[i][j][2];
        row.insertCell(3).innerHTML = this.singleOrderStausData[i][j][3];
        row.insertCell(4).innerHTML = this.singleOrderStausData[i][j][4];
        row.insertCell(5).innerHTML = this.singleOrderStausData[i][j][5];
        row.insertCell(6).innerHTML = this.singleOrderStausData[i][j][6];
        row.insertCell(7).innerHTML = this.singleOrderStausData[i][j][7];
        row.insertCell(8).innerHTML = this.singleOrderStausData[i][j][8];
        row.insertCell(9).innerHTML = this.singleOrderStausData[i][j][9];
        this.totalPacked =
          this.totalPacked + this.singleOrderStausData[i][j][8];
      }
      rowInserted = rowInserted + 1;
    },
    async initiateSingleOrderStatus(
      id,
      customer,
      quantity,
      orderNumber,
      customerImage
    ) {
      this.customer = customer;
      this.quantity = quantity;
      this.orderNumber = orderNumber;
      this.customerImg = customerImage;

      // TODO why you used id tags instead of v-bin? @temesgen
      this.loadSingleOrderStatus(id).then(() => {
        if (this.singleOrderStausData.length > 0) {
          $("#orderNotstarted").hide();
          $("#tableDiv").show();
          // $("#nameQuantity").html(
          //   this.customer +
          //     " -Order No : " +
          //     this.orderNumber +
          //     ", Quantity : " +
          //     this.quantity
          // );
          // $("#packed").html(" , Total Packed : " + this.totalPacked);
          var table = document.getElementById("tabelOrderSingle");
          $("#tabelOrderSingle").show();

          //to delete old table rows before reload
          while (table.rows.length > 2) {
            table.deleteRow(2);
          }

          var i = 0;
          while (i < this.singleOrderStausData.length) {
            this.drawGraph(i);
            i += 1;
          }
        } else {
          $("#orderNotstarted").show();
          $("#tableDiv").hide();
        }
      });
    },
  },
};
</script>

<style>
#tableDiv {
  display: none;
  margin-bottom: 2%;
  /* border: inset; */
}

#tabelOrderSingle {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}

.box {
  width: 270px;
  height: 90px;
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px 50px 50px 12px;
  background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000052;
  display: flex;
  flex-direction: row-reverse;
  /* background-color: #acf4ac; */
  color: #9b751a;
}
.box:hover {
  transform: rotate(2deg);
}
.cimg {
  width: 90px;
  height: 90px;
  border-radius: 80px;
  display: block;
  box-shadow: 0px 3px 6px #00000052;
}

.textcol {
  display: flex;
  flex-direction: column;
  margin: auto;
}
.maintext {
  font-size: 15px;
}

.subtext {
  font-size: 12px;
}
.subtext:hover {
  font-size: 15px;
}
.boldtxt {
  font-weight: bold;
}
</style>
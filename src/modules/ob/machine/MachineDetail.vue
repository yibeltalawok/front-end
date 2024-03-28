<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'machine'
              })
            "
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md4 lg4 pa-3>
              <v-card height="100%" outlined>
                <v-card-text>
                  <v-layout row wrap justify-left>
                    <v-flex xs12 sm12 md6 lg6 pa-2>
                      <v-btn
                        rounded
                        outlined
                        color="primary"
                        class="text-capitalize"
                        @click="
                          $router.push({
                            name: 'update-machine',
                            params: { machineId: machineDetails.id }
                          })
                        "
                        >{{ $t("change_info") }}</v-btn
                      >
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                  <v-layout column justify-center align-left ma-5>
                    <p>
                      <B>{{ $t("sr") }}:</B>
                      {{ machineDetails.serialNumber }}
                    </p>
                    <p>
                      <b>{{ $t("make") }}:</b>
                      {{ machineDetails.make }}
                    </p>
                    <p>
                      <b>{{ $t("machine-model-number") }}:</b>
                      {{ machineDetails.modelNumber }}
                    </p>
                    <p>
                      <b>{{ $t("description") }}:</b>
                      {{ machineDetails.description }}
                    </p>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 sm12 md6 lg6 pa-3>
              <v-card height="100%" outlined>
                <v-card-text>
                  <v-layout row wrap justify-right>
                    <v-flex xs12 sm12 md6 lg6 pa-2>
                      <v-row>
                        <v-btn
                          rounded
                          outlined
                          color="primary"
                          class="text-capitalize"
                          @click="lostTimeDialog = true"
                          >{{ $t("add-stock-info") }}</v-btn
                        >

                        <v-spacer />

                        <h4>{{ $t("available_stock") }}:</h4>
                        <h3 style="color:green; margin-left: 10px;">
                          {{ availableStock }}
                        </h3>
                      </v-row>
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                  <v-layout column justify-center align-center>
                    <template>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">{{ $t("date") }}</th>
                              <th class="text-left">
                                {{ $t("openingStock") }}
                              </th>
                              <!-- <th class="text-left">{{ $t("assigned") }}</th> -->
                              <th class="text-left">{{ $t("purchased") }}</th>
                              <th class="text-left">
                                {{ $t("closingStock") }}
                              </th>
                              <th class="text-left">
                                {{ $t("action") }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(stock, i) in stocks" :key="stock.day">
                              <td>
                                {{
                                  new Date(stock.day).toLocaleDateString(
                                    "en-US"
                                  )
                                }}
                              </td>
                              <td>{{ stock.openingStock }}</td>
                              <!-- <td>{{ stock.assigned }}</td> -->
                              <td>{{ stock.purchased }}</td>
                              <td>{{ stock.closingStock }}</td>
                              <td>
                                <v-menu
                                  bottom
                                  left
                                  transition="slide-x-transition"
                                  offset-y
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      text
                                      rounded
                                      small
                                      v-on="on"
                                      color="primary"
                                      class="text-capitalize"
                                      >{{ $t("clickHere") }}</v-btn
                                    >
                                  </template>

                                  <v-card>
                                    <v-card-text>
                                      <v-icon
                                        color="primary"
                                        @click="update(stock, i)"
                                        class="mr-2"
                                        >edit</v-icon
                                      >
                                      <v-icon
                                        color="red"
                                        small
                                        class="ml-2"
                                        @click="deleteStock(stock)"
                                        >delete</v-icon
                                      >
                                    </v-card-text>
                                  </v-card>
                                </v-menu>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-3>
              <v-card outlined>
                <v-layout
                  class="mt-3"
                  column
                  justify-center
                  align-center
                  ref="content"
                >
                  <qrcode-vue
                    :value="JSON.stringify(value)"
                    :size="size"
                    level="H"
                  ></qrcode-vue>
                </v-layout>
                <v-toolbar flat dense>
                  <v-spacer></v-spacer>
                  <v-btn
                    small
                    rounded
                    outlined
                    color="primary"
                    class="text-capitalize"
                    @click="print"
                    >{{ $t("print") }}</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-toolbar>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <v-dialog v-model="lostTimeDialog" persistent max-width="800px">
      <v-card style="padding-right: 20%; padding-left: 20%">
        <v-card-title>
          <span class="headline">{{ "Add machine stock" }}</span>
        </v-card-title>

        <!-- <v-card style="padding-right: 20%; padding-left: 20%">
        <v-card-title>
          <span class="headline">{{ $t("power-outage-lost-time") }}</span>
        </v-card-title>
>>>>>>> 43c505a1018d2019f8ea7fb5959b5e4195cbb038 -->

        <v-menu
          v-model="pickDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              :error-messages="errors.collect('day')"
              :label="$t('date')"
              name="day"
              prepend-inner-icon="event"
              outlined
              dense
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="pickDate = false"
          ></v-date-picker>
        </v-menu>
        <!-- Date Picker -->
        <v-text-field
          v-model="openingStock"
          :error-messages="errors.collect('openingStock')"
          :label="$t('openingStock')"
          name="openingStock"
          type="number"
          disabled
          min="0"
          outlined
          dense
        />
        <!-- <v-text-field
          v-model="assigned"
          :error-messages="errors.collect('assigned')"
          :label="$t('assigned')"
          name="assigned"
          type="number"
          min="0"
          outlined
          dense
        /> -->
        <v-text-field
          v-model="purchased"
          :error-messages="errors.collect('purchased')"
          :label="$t('purchased')"
          name="purchased"
          type="number"
          min="0"
          outlined
          dense
          @input="setClosingStock"
        />

        <v-text-field
          v-model="closingStock"
          :error-messages="errors.collect('closingStock')"
          :label="$t('closingStock')"
          name="closingStock"
          type="number"
          min="0"
          disabled
          outlined
          dense
        />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            class="text-capitalize white--text"
            @click="closeDialog"
            >{{ $t("close") }}</v-btn
          >
          <v-btn
            color="primary"
            class="text-capitalize white--text"
            @click="addStock"
            v-if="updateStocke == false"
            >{{ $t("save") }}</v-btn
          >
          <v-btn
            color="primary"
            class="text-capitalize white--text"
            @click="manageUpdate"
            v-if="updateStocke == true"
            >{{ $t("edit") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
import QrcodeVue from "qrcode.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { mapActions, mapState } from "vuex";

export default {
  name: "machineInfo",
  mixins: [tableMixin],
  data() {
    return {
      resourceName: "Machine",
      lostTimeDialog: false,
      updateStocke: false,
      pickDate: "",
      date: "",
      openingStock: "",
      assigned: "",
      purchased: "",
      availableStock: 0,
      closingStock: "",
      item: {},
      stocks: [],
      qrcode: [],
      resource: api,
      path: path.machine,
      value: {},
      size: 100,
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Machine",
          disabled: false,
          to: "/app/machine/list"
        },
        {
          text: "More Info",
          disabled: true
        }
      ],
      index: ""
    };
  },
  components: {
    QrcodeVue
  },

  computed: {
    ...mapState("machines", ["machinelist", "machineDetails"])
  },
  async created() {
    this.fetchData();
  },
  methods: {
    ...mapActions("machines", [
      "fetchAllMachines",
      "fetchMachinesWithID",
      "registerStock"
    ]),

    async fetchData() {
      this.closingStock = "";
      this.purchased = "";
      this.updateStocke = false;
      const { machineId } = this.$route.params;
      // this.item = await api.get(machineId, this.path);
      await this.fetchMachinesWithID(machineId).then(res => {
        res;
        this.qrcode = {};
        this.stocks = this.machineDetails.stockrecord;
        // this.stocks = this.machineDetails.stock;
        this.availableStock =
          this.stocks.length == 0
            ? 0
            : this.stocks[this.stocks.length - 1].closingStock;
        // .reduce(
        //     (acc, val) => parseFloat(acc) + parseFloat(val.closingStock),
        //     0
        //   );
        this.openingStock = this.availableStock;
        this.machine = this.machineDetails;
        this.value = {
          id: this.machineDetails.id,
          modelNumber: this.machineDetails.modelNumber,
          type: "machine"
        };
      });

      //this.value = JSON.stringify(this.item);

      // =======
      //           id: this.machineDetails.id,
      //           modelNumber: this.machineDetails.modelNumber,
      //           description: this.machineDetails.description,
      //           type: "machine"
      //         };
      //       });

      //       //this.value = JSON.stringify(this.item);
      // >>>>>>> 43c505a1018d2019f8ea7fb5959b5e4195cbb038
    },
    setClosingStock() {
      this.closingStock =
        parseFloat(this.purchased) + parseFloat(this.openingStock);
    },
    print() {
      const doc = new jsPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/png", 10);
        doc.addImage(img, "JPEG", 50, 50);
        doc.save("machine.pdf");
      });
    },

    async addStock() {
      // eslint-disable-next-line no-console
      // console.log({
      //   day: this.date,
      //   openingStock: this.openingStock,
      //   assigned: this.assigned,
      //   purchased: this.purchased,
      //   closingStock: this.closingStock,
      //   machineid: this.machineDetails.id
      // });

      await this.registerStock({
        record: {
          day: this.date,
          openingStock: this.openingStock,
          assigned: this.assigned,
          purchased: this.purchased,
          closingStock: this.closingStock,
          machineid: this.machineDetails.id
        }
      }).then(r => {
        r;
        // this.lostTimeDialog = false;
        // this.updateStocke = false;
        // this.fetchData();
        this.lostTimeDialog = false;
        // this.setClosingStock = false;
        this.openingStock = "";
        this.purchased = "";
        this.closingStock = "";
        this.updateStocke = false;
        this.fetchData();
      });
    },
    // eslint-disable-next-line no-unused-vars
    async deleteStock(stock) {
      // alert(this.machineDetails.stock.length);
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        let temp = [];
        for (
          let index = 0;
          index < this.machineDetails.stockrecord.length;
          index++
        ) {
          if (this.machineDetails.stockrecord[index] != stock) {
            temp.push(this.machineDetails.stockrecord[index]);
          }
        }
        this.machineDetails.stock =
          this.machineDetails.stock - parseInt(stock.purchased);
        this.machineDetails.stockrecord = temp;
        // this.stocks = temp;
        this.updateStock(this.machineDetails);
      }
    },
    async updateStock(machineDetails) {
      api
        .update(machineDetails, this.path)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Stock info",
            message: `Stock is ${this.$t("updated")} ${this.$t(
              "successfully"
            )}.`
          });
          this.lostTimeDialog = false;
          this.updateStocke = false;
          this.fetchData();
        })
        .catch(err => {
          this.showErrors(err);
        });
    },
    // eslint-disable-next-line no-unused-vars
    update(stock, i) {
      this.index = i;
      this.date = stock.day;
      this.openingStock = stock.openingStock;
      this.assigned = stock.assigned;
      this.purchased = stock.purchased;
      this.closingStock = stock.closingStock;
      this.updateStocke = true;
      this.lostTimeDialog = true;
      // machineid: this.machineDetails.id
    },
    manageUpdate() {
      this.machineDetails.stockrecord[this.index] = {
        day: this.date,
        openingStock: this.openingStock,
        assigned: this.assigned,
        purchased: this.purchased,
        closingStock: this.closingStock,
        machineid: this.machineDetails.id
      };
      this.updateStock(this.machineDetails);
    },
    closeDialog() {
      this.lostTimeDialog = false;
      this.openingStock = this.availableStock;
      this.purchased = "";
      this.closingStock = "";
      this.updateStocke = false;
    },
    async computePurchased() {}
  }
};
</script>

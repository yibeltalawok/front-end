<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 13px">
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
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <div class="text-right">
              <v-menu bottom left transition="slide-x-transition" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    v-on="on"
                    outlined
                    class="text-capitalize"
                    >{{ $t("status-summary") }}</v-btn
                  >
                </template>
                <v-card v-if="item.length > 0">
                  <v-card-text>
                    <p>
                      {{ $t("total") }} {{ $t("cutIn") }}:
                      {{ item[item.length - 1].cutIn }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("cutOut") }}:
                      {{ item[item.length - 1].totalCutOut }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("sewIn") }}:
                      {{ item[item.length - 1].totalSewIn }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("sewOut") }}:
                      {{ item[item.length - 1].totalSewOut }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("finishingIn") }}:
                      {{ item[item.length - 1].totalFinishingIn }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("finishingOut") }}:
                      {{ item[item.length - 1].totalFinishingOut }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("packedIn") }}:
                      {{ item[item.length - 1].totalPackedIn }}
                    </p>
                    <p>
                      {{ $t("total") }} {{ $t("packedOut") }}:
                      {{ item[item.length - 1].totalPackedOut }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </v-flex>
          <v-spacer />
          <v-flex xs12 sm12 md3 lg3 pa2>
            <v-combobox
              v-model="colors"
              :items="colorFilter"
              item-text="color"
              item-value="color"
              clearable
              :label="$t('color-summary')"
              multiple
              hide-details
              dense
              outlined
              color="primary"
              @input="filterByColor"
            />
          </v-flex>

          <v-spacer />
          <v-flex xs12 sm12 md3 lg3 pa2>
            <v-combobox
              v-model="sizes"
              :items="sizeFilter"
              item-text="size"
              clearable
              hide-details
              :label="$t('size-summary')"
              multiple
              dense
              outlined
              color="primary"
              @input="filterBySize"
            />
          </v-flex>
          <v-spacer />
          <v-btn
            class="primary"
            @click="$router.push({ name: 'create-status' })"
            >{{ $t("addNew") }}</v-btn
          >
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-flex
          v-if="colors.length != 0 || (sizes.length != 0 && item.length > 0)"
        >
          <table>
            <tr class="grey">
              <th>{{ $t("cutIn") }}</th>
              <th>{{ $t("cutOut") }}</th>
              <th>{{ $t("sewIn") }}</th>
              <th>{{ $t("sewOut") }}</th>
              <th>{{ $t("finishingIn") }}</th>
              <th>{{ $t("finishingOut") }}</th>
              <th>{{ $t("packedIn") }}</th>
              <th>{{ $t("packedOut") }}</th>
            </tr>
            <tr>
              <td>{{ item[0].cutIn }}</td>
              <td>{{ cutOut }}</td>
              <td>{{ sewIn }}</td>
              <td>{{ sewOut }}</td>
              <td>{{ finishingIn }}</td>
              <td>{{ finishingOut }}</td>
              <td>{{ packedIn }}</td>
              <td>{{ packedOut }}</td>
            </tr>
          </table>
        </v-flex>
        <v-data-table
          :headers="headers"
          :options.sync="pagination"
          :loading="loading"
          :items="item"
          item-key="id"
          :items-per-page-text="`status per page`"
        >
          <!-- <template v-slot:item.date="{ item }">
            <span>{{ new Date(item.date).toLocaleDateString("en-US") }}</span>
          </template> -->
          <template v-slot:item.action="{ item }">
            <v-btn small text color="red" @click="deleteItem(item.id, path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";

export default {
  data() {
    return {
      items: [],
      loading: false,
      pagination: undefined,
      orderId: "",
      path: path.orderStatus,
      resourceName: "Order Status",
      colors: [],
      sizes: [],
      item: [],
      hearder: [],
      scannedOrders: [],
      colorFilter: [],
      colorF: [],
      sizeFilter: [],
      sizeF: [],
      cutOut: 0,
      sewIn: 0,
      sewOut: 0,
      finishingIn: 0,
      finishingOut: 0,
      packedIn: 0,
      packedOut: 0,
    };
  },
  created() {
    const { orderId } = this.$route.params;
    this.orderId = orderId;
    // alert(this.orderId);
    this.loadData();
  },
  computed: {
    headers() {
      return [
        // {
        //   text: this.$t("date"),
        //   value: "date"
        // },
        // {
        //   text: this.$t("size"),
        //   value: "size"
        // },
        // {
        //   text: this.$t("color"),
        //   value: "color"
        // },
        {
          text: this.$t("customer"),
          value: "customer",
        },
        {
          text: this.$t("styleName"),
          value: "styleName",
        },
        {
          text: this.$t("cutIn"),
          value: "cutIn",
        },
        {
          text: this.$t("cutOut"),
          value: "cutOut",
        },
        {
          text: this.$t("sewIn"),
          value: "sewIn",
        },
        {
          text: this.$t("sewOut"),
          value: "sewOut",
        },

        {
          text: this.$t("finishingIn"),
          value: "finishingIn",
        },
        {
          text: this.$t("finishingOut"),
          value: "finishingOut",
        },
        {
          text: this.$t("packedIn"),
          value: "packedIn",
        },
        {
          text: this.$t("packedOut"),
          value: "packedOut",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    async loadData() {
      let filter = { include: ["order"], where: { orderId: this.orderId } };
      this.item = (await api.all(path.orderStatus, filter)).rows.map((x) => {
        return {
          id: x.id,
          size: x.size,
          color: x.color,
          date: x.date,
          customer: x.order.customer,
          styleName: x.order.styleName,
          cutIn: x.cutIn,
          cutOut: x.cutOut + "/" + x.totalCutOut,
          totalCutOut: x.totalCutOut,
          sewIn: x.sewIn + "/" + x.totalSewIn,
          totalSewIn: x.totalSewIn,
          sewOut: x.sewOut + "/" + x.totalSewOut,
          totalSewOut: x.totalSewOut,
          finishingIn: x.finishingIn + "/" + x.totalFinishingIn,
          totalFinishingIn: x.totalFinishingIn,
          finishingOut: x.finishingOut + "/" + x.totalFinishingOut,
          totalFinishingOut: x.totalFinishingOut,
          packedIn: x.packedIn + "/" + x.totalPackedIn,
          totalPackedIn: x.totalPackedIn,
          packedOut: x.packedOut + "/" + x.totalPackedOut,
          totalPackedOut: x.totalPackedOut,
        };
      });
      this.getScannedValues();
    },
    async getScannedValues() {
      let filter = { where: { orderId: this.orderId + "scan" } };
      this.scannedOrders = (await api.all(path.scannedOrders, filter)).rows;
      for (let i = 0; i < this.scannedOrders.length; i++) {
        const index = this.colorF.indexOf(this.scannedOrders[i].color);
        if (index == -1) {
          this.colorFilter.push({ color: this.scannedOrders[i].color });
          this.colorF.push(this.scannedOrders[i].color);
        }
        const ind = this.sizeF.indexOf(this.scannedOrders[i].label);
        if (ind == -1) {
          this.sizeFilter.push({ size: this.scannedOrders[i].label });
          this.sizeF.push(this.scannedOrders[i].label);
        }
      }
    },
    filterByColor() {
      this.sizes = [];
      this.makeNull();
      for (let i = 0; i < this.colors.length; i++) {
        for (let j = 0; j < this.scannedOrders.length; j++) {
          if (this.scannedOrders[j].color == this.colors[i].color) {
            if (this.scannedOrders[j].type == "co") {
              this.cutOut =
                parseInt(this.cutOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "si") {
              this.sewIn =
                parseInt(this.sewIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "so") {
              this.sewOut =
                parseInt(this.sewOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "fi") {
              this.finishingIn =
                parseInt(this.finishingIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "fo") {
              this.finishingOut =
                parseInt(this.finishingOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "pi") {
              this.packedIn =
                parseInt(this.packedIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "po") {
              this.packedOut =
                parseInt(this.packedOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
          }
        }
      }
    },
    filterBySize() {
      this.colors = [];
      this.makeNull();
      for (let i = 0; i < this.sizes.length; i++) {
        for (let j = 0; j < this.scannedOrders.length; j++) {
          if (this.scannedOrders[j].label == this.sizes[i].size) {
            if (this.scannedOrders[j].type == "co") {
              this.cutOut =
                parseInt(this.cutOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "si") {
              this.sewIn =
                parseInt(this.sewIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "so") {
              this.sewOut =
                parseInt(this.sewOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "fi") {
              this.finishingIn =
                parseInt(this.finishingIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "fo") {
              this.finishingOut =
                parseInt(this.finishingOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "pi") {
              this.packedIn =
                parseInt(this.packedIn) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
            if (this.scannedOrders[j].type == "po") {
              this.packedOut =
                parseInt(this.packedOut) +
                parseInt(this.scannedOrders[j].to) -
                parseInt(this.scannedOrders[j].from) +
                1;
            }
          }
        }
      }
    },
    makeNull() {
      this.cutOut = 0;
      this.sewIn = 0;
      this.sewOut = 0;
      this.finishingIn = 0;
      this.finishingOut = 0;
      this.packedIn = 0;
      this.packedOut = 0;
    },
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
      });
      if (confirmed) {
        await api.remove(id, path);
        this.$notify({
          type: "success",
          title: "Success",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`,
        });
        this.loadData();
      }
    },
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
  padding: 10px 1px 0px 1px;
}
</style>
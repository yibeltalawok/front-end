<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'status-list', params: orderId })"
          >
            <v-icon class="mx-3">arrow_back</v-icon>Order status list
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form
          @submit.prevent="save"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <form-error-messages :messages="errorMessage" />
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.date"
                :error-messages="errors.collect('date')"
                label="Date"
                name="date"
                outlined
                dense
                type="date"
                @change="efficiency"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.cutOut"
                :error-messages="errors.collect('cutOut')"
                label="Cut Out"
                name="Cut Out"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.cutOut, tco, item.cutIn, 'CO')"
                :rules="cutOutRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.sewIn"
                :error-messages="errors.collect('sewIn')"
                :label="$t('Sew In')"
                name="sewIn"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.sewIn, tsi, tempTco, 'SI')"
                :rules="sewInRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.sewOut"
                :error-messages="errors.collect('sewOut')"
                :label="$t('Sew Out')"
                name="sewOut"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.sewOut, tso, tempTsi, 'SO')"
                @change="efficiency"
                :rules="sewOutRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.finishingIn"
                :error-messages="errors.collect('finishingIn')"
                label="Finishing In"
                name="finishingIn"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.finishingIn, tfi, tempTso, 'FI')"
                :rules="finishingInRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.finishingOut"
                :error-messages="errors.collect('finishingOut')"
                label="Finishing Out"
                name="finishingOut"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.finishingOut, tfo, tempTfi, 'FO')"
                :rules="finishingOutRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.packedIn"
                :error-messages="errors.collect('packedIn')"
                label="Packed in"
                name="packedIn"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.packedIn, tpi, tempTfo, 'PI')"
                :rules="packingInRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.packedOut"
                :error-messages="errors.collect('packedOut')"
                :label="$t('Packed Out')"
                name="packedOut"
                outlined
                dense
                type="number"
                min="1"
                @input="checktotalValue(item.packedOut, tpo, tempTpi, 'PO')"
                :rules="packingoutRules"
              />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-text-field
                v-validate="'required'"
                v-model="item.line"
                :error-messages="errors.collect('line')"
                :label="$t('Line Number')"
                name="line"
                outlined
                dense
                type="number"
                min="1"
                :rules="lineRule"
              />
            </v-flex>

            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-combobox
                v-model="size"
                :items="sizes"
                v-validate="'required'"
                :label="$t('size')"
                dense
                outlined
                color="primary"
                :rules="lineRule"
              />
              <!-- <v-text-field name="size" outlined dense :rules="lineRule" /> -->
            </v-flex>

            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-combobox
                v-model="color"
                :items="colors"
                v-validate="'required'"
                :label="$t('color')"
                dense
                outlined
                color="primary"
                :rules="lineRule"
              />
              <!-- <v-text-field
                v-validate="'required'"
                v-model="color"
                :label="$t('color')"
                name="color"
                outlined
                dense
                :rules="lineRule"
              /> -->
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md5 lg5 pa-3>
              <v-btn
                rounded
                outlined
                color="primary"
                block
                class="text-capitalize"
                @click="save"
                >Save Info</v-btn
              >
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      orderId: "",
      item: {},
      order: {},
      orderStatus: {},
      color: "",
      colors: [],
      size: "",
      sizes: [],
      tco: 0,
      tsi: 0,
      tso: 0,
      tfi: 0,
      tfo: 0,
      tpi: 0,
      tpo: 0,
      tempTco: 0,
      tempTsi: 0,
      tempTso: 0,
      tempTfi: 0,
      tempTfo: 0,
      tempTpi: 0,
      tempTpo: 0,
      plannedCutQuantity: "",
      orders: {},
      cutOutRules: [
        v =>
          v <= this.maxCutOut ||
          `Cut out must be less than or equal to ${this.maxCutOut} `,
        v =>
          v >= this.minCutOut ||
          `Cut out must be greater than ${this.minCutOut} `
      ],
      sewInRules: [
        v => v <= this.maxSewIn || `Sew in must be less than ${this.maxSewIn} `,
        v =>
          v >= this.minSewIn || `Sew in must be greater than ${this.minSewIn} `
      ],
      sewOutRules: [
        v =>
          v <= this.maxSewOut || `Sew out must be less than ${this.maxSewOut} `,
        v =>
          v >= this.minSewOut ||
          `Sew out must be greater than ${this.minSewOut} `
      ],
      finishingInRules: [
        v =>
          v <= this.maxFinishingIn ||
          `Finishing in must be less than ${this.maxFinishingIn} `,
        v =>
          v >= this.minFinishingIn ||
          `Finishing in must be greater than ${this.minFinishingIn} `
      ],
      finishingOutRules: [
        v =>
          v <= this.maxFinishingOut ||
          `Finishing out must be less than ${this.maxFinishingOut} `,
        v =>
          v >= this.minFinishingOut ||
          `Finishing out must be greater than ${this.minFinishingOut} `
      ],
      packingInRules: [
        v =>
          v <= this.maxPackingIn ||
          `Packing in must be less than ${this.maxPackingIn} `,
        v =>
          v >= this.minPackingIn ||
          `Packing in must be greater than ${this.minPackingIn} `
      ],
      packingoutRules: [
        v =>
          v <= this.maxPackingOut ||
          `Packing out must be less than ${this.maxPackingOut} `,
        v =>
          v >= this.minPackingOut ||
          `Packing out must be greater than ${this.minPackingOut}`
      ],
      lineRule: [v => !!v || "This field is required"]
    };
  },
  async created() {
    const { orderId } = this.$route.params;
    this.orderId = orderId;
    this.orders = await api.get(orderId, path.order);
    this.sizes = this.orders.data.map(s => s.size);
    this.colors = this.orders.data[0].colors.map(a => a.color);
    this.loadData();
  },
  methods: {
    async loadData() {
      let filter = { where: { orderId: this.orderId } };
      this.orderStatus = (await api.all(path.orderStatus, filter)).rows;
      if (this.orderStatus.length > 0) {
        this.hasRegisterdData();
      } else {
        this.order = await api.get(this.orderId, path.order);
        this.item.cutIn = this.order.quantity;
      }
    },
    checktotalValue(current, total, prevVal, type) {
      let totalV = parseInt(prevVal) - parseInt(total);
      if (type == "CO") {
        this.maxCutOut = totalV;
        this.minCutOut = 0;
        this.tempTco = parseInt(this.tco) + parseInt(current);
      }
      if (type == "SI") {
        this.maxSewIn = totalV;
        this.minSewIn = 0;
        this.tempTsi = parseInt(this.tsi) + parseInt(current);
      }
      if (type == "SO") {
        this.maxSewOut = totalV;
        this.minSewOut = 0;
        this.tempTso = parseInt(this.tso) + parseInt(current);
      }
      if (type == "FI") {
        this.maxFinishingIn = totalV;
        this.minFinishingIn = 0;
        this.tempTfi = parseInt(this.tfi) + parseInt(current);
      }
      if (type == "FO") {
        this.maxFinishingOut = totalV;
        this.minFinishingOut = 0;
        this.tempTfo = parseInt(this.tfo) + parseInt(current);
      }
      if (type == "PI") {
        // alert(totalV + "   " + total);
        this.maxPackingIn = totalV;
        this.minPackingIn = 0;
        this.tempTpi = parseInt(this.tpi) + parseInt(current);
      }
      if (type == "PO") {
        this.maxPackingOut = totalV;
        this.minPackingOut = 0;
        this.tempTpo = parseInt(this.tpo) + parseInt(current);
      }
    },
    hasRegisterdData() {
      this.item.cutIn = this.orderStatus[
        this.orderStatus.length - 1
      ].totalCutIn;
      this.tco = this.orderStatus[this.orderStatus.length - 1].totalCutOut;
      this.tempTco = this.orderStatus[this.orderStatus.length - 1].totalCutOut;

      this.tsi = this.orderStatus[this.orderStatus.length - 1].totalSewIn;
      this.tempTsi = this.orderStatus[this.orderStatus.length - 1].totalSewIn;

      this.tso = this.orderStatus[this.orderStatus.length - 1].totalSewOut;
      this.tempTso = this.orderStatus[this.orderStatus.length - 1].totalSewOt;

      this.tfi = this.orderStatus[this.orderStatus.length - 1].totalFinishingIn;
      this.tempTfi = this.orderStatus[
        this.orderStatus.length - 1
      ].totalFinishingIn;

      this.tfo = this.orderStatus[
        this.orderStatus.length - 1
      ].totalFinishingOut;
      this.tempTfo = this.orderStatus[
        this.orderStatus.length - 1
      ].totalFinishingOut;

      this.tpi = this.orderStatus[this.orderStatus.length - 1].totalPackedIn;
      this.tempTpi = this.orderStatus[
        this.orderStatus.length - 1
      ].totalPackedIn;

      this.tpo = this.orderStatus[this.orderStatus.length - 1].totalPackedOut;
      this.tempTpo = this.orderStatus[
        this.orderStatus.length - 1
      ].totalPackedOut;
    },
    save() {
      this.item.orderId = this.orderId;
      let d = new Date(this.item.date);
      this.item.date = d;
      this.item.day = d.getDate();
      this.item.month = d.getMonth() + 1;
      this.item.year = d.getFullYear();
      this.item.totalCutIn = this.item.cutIn;
      this.item.totalCutOut = this.tempTco;
      this.item.totalSewIn = this.tempTsi;
      this.item.totalSewOut = this.tempTso;
      this.item.totalFinishingIn = this.tempTfi;
      this.item.totalFinishingOut = this.tempTfo;
      this.item.totalPackedIn = this.tempTpi;
      this.item.totalPackedOut = this.tempTpo;
      this.item.color = this.color;
      this.item.size = this.size;
      if (this.$refs.form.validate()) {
        let scannedOrderStatus = [
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.cutOut,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "co"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.sewIn,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "si"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.sewOut,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "so"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.finishingIn,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "fi"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.finishingOut,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "fo"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.packedIn,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "pi"
          },
          {
            color: this.color,
            label: this.size,
            bundleNo: "100",
            from: "1",
            to: this.item.packedOut,
            orderId: this.orderId + "scan",
            orderNumber: "",
            type: "po"
          }
        ];
        api
          .create(this.item, path.orderStatus)
          .then(() => {
            api.create(scannedOrderStatus, path.scannedOrders).then(() => {
              this.$router.push({
                name: "status-list",
                params: this.orderId
              });
              this.$notify({
                type: "success",
                title: "Order Status",
                message: `Order Status information successfully saved.`
              });
            });
          })
          .catch(() => {
            this.$notify({
              type: "error",
              title: "Failure",
              message: `Failed to submit the information. Try later on.`
            });
          });
      }
    }
  }
};
</script>
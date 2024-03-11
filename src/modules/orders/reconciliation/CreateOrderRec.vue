<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'order-rec' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  :label="$t('orderNumber')"
                  outlined
                  dense
                  :items="orders"
                  item-text="orderNumber"
                  @change="computeData"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.totalCutQty"
                  :error-messages="errors.collect('totalCutQty')"
                  :label="$t('total-cut-quantity')"
                  name="totalCutQty"
                  outlined
                  dense
                  type="number"
                  min="1"
                  disabled
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.plannedFabricConsumed"
                  :error-messages="errors.collect('plannedFabricConsumed')"
                  :label="$t('planned-consumption-per-piece')"
                  name="plannedFabricConsumed"
                  outlined
                  dense
                  type="number"
                  min="1"
                  @input="plannedFabric"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.fabricConsumption"
                  :error-messages="errors.collect('fabricConsumption')"
                  :label="$t('actual-consumption-per-piece')"
                  name="fabricConsumption"
                  outlined
                  dense
                  type="number"
                  min="1"
                  @input="actualFabric"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.totalPlennedFabric"
                  :error-messages="errors.collect('totalPlennedFabric')"
                  :label="$t('total-planned-fabric')"
                  name="totalPlnnedFabric"
                  outlined
                  dense
                  type="number"
                  min="1"
                  disabled
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-model="item.actualFabricConsumed"
                  :label="$t('actual-fabric-consumed')"
                  outlined
                  disabled
                  dense
                  type="number"
                  min="1"
                  @input="extraFabric"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-model="item.extra"
                  :label="$t('extra-fabric-consumed')"
                  outlined
                  dense
                  type="number"
                  min="1"
                  disabled
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-model="item.actualShipment"
                  :label="$t('actual-shipment')"
                  outlined
                  dense
                  type="number"
                  min="1"
                  @input="rejectedPiece"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.rejectedPiece"
                  :error-messages="errors.collect('rejectedPiece')"
                  :label="$t('rejected-piece')"
                  name="rejectedPiece"
                  outlined
                  dense
                  disabled
                  type="number"
                  min="1"
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-center pb-3>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-btn
                  rounded
                  outlined
                  color="primary"
                  block
                  class="text-capitalize"
                  @click="save"
                  >{{ $t("save") }}</v-btn
                >
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      item: {}
      // orders: []
    };
  },
  computed: {
    ...mapState("Styles", ["orders"])
  },
  async created() {
    this.ordersList();
  },
  methods: {
    ...mapActions("Styles", ["ordersList"]),
    computeData(val) {
      let totalCutQty =
        (parseFloat(val.quantity) * parseFloat(val.extra)) / 100 +
        parseFloat(val.quantity);

      this.item = {
        totalCutQty: totalCutQty,
        orderId: val.id
      };
    },
    // //planned fabric
    plannedFabric(val) {
      this.item.totalPlennedFabric =
        parseFloat(this.item.totalCutQty) > 0
          ? parseFloat(this.item.totalCutQty) * parseFloat(val)
          : 0;
      this.extraFabric();
    },
    // //planned fabric
    actualFabric(val) {
      this.item.actualFabricConsumed =
        parseFloat(this.item.totalCutQty) > 0
          ? parseFloat(this.item.totalCutQty) * parseFloat(val)
          : 0;
      this.extraFabric();
    },
    // //extra fabric consumed
    extraFabric() {
      this.item.extra =
        parseFloat(this.item.totalPlennedFabric) -
        parseFloat(this.item.actualFabricConsumed);
    },
    rejectedPiece(val) {
      this.item.rejectedPiece =
        parseFloat(this.item.totalCutQty) - parseFloat(val);
    },
    save() {
      api
        .create(this.item, path.reconciliation)
        .then(() => {
          this.$router.push({ name: "order-rec" });
          this.$notify({
            type: "success",
            title: "Order Reconciliation",
            message: `Order reconciliation information successfully saved.`
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
};
</script>
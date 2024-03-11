<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'laysheet-list' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <table>
            <tr>
              <td>
                <v-text-field
                  disabled
                  flat
                  dense
                  hide-details
                  :label="$t('cutNumber')"
                  v-model="item.cutNumber"
                />
              </td>
              <td>
                <v-text-field
                  disabled
                  dense
                  hide-details
                  flat
                  :label="$t('orderNumber')"
                  v-model="orderNo"
                />
              </td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  disabled
                  flat
                  :label="$t('orderQuantity')"
                  v-model="item.order.quantity"
                />
              </td>
              <td>
                <v-text-field
                  disabled
                  flat
                  dense
                  hide-details
                  :label="$t('extra')"
                  v-model="item.order.extra"
                />
              </td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  disabled
                  flat
                  :label="$t('noOfBundles')"
                  v-model="item.noOfBundle"
                />
              </td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  disabled
                  flat
                  :label="$t('bundleQuantity')"
                  v-model="item.bQty"
                />
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field
                  disabled
                  flat
                  dense
                  hide-details
                  :label="$t('styleName')"
                  v-model="item.order.styleName"
                />
              </td>
              <td>
                <v-text-field
                  disabled
                  flat
                  dense
                  hide-details
                  :label="$t('styleNumber')"
                  v-model="item.order.styleNumber"
                />
              </td>
              <td>
                <v-text-field
                  dense
                  disabled
                  flat
                  hide-details
                  :label="$t('customer')"
                  v-model="item.customerName"
                />
              </td>
              <td>
                <v-text-field
                  disabled
                  flat
                  dense
                  hide-details
                  :label="$t('po_number')"
                  v-model="item.order.poNo"
                />
              </td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  disabled
                  flat
                  :label="$t('design')"
                  v-model="item.order.design"
                />
              </td>
              <td>
                <v-combobox
                  flat
                  disabled
                  :items="colorOptions"
                  multiple
                  dense
                  hide-details
                  :label="$t('color')"
                  v-model="colors"
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
                    disabled
                    hide-details
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
                    disabled
                    hide-details
                    dense
                    flat
                    :value="ratio"
                  />
                </th>
              </tr>
              <tr v-for="(color, i) in colors" :key="i">
                <th>
                  <v-text-field
                    disabled
                    hide-details
                    dense
                    flat
                    :value="color"
                  />
                </th>
                <td>
                  <v-text-field
                    hide-details
                    dense
                    disabled
                    flat
                    v-model="plyValues[i]"
                  />
                </td>
                <td v-for="(val, j) in ratios" :key="j">
                  <v-text-field
                    hide-details
                    dense
                    disabled
                    flat
                    v-model="colorValues[j + i * ratios.length]"
                  />
                </td>
              </tr>
            </table>
          </div>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md9 lg9 pa-2>
              <v-combobox
                disabled
                v-model="chips"
                clearable
                :label="$t('parts-name')"
                multiple
                dense
                outlined
              />
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-2>
              <v-btn
                block
                color="primary"
                class="text-capitalize"
                @click="generateBundles"
                >{{ $t("view-bundle-teckets") }}</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { path } from "@/api";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      saveStatus: true,
      dialog: false,
      path: path.laysheet,
      orderNo: "",
      sizes: [],
      ratios: [],
      quantities: [],
      test: [],
      plyValues: [],
      colorValues: [],
      color: [],
      colors: [],
      disableColor: true,
      item: {},
      tkt: {},
      colorOptions: [],
      chips: [],
      laysheetId: ""
    };
  },
  computed: {
    ...mapState("laysheet", ["items"]),
    ...mapGetters("laysheet", {
      allTkts: "allItem",
      parts: "parts"
    }),
    ...mapState("inventory", ["itemById"])
  },
  async created() {
    let filter = {
      include: ["order"]
    };
    const { laysheetId } = this.$route.params;
    await this.getDataByIdWithF([laysheetId, path.laysheet, filter]).then(
      () => {
        this.item = this.itemById;
        this.laysheetId = laysheetId;
        this.item.cutNumber = this.item.cutNo;
        this.item.customerName = this.item.customerName;
        this.colors = this.item.colors.map(x => x.color);
        this.plyValues = this.item.colors.map(x => x.ply);
        this.orderNo = this.item.order.orderNumber;
        this.sizes = this.item.colors[0].sizes.map(x => x.label);
        this.ratios = this.item.colors[0].sizes.map(x => x.ratio);
        this.chips = this.item.parts;
        this.index = 0;
        this.colorValues = this.item.colors[0].sizes.map(x => x.label);

        for (let i = 0; i < this.item.colors.length; i++) {
          for (let j = 0; j < this.item.colors[i].sizes.length; j++) {
            this.colorValues[j + i * this.sizes.length] = this.item.colors[
              i
            ].sizes[j].qty;
          }
        }
      }
    );
  },
  methods: {
    ...mapActions("laysheet", ["getBundleData"]),
    ...mapActions("inventory", ["getDataByIdWithF"]),
    async generateBundles() {
      const laysheet = {
        cutNo: this.item.cutNumber,
        noOfBundle: this.item.noOfBundle,
        bQty: this.item.bQty,
        styleName: this.item.order.styleName,
        styleNo: this.item.order.styleNumber,
        design: this.item.order.design
      };
      // this.$router.push({ name: "bcsheet" });
      await this.getBundleData([
        this.laysheetId,
        this.chips,
        laysheet,
        this.colors,
        this.item.orderId,
        this.item.order.styleName
      ]).then(() => {
        if (this.allTkts.length > 0 && this.parts.length > 0) {
          this.$router.push({ name: "bcsheet" });
        } else {
          this.$notify({
            type: "danger",
            title: "Laysheet",
            message: `This bundle lay sheet does not contain all information.`
          });
        }
      });
    },
    manageState(items, chips, laysheet, color, orderId, styleName) {
      this.$store.commit("setLaysheet", items);
      this.$store.commit("manageParts", chips);
      this.$store.commit("manageLaysheet", laysheet);
      this.$store.commit("manageColor", color);
      this.$store.commit("manageOrderId", orderId);
      this.$store.commit("manageStyleName", styleName);
      this.$router.push({ name: "bcsheet" });
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
</style>
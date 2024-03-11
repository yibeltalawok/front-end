<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-layout row wrap justify-center>
        <v-flex 3 xs12 sm12 md4 lg4 pa-2>
          <v-text-field
            v-model="item.heading.shippingMark"
            dense
            :label="$t('shippingMark')"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-text-field
            v-model="item.heading.codeArticle"
            dense
            :label="$t('codeArticle')"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-text-field
            v-model="item.heading.talle"
            dense
            :label="$t('talle')"
            disabled
          />
        </v-flex>
        <!-- <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field v-model="item.heading.quantity" dense :label="$t('quantity')" disabled />
        </v-flex> -->
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field
            v-model="item.heading.styleNumber"
            dense
            :label="$t('styleNumber')"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field
            v-model="item.heading.orderNumber"
            dense
            :label="$t('orderNumber')"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field
            v-model="item.heading.orderQuantity"
            dense
            :label="$t('orderQuantity')"
            disabled
          />
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-xs fluid>
      <v-layout row wrap justify-center>
        <v-flex xs7>
          <table>
            <tr>
              <th rowspan="2">{{ $t("color") }}</th>
              <th :colspan="parseInt(item.data.length)">{{ $t("size") }}</th>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td
                v-for="(size, i) in parseInt(item.data[0].values.length)"
                :key="i"
              >
                <v-text-field
                  solo
                  flat
                  dense
                  disabled
                  hide-details
                  v-model="item.data[0].values[i].size"
                  :label="$t('size') + '-' + (i + 1)"
                />
              </td>
              <th>{{ $t("PCS/CTN") }}</th>
            </tr>
            <tr v-for="(color, i) in parseInt(item.data.length)" :key="i">
              <td>
                <v-text-field
                  solo
                  flat
                  dense
                  disabled
                  hide-details
                  v-model="item.data[i].color"
                  :label="$t('color') + '-' + (i + 1)"
                />
              </td>
              <td
                v-for="(ts, j) in parseInt(item.data[0].values.length)"
                :key="j"
              >
                <v-text-field
                  solo
                  flat
                  type="number"
                  min="0"
                  dense
                  disabled
                  hide-details
                  v-model="item.data[i].values[j].value"
                />
              </td>
              <td>
                <v-text-field
                  solo
                  flat
                  dense
                  disabled
                  hide-details
                  type="number"
                  min="0"
                  v-model="item.data[i].ctnPcs"
                />
              </td>
            </tr>
            <tr>
              <td>{{ $t("total") }}</td>
              <td v-for="(ts, i) in parseInt(item.totalValues.length)" :key="i">
                <v-text-field
                  solo
                  flat
                  type="number"
                  min="0"
                  dense
                  disabled
                  hide-details
                  v-model="item.totalValues[i].total"
                />
              </td>
              <td>
                <v-text-field
                  solo
                  flat
                  type="number"
                  min="0"
                  dense
                  disabled
                  hide-details
                  v-model="item.ctnPcsTotal"
                />
              </td>
            </tr>
          </table>
        </v-flex>
        <v-flex xs3>
          <table>
            <tr>
              <th>{{ $t("CTN-NO") }}</th>
              <th>{{ $t("TTL-CTN") }}</th>
            </tr>
            <tr>
              <td>
                <v-text-field disabled solo flat v-model="item.data[0].ctnNo" />
              </td>
              <td>
                <v-text-field
                  disabled
                  solo
                  flat
                  v-model="item.data[0].ttlOtn"
                />
              </td>
            </tr>
          </table>
        </v-flex>
        <v-flex xs2>
          <table>
            <tr>
              <td>
                <span style="visibility:hidden">{{ $t("total") }}</span>
              </td>
            </tr>
            <tr>
              <th>
                <v-text-field
                  solo
                  flat
                  disabled
                  dense
                  hide-details
                  :label="$t('TTL-PCS')"
                />
              </th>
            </tr>
            <tr v-for="(color, i) in parseInt(item.data.length)" :key="i">
              <td>
                <v-text-field
                  solo
                  flat
                  dense
                  disabled
                  hide-details
                  type="number"
                  min="0"
                  v-model="item.data[i].totalPcs"
                />
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field
                  solo
                  flat
                  type="number"
                  min="0"
                  dense
                  disabled
                  hide-details
                  v-model="item.total.totalPcs"
                />
              </td>
            </tr>
          </table>
        </v-flex>
        <v-flex xs12></v-flex>
      </v-layout>

      <v-layout row wrap justify-center>
        <!-- <v-flex xs12 pt-2>
          <h3 class="text-center info--text">{{ $t("summary") }}</h3>
        </v-flex> -->
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            label="Total"
            dense
            disabled
            hide-details
            type="number"
            min="0"
            v-model="item.summary.total"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            :label="$t('totalCTNs')"
            dense
            disabled
            hide-details
            v-model="item.summary.totalCTNs"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            :label="$t('grossWeight')"
            dense
            disabled
            hide-details
            v-model="item.summary.grossWeight"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            :label="$t('netWeight')"
            dense
            disabled
            hide-details
            v-model="item.summary.netWeight"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            :label="$t('ctnMEAS')"
            dense
            disabled
            hide-details
            v-model="item.summary.ctnMEAS"
          />
        </v-flex>
        <v-flex xs12></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { path } from "@/api";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      item: {}
    };
  },
  computed: {
    ...mapState("inventory", ["itemById"])
  },
  async created() {
    const { packingId } = this.$route.params;
    await this.getDataById([packingId, path.packingList]).then(() => {
      this.item = this.itemById;
    });
    // this.item = await api.get(packingId, path.packingList);
  },
  methods: {
    ...mapActions("inventory", ["getDataById"])
  }
};
</script>


<style lang="css" scoped>
table {
  border-collapse: collapse;
  width: 100%;
  height: 100%;
}

td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 10px 1px 0px 1px;
}
</style>
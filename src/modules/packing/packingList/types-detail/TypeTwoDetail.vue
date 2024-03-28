<template>
  <div>
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
      <table>
        <tr>
          <th rowspan="2">{{ $t("size") }}</th>
          <th :colspan="parseInt(item.data[0].values.length)">
            {{ $t("color") }}
          </th>
          <td colspan="4"></td>
        </tr>

        <tr>
          <td
            v-for="(color, i) in parseInt(item.data[0].values.length)"
            :key="i"
          >
            <v-text-field
              solo
              flat
              dense
              hide-details
              v-model="item.data[0].values[i].color"
              :label="'color-' + (i + 1)"
              disabled
            />
          </td>
          <th>{{ $t("PCS/CTN") }}</th>
          <th>{{ $t("CTN-NO") }}</th>
          <th>{{ $t("TTL-CTN") }}</th>
          <th>{{ $t("TTL-PCS") }}</th>
        </tr>
        <tr v-for="(size, i) in parseInt(item.data.length)" :key="i">
          <td>
            <v-text-field
              solo
              flat
              dense
              hide-details
              v-model="item.data[i].size"
              :label="$t('size') + '-' + (i + 1)"
              disabled
            />
          </td>
          <td v-for="(ts, j) in parseInt(item.data[0].values.length)" :key="j">
            <v-text-field
              dense
              hide-details
              v-model="item.data[i].values[j].value"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.data[i].ctnPcs"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.data[i].ctnNo"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.data[i].ttlOtn"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.data[i].totalPcs"
              disabled
            />
          </td>
        </tr>
        <tr>
          <th>{{ $t("total") }}</th>
          <td v-for="(color, i) in parseInt(item.totalValues.length)" :key="i">
            <v-text-field
              dense
              hide-details
              v-model="item.totalValues[i].total"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.total.ctnPcs"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.total.ctnNo"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.total.ttlOtn"
              disabled
            />
          </td>
          <td>
            <v-text-field
              dense
              hide-details
              v-model="item.total.totalPcs"
              disabled
            />
          </td>
        </tr>
      </table>

      <v-layout row wrap justify-center>
        <!-- <v-flex xs12 pt-2>
          <h3 class="text-center info--text">{{ $t("summary") }}</h3>
        </v-flex> -->
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            label="Total"
            dense
            hide-details
            v-model="item.summary.total"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            :label="$t('totalCTNs')"
            dense
            hide-details
            v-model="item.summary.totalCTNs"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            :label="$t('grossWeight')"
            dense
            hide-details
            v-model="item.summary.grossWeight"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            :label="$t('netWeight')"
            dense
            hide-details
            v-model="item.summary.netWeight"
            disabled
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            :label="$t('ctnMEAS')"
            dense
            hide-details
            v-model="item.summary.ctnMEAS"
            disabled
          />
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>
<script>
import { path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      item: {},
      sizes: [],
      colors: [],
      ctnPcs: [],
      ctnNo: [],
      ttlOtn: [],
      totalPcs: []
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
}

td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 10px 1px 0px 1px;
}
</style>
<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'packing' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>Packing List
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-layout row wrap justify-center>
          <v-flex 3 xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.heading.shippingMark"
              dense
              label="SHIPPING MARK"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.heading.codeArticle"
              dense
              label="CODE ARTICLE/ITEM"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="item.heading.talle"
              dense
              label="TALLE/SIZE"
              disabled
            />
          </v-flex>
          <!-- <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field v-model="item.heading.quantity" dense label="QUANTITY" disabled />
          </v-flex> -->
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              v-model="item.heading.styleNumber"
              dense
              label="STYLE NUMBER"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              v-model="item.heading.orderNumber"
              dense
              label="ORDER NUMBER"
              disabled
            />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-text-field
              v-model="item.heading.orderQuantity"
              dense
              label="ORDER QUANTITY"
              disabled
            />
          </v-flex>
          <table>
            <tr>
              <th rowspan="2">Color</th>
              <th :colspan="parseInt(item.data[0].values.length)">Size</th>
              <td colspan="4"></td>
            </tr>

            <tr>
              <td
                v-for="(size, i) in parseInt(item.data[0].values.length)"
                :key="i"
              >
                <v-text-field
                  dense
                  hide-details
                  v-model="sizes[i]"
                  :label="'size-' + (i + 1)"
                  disabled
                />
              </td>
              <th>CTN/PCS</th>
              <th>CTN NO</th>
              <th>TTL OTN</th>
              <th>TOTAL PCS</th>
            </tr>
            <tr v-for="(color, i) in parseInt(item.data.length)" :key="i">
              <td>
                <v-text-field
                  dense
                  hide-details
                  v-model="colors[i]"
                  :label="'color-' + (i + 1)"
                  disabled
                />
              </td>
              <td
                v-for="(ts, j) in parseInt(item.data[0].values.length)"
                :key="j"
              >
                <v-text-field
                  dense
                  hide-details
                  v-model="sizeValues[j + i * item.data[0].values.length]"
                  disabled
                />
              </td>
              <td>
                <v-text-field dense hide-details v-model="ctnPcs[i]" disabled />
              </td>
              <td>
                <v-text-field dense hide-details v-model="ctnNo[i]" disabled />
              </td>
              <td>
                <v-text-field dense hide-details v-model="ttlOtn[i]" disabled />
              </td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  v-model="totalPcs[i]"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <th>Total</th>
              <td
                v-for="(color, i) in parseInt(item.totalValues.length)"
                :key="i"
              >
                <v-text-field
                  dense
                  hide-details
                  v-model="totalOfSizes[i]"
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
            <v-flex xs12 pt-2>
              <h3 class="text-center info--text">Summary</h3>
            </v-flex>
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
                label="Total CTNs"
                dense
                hide-details
                v-model="item.summary.totalCTNs"
                disabled
              />
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-2>
              <v-text-field
                label="Gross Weight"
                dense
                hide-details
                v-model="item.summary.grossWeight"
                disabled
              />
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-2>
              <v-text-field
                label="Net Weight"
                dense
                hide-details
                v-model="item.summary.netWeight"
                disabled
              />
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-2>
              <v-text-field
                label="CTN MEAS"
                dense
                hide-details
                v-model="item.summary.ctnMEAS"
                disabled
              />
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      item: {},
      totalOfSizes: [],
      sizes: [],
      totalColor: 0,
      sizeValues: [],
      colors: [],
      ctnPcs: [],
      ctnNo: [],
      ttlOtn: [],
      totalPcs: []
    };
  },
  async created() {
    const { packingId } = this.$route.params;
    this.item = await api.get(packingId, path.packingList);
    this.manageTable();
  },
  methods: {
    manageTable() {
      for (let i = 0; i < this.item.data.length; i++) {
        this.colors.push(this.item.data[i].color);
        this.ctnPcs.push(this.item.data[i].ctnPcs);
        this.ctnNo.push(this.item.data[i].ctnNo);
        this.ttlOtn.push(this.item.data[i].ttlOtn);
        this.totalPcs.push(this.item.data[i].totalPcs);
        for (let j = 0; j < this.item.data[i].values.length; j++) {
          this.sizes[j] = this.item.data[i].values[j].size;
          this.sizeValues.push(this.item.data[i].values[j].value);
          if (this.totalOfSizes[j] == null) {
            this.item.data[i].values[j].value;
          } else {
            this.totalOfSizes[j] =
              parseFloat(this.totalOfSizes[j]) +
              parseFloat(this.item.data[i].values[j].value);
          }
        }
      }
      for (let i = 0; i < this.item.totalValues.length; i++) {
        this.totalOfSizes[i] = this.item.totalValues[i].total;
      }
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
  padding: 10px 1px 0px 1px;
}
</style>
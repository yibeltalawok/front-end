<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
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
              <th>Color</th>
              <th>Size</th>
              <th>Value</th>
              <th>CTN/PCS</th>
              <th>CTN NO</th>
              <th>TTL CTN</th>
              <th>TOTAL PCS</th>
            </tr>

            <tr v-for="(color, i) in parseInt(colors.length)" :key="i">
              <td>
                <v-text-field
                  solo
                  flat
                  dense
                  hide-details
                  v-model="colors[i]"
                  :placeholder="'color-' + (i + 1)"
                  disabled
                />
              </td>
              <td>
                <tr v-for="(size, j) in parseInt(sizes.length)" :key="j">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      :placeholder="'size-' + (i + 1)"
                      v-model="sizes[j]"
                      disabled
                    />
                  </td>
                </tr>
              </td>

              <td>
                <tr v-for="(size, j) in parseInt(sizes.length)" :key="j">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      v-model="sizesValue[j + i * parseInt(sizes.length)]"
                      disabled
                    />
                  </td>
                </tr>
              </td>

              <td>
                <tr v-for="(ctnPc, a) in sizes.length" :key="a">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      v-model="ctnPcs[a + i * sizes.length]"
                      disabled
                    />
                  </td>
                </tr>
              </td>

              <td>
                <tr v-for="(ctnno, b) in sizes.length" :key="b">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      v-model="ctnNo[b + i * sizes.length]"
                      disabled
                    />
                  </td>
                </tr>
              </td>

              <td>
                <tr v-for="(ttlOTN, c) in sizes.length" :key="c">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      v-model="ttlOtn[c + i * sizes.length]"
                      disabled
                    />
                  </td>
                </tr>
              </td>

              <td>
                <tr v-for="(totalPc, d) in parseInt(sizes.length)" :key="d">
                  <td style="border:0px solid red;padding:0">
                    <v-text-field
                      dense
                      hide-details
                      v-model="totalPcs[d + i * sizes.length]"
                      disabled
                    />
                  </td>
                </tr>
              </td>
            </tr>
            <tr>
              <th colspan="2">Total</th>
              <td>
                <v-text-field
                  dense
                  hide-details
                  v-model="totalOfSizes"
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
      sizesValue: [],
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
        this.ctnPcs.push(this.item.data[i].ctnPcs);
        this.ctnNo.push(this.item.data[i].ctnNo);
        this.ttlOtn.push(this.item.data[i].ttlOtn);
        this.totalPcs.push(this.item.data[i].totalPcs);
        const index = this.colors.indexOf(this.item.data[i].color);
        this.sizesValue.push(this.item.data[i].value);
        if (index == -1) {
          this.colors.push(this.item.data[i].color);
        }
        const sizeIndex = this.sizes.indexOf(this.item.data[i].size);

        if (sizeIndex == -1) {
          this.sizes.push(this.item.data[i].size);
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
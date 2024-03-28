<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-layout row wrap justify-center>
        <v-flex 3 xs12 sm12 md4 lg4 pa-2>
          <v-text-field v-model="item.shippingMark" dense label="SHIPPING MARK" />
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-text-field v-model="item.codeArticle" dense label="CODE ARTICLE/ITEM" />
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-text-field v-model="item.talle" dense label="TALLE/SIZE" />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field v-model="item.quantity" type="number" dense label="QUANTITY" />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field v-model="item.styleNumber" dense label="STYLE NUMBER" />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field v-model="item.orderNumber" dense label="ORDER NUMBER" />
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2>
          <v-text-field
            v-model="item.orderQuantity"
            type="number"
            min="0"
            dense
            label="ORDER QUANTITY"
          />
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-container>
    {{vals.totalValues}}
    <v-container grid-list-xs fluid>
      <v-toolbar dense flat>
        <v-spacer></v-spacer>
        <v-card flat class="mx-2">
          <v-text-field
            type="number"
            min="1"
            dense
            hide-details
            label="How many sizes"
            v-model="totalSizes"
          />
        </v-card>
        <v-card flat class="mx-2">
          <v-text-field
            type="number"
            min="1"
            dense
            hide-details
            label="How many colors"
            v-model="totalColors"
          />
        </v-card>
      </v-toolbar>
      <v-layout row wrap justify-center>
        <v-flex xs8>
          <table>
            <tr>
              <th>sdfg</th>
            </tr>
          </table>
        </v-flex>
        <v-flex xs3>
          <table>
            <tr>
              <th>TTL PCS</th>
              <th>TTL PCS</th>
            </tr>
          </table>
        </v-flex>
        <v-flex xs1>
          <table>
            <tr>
              <th>TTL PCS</th>
            </tr>
          </table>
        </v-flex>
      </v-layout>

      <table>
        <tr>
          <th rowspan="2">Color</th>
          <th :colspan="parseInt(totalSizes)">Size</th>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td v-for="(size,i) in parseInt(totalSizes)" :key="i">
            <v-text-field dense hide-details v-model="sizes[i]" :label="'size-'+(i+1)" />
          </td>
          <th>CTN/PCS</th>
          <th>CTN NO</th>
          <th>TTL CTN</th>
          <th>TOTAL PCS</th>
        </tr>
        <tr v-for="(color,i) in parseInt(totalColors)" :key="i">
          <td>
            <v-text-field dense hide-details v-model="colors[i]" :label="'color-'+(i+1)" />
          </td>
          <td v-for="(ts,j) in parseInt(totalSizes)" :key="j">
            <v-text-field
              type="number"
              min="0"
              dense
              hide-details
              v-model="sizeValues[j+i*totalSizes]"
            />
          </td>
          <td>
            <v-text-field dense hide-details type="number" min="0" v-model="ctnPcs[i]" />
          </td>
          <td>
            <v-text-field dense hide-details type="number" min="0" v-model="ctnNo[i]" />
          </td>
          <td>
            <v-text-field dense hide-details type="number" min="0" v-model="ttlOtn[i]" />
          </td>
          <td>
            <v-text-field dense hide-details type="number" min="0" v-model="totalPcs[i]" />
          </td>
        </tr>
        <tr>
          <th>Total</th>
          <td v-for="(ts,i) in parseInt(totalSizes)" :key="i">
            <v-text-field type="number" min="0" dense hide-details v-model="totalOfSizes[i]" />
          </td>
          <td>
            <v-text-field type="number" min="0" dense hide-details v-model="item.ctnPcsTotal" />
          </td>
          <td>
            <v-text-field type="number" min="0" dense hide-details v-model="item.ctnNoTotal" />
          </td>
          <td>
            <v-text-field type="number" min="0" dense hide-details v-model="item.ttlOtnTotal" />
          </td>
          <td>
            <v-text-field type="number" min="0" dense hide-details v-model="item.totalPcsTotal" />
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
            type="number"
            min="0"
            v-model="summary.total"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            label="Total CTNs"
            dense
            hide-details
            v-model="summary.totalCTNs"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            label="Gross Weight"
            dense
            hide-details
            v-model="summary.grossWeight"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field
            type="number"
            min="0"
            label="Net Weight"
            dense
            hide-details
            v-model="summary.netWeight"
          />
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-text-field label="CTN MEAS" dense hide-details v-model="summary.ctnMEAS" />
        </v-flex>
        <v-flex xs12></v-flex>

        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-btn color="primary" class="text-capitalize" @click="save">
            <v-icon class="mr-2">save</v-icon>Save
          </v-btn>
        </v-flex>
        <v-flex xs12 sm12 md1 lg1 pa-2>
          <v-btn class="text-capitalize" @click="save">Clear</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// import { api, path } from "@/api";
export default {
  data() {
    return {
      vals: {},
      sizeValues: [],
      totalColors: 3,
      totalSizes: 4,
      item: {},
      summary: {},
      sizes: [],
      totalOfSizes: [],
      colors: [],
      ctnPcs: [],
      ctnNo: [],
      ttlOtn: [],
      totalPcs: [],
    };
  },
  methods: {
    save() {
      let sum = 0;
      this.totalOfSizes = [];
      for (let i = 0; i < parseInt(this.totalSizes); i++) {
        for (let j = 0; j < this.colors.length; j++) {
          sum +=
            parseInt(this.sizeValues[i + j * this.totalSizes]) *
            parseInt(this.ttlOtn[j]);
        }
        this.totalOfSizes.push(sum);
        sum = 0;
      }

      //sum of all PCS
      this.item.totalPcsTotal = this.totalPcs.reduce(
        (acc, val) => acc + parseInt(val),
        0
      );

      //values collection to send to a database
      this.vals = {
        type: 1,
        createdAt: new Date(),
        heading: {
          shippingMark: this.item.shippingMark,
          codeArticle: this.item.codeArticle,
          talle: this.item.talle,
          quantity: this.item.quantity,
          styleNumber: this.item.styleNumber,
          orderNumber: this.item.orderNumber,
          orderQuantity: this.item.orderQuantity,
        },
        summary: this.summary,
        data: this.colors.map((x, i) => {
          return {
            color: x,
            ctnPcs: this.ctnPcs[i],
            ctnNo: this.ctnNo[i],
            ttlOtn: this.ttlOtn[i],
            totalPcs: this.totalPcs[i],
            values: this.sizes.map((y, j) => {
              return {
                size: y,
                value: this.sizeValues[j + i * this.totalSizes],
              };
            }),
          };
        }),
        totalValues: this.sizes.map((x, i) => {
          return {
            size: x,
            total: this.totalOfSizes[i],
          };
        }),
        total: {
          ctnPcs: this.item.ctnPcsTotal,
          ctnNo: this.item.ctnNoTotal,
          ttlOtn: this.item.ttlOtnTotal,
          totalPcs: this.item.totalPcsTotal,
        },
      };
      // api
      //   .create(this.vals, path.packingList)
      //   .then(() => {
      //     this.$notify({
      //       type: "success",
      //       title: "Success",
      //       message: `Packing List information saved successfully.`
      //     });
      //     this.$router.push({ name: "packing" });
      //   })
      //   .catch(() => {
      //     this.$notify({
      //       type: "danger",
      //       title: "Failure",
      //       message: `Unable to save your packing list information right now.`
      //     });
      //   });
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
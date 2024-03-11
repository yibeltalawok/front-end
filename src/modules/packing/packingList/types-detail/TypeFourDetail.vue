<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-layout row wrap justify-center>
        <v-layout row wrap> </v-layout>
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
            :label="'orderNumber'"
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
    <table>
      <tr>
        <th>{{ $t("size") }}</th>
        <th>{{ $t("color") }}</th>
        <th>{{ $t("value") }}</th>
        <th>{{ $t("PCS/CTN") }}</th>
        <th>{{ $t("CTN-NO") }}</th>
        <th>{{ $t("TTL-CTN") }}</th>
        <th>{{ $t("TTL-PCS") }}</th>
      </tr>
      <tr v-for="(size, i) in item.data.length" :key="i">
        <td>{{ item.data[i].size }}</td>
        <td>{{ item.data[i].color }}</td>
        <td>{{ item.data[i].value }}</td>
        <td>{{ item.data[i].ctnPcs }}</td>
        <td>{{ item.data[i].ctnNo }}</td>
        <td>{{ item.data[i].ttlOtn }}</td>
        <td>{{ item.data[i].totalPcs }}</td>
      </tr>
      <tr>
        <th colspan="2">TOTAL</th>
        <td>{{ item.totalValues[0].total }}</td>
        <td>{{ item.totalValues[0].ctnPcs }}</td>
        <td>{{ item.totalValues[0].ctnNo }}</td>
        <td>{{ item.total.ttlOtn }}</td>
        <td>{{ item.total.totalPcs }}</td>
      </tr>
    </table>

    <div class="my-3">
      <!-- <h3 class="py-2">{{ $t("summary") }}</h3> -->
    </div>
    <table class="my-3">
      <tr>
        <th>{{ $t("total") }}</th>
        <th>{{ $t("totalCTNs") }}</th>
        <th>{{ $t("grossWeight") }}</th>
        <th>{{ $t("netWeight") }}</th>
        <th>{{ $t("ctnMEAS") }}</th>
      </tr>
      <tr>
        <td>{{ item.summary.total }}</td>
        <td>{{ item.summary.totalCTNs }}</td>
        <td>{{ item.summary.grossWeight }}</td>
        <td>{{ item.summary.netWeight }}</td>
        <td>{{ item.summary.ctnMEAS }}</td>
      </tr>
    </table>

    <br />
    <br />
    <v-btn color="primary" class="text-capitalize" @click="dialog = true"
      >Print</v-btn
    >
    <v-flex xs12 sm12 md12 lg12 pa-1 ref="content" class="mt-5 text-center">
      <v-layout row wrap justify-center>
        <table cellPadding="12" cellSpacing="2">
          <tr>
            <td><h4>Invoice #</h4></td>
            <td colspan="3">GE/566/14+B21</td>
            <td colspan="3" rowspan="2" class="grey">
              <h1>Packing List</h1>
            </td>

            <td colspan="2" rowspan="6">
              Shipping Mark<br />
              Size / Weight / Qty<br />
              Description <br />
              Carton # {{ firstCtn }} to {{ lastCtn }}
            </td>
          </tr>
          <tr>
            <td><h4>Dated</h4></td>
            <td colspan="3">
              {{ new Date(item.createdAt).toLocaleDateString("en-US") }}
            </td>
          </tr>
          <tr>
            <td colspan="4"><h1>BY AIR</h1></td>
            <td colspan="3" rowspan="4" class="txtAlign">
              Form"E" A B L # ---------<br />
              Form"E" Dated : -------------<br />
              N T N # --------------------
            </td>
          </tr>
          <td><h4>N. Wt</h4></td>
          <td colspan="3">{{ item.summary.grossWeight }}Kg</td>
          <tr></tr>
          <td><h4>G. Wt</h4></td>
          <td colspan="3">{{ item.summary.netWeight }}Kg</td>
          <tr>
            <td colspan="3">
              <h4>Sr/No,s Of Ctn {{ firstCtn }} To {{ lastCtn }}</h4>
            </td>
            <td colspan="2"><h4>Miss Ctn 0</h4></td>
            <td colspan="2">
              <h4>Shipped Ctn {{ last }}</h4>
            </td>
            <td colspan="2">
              <h4>Shipped {{ last }}</h4>
            </td>
          </tr>
          <tr>
            <td colspan="9" class="txtAlign">
              <h4>Payment Terms : Advance Payment Received</h4>
            </td>
          </tr>
          <tr>
            <td colspan="9" class="txtAlign">
              <h4>By Air : Manchester UK Air Port Delivery Prepaid</h4>
            </td>
          </tr>
          <tr>
            <td colspan="9" class="txtAlign">
              <h4>
                Through ; Allied Bank Limited Model Town, Lahore Pakistan
              </h4>
            </td>
          </tr>
          <tr>
            <td colspan="9" class="txtAlign">
              <h4>
                Notify Party : D Fashion Ltd , 54 Evesham Grove
                Ashton-Under-Lyne Lancashire (Code) U.K
              </h4>
            </td>
          </tr>
          <tr>
            <td colspan="3"><h4>Consignee: Zain Fashion Ltd</h4></td>
            <td colspan="3"><h4>Air Way Bill # PK</h4></td>
            <td colspan="3"><h4>Flight #</h4></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Sr. #</th>
            <th>Nos of CTn</th>
            <th></th>
            <th></th>
            <th>Style. #</th>
            <th>Quality</th>
            <th>Item</th>
            <th>Colour</th>
            <th>Size</th>
          </tr>

          <tr v-for="(size, i) in item.data.length" :key="i">
            <td>{{ item.data[i].ctnNo }}</td>
            <td>{{ item.data[i].ttlOtn }}</td>
            <td>21</td>
            <td>29</td>
            <td>{{ item.order.styleNumber }}</td>
            <td>{{ item.heading.quantity }}</td>
            <td>{{ item.order.styleName }}</td>
            <td>{{ item.data[i].color }}</td>
            <td>{{ item.data[i].size }}</td>
          </tr>
        </table>
      </v-layout></v-flex
    >

    <v-dialog v-model="dialog" width="750">
      <v-card>
        <v-card-title class="headline primary lighten-2">
          Packing List print Data
        </v-card-title>
        <v-form
          @submit.prevent="save"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.invoice"
                  label="Invoice #"
                  name="invoice no"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.date"
                  label="Date"
                  name="date"
                  outlined
                  dense
                  type="date"
                  :rules="rule"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.netWeight"
                  :label="$t('N. Wt')"
                  name="netWight"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.grossWeight"
                  :label="$t('G. Wt')"
                  name="grossWeight"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.missCtn"
                  :label="$t('Miss Ctn')"
                  name="missCtn"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.shippedCtn"
                  label="Shappe ctn"
                  name="shappedCtn"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.shipped"
                  label="Shipped"
                  name="shipped"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.byAir"
                  label="By air"
                  name="packedIn"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.through"
                  :label="$t('Through')"
                  name="through"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.notifyParty"
                  :label="$t('Notify party')"
                  name="notifyParty"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.consignee"
                  :label="$t('Consignee')"
                  name="consignee"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="itemHeader.airWayBill"
                  :label="$t('Air way bill #')"
                  name="airWayBill"
                  outlined
                  dense
                  :rules="rule"
                />
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-layout row wrap justify-center>
              <v-btn class="green white--text" text @click="exportP">
                Print to .pdf
              </v-btn>
            </v-layout>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { path } from "@/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { mapState, mapActions } from "vuex";
// import html2canvas from "html2canvas";
export default {
  data() {
    return {
      itemHeader: {},
      item: {},
      items: [],
      printItem: [],
      printArray: [],
      dialog: false,
      rule: [v => !!v || "This field is requird"],
      firstCtn: 0,
      lastCtn: 0
    };
  },
  computed: {
    ...mapState("inventory", ["itemById"])
  },
  async created() {
    const { packingId } = this.$route.params;
    let filter = { include: ["order"] };

    await this.getDataByIdWithF([packingId, path.packingList, filter]).then(
      () => {
        this.item = this.itemById;
        //  this.item = await api.get(packingId, path.packingList, filter);
        this.item.data.length;
        let initial = this.item.data[0].ctnNo.split("-");
        let last = this.item.data[this.item.data.length - 1].ctnNo.split("-");
        this.firstCtn = initial[0];
        this.lastCtn = last[1];
      }
    );

    // this.last = this.item.data.reduce(
    //   (acc, val) => acc + parseInt(val.ttlOtn),
    //   0
    // );
    this.manageForPrint();
  },
  methods: {
    ...mapActions("inventory", ["getDataByIdWithF"]),
    manageForPrint() {
      let count = 0;
      for (const item of this.item.data) {
        if (count == 0) {
          this.printArray.push([
            "Sr. #",
            "Nos of CTN",
            " ",
            " ",
            "Style. #",
            "Quantity",
            "Item",
            "Color",
            "Size"
          ]);
        }
        count += 1;
        this.printArray.push([
          item.ctnNo,
          item.ttlOtn,
          "72",
          "456",
          this.item.order.styleNumber,
          this.item.heading.quantity,
          this.item.order.styleName,
          item.color,
          item.size
        ]);
      }
    },
    exportP() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        // Col spans and row spans
        var doc = new jsPDF("p", "pt", "a4");
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFontStyle("bold");
        let body = [
          [
            {
              content: "Payment Terms : Advance Payment Received",
              colSpan: 9
            }
          ],
          [
            {
              content: "By Air : " + this.itemHeader.byAir,
              colSpan: 9
            }
          ],

          [
            {
              content: "Through : " + this.itemHeader.through,
              colSpan: 9
            }
          ],
          [
            {
              content: "Notify Party : " + this.itemHeader.notifyParty,
              colSpan: 9
            }
          ],
          [
            {
              content: "Consignee: " + this.itemHeader.consignee,
              colSpan: 3
            },
            {
              content: "Air Way Bill #: " + this.itemHeader.airWayBill,
              colSpan: 3
              // styles: { halign: "center", fillColor: [22, 160, 133] }
            },
            {
              content: "Flight #",
              colSpan: 3
              // styles: { halign: "center", fillColor: [22, 160, 133] }
            }
          ]
        ];
        for (let i = 0; i < this.printArray.length; i++) {
          body.push(this.printArray[i]);
        }
        let head = [
          [
            {
              content: "Invoice #:",
              colSpan: 1
            },
            {
              content: this.itemHeader.invoice,
              colSpan: 2
            },
            {
              content: "Packing List",
              colSpan: 3,
              rowSpan: 2
            },
            {
              content:
                "Shipping Mark\nSize / Weight / Qty\nDescription\nCarton # " +
                this.firstCtn +
                " to " +
                this.lastCtn,
              colSpan: 3,
              rowSpan: 5
            }
          ],

          [
            {
              content: "Dated",
              colSpan: 1
            },
            {
              content: this.itemHeader.date,
              colSpan: 2
            }
          ],

          [
            {
              content: "BY AIR",
              colSpan: 3
            },
            {
              content: [
                "Form  A B L #____________ \n\nForm  Dated : ___________ \n\nN T N #__________________ "
              ],
              colSpan: 3,
              rowSpan: 3
            }
          ],

          [
            {
              content: "N. Wt",
              colSpan: "1"
            },
            {
              content: this.itemHeader.netWeight,
              colSpan: 2
            }
          ],
          [
            {
              content: "G. Wt",
              colSpan: 1
            },
            {
              content: this.itemHeader.grossWeight,
              colSpan: 2
            }
          ],
          [
            {
              content:
                "Sr/No,s Of Ctn " + this.firstCtn + " to " + this.lastCtn,
              colSpan: 3
            },
            {
              content: "Miss Ctn: " + this.itemHeader.missCtn,
              colSpan: 2
            },
            {
              content: "Shipped Ctn:" + this.itemHeader.shippedCtn,
              colSpan: 2
            },
            {
              content: "Shipped: " + this.itemHeader.shipped,
              colSpan: 2
            }
          ]
        ];
        doc.autoTable({
          theme: "plain",
          startY: 60,
          styles: {
            // Defaul style
            lineWidth: 0.01,
            lineColor: 0,
            fillStyle: "DF",
            halign: "center",
            valign: "middle",
            columnWidth: "auto",
            overflow: "linebreak"
          },
          head: head,
          body: body
          // theme: "grid"
        });
        doc.save("type-four-detail.pdf");
      }
    },

    bodyRows(rowCount) {
      rowCount = rowCount || 10;
      let body = [];
      for (var j = 1; j <= rowCount; j++) {
        body.push({
          id: j,
          name: "PARTH",
          email: "PARTH",
          city: "PARTH",
          expenses: "PARTH"
        });
      }
      return body;
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
  color: black;
  text-align: center;
  padding: 10px 1px 0px 1px;
}
.txtAlign {
  text-align: left;
}
</style>
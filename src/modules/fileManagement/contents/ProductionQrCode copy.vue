<template>
  <div>
    <v-card outlined style="border-radius:12px">
      <v-toolbar dense flat>
        <span class="mr-3">Production QR Code</span>
        <v-divider vertical></v-divider>
        <v-spacer />

        <v-card flat class="mx-2">
          <v-select
            dense
            hide-details
            v-model="operation"
            :items="operations"
            item-text="operationName"
            label="Select operation"
            @input="disabled=false"
          />
        </v-card>
        <v-card class="mx-2" flat>
          <v-select
            :disabled="disabled"
            dense
            label="Select style"
            :items="bndls"
            item-text="title"
            item-value="id"
            @input="generateSR"
            hide-details
          />
        </v-card>

        <v-btn :disabled="disabled" color="primary" @click="print">
          <v-progress-circular
            v-if="printing"
            class="mr-1"
            indeterminate
            size="20"
            :value="20"
            color="white"
          />
          <v-icon class="mr-2">print</v-icon>Print
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-container grid-list-xs fluid>
        <div class="text-right" v-if="totalQrcodes>0 &&
         currentQrcodes>0">
          <h4 class="info--text">{{currentQrcodes}} QR codes</h4>
        </div>
        <v-layout column justify-center align-center v-if="overlay">
          <v-progress-circular indeterminate :value="20" color="info" />
          <p class="info--text title py-3">Generating QR codes ...</p>
        </v-layout>
        <v-row class="mx-0">
          <v-col cols="12" ref="content">
            <v-row align="center" justify="center">
              <v-card
                v-for="(tkt, i) in qrcodes"
                :key="i"
                class="mx-0"
                width="100"
                style="border:1px solid grey"
              >
                <v-toolbar dense flat height="15px" color="accent">
                  <small style="font-size:9px">{{tkt.partName}}</small>
                </v-toolbar>
                <div class="text-center white mt-1">
                  <qrcode-vue :value="JSON.stringify(tkt.qr)" :size="size" level="H" />
                </div>
                <v-toolbar dense flat height="15px" color="accent">
                  <small style="font-size:9px">B.N: {{tkt.bundleNo}}</small>
                  <v-spacer></v-spacer>
                  <small>{{tkt.color.toLowerCase()}}</small>
                  <v-spacer></v-spacer>
                  <small>{{tkt.size}}</small>
                </v-toolbar>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-navigation-drawer v-if="rightSidebar" app right clipped width="170px">
      <v-container grid-list-xs>
        <h3 class="text-left grey--text">QR Codes</h3>
        <h4 class="info--text text-center" v-if="totalQrcodes>0">{{totalQrcodes}} QR codes</h4>

        <v-list link dense rounded>
          <v-list-item-group v-model="item" color="primary">
            <template v-for="(item,i) in output.length">
              <v-list-item :key="i" @click="paginate(i)">
                <v-list-item-content>
                  <v-list-item-title>Production {{ i+1}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>


<script>
import { mapMutations } from "vuex";
import { api, path } from "@/api";
import QrcodeVue from "qrcode.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      totalQrcodes: 0,
      currentQrcodes: 0,
      disabled: true,
      rightSidebar: false,
      output: [],
      qrodes: [],
      overlay: false,
      printing: false,
      tempTkts: [],
      tkts: [],
      size: 95,
      sizes: [],
      bndls: [],
      plyValues: [],
      colors: [],
      colorValues: [],
      items: [],
      operation: "",
      item: {},
      operations: [],
      camps: [],
    };
  },

  components: {
    QrcodeVue,
  },
  computed: {
    allTkts() {
      return this.$store.getters.allItems;
    },
    info() {
      return this.$store.getters.laysheet;
    },
    color() {
      return this.$store.getters.color;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { styleId } = this.$route.params;
      let filter = {
        where: {
          oprBltnId: styleId,
        },
      };
      let orderFilter = {
        include: ["order"],
      };
      this.operations = (await api.all(path.operation, filter)).rows;
      this.bndls = (await api.all(path.laysheet, orderFilter)).rows.map((x) => {
        return {
          id: x.id,
          title:
            x.order.styleName +
            "(" +
            x.order.styleNumber +
            ")" +
            ", " +
            x.order.customer,
          parts: x.parts,
          qty: x.qty,
          sr: x.sr,
        };
      });

      this.camps = [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Operation",
          disabled: false,
          to: "/app/operation/" + styleId + "/list",
        },
        {
          text: "QR Codes",
          disabled: true,
        },
      ];
    },
    ...mapMutations("layout", ["toggleNavBar"]),
    async generateSR(id) {
      if (this.operation == "")
        this.$notify({
          type: "danger",
          title: "Bundles QR codes",
          message: `Unable to generate QR Codes. 
          Operation Name is messed.
           Please select your preffered operation.`,
        });
      else {
        this.toggleNavBar();
        this.overlay = true;
        let filter = {
          include: ["order"],
        };
        this.item = await api.get(id, path.laysheet, filter);
        this.sizes = this.item.sizes;
        this.colors = this.item.sizes[0].colors.map((x) => x.color);

        let items = this.sizes.map((x) => {
          return {
            size: x.label,
            ratio: x.ratio,
            quantity: x.qty,
            nB: this.roundUp(
              parseInt(x.qty) /
                (parseInt(this.item.noOfBundle) * parseInt(this.item.bQty))
            ),
            colors: x.colors.map((c) => {
              return {
                color: c.color,
                ply: c.ply,
                value: c.value,
              };
            }),
            // all: this.item
          };
        });

        // this.items = items;
        this.tktData(items);
      }
    },
    tktData(items) {
      let nRows = parseInt(this.item.noOfBundle);
      let bQ = parseInt(this.item.bQty);
      let rSum = 0;
      let cnRows = 0;
      let count = 0;
      let iterator = 0;
      let arr = items;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 1; j <= arr[i].nB; j++) {
          rSum =
            j < arr[i].nB
              ? nRows * bQ
              : arr[i].quantity - nRows * bQ * (arr[i].nB - 1);
          cnRows = j < arr[i].nB ? nRows : rSum / bQ;
          iterator = j - 1;
          this.items.push({
            label: arr[i].size,
            val: { count: count + j, iterator: iterator },
            nb: this.roundUp(cnRows),
            rSum: rSum,
            tQ: bQ,
            cardCounter: j - 1,
          });
        }
        iterator = 0;
        count += arr[i].nB;
      }
      this.generateBundles();
    },
    generateBundles() {
      const laysheet = {
        cutNo: this.item.cutNo,
        noOfBundle: this.item.noOfBundle,
        bQty: this.item.bQty,
        styleName: this.item.order.styleName,
        styleNo: this.item.order.styleNumber,
        buyer: this.item.order.customer,
        design: this.item.order.design,
      };
      this.manageState(this.items, laysheet, this.colors);
      this.generateTkt();
    },
    manageState(items, laysheet, color) {
      this.$store.commit("manageState", items);
      this.$store.commit("manageLaysheet", laysheet);
      this.$store.commit("manageColor", color);
    },
    generateTkt() {
      this.items = [];
      this.tempTkts = [];
      let tkts = this.allTkts;
      for (let i = 0; i < tkts.length; i++) {
        for (let j = 0; j < 1; j++) {
          for (let k = 0; k < tkts[i].No.length; k++) {
            this.tempTkts.push({
              id: this.item.id,
              tkt: tkts[i].val,
              label: tkts[i].label,
              bundle: tkts[i].No[k],
            });
          }
        }
      }

      this.tkts = [];
      for (let a = 0; a < this.color.length; a++) {
        for (let b = 0; b < this.tempTkts.length; b++) {
          this.tkts.push({
            id: this.item.id,
            color: this.color[a],
            label: this.tempTkts[b].label,
            tkt: this.tempTkts[b].tkt,
            bundle: this.tempTkts[b].bundle,
          });
        }
      }
      // this.tkts = this.tempTkts;

      this.cards = this.tkts.map((x) => {
        return {
          id: x.id,
          color: x.color,
          partName: this.operation,
          size: x.label,
          bundleNo: x.bundle.count,
          srFrom: x.bundle.from,
          srTo: x.bundle.to,
          qr: [
            "pr",
            x.color,
            this.operation,
            x.label,
            x.bundle.count,
            x.bundle.from,
            x.bundle.to,
          ],
        };
      });
      this.totalQrcodes = this.cards.length;
      var alphabetPairs = this.splitArrayIntoChunksOfLen(this.cards, 56);
      this.output = alphabetPairs;

      this.paginate(0);
      this.cards = [];
    },
    splitArrayIntoChunksOfLen(arr, len) {
      var chunks = [],
        i = 0,
        n = arr.length;
      while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
      }
      return chunks;
    },

    paginate(index) {
      this.qrcodes = this.output[index];
      this.currentQrcodes = this.qrcodes.length;
      this.overlay = false;
      this.rightSidebar = true;
    },
    roundUp(number) {
      return parseInt(Math.ceil(number));
    },
    //print
    print() {
      this.printing = true;
      const doc = new jsPDF({
        orientation: "landscape",
      });
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement })
        .then(function (canvas) {
          const img = canvas.toDataURL("image/png", 10);
          doc.addImage(img, "JPEG", 0, 0);

          doc.save("production.pdf");
        })
        .then(() => {
          this.printing = false;
          this.toggleNavBar();
        });
    },
  },
};
</script>


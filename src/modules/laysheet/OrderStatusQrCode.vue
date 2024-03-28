/* eslint-disable no-unused-vars */
<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-select
            solo
            flat
            dense
            :label="$t('select-style')"
            :items="bndls"
            item-text="title"
            return-object
            @input="generateSR"
            hide-details
          />
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <div class="text-right" v-if="totalQrcodes > 0 && currentQrcodes > 0">
            <h4 class="info--text">{{ currentQrcodes }} {{ $t("qr-code") }}</h4>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 pa-2>
          <v-btn color="primary" @click="print">
            <v-progress-circular
              v-if="printing"
              class="mr-1"
              indeterminate
              size="20"
              :value="20"
              color="white"
            />
            <v-icon class="mr-2">print</v-icon>
            {{ $t("print") }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-xs fluid>
      <v-layout column justify-center align-center v-if="overlay">
        <v-progress-circular indeterminate :value="20" color="info" />
        <p class="info--text title py-3">{{ $t("generating-qr-codes") }}</p>
      </v-layout>

      <div>
        <v-row class="mx-0">
          <v-col cols="12" ref="content">
            <v-row align="center" justify="center">
              <v-card
                v-for="(tkt, i) in qrcodes"
                :key="i"
                class="ma-1"
                width="103"
              >
                <v-toolbar dense flat height="15px" color="accent">
                  <small style="font-size:9px">{{ tkt.styleName }}</small>
                </v-toolbar>
                <div class="text-center white mt-1">
                  <qrcode-vue
                    :value="JSON.stringify(tkt.qr)"
                    :size="size"
                    level="H"
                  />
                </div>
                <v-toolbar dense flat height="15px" color="accent">
                  <small style="font-size:9px">B.N: {{ tkt.bundleNo }}</small>
                  <v-spacer></v-spacer>
                  <small>{{ tkt.color.toLowerCase() }}</small>
                  <v-spacer></v-spacer>
                  <small>{{ tkt.size }}</small>
                </v-toolbar>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-overlay
          :absolute="absolute"
          :opacity="opacity"
          :value="overlayCircle"
          :z-index="zIndex"
        >
          <v-progress-circular
            indeterminate
            :size="50"
            color="amber"
          ></v-progress-circular>
          <p class="Green--text title py-3">{{ $t("loading") }}</p>
        </v-overlay>
        <v-navigation-drawer
          v-if="rightSidebar"
          app
          right
          clipped
          width="170px"
        >
          <v-container grid-list-xs>
            <h3 class="text-left grey--text">{{ $t("qr-code") }}</h3>
            <h4 class="info--text text-center" v-if="totalQrcodes > 0">
              {{ totalQrcodes }} {{ $t("qr-code") }}
            </h4>

            <v-list link dense rounded>
              <v-list-item-group v-model="item" color="primary">
                <template v-for="(item, i) in output.length">
                  <v-list-item :key="i" @click="paginate(i)">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ $t("production") }} {{ i + 1 }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-container>
        </v-navigation-drawer>
      </div>
    </v-container>
  </div>
</template>


<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
import { api, path, API_ROOT } from "@/api";
import QrcodeVue from "qrcode.vue";
// eslint-disable-next-line no-unused-vars
import jsPDF from "jspdf";
// eslint-disable-next-line no-unused-vars
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      totalQrcodes: 0,
      currentQrcodes: 0,
      disabled: true,
      absolute: true,
      zIndex: 0,
      opacity: 0,
      rightSidebar: false,
      output: [],
      qrcodes: [],
      overlayCircle: false,
      overlay: false,
      printing: false,
      tempTkts: [],
      tkts: [],
      size: 95,
      sizes: [],
      // bndls: [],
      plyValues: [],
      colors: [],
      colorValues: [],
      items: [],
      operation: "",
      item: {},
      operations: [],
      camps: [],
      styleName: "",
      orderId: "",
      orderNumber: "",
      tempLaySheet: {},
      cutNo: ""
    };
  },

  components: {
    QrcodeVue
  },
  computed: {
    ...mapGetters("laysheet", ["allItem", "laysheet", "color"]),

    allTkts() {
      return this.allItem;
    },
    info() {
      return this.laysheet;
    },
    color() {
      return this.color;
    },
    ...mapState("Styles", ["bndls"])
  },
  created() {
    this.loadData();
  },
  methods: {
    ...mapActions("Styles", ["setStyle"]),
    async loadData() {
      this.setStyle();
    },
    ...mapMutations("layout", ["toggleNavBar"]),
    ...mapMutations("laysheet", ["setLaysheet"]),
    async generateSR(item) {
      this.items = item;
      this.cutNo = item.cutNo;
      let temp = [];
      await api
        .create({ laysheetId: item.id }, path.getLaysheet)
        .then(result => {
          temp = result;
        });
      this.items = temp;
      this.tempLaySheet = item;
      this.styleName = item.styleName;
      this.orderId = item.orderId;
      this.orderNumber = item.orderNumber;
      this.generateBundles();
    },
    generateBundles() {
      this.manageState(this.items);
      this.generateTkt();
    },
    manageState(items) {
      this.setLaysheet(items);
    },
    generateTkt() {
      this.items = [];
      this.tempTkts = [];
      let tkts = this.allTkts;
      for (let i = 0; i < tkts.length; i++) {
        for (let k = 0; k < tkts[i].No.length; k++) {
          this.tempTkts.push({
            id: this.tempLaySheet.id,
            tkt: tkts[i].val,
            label: tkts[i].label,
            color: tkts[i].color,
            bundle: tkts[i].No[k]
          });
        }
      }

      this.tkts = [];
      for (let b = 0; b < this.tempTkts.length; b++) {
        this.tkts.push({
          id: this.tempLaySheet.id,
          color: this.tempTkts[b].color,
          label: this.tempTkts[b].label,
          tkt: this.tempTkts[b].tkt,
          bundle: this.tempTkts[b].bundle
        });
      }

      this.cards = this.tkts.map(x => {
        return {
          id: x.id,
          color: x.color,
          styleName: this.styleName,
          size: x.label,
          bundleNo: x.bundle.count,
          srFrom: x.bundle.from,
          srTo: x.bundle.to,

          qr: [
            "os",
            x.color,
            x.label,
            x.bundle.count,
            x.bundle.from,
            x.bundle.to,
            this.orderId,
            this.orderNumber,
            this.styleName,
            this.cutNo,
            "order-status"
          ]
        };
      });
      this.totalQrcodes = this.cards.length;
      var alphabetPairs = this.splitArrayIntoChunksOfLen(this.cards, 66);
      this.output = alphabetPairs;

      this.paginate(0);
      // this.cards = [];
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
      this.overlayCircle = true;
      this.qrcodes = this.output[index];
      this.currentQrcodes = this.qrcodes.length;
      this.overlay = false;
      this.rightSidebar = true;
      this.overlayCircle = false;
    },
    roundUp(number) {
      return parseInt(Math.ceil(number));
    },
    //print
    async print() {
      await api
        .create(
          {
            value: this.qrcodes,
            name: "order-status"
          },
          "/printqrs/printosqrcode"
        )
        .then(resp => {
          // eslint-disable-next-line no-console
          console.log(resp);
          if (resp.status == "success")
            window.open(
              API_ROOT + "/Containers/qrtoprint/download/" + resp.filename,
              "_blank"
            );
        });
    }
  }
};
</script>


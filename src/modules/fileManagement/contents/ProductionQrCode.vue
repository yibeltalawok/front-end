<template>
  <div>
    <v-card outlined style="border-radius:12px">
      <v-toolbar dense flat>
        <span class="mr-3">{{ $t("production") }} {{ $t("qr-code") }}</span>
        <v-divider vertical></v-divider>
        <v-spacer />
   
        <v-card class="mx-2" flat>
          <v-select
            dense
            :label="$t('select-style')"
            :items="bndls"
            item-text="title"
            return-object
            @input="getOperations"
            hide-details
          />
        </v-card>

        <v-btn
          small
          color="green"
          rounded
          class="text-capitalize white--text"
          :disabled="isQuee"
          @click="addToQuee"
        >
          {{ $t("Add to Queue") }} ({{ queue.length }})
        </v-btn>
        <v-btn
          v-if="tempItem.length != null"
          color="primary"
          @click="getOperations(tempItem)"
        >
          {{ $t("generate") }}
        </v-btn>
        <v-btn v-if="queue.length > 0" color="primary" @click="print">
          <v-progress-circular
            v-if="printing"
            class="mr-1"
            indeterminate
            size="20"
            :value="20"
            color="white"
          />
          <v-icon class="mr-2">print</v-icon>{{ $t("print") }}
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-overlay :absolute="absolute" :value="overlayCircle">
        <v-progress-circular
          indeterminate
          :size="50"
          color="amber"
        ></v-progress-circular>
        <p class="Green--text title py-3">{{ "loading" }}</p>
      </v-overlay>
      <v-container grid-list-xs fluid>
        <div class="text-right" v-if="totalQrcodes > 0 && currentQrcodes > 0">
          <h4 class="info--text">{{ currentQrcodes }} {{ $t("qr-code") }}</h4>
        </div>
        <v-layout column justify-center align-center v-if="overlay">
          <v-progress-circular indeterminate :value="20" color="info" />
          <p class="info--text title py-3">{{ $t("generating-qr-codes") }}</p>
        </v-layout>
        <v-row class="mx-0">
          <v-col cols="12" ref="content" class="ma-0 pa-0">
            <v-row align="center" justify="center" class="ma-0 pa-0">
              <v-card
                flat
                v-for="(tkt, i) in qrcodes"
                :key="i"
                class="ma-0 pa-0"
                width="29.7mm"
                height="58.5mm"
                style="border:1px dotted grey"
                 >
                <div class="text-center white mt-3">
                  <qrcode-vue
                    :value="JSON.stringify(tkt.qr)"
                    :size="size"
                    level="H"
                  />
                </div>
                <p class="px-1 text-center">
                  <small>
                    {{ tkt.partName }}
                    <br />
                    B.N: {{ tkt.bundleNo }}
                    <br />
                    {{ tkt.color.toLowerCase() }}, {{ tkt.size }}<br />
                    <v-btn text
                      class="mx-2 text-capitalize blue--text"                      
                      x-small
                      color="white"
                      @click="pushToSave(tkt.partName, tkt.srFrom, tkt.srTo)"
                    >
                      Add
                    </v-btn>
                  </small>
                </p>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-navigation-drawer v-if="rightSidebar" app right clipped width="170px">
      <v-container grid-list-xs>
        <h3 class="text-left grey--text">{{ $t("qr-codes") }}</h3>
        <h4 class="info--text text-center" v-if="totalQrcodes > 0">
          {{ totalQrcodes }} {{ $t("qr-codes") }}
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
</template>


<script>
import { mapMutations, mapActions, mapState } from "vuex";
import { api, API_ROOT } from "@/api"; //path
import QrcodeVue from "qrcode.vue";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
export default {
  data() {
    return {
      totalQrcodes: 0,
      currentQrcodes: 0,
      disabled: true,
      rightSidebar: false,
      output: [],
      qrodes: [],
      absolute: true,
      overlay: false,
      overlayCircle: false,
      printing: false,
      tempTkts: [],
      tkts: [],
      size: 95,
      sizes: [],
      // bndls: [],
      plyValues: [],
      colors: [],
      colorValues: [],
      // items: [],
      operation: "",
      item: {},
      // operations: [],
      camps: [],
      tempLaySheet: {},
      cutNo: "",
      oprBltn: [],
      // cards: [],
      qrcodes: [],
      qrV: [],
      tempItem: {},
      isQuee: false,
      queue: [],
      peginateIndex: 0,
      queueItemsIndex: []
    };
  },

  components: {
    QrcodeVue
  },
  updated() {
    if (this.tkts.length > 0) {
      this.loadingProgress = false;
    } else {
      setTimeout(
        () => `No data available here.
       You will be redireced to the Laysheet page. `,
        5000
      );
      setTimeout(() => (this.overlayCircle = false), 5000);
    }
  },
  computed: {
    ...mapState("Styles", ["bndls"]),
    ...mapState("Styles", ["operations"]),
    ...mapState("Styles", ["items"]),
    ...mapState("Styles", ["cards"]),
    info() {
      return this.$store.getters.laysheet;
    },
    color() {
      return this.$store.getters.color;
    }
  },
  created() {
    this.loadData();
    // this.setStyle();
  },
  methods: {
    ...mapActions("Styles", ["setStyle"]),
    ...mapActions("Styles", ["getOperation"]),
    async loadData() {
      this.setStyle();
    },
    ...mapMutations("layout", ["toggleNavBar"]),
    async getOperations(item) {
      this.disabled = true;
      this.tempItem = item;
      // this.operations = [];
      this.output = [];
      this.queue = [];
      this.queueItemsIndex = [];
      this.peginateIndex = 0;
      this.isQuee = false;
      this.orderId = item.orderId;
      await this.getOperation(item).then(res => {
        res;
        this.generateTkt();
      });
    },

    async generateSR(item) {
      //item
      this.disabled = true;
      this.cards = [];
      // this.operations = [];
      this.output = [];
      this.cutNo = item.cutNo;
      this.orderId = item.orderId;
      //
      if (this.operations.length > 0) {
        this.getBundleTkts(item.id);
        this.generateBundles();
      } else {
        this.generateBundles();
        this.$notify({
          type: "danger",
          title: "Operation",
          message: `Unable to found Operation for this order. `
        });
      }
    },
    generateBundles() {
      this.manageState(this.items);
      this.generateTkt();
    },
    manageState(items) {
      this.$store.commit("setLaysheet", items);
    },
    generateTkt() {
      this.totalQrcodes = this.cards.length;
      var alphabetPairs = this.splitArrayIntoChunksOfLen(this.cards, 50);
      this.output = alphabetPairs;

      this.paginate(0);
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
      this.peginateIndex = index;
      this.overlayCircle = true;
      this.qrcodes = this.output[index];
      this.currentQrcodes = this.qrcodes.length;
      this.overlay = false;
      this.rightSidebar = true;
      this.overlayCircle = false;
      const ind = this.queueItemsIndex.indexOf(index);
      this.isQuee = ind == -1 ? false : true;
    },
    roundUp(number) {
      return parseInt(Math.ceil(number));
    },
    addToQuee() {
      this.queueItemsIndex.push(this.peginateIndex);
      for (let i = 0; i < this.qrcodes.length; i++) {
        this.queue.push(this.qrcodes[i]);
      }
      this.isQuee = true;
    },
    //print
    async print() {
      await api
        .create(
          {
            value: this.queue,
            name: "production"
          },
          "/printqrs/printproductionqrcode"
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
   
    },
    pushToSave(partName, srFrom, srTo) {
      let am = parseFloat(srTo) - parseFloat(srFrom) + 1;

      this.$router.push({ name: "production-new", params: { amountDone: am } });
    }
  }
};
</script>


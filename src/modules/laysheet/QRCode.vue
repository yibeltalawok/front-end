<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
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
          <v-spacer></v-spacer>
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
            small
            color="primary"
            rounded
            class="text-capitalize"
            @click="generatePdf"
          >
            <v-progress-circular
              v-if="loading"
              size="20"
              indeterminate
              :value="20"
            />
            <v-icon class="ma-1">print</v-icon>
            {{ $t("print") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-overlay :value="overlay">
          <v-progress-circular
            indeterminate
            :size="50"
            color="amber"
          ></v-progress-circular>
          <br />
          <h2 class="primary--text">loading...</h2>
        </v-overlay>
        <v-card-text>
          <v-row ref="content">
            <v-col cols="12">
              <v-row align="center" justify="center" ref="qrs">
                <v-card
                  v-for="(tkt, i) in cards"
                  :key="i"
                  class="card ma-1"
                  width="100"
                >
                  <v-toolbar dense flat height="20px" color="accent">
                    {{ tkt.partName }}
                    <v-spacer></v-spacer>
                    {{ tkt.size }}
                  </v-toolbar>
                  <div class="pa-1 text-center white">
                    <qrcode-vue
                      :value="JSON.stringify(tkt.qr)"
                      :size="size"
                      level="H"
                    />
                  </div>
                  <v-toolbar dense flat height="18px" color="accent">
                    <v-spacer />
                    <small>{{ tkt.color.toLowerCase() }}</small>
                    <v-spacer />
                    <small class="primary--text">{{ tkt.bundleNo }}</small>
                    <v-spacer />
                  </v-toolbar>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <v-navigation-drawer app right clipped width="200px">
      <v-container grid-list-xs>
        <h3 class="text-left grey--text">{{ $t("bundle-tickets") }}</h3>
        <v-list link dense rounded>
          <v-list-item-group v-model="item" color="primary">
            <template v-for="(item, i) in allTkts">
              <v-list-item :key="i" @click="paginate(i, i + 1)">
                <v-list-item-content>
                  <v-list-item-title
                    >{{ $t("bundle-ticket") }} {{ i + 1 }}</v-list-item-title
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
import QrcodeVue from "qrcode.vue";
import { api, API_ROOT } from "@/api";

// eslint-disable-next-line no-unused-vars
import jsPDF from "jspdf";
// eslint-disable-next-line no-unused-vars
import html2canvas from "html2canvas";
import { mapMutations, mapGetters } from "vuex";
export default {
  props: {
    msg: String
  },
  components: {
    QrcodeVue
  },
  data() {
    return {
      loading: false,
      overlay: false,
      queue: [],
      isQuee: false,
      size: 90,
      tempTkts: [],
      tkts: [],
      cards: [],
      printAll: [],
      cutNo: "",
      start: "0",
      last: "1",
      queueItemsIndex: []
    };
  },
  computed: {
    ...mapGetters("laysheet", {
      allTkts: "allItem",
      parts: "parts",
      item: "laysheet",
      color: "color"
    })
  },

  created() {
    this.toggleNavBar();
    this.paginate(0, 1);
  },

  methods: {
    ...mapMutations("layout", ["toggleNavBar"]),
    paginate(start, last) {
      this.start = start;
      this.last = last;

      this.overlay = true;
      let nb = this.validate(this.itemnoOfBundle);
      let bq = this.validate(this.item.bQty);
      this.tempTkts = [];
      this.tkts = [];
      let tkts = this.allTkts;
      // alert(start + "   " + last);
      for (let i = start; i < last; i++) {
        for (let j = 0; j < this.parts.length; j++) {
          for (let k = 0; k < tkts[i].No.length; k++) {
            this.tempTkts.push({
              partName: this.parts[j],
              label: tkts[i].label,
              color: tkts[i].color,
              tkt: tkts[i].val,
              bundle: tkts[i].No[k],
              from: (k + nb * this.validate(tkts[i].val.iterator)) * bq + 1,
              to:
                this.validate(tkts[i].No[k].bq) * (k + 1) +
                nb * this.validate(tkts[i].val.iterator)
            });
          }
        }
      }
      for (let b = 0; b < this.tempTkts.length; b++) {
        this.tkts.push({
          partName: this.tempTkts[b].partName,
          label: this.tempTkts[b].label,
          color: this.tempTkts[b].color,
          tkt: this.tempTkts[b].tkt,
          bundle: this.tempTkts[b].bundle,
          from: this.tempTkts[b].from,
          to: this.tempTkts[b].to
        });
      }

      this.cards = this.tkts.map(x => {
        return {
          color: x.color,
          partName: x.partName,
          bundleNo: x.bundle.count,
          size: x.label,
          qr: [
            "ls",
            x.color,
            x.partName,
            x.bundle.count,
            this.item.styleNo,
            this.item.cutNo,
            x.label,
            x.bundle.bq,
            x.bundle.from,
            x.bundle.to,
            this.item.cutNo,
            "laysheet"
          ]
        };
      });
      this.overlay = false;
      let index = this.start + "" + this.last;
      const ind = this.queueItemsIndex.indexOf(index);

      this.isQuee = ind == -1 ? false : true;
    },
    validate(val) {
      return Number.isInteger(parseInt(val, 10)) ? parseInt(val) : 0;
    },
    addToQuee() {
      this.queueItemsIndex.push(this.start + "" + this.last);
      for (let i = 0; i < this.cards.length; i++) {
        this.queue.push({
          color: this.cards[i].color,
          partName: this.cards[i].partName,
          bundleNo: this.cards[i].bundleNo,
          size: this.cards[i].size,
          qr: [
            this.cards[i].qr[0],
            this.cards[i].qr[1],
            this.cards[i].qr[2],
            this.cards[i].qr[3],
            this.cards[i].qr[4],
            this.cards[i].qr[5],
            this.cards[i].qr[6],
            this.cards[i].qr[7],
            this.cards[i].qr[8],
            this.cards[i].qr[9],
            this.cards[i].qr[10],
            this.cards[i].qr[11]
          ]
        });
      }
      this.isQuee = true;
    },
    async generatePdf() {
      let items = this.queue.length > 0 ? this.queue : this.cards;
      await api
        .create(
          {
            value: items,
            name: "laysheet"
          },
          "/printqrs/printqrcode"
        )
        .then(resp => {
          this.queue = [];
          this.isQuee = false;
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

<style lang="css" scoped>
table,
th,
td {
  border: 1px solid grey;
  border-collapse: collapse;
}
th {
  text-align: left;
}
th,
td {
  padding: 2px;
  font-size: 12px;
}
</style>

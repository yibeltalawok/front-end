<template>
  <div>
    <!-- loading  -->
    <v-container v-if="loadingProgress" style="height: 400px;">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="subtitle-1 text-center" cols="12">{{ noData }}</v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
    <!-- loading  -->
    <v-container grid-list-xs>
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
            color="primary"
            rounded
            class="text-capitalize"
            @click="generateQrcode"
          >
            <v-progress-circular
              v-if="loading"
              size="20"
              indeterminate
              :value="20"
            />
            <v-icon class="ma-1">camera</v-icon>
            {{ $t("qr-code") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md4 lg4 pa-2 v-for="(tkt, i) in tkts" :key="i">
              <v-card>
                <v-toolbar dense flat height="30px" color="grey lighten-2">
                  {{ tkt.partName }}
                  <v-spacer></v-spacer>
                  <span>{{ tkt.color.toLowerCase() }}</span>
                  <v-spacer></v-spacer>
                  <!-- {{ tkt.label }} -->
                </v-toolbar>
                <table class="table" width="100%">
                  <tr>
                    <th>Bundle No</th>
                    <td class="primary--text">{{ tkt.bundle.count }}</td>
                    <th>Style Name</th>
                    <td>{{ item.styleName }}</td>
                  </tr>
                  <tr>
                    <th>Buyer</th>
                    <td>{{ item.buyer }}</td>
                    <th>Design</th>
                    <td>{{ item.design }}</td>
                  </tr>

                  <tr>
                    <th>Style #</th>
                    <td>{{ item.styleNo }}</td>
                    <th>Cut No</th>
                    <td>{{ item.cutNo }}</td>
                  </tr>

                  <tr>
                    <th>Size</th>
                    <td class="success--text">{{ tkt.label }}</td>
                    <th>Qty</th>
                    <td>{{ tkt.bundle.bq }}</td>
                  </tr>

                  <tr>
                    <th>Sr from</th>
                    <td>{{ tkt.bundle.from }}</td>

                    <th>Sr to</th>
                    <td>{{ tkt.bundle.to }}</td>
                  </tr>
                </table>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
    <v-navigation-drawer app right clipped width="200px">
      <v-container grid-list-xs>
        <h3 class="text-left grey--text">{{ $t("bundle-tickets") }}</h3>
        <v-list link dense rounded>
          <v-list-item-group v-model="item" color="primary">
            <template v-for="(item, i) in allTkts">
              <!-- if no children -->
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
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tempTkts: [],
      tkts: [],
      overlay: false,
      disableBtn: true,
      loading: false,
      loadingStatus: false,
      loadingProgress: true,
      noData: "Loading data",
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Bundle Ticket",
          disabled: false,
          to: "/app/laysheet"
        },
        {
          text: "Bundle Control Sheet",
          disabled: true
        }
      ]
    };
  },
  mounted() {
    this.disableBtn = this.tkts.length > 0 ? false : true;
    if (this.tkts.length > 0) {
      this.loadingProgress = false;
    } else {
      this.loadingProgress = true;
      setTimeout(
        () =>
          (this.noData = `No data available here. 
       You will be redireced to the Laysheet page. `),
        3000
      );
      setTimeout(() => 5000);
    }
  },
  updated() {
    if (this.tkts.length > 0) {
      this.loadingProgress = false;
    } else {
      this.loadingProgress = true;
      setTimeout(
        () =>
          (this.noData = `No data available here. 
       You will be redireced to the Laysheet page. `),
        3000
      );
      setTimeout(() => 5000);
    }
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
    this.paginate(0, 1);
  },

  methods: {
    paginate(start, last) {
      this.overlay = true;
      this.tkts = [];
      this.tempTkts = [];
      let tkts = this.allTkts;
      for (let i = start; i < last; i++) {
        for (let j = 0; j < this.parts.length; j++) {
          for (let k = 0; k < tkts[i].No.length; k++) {
            this.tempTkts.push({
              partName: this.parts[j],
              label: tkts[i].label,
              color: tkts[i].color,
              tkt: tkts[i].val,
              bundle: tkts[i].No[k]
            });
          }
        }
      }

      // for (let a = 0; a < this.color.length; a++) {
      for (let b = 0; b < this.tempTkts.length; b++) {
        this.tkts.push({
          color: this.tempTkts[b].color,
          partName: this.tempTkts[b].partName,
          label: this.tempTkts[b].label,
          tkt: this.tempTkts[b].tkt,
          bundle: this.tempTkts[b].bundle
        });
        // }
      }

      this.overlay = false;
    },
    validate(val) {
      return Number.isInteger(parseInt(val, 10)) ? parseInt(val) : 0;
    },
    generateQrcode() {
      this.loading = !this.loading;
      this.$router.push({ name: "qrcode" });
    },
    generateStatusQrcode() {
      this.loadingStatus = !this.loadingStatus;
      this.$router.push({ name: "status-qrcode" });
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
<template>
  <v-app>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout justify-center column>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 pa-1>
                  <b>SAM Code:</b>
                  {{item.samCode}}
                </v-flex>
                <v-flex xs12 pa-1>
                  <b>Style Name:</b>
                  {{item.styleName}}
                </v-flex>
                <v-flex xs12 pa-1>
                  <b>Style Number:</b>
                  {{ item.styleNumber }}
                </v-flex>
                <v-flex xs12 pa-1>
                  <b>SAM Value :</b>
                  {{ item.sam }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout column justify-center align-center ref="content">
                <qrcode-vue :value="JSON.stringify(value)" :size="size" level="H"></qrcode-vue>
              </v-layout>
            </v-card-text>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-btn
                  outlined
                  small
                  rounded
                  color="primary"
                  block
                  class="text-capitalize"
                  @click="print"
                >Print QR Code</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md4 lg4 pa-3>
          <div>
            <v-btn
              rounded
              outlined
              color="primary"
              class="text-capitalize"
              @click="$router.push({name:'update-sam',
              params:{ samId:item.id }})"
            >Edit SAM Info</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
import QrcodeVue from "qrcode.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  name: "machineInfo",
  mixins: [tableMixin],
  data() {
    return {
      resourceName: "SAM",
      item: {},
      filter: { include: ["operation"] },
      path: path.sam,
      resource: api,
      size: 100,
      value: {},
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "SAM Bank",
          disabled: false,
          to: "/app/sam/list"
        },
        {
          text: "SAM information",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { samId } = this.$route.params;
    this.item = await api.get(samId, path.sam, this.filter);
    this.value = {
      id: this.item.id,
      code: this.item.samCode,
      sam: this.item.sam
    };
  },
  components: {
    QrcodeVue
  },
  methods: {
    print() {
      const doc = new jsPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/png", 10);
        doc.addImage(img, "JPEG", 50, 50);
        doc.save("sam.pdf");
      });
    }
  }
};
</script>

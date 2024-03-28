<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'hr' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <span class="mx-2 info--text"
            >{{ items.length }} {{ $t("qr-code") }}</span
          >
          <v-btn color="primary" small @click="print">
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="25"
              :value="10"
            ></v-progress-circular>
            <v-icon class="mx-1">print</v-icon>
            {{ $t("print") }}
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-row ref="content">
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-card
                  v-for="(item, i) in items"
                  :key="i"
                  class="ma-3 primary"
                >
                  <v-toolbar dense flat height="20px" color="grey lighten-2">{{
                    item.idno
                  }}</v-toolbar>
                  <div class="pa-1 text-center white">
                    <qrcode-vue
                      :value="JSON.stringify(item.qr)"
                      :size="size"
                      level="H"
                    />
                  </div>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path, API_ROOT } from "@/api";

import QrcodeVue from "qrcode.vue";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
export default {
  data() {
    return {
      loading: false,
      items: []
    };
  },
  components: {
    QrcodeVue
  },
  async created() {
    this.items = (await api.all(path.employee)).rows.map(x => {
      return {
        idno: x.idno,
        qr: ["emp", x.id, x.fullName, x.idno, "employee"]
      };
    });
  },
  methods: {
    async print() {
      await api
        .create(
          {
            value: this.items,
            name: "employee"
          },
          "/Employees/printqrcode"
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
      // this.loading = true;
      // const doc = new jsPDF();
      // var canvasElement = document.createElement("canvas");
      // html2canvas(this.$refs.content, { canvas: canvasElement })
      //   .then(function(canvas) {
      //     const img = canvas.toDataURL("image/png", 10);
      //     doc.addImage(img, "JPEG", 0, 0);
      //     doc.save("employees.pdf");
      //   })
      //   .then(() => {
      //     this.loading = false;
      //   });
    }
  }
};
</script>
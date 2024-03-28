<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container grid-list-xs>
      {{item}}
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="item.date"
                          label="Select Date"
                          readonly
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="item.date" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <h1>{{exp}}</h1>
                </v-layout>
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md4 lg4 pa-3>
                    <v-btn
                      color="primary"
                      outlined
                      rounded
                      block
                      class="text-capitalize"
                      @click="calculateExp"
                    >Save Info</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      exp: "",
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
          text: "Register SAM",
          disabled: true
        }
      ],
      employee: []
    };
  },
  created() {},
  methods: {
    calculateExp() {
      // ===================Joining Date===================================
      let jod = new Date(this.item.date);
      let jd = jod.getDate();
      let jm = jod.getMonth() + 1;
      let jy = jod.getFullYear();
      // ===================Current Date===================================
      let date = new Date();
      let cd = date.getDate();
      let cm = date.getMonth() + 1;
      let cy = date.getFullYear();
      let m, y, d;
      y = cy - jy;
      if (cm >= jm) m = cm - jm;
      else {
        y--;
        m = 12 + cm - jm;
      }

      if (cd >= jd) d = cd - jd;
      else {
        m--;
        d = 31 + cd - jd;

        if (m < 0) {
          m = 11;
          y--;
        }
      }
      this.exp = d + "-" + m + "-" + y;
    },
    save() {
      this.item.value = "P";
      let dat = new Date(this.item.date);

      this.item.month = dat.getMonth() + 1;
      this.item.year = dat.getFullYear();
      api
        .create(this.item, path.attendance)
        .then(() => {
          this.item = {};
          this.$notify({
            type: "success",
            title: "Register",
            message: `${this.$t("SAM")} ${this.$t(
              " information is successfully registered"
            )}`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });
    }
  }
};
</script>

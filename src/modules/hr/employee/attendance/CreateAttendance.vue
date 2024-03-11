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
            <v-icon class="mx-1">arrow_back</v-icon>Employees
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            rounded
            small
            class="text-capitalize"
            @click="$router.push({ name: 'exp-calc' })"
            >Calculate Expe</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md6 lg6 pa-3 v-if="errMessage != ''">
                <v-alert type="error">{{ errMessage }}</v-alert>
              </v-flex>
            </v-layout>
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
                      v-model="item.dateAttended"
                      label="Select Date"
                      readonly
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.date"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-3>
                <v-autocomplete
                  label="Select employee"
                  v-model="item.employeeId"
                  :items="employee"
                  item-text="idno"
                  item-value="id"
                  outlined
                  dense
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-3>
                <v-btn
                  color="primary"
                  outlined
                  rounded
                  block
                  class="text-capitalize"
                  @click="save"
                  >Save Info</v-btn
                >
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import { mapActions } from "vuex";
export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      operation: [],
      errMessage: "",
      isLoading: false,
      path: path.sam,
      isModalVisible: false,
      dialog: false,
      idDone: false,
      samC: [],

      employee: []
    };
  },
  async created() {
    this.employee = (await api.all(path.employee)).rows;
  },
  methods: {
    ...mapActions("inventory", ["postData"]),
    save() {
      this.item.value = "P";
      let dat = new Date(this.item.date);

      this.item.month = dat.getMonth() + 1;
      this.item.year = dat.getFullYear();
      api
        .create(this.item, path.attendance)
        .then(() => {
          this.errMessage = "";
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

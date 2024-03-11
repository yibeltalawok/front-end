<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({name:'machine'})"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{$t('go_back')}}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-1 v-if="errMessage != ''">
                <v-alert type="error" dark dismissible>
                  {{
                  errMessage
                  }}
                </v-alert>
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.serialNumber"
                  :error-messages="errors.collect('serialNumber')"
                  :label="$t('sr')"
                  name="serialNumber"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.make"
                  :error-messages="errors.collect('make')"
                  :label="$t('make')"
                  name="make"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.modelNumber"
                  :error-messages="errors.collect('modelNumber')"
                  :label="$t('machine-model-number')"
                  name="modelNumber"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md10 lg10 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.description"
                  :error-messages="errors.collect('description')"
                  :label="$t('description')"
                  name="description"
                  outlined
                  dense
                />
                <input type="hidden" v-model="item.status" value="0" />
              </v-flex>
              <v-flex xs12 sm12 md6 lg2 pa-2>
                <v-text-field
                  v-model="color"
                  v-mask="mask"
                  hide-details
                  class="ma-0 pa-0"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker v-model="color" flat />
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-1></v-flex>
            </v-layout>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md5 lg5 pa-2>
                <v-btn
                  outlined
                  color="primary"
                  rounded
                  class="text-capitalize"
                  block
                  @click="save"
                >{{$t('save')}}</v-btn>
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

export default {
  name: "RegisterMachine",
  mixins: [formErrorHandling],

  data() {
    return {
      //color picker
      color: "#9FC5FCFF",
      mask: "!#XXXXXXXX",
      menu: false,
      //color picker
      stock: [],
      item: {},
      errMessage: "",
      path: path.machine,
      isLoading: false
    };
  },
  computed: {
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out"
      };
    }
  },
  async created() {
    this.item.stock = this.stock;
  },
  methods: {
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.errorMessage = null;
          this.filter = {
            where: { serialNumber: this.item.serialNumber }
          };
          this.checkSerialNumberExists(this.color);
        }
      });
    },

    async checkSerialNumberExists(color) {
      this.isSerialExist = (await api.all(this.path, this.filter)).rows;

      if (this.isSerialExist.length != 0) {
        this.errMessage = "Machine serial number is used by other machine!";
      } else {
        this.RegisterMachine(color);
      }
    },
    RegisterMachine(color) {
      this.item.color = color;
      api
        .create(this.item, path.machine)
        .then(() => {
          this.errMessage = "";
          this.item = {};
          this.$notify({
            type: "success",
            title: "Register",
            message: `${this.$t("Machine")} ${this.$t(
              "Machine successfully registered!"
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

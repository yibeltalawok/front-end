<template>
  <v-container grid-list-xs>
    <v-card outlined style="border-radius:12px">
      <v-toolbar dense flat>
        <v-btn text color="primary" class="text-capitalize" @click="$router.push({name:'machine'})">
          <v-icon class="mx-1">arrow_back</v-icon>
          {{$t('go_back')}}
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-form @submit.prevent="save">
          <form-error-messages :messages="errorMessage" />
          <v-layout row wrap justify-center>
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
      color: "#1976D2FF",
      mask: "!#XXXXXXXX",
      menu: false,
      //color picker
      stock: [],
      item: {},
      date: new Date().toISOString().substr(0, 10),
      pickDate: false,
      openingStock: 0,
      assigned: 0,
      purchased: 0,
      closingStock: 0,
      errMessage: "",
      path: path.machine,
      isLoading: false,
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Machine",
          disabled: false,
          to: "/app/machine/list"
        },
        {
          text: "Update Machine Info",
          disabled: true
        }
      ]
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
    const { machineId } = this.$route.params;
    this.item = await api.get(machineId, this.path);
    this.openingStock = this.lastClosingStock(this.item.stock);
    this.computeClosingStock();
  },
  methods: {
    save() {
      // this.addToStock();
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.color = this.color;
          api
            .update(this.item, this.path)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Update Information",
                message: `${this.$t("Machine")} ${this.$t(
                  "information updated successfully."
                )}`
              });
              this.$router.push({ name: "machine" });
            })
            .catch(err => {
              this.showErrors(err);
            });
        }
      });
    },
    
    // addToStock() {
    //   const check = this.dateExist(this.item.stock, this.date);
    //   if (check == false) {
    //     this.item.stock.push({
    //       day: this.date,
    //       openingStock: this.openingStock,
    //       assigned: this.assigned,
    //       purchased: this.purchased,
    //       closingStock: this.closingStock
    //     });
    //   } else {
    //     this.$notify({
    //       type: "danger",
    //       title: "Stock Information",
    //       message: `${this.$t("Date")} ${this.$t("Already exist.")}`
    //     });
    //   }
    // },


    dateExist(stocks, date) {
      var exist = false;
      if (stocks.length == 0) {
        exist = false;
      } else {
        for (let i = 0; i < stocks.length; i++) {
          if (new Date(stocks[i].day).toISOString().substr(0, 10) == date) {
            exist = true;
            break;
          }
        }
      }
      return exist;
    },
    lastClosingStock(stocks) {
      const last = stocks.length - 1;
      const closingStock = stocks[last].closingStock;
      return closingStock;
    },
    computeClosingStock() {
      this.closingStock = this.openingStock;
    },
    computeOpeningStock(value) {
      this.closingStock = value;
    },
    computeAssigned(value) {
      this.closingStock = this.openingStock - value;
    },
    computePurchased(value) {
      var base = this.openingStock - this.assigned;
      this.closingStock = parseInt(base, 10) + parseInt(value, 10);
    }
  }
};
</script>

<template>
  <div>
    <v-container grid-list-xs>
      <v-toolbar dense flat>
        <v-btn
          text
          color="primary"
          class="text-capitalize"
          @click="$router.push({ name: 'slabe-list' })"
        >
          <v-icon>arrow_back</v-icon>
          {{ $t("go_back") }}
        </v-btn>
      </v-toolbar>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md4 lg4 pa-1 v-if="errMessage != ''">
                    <v-alert type="error" dark dismissible>
                      {{ errMessage }}
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.from"
                      disabled="true"
                      :error-messages="errors.collect('from')"
                      :label="$t('from')"
                      name="from"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.to"
                      :error-messages="errors.collect('to')"
                      :label="$t('to')"
                      name="to"
                      outlined
                      dense
                      type="number"
                      max="100"
                      :rules="numberRules"
                      @input="checkTo(item.to)"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.percent"
                      :error-messages="errors.collect('Percent')"
                      :label="$t('percent')"
                      name="percent"
                      outlined
                      dense
                      type="number"
                      @input="checkPercent(item.percent)"
                    />
                  </v-flex>
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
                      >{{ $t("save") }}</v-btn
                    >
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
  name: "RegisterSlabe",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      slabe: [],
      errMessage: "",
      totalPercents: 0,
      path: path.slabe,
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Incentive",
          disabled: true
        },
        {
          text: "slabe",
          disabled: false,
          to: "/app/incentive/slabe-list"
        },
        {
          text: "Register Slabe",
          disabled: true
        }
      ],
      numberRules: [
        v =>
          v <= this.maxLength ||
          `${this.errorName} must be less than ${this.maxLength} `,
        v =>
          v >= this.minLength ||
          `${this.errorName} must be greater than ${this.minLength} `
      ]
    };
  },
  async created() {
    //  this.item.from = 0;
    this.slabe = (await api.all(path.slabe)).rows;
    if (this.slabe.length == 0) {
      this.item.from = 0;
      //alert("0");
    } else {
      this.getFrom();
    }
  },
  methods: {
    getFrom() {
      for (const iterator of this.slabe) {
        this.item.from = parseFloat(iterator.to) + 1;
        this.totalPercents = this.totalPercents + parseFloat(iterator.percent);
      }
    },
    checkPercent() {
      this.errorName = "Input";
      this.minLength = 0;
      this.maxLength = 100 - parseFloat(this.totalPercents);
    },
    checkTo() {
      this.errorName = "Input";
      this.minLength = parseFloat(this.item.from) + 1;
      this.maxLength = 100;
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          api
            .create(this.item, path.slabe)
            .then(() => {
              this.errMessage = "";
              this.item = {};
              this.$notify({
                type: "success",
                title: "Register Slabe",
                message: `${this.$t("Incentive ")} ${this.$t(
                  "Slabe successfully registered!"
                )}`
              });
              this.$router.push({ name: "slabe-list" });
            })
            .catch(err => {
              this.showErrors(err);
            });
        }
      });
    }
  }
};
</script>

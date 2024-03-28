<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined>
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
        <v-divider></v-divider>
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
      </v-card>
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
          text: "Update Slabe",
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
    const { slabeId } = this.$route.params;
    this.item = await api.get(slabeId, this.path);
  },
  methods: {
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          api
            .update(this.item, this.path)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Update Slabe ",
                message: `Slabe information saved successfully.`
              });
              this.$router.push({
                name: "slabe-list"
              });
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

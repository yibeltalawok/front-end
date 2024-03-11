<template>
  <v-app>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-combobox
                      :items="sams"
                      v-model="item.samCode"
                      label="Select SAM"
                      name="sam"
                      item-text="title"
                      dense
                      outlined
                      :filter="filter"
                      :hide-no-data="!search"
                      :search-input.sync="search"
                      hide-selected
                      @input="selectedSam"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      v-model="item.sam"
                      :disabled="disabledSam"
                      outlined
                      dense
                      flat
                      label="SAM"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.styleName"
                      :error-messages="errors.collect('styleName')"
                      :label="$t('Style Description')"
                      name="styleName"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.styleNumber"
                      :error-messages="errors.collect('styleNumber')"
                      :label="$t('Style Number')"
                      name="styleNumber"
                      outlined
                      dense
                      type="number"
                      min="1"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md5 lg5 pa-3>
                    <v-btn
                      outlined
                      rounded
                      block
                      color="primary"
                      class="text-capitalize"
                      @click="save"
                    >Save Changes</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      sams: [],
      code: "",
      sam: "",
      disabledSam: false,

      item: {},
      totalSAM: 0,
      operation: [],
      isLoading: false,
      isModalVisible: false,
      dialog: false,
      idDone: false,
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
          text: "Update SAM Bank",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { samId } = this.$route.params;

    this.item = await api.get(samId, path.sam);
    this.operation = (await api.all(path.operation)).rows;

    //fetch SAM data
    this.sams = (await api.all(path.operation)).rows.map(x => {
      return {
        id: x.id,
        code: x.code,
        sam: x.sam,
        title: x.code + " (" + x.sam + ")"
      };
    });
  },
  methods: {
    //filter sam and sam code values
    async selectedSam(sam) {
      if (sam.id == null) {
        this.disabledSam = false;
        this.item.sam = this.item.sam;
        this.item.samCode = this.item.samCode;
      } else {
        this.disabledSam = true;
        this.item.sam = sam.sam;
        this.item.samCode = sam.code;
      }
    },

    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.errorMessage = null;
          api
            .update(this.item, path.sam)
            .then(() => {
              this.item = {};
              this.$notify({
                type: "success",
                title: "Update SAM",
                message: `${this.$t("SAM")} ${this.$t(
                  "information  successfully changed"
                )}`
              });
              this.$router.push({ name: "sam-list" });
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

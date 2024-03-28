<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />

                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      :label="$t('description')"
                      v-model="item.desc"
                      name="description"
                      :error-messages="errors.collect('workhour description')"
                      outlined
                      dense
                    />
                  </v-flex>
                  <!-- Day Selector -->
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-select
                      :items="days"
                      v-validate="'required'"
                      :label="$t('day')"
                      prepend-icon="date_range"
                      v-model="item.day"
                      name="day"
                      :error-messages="errors.collect('day')"
                      outlined
                      dense
                    />
                  </v-flex>
                  <!-- Time Picker - From -->
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-menu
                      v-model="start"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="item.from"
                          :label="$t('from')"
                          prepend-icon="access_time"
                          v-validate="'required'"
                          readonly
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="start"
                        v-model="item.from"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <!-- Time Picker - TO -->
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-menu
                      v-model="end"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="item.to"
                          :label="$t('to')"
                          prepend-icon="access_time"
                          v-validate="'required'"
                          readonly
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="end"
                        v-model="item.to"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12></v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <div class="text-center">
                      <v-btn
                        rounded
                        block
                        outlined
                        color="primary"
                        @click="save"
                        class="text-capitalize"
                        >{{ $t("save") }}</v-btn
                      >
                    </div>
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
import { api, path } from "@/api/";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      item: {},
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      start: "",
      end: "",

      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Setting",
          disabled: true
        },
        {
          text: "Working Hour",
          disabled: false,
          to: "/app/workhour/list"
        },
        {
          text: "Working Hour Update",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { workhourId } = this.$route.params;

    this.item = await api.get(workhourId, path.workHour);
  },
  methods: {
    ...mapActions("inventory", ["updateData"]),
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.errorMessage = null;
        try {
          this.updateData([this.item, path.workHour]).then(() => {
            this.$notify({
              type: "primary",
              title: this.$t("primary"),
              text: `Work Hour updated successfully`
            });
            this.$router.push({ name: "workhour-list" });
          });
        } catch (err) {
          if (err.statusCode === 422) {
            const { messages } = err.details;
            this.errorMessage = messages;
          }
        }
      }
    }
  }
};
</script>
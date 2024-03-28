<template>
  <div>
    <v-btn text small outlined color="green" @click="addNewDialog = true"
      >Add New</v-btn
    >
    <v-dialog v-model="addNewDialog" persistent max-width="650px">
      <v-card>
        <v-app-bar color="amber">
          <v-card-subtitle>Add New Cost Per Minute </v-card-subtitle>
        </v-app-bar>
        <v-card-text style="margin-top: 5%">
          <v-containor>
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="monthYear"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      flat
                      v-on="on"
                      v-bind="attrs"
                      v-model="monthYear"
                      label="Start and End Date"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="amber"
                    v-model="monthYear"
                    type="month"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.menu.save(monthYear),
                          getCostSummaryOfSelectedMonth()
                      "
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6"> Total Cost : {{}} </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  max="31"
                  type="number"
                  label="Working Days"
                  v-model="workingDay"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  type="number"
                  label="Minutes Per Day"
                  v-model="inutesPerDay"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="8"></v-col>
              <v-col cols="12" sm="2"
                ><v-btn small outlined color="red" @click="addNewDialog = fasle"
                  >Cancel</v-btn
                ></v-col
              >
              <v-col
                ><v-btn
                  small
                  outlined
                  cols="12"
                  sm="2"
                  color="green"
                  @click="addNewDialogProcessing"
                  >Save</v-btn
                ></v-col
              >
            </v-row>
          </v-containor>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      monthYear: new Date().toISOString().substr(0, 7),
      addNewDialog: false,
    };
  },
  methods: {
    async getCostSummaryOfSelectedMonth() {
      alert("asdfghjkl;");
    },
    async addNewDialogProcessing() {
      alert("Save button clicked....");
    },
  },
};
</script>

<style>
</style>
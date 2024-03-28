<template>
  <div style="margin-right: 15px">
    <v-btn small outlined color="#255325" @click="trfdhuDialog = true"
      >RFT and DHU</v-btn
    >
    <v-dialog v-model="trfdhuDialog" persistent max-width="700px">
      <v-card
        ><v-app-bar color="amber">
          <v-card-subtitle>RFT and DHU </v-card-subtitle>
        </v-app-bar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" justify="center"
                ><v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date"
                    ><v-spacer />
                    <v-btn text color="red" @click="menu = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn
                      text
                      color="green"
                      @click="$refs.menu.save(date), fetchExistingData()"
                      >Ok</v-btn
                    >
                  </v-date-picker>
                </v-menu></v-col
              >
            </v-row>
            <h3 style="color: green">Old ...</h3>
            <div v-if="loadExistData.length > 0">
              <v-data-table 
                :headers="header"
                dense
                :items="loadExistData">
              </v-data-table>
            </div>
            <div v-else>
              <h3 style="margin-left: 30%; color: lightblue">
                No old data exist....
              </h3>
            </div>

            <h3 style="color: green">New ...</h3>
            <div v-if="loadnewDataToInsert.length > 0">
              <v-data-table 
                :headers="header"
                dense
                :items="loadnewDataToInsert">
              </v-data-table>
            </div>
            <div v-else>
              <h3 style="margin-left: 30%; color: red">
                No new data exist....
              </h3>
              <br />
              <br />
            </div>

            <!-- Used to save if its new and update if old(have existing data) using if else button will be visable-->
            <!-- Also all will be invisabe no data exist @ all-->
            <v-row>
              <v-col cols="12" sm="10"></v-col>
              <v-col v-if="loadExistData.length > 0" cols="12" sm="2"
                ><v-btn text color="amber" @click="saveData()"
                  >Update</v-btn
                ></v-col
              >
              <v-col
                v-else-if="
                  loadExistData.length === 0 && loadnewDataToInsert.length > 0
                "
                cols="12"
                sm="2"
                ><v-btn text color="green" @click="saveData()"
                  >Save</v-btn
                ></v-col
              >
              <v-col v-else cols="12" sm="2">
                <v-btn text color="red" @click="trfdhuDialog = false"
                  >Cancel</v-btn
                ></v-col
              >
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState("rftanddhu", ["loadExistData", "loadnewDataToInsert"]),
  },
  data() {
    return {
      header: [
        { text: "Line", value: "line" },
        { text: "Garment checked", value: "totalGarmentChecked" },
        { text: "Defect", value: "totalDefect" },
        { text: "FTP", value: "ftp" },
        { text: "RFT", value: "rft" },
        { text: "DHU", value: "dhu" }
      ],
      trfdhuDialog: false,

      //date picker in dialog add new / update RTF and DHU
      date: new Date().toISOString().substr(0, 10),
      menu: false,
    };
  },
  created() {
    this.fetchExistingData();
  },
  methods: {
    ...mapActions("rftanddhu", [
      "getloadExistData",
      "getloadnewDataToInsert",
      "saveNewDataTorftanddhu",
    ]),

    async fetchExistingData() {
      this.getloadExistData(this.date);
      this.getloadnewDataToInsert(this.date);
    },
    async saveData() {
      this.loadnewDataToInsert.push(this.date);
      this.saveNewDataTorftanddhu(this.loadnewDataToInsert);
      this.trfdhuDialog = false;
      this.date = new Date().toISOString().substr(0, 10);
    },
  },
};
</script>

<style>
</style>
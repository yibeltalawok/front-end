<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'ob' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md3 lg3 pa-2>
              <v-card height="100%" outlined>
                <v-toolbar dense flat>
                  <v-btn
                    color="purple white--text"
                    fab
                    small
                    @click="isEditing = !isEditing"
                  >
                    <v-icon v-if="isEditing">close</v-icon>
                    <v-icon v-else>edit</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small color="primary" @click="save">{{
                    $t("save")
                  }}</v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    :disabled="!isEditing"
                    dense
                    v-model="item.product"
                    :label="$t('product')"
                  />
                  <v-text-field
                    :disabled="!isEditing"
                    dense
                    v-model="item.outputPiecesPerDay"
                    :label="$t('outputPiecesPerDay')"
                  />
                  <v-text-field
                    :disabled="!isEditing"
                    dense
                    v-model="item.targetEfficiency"
                    :label="$t('targetEfficiency')"
                  />

                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="item.lastDateOfRevision"
                        :label="$t('lastDateOfRevision')"
                        v-on="on"
                        dense
                        :disabled="!isEditing"
                      />
                    </template>
                    <v-date-picker v-model="pickedDate" @input="pickDate" />
                  </v-menu>

                  <v-text-field
                    :disabled="!isEditing"
                    dense
                    v-model="item.minutesPerDay"
                    :label="$t('minutesPerDay')"
                  />
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md7 lg7 pa-2>
              <v-card outlined height="100%">
                <v-card-text>
                  <p class="info--text text-center">
                    {{ $t("style-detail-title") }}
                  </p>
                  <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md6 lg6 pa-2>
                      <p>
                        <b>{{ $t("output-at-100%-efficiency") }}:</b>
                        <span class="info--text mx-2">{{
                          item.outputAtFulEfficiency
                        }}</span>
                      </p>

                      <p>
                        <b>{{ $t("line-efficiency-(balancing-plan)") }}:</b>
                        <span class="info--text mx-2"
                          >{{ item.lineEfficiency }} %</span
                        >
                      </p>
                      <p>
                        <b>{{ $t("number-of-workplaces") }}:</b>
                        <span class="info--text mx-2">{{
                          item.noOfWorkplaces
                        }}</span>
                      </p>
                      <p>
                        <b
                          >{{
                            $t("number-of-inspection-stations-required")
                          }}:</b
                        >
                        <span class="info--text mx-2">{{
                          item.noOfInspectionStations
                        }}</span>
                      </p>
                      <p>
                        <b>{{ $t("total-manpower-alloted") }}:</b>
                        <span class="info--text mx-2">{{
                          item.totalManPowerAlloted
                        }}</span>
                      </p>
                      <p>
                        <b>{{ $t("number-of-sewing-operators") }}:</b>
                        <span class="info--text mx-2">{{
                          item.noOfSewingOperators
                        }}</span>
                      </p>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6 pa-2>
                      <p>
                        <b>{{ $t("number-of-sewing-machines-required") }}:</b>
                        <span class="info--text mx-2">{{
                          item.noOfSewingMachine
                        }}</span>
                      </p>
                      <p>
                        <b
                          >{{
                            $t("number-of-helper-workstations-required")
                          }}:</b
                        >
                        <span class="info--text mx-2">{{
                          item.noOfHelperWorkstations
                        }}</span>
                      </p>
                      <p>
                        <b>{{ $t("number-of-ironer-stations-required") }}:</b>
                        <span class="info--text mx-2">{{
                          item.noOfIronesStations
                        }}</span>
                      </p>
                      <p>
                        <b>{{ $t("total-sewing-SAMs") }}:</b>
                        <span class="info--text mx-2">{{
                          item.totalSewingSam
                        }}</span>
                      </p>
                      <p>
                        <b>{{ $t("total-SAMs") }}:</b>
                        <span class="info--text mx-2">{{ item.totalSam }}</span>
                      </p>
                      <p>
                        <b>{{ $t("pieces-per-operation-per-day") }}:</b>
                        <span class="info--text mx-2">{{
                          item.piecesPerOprPerDay
                        }}</span>
                      </p>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 pa-2>
              <v-card outlined>
                <v-card-text>
                  <v-layout column justify-center align-center>
                    <div>
                      <img
                        :src="pictureUrl()"
                        :alt="$t('picture')"
                        height="130px"
                        width="100%"
                      />
                    </div>

                    <input
                      type="file"
                      @change="onFileSelected"
                      style="display:none"
                      ref="fileInput"
                    />
                    <v-btn
                      small
                      text
                      class="text-capitalize"
                      @click="$refs.fileInput.click()"
                    >
                      <v-btn icon>
                        <v-icon>attachment</v-icon>
                      </v-btn>
                      {{ $t("upload") }}
                    </v-btn>
                    <br />
                    <em
                      class="text-capitalize primary--text"
                      v-if="done == true"
                    >
                      <v-icon>done</v-icon>
                      {{ $t("attached") }}
                    </em>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path, API_ROOT } from "@/api";
export default {
  data() {
    return {
      item: {},

      menu: false,
      pickedDate: null,

      operations: [],
      isEditing: null,
      done: false,
      selectedFile: null
    };
  },
  async created() {
    const { styleId } = this.$route.params;
    let filter = {
      include: ["order"]
    };
    this.item = await api.get(styleId, path.oprBltn, filter);
    this.item.lastDateOfRevision = new Date(
      this.item.lastDateOfRevision
    ).toLocaleDateString("en-US");
    this.calculateValues();

    this.item.product = this.item.order.styleName;
  },
  methods: {
    pickDate(val) {
      this.menu = false;
      this.item.lastDateOfRevision = val;
    },
    async calculateValues() {
      const { styleId } = this.$route.params;
      let f = {
        include: ["machine", "oprBltns"],
        where: {
          oprBltnId: styleId
        }
      };
      // fetch operations
      let operations = (await api.all(path.operation, f)).rows;

      //map targeted attribute value
      this.operations = operations.map(x => {
        return {
          sr: x.sr,
          operation: x.operationName,
          section: x.section,
          machine: x.machine.name,
          category: x.category,
          code: x.code,
          sam: x.sam,
          sewingSam: x.category == "O" ? x.sam : 0,
          outputPerHour: x.outputPerHour,
          mpRqrd: x.mpRqrd,
          mcAllocated: x.mcAllocated != "" ? x.mcAllocated : 0,
          mpAllocated: x.mpAllocated,
          sewingOprAlltd: x.sewingOprAlltd,
          helper: x.category == "H" ? x.mpAllocated : 0,
          insp: x.category == "C" ? x.mpAllocated : 0,
          ironer: x.category == "I" ? x.mpAllocated : 0,
          remark: x.remark
        };
      });
      //total man power allocated
      let totalMpAlloted = this.operations.reduce(
        (acc, mp) => acc + parseFloat(mp.mpAllocated),
        0
      );
      this.item.totalManPowerAlloted = totalMpAlloted.toFixed(0);
      //total Sewing SAMs
      let totalSewingSams = this.operations.reduce(
        (acc, ss) => acc + parseFloat(ss.sewingSam),
        0
      );

      this.item.totalSewingSam = totalSewingSams.toFixed(2);

      //total SAMs
      let totalSams = this.operations.reduce(
        (acc, sam) => acc + parseFloat(sam.sam),
        0
      );
      this.item.totalSam = totalSams.toFixed(2);

      //output at 100% efficiency
      let val = (
        (parseFloat(this.item.minutesPerDay) *
          parseFloat(this.item.totalManPowerAlloted)) /
        parseFloat(this.item.totalSam)
      ).toFixed(2);

      this.item.outputAtFulEfficiency = val > 0 ? val : "Un known";
      //number of workplaces
      let noOfWorkplaces = totalMpAlloted > 0 ? totalMpAlloted : 1;
      this.item.noOfWorkplaces = noOfWorkplaces.toFixed(2);

      //line efficiency
      this.item.lineEfficiency = (
        ((parseFloat(this.item.outputPiecesPerDay) *
          parseFloat(this.item.totalSam)) /
          (parseFloat(totalMpAlloted) * parseFloat(this.item.minutesPerDay))) *
        100
      ).toFixed(2);
      //Number of inspection stations required
      this.item.noOfInspectionStations = this.operations
        .reduce((acc, i) => acc + parseFloat(i.insp), 0)
        .toFixed(0);
      this.item.noOfIronesStations = this.operations
        .reduce((acc, i) => acc + parseFloat(i.ironer), 0)
        .toFixed(0);

      //total sewing operators
      this.item.noOfSewingOperators = this.operations
        .reduce((acc, so) => acc + parseFloat(so.sewingOprAlltd), 0)
        .toFixed(0);
      //no of sewing machine
      this.item.noOfSewingMachine = this.operations
        .reduce((acc, sm) => acc + parseFloat(sm.mcAllocated), 0)
        .toFixed(0);

      // total number of helper workstations
      this.item.noOfHelperWorkstations = this.operations
        .reduce((acc, hw) => acc + parseFloat(hw.helper), 0)
        .toFixed(0);
      // pieces per operation per day
      this.item.piecesPerOprPerDay =
        totalMpAlloted > 0
          ? (this.item.outputPiecesPerDay / totalMpAlloted).toFixed(2)
          : "Un known";
    },
    save() {
      api
        .update(this.item, path.oprBltn)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Operation bulletin",
            message: `Operation bulletin update successfully.`
          });
          this.$router.push({
            name: "ob"
          });
        })
        .catch(err => {
          this.showErrors(err);
        });
    },
    pictureUrl() {
      try {
        return (
          API_ROOT + "/containers" + "/operation" + "/download/" + this.item.id
        );
      } catch (error) {
        return "no image";
      }
    },
    onFileSelected() {
      this.done = true;
      this.selectedFile = event.target.files[0];
      let fileName = this.item.id;
      this.checkImage(this.selectedFile, fileName);
    },
    async checkImage(file) {
      await api
        .checkFile("operation", this.item.id, path.container)
        .then(() => this.changePicture(file))
        .catch(() => this.uploadPicture(file));
    },
    async uploadPicture(file) {
      const formData = new FormData();
      formData.append("Image", file, this.item.id);
      await api
        .upload("operation", formData, path.container)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Upload picture",
            message: `picture uploaded.`
          });
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            title: "Failure",
            message: `${this.$t("picture not uploaded right now.")} ${this.$t(
              "Try later."
            )}`
          });
        });
    },

    async changePicture(file) {
      await api
        .removeFile("operation", this.item.id, path.container)
        .then(() => {
          const formData = new FormData();
          formData.append("Image", file, this.item.id);
          api
            .upload("operation", formData, path.container)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Picture update",
                message: `Picture changed successfully.`
              });
            })
            .catch(() => {
              this.$notify({
                type: "danger",
                title: "Failure",
                message: `${this.$t(
                  "picture not changed right now."
                )} ${this.$t("Try later.")}`
              });
            });
        })
        .catch(() => {
          this.$notify({
            type: "red",
            title: this.$t("Failure"),
            message: `${this.$t("picture not changed right now.")} ${this.$t(
              "Try later."
            )}`
          });
        });
    }
  }
};
</script>
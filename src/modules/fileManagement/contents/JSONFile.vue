<template>
  <div>
    <v-card outlined style="border-radius:12px">
      <v-toolbar flat dense>
        {{ $t("Pproduction-and-lost-time-information") }}
        <v-spacer></v-spacer>
        <v-btn
          small
          color="primary"
          @click="$router.push({ name: 'order-status-scanned' })"
          >{{ $t("scanned-order-status") }}</v-btn
        >
        <v-spacer />
        <v-btn
          small
          color="primary"
          @click="$router.push({ name: 'order-status-json' })"
          >{{ $t("order-status") }}</v-btn
        >
      </v-toolbar>
      <v-spacer />
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md4 lg4 pa-3>
          <input
            type="file"
            @change="onJsonFileSelected"
            style="display:none"
            ref="fileInput"
          />
          <v-btn text class="text-lowercase" @click="$refs.fileInput.click()">
            <v-btn text> <v-icon>attachment</v-icon> </v-btn
            >{{ $t("browse-from-your-computer") }}.
          </v-btn>
          <br />
          <em class="text-capitalize success--text" v-if="done">
            <div class="text-center">
              <v-icon color="success">done</v-icon
              >{{ $t("json-file-browsed") }}.
            </div>
          </em>
        </v-flex>

        <v-flex xs12 v-if="done">
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 pa-2 v-if="done">
          <h3 class="text-center">{{ "file-name" }}: {{ jsonFileName }}</h3>
          <h4 class="text-center">{{ "file-type" }}: {{ fileType }}</h4>
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-2 v-for="(item, i) in contents" :key="i">
          <v-card v-if="done" flat>
            <v-list dense disabled>
              <v-subheader class="info--text"
                >{{ $t("production") }}: {{ i + 1 }}</v-subheader
              >
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>done</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >{{ $t("lost_time") }}: {{ item.lostTime }}
                      {{ $t("minutes") }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>done</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t("lost-time-reason") }}:
                      {{ item.lostTimeReason }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>done</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >{{ $t("pieces-produced") }}:
                      {{ item.amountDone }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12 pa-2 v-if="done">
          <div class="my-3 text-center">
            <v-btn small outlined rounded color="primary" @click="saveData">{{
              $t("save")
            }}</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { api, path } from "@/api";

export default {
  data() {
    return {
      done: false,
      jsonFileName: null,
      fileType: null,
      contents: [],
      content: {}
    };
  },
  methods: {
    onJsonFileSelected(event) {
      let file = event.target.files[0];

      //check file validatity and file type
      let isValidFile =
        !file || file.type !== "application/json" ? false : true;

      isValidFile ? this.processFile(file) : this.throwError();
    },
    processFile(file) {
      this.fileType = "json";
      this.jsonFileName = file.name;
      this.done = true;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        let text = evt.target.result;
        try {
          this.content = `[${text}]`;
          let temp = this.content.toString().replace(",]", "]");
          var arr = JSON.parse(temp);
          this.contents = arr;
        } catch (e) {
          alert("Sorry, your file doesn't appear to be valid JSON data.");
        }
      };

      reader.onerror = evt => {
        alert(evt);
      };
    },
    throwError() {
      this.done = false;
      this.$notify({
        type: "danger",
        title: "File type error",
        message: "This is not JSON file. Try again with a right json file."
      });
    },
    saveData() {
      this.contents.map(x => this.submitValue(x));
    },
    async submitValue(item) {
      //get Job the employee has done
      let filter = {
        where: {
          employeeId: item.employeeId
        }
      };
      let job = (await api.all(path.job, filter)).rows;

      if (job.length > 0) {
        let jobsId = job.pop().id;
        this.updateJob(jobsId, item);
        this.saveLostTime(item, jobsId);
      } else {
        this.$notify({
          type: "danger",
          title: "Job Error",
          message: `You are trying to manage a job that is not assigned to the target Operator.`
        });
      }
    },
    async updateJob(id, item) {
      let val = {
        id: id,
        amountDone: item.amountDone
      };
      let filter = {
        where: {
          employeeId: item.employeeId
        }
      };
      await api
        .update(val, path.job, filter)
        .then(() => true)
        .catch(err => {
          this.showErrors(err);
        });
    },
    saveLostTime(item, id) {
      let val = {
        jobsId: id,
        totalmins: item.lostTime,
        reason: item.lostTimeReason,
        line: item.line,
        periodFrom: item.periodFrom,
        periodTo: item.periodTo
      };

      api
        .create(val, path.lostTime)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Lost time",
            message: `Lost time and production data saved.`
          });
        })
        .catch(err => {
          this.showErrors(err);
        });
    }
  }
};
</script>
<style lang="css">
ul li {
  list-style-type: disc;
}
</style>
<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            small
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'json' })"
          >
            <v-icon class="mr-1">arrow_back</v-icon>{{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
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
                >{{ $t("json-file-browsed") }}
              </div>
            </em>
          </v-flex>
          <v-flex xs12 v-if="done">
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 pa-2 v-if="done">
            <h3 class="text-center">
              {{ $t("file-name") }}: {{ jsonFileName }}
            </h3>
            <h4 class="text-center">{{ $t("file-type") }}: {{ fileType }}</h4>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2 v-for="(item, i) in contents" :key="i">
            <v-card v-if="done" flat>
              <v-list dense disabled>
                <v-subheader class="info--text"
                  >{{ $t("order-status") }}: {{ i + 1 }}</v-subheader
                >
                <v-list-item-group color="primary">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ $t("cutIn") }}: {{ item.cutIn }}</v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ $t("cutOut") }}:
                        {{ item.cutOut }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("sewIn") }}:
                        {{ item.sewIn }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("sewOut") }}:
                        {{ item.sewOut }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ $t("finishingIn") }}:
                        {{ item.finishingIn }}</v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("finishingOut") }}:
                        {{ item.finishingOut }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ $t("packedIn") }}:
                        {{ item.packedIn }}</v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>done</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t("packedOut") }}:
                        {{ item.packedOut }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-divider></v-divider>
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
    </v-container>
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
      this.contents.map(x => this.save(x));
    },
    save(item) {
      api
        .create(item, path.orderStatus)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Order status",
            message: `Order status data saved.`
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
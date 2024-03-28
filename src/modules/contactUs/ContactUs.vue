<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md7 lg7>
              <v-form @submit.prevent="send" class="pa-3">
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      outlined
                      :label="$t('fullName')"
                      v-model="item.fullName"
                      dense
                      hide-details
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      outlined
                      :label="$t('phoneNumber')"
                      v-model="item.phoneNumber"
                      dense
                      hide-details
                      v-validate="'required'"
                      :error-messages="errors.collect('phoneNumber')"
                      name="phoneNumber"
                      type="text"
                    />
                  </v-flex>
                  <v-flex xs12 pa-2>
                    <v-text-field
                      :label="$t('email')"
                      outlined
                      dense
                      hide-details
                      v-validate="'required|email'"
                      v-model="item.email"
                      :error-messages="errors.collect('email')"
                      name="email"
                      type="email"
                      autocomplete="email"
                    />
                  </v-flex>
                  <v-flex xs12 pa-2>
                    <v-textarea
                      outlined
                      :label="$t('message')"
                      v-model="item.message"
                      dense
                      hide-details
                    />
                  </v-flex>
                  <v-flex xs12 pa-2>
                    <v-card outlined>
                      <v-card-text>
                        <input
                          type="file"
                          @change="onFileSelected"
                          style="display:none"
                          ref="fileInput"
                        />
                        <v-btn
                          text
                          class="text-capitalize"
                          @click="$refs.fileInput.click()"
                        >
                          <v-icon large>attachment</v-icon>
                          {{ $t("attachement") }}
                        </v-btn>
                        <br />
                        <em class="text-capitalize primary--text" v-if="done">
                          <v-icon>done</v-icon>
                          <span class="mx-2">File Attached</span>
                        </em>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12></v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-btn
                      block
                      rounded
                      color="primary"
                      type="submit"
                      @click="send"
                      :disabled="disabled"
                      class="text-capitalize"
                    >
                      <v-progress-circular
                        v-if="loading"
                        size="20"
                        indeterminate
                        :value="20"
                      />
                      <span class="mx-2">{{ $t("sendMessage") }}</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
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
  name: "Contact us",
  data() {
    return {
      loading: false,
      done: false,
      item: {},
      selectedFile: null,
      label: "Attachement",
      msg: "Send Message",
      disabled: false,
      pathContainer: path.container,
      attachment: false
    };
  },
  methods: {
    onFileSelected(event) {
      /* This function is called when you select file for attachment */
      this.selectedFile = event.target.files[0];
      this.label = this.selectedFile.name;
      this.done = true;
      this.item.fileName = this.label;
      this.attachment = true;
    },
    async send() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.loading = true;
          this.disabled = true;
          this.msg = "Sending Message";
          this.sendAttachment(this.selectedFile);
          this.sendMessage();
        }
      });
    },

    async sendAttachment(file) {
      /* This is implemented for saving data to the container upload */

      const formData = new FormData();
      formData.append("Image", file, file.name);
      await api
        .upload("attachment", formData, this.pathContainer)
        .then(() => {})
        .catch(() => {
          this.disabled = false;
          this.loading = false;
          this.$notify({
            type: "danger",
            title: this.$t("failure"),
            message: `Unable to send your attachement. Try again.`
          });
        });
    },
    async sendMessage() {
      this.item.rootPath = this.attachment ? API_ROOT : "";
      this.item.sentAt = new Date();
      await api
        .create(this.item, path.contactUs)
        .then(() => {
          this.item = {};
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: `Message Sent Successfully!`
          });
          this.$router.push({ name: "dashboard" });
        })
        .catch(err => {
          this.item = {};
          this.disabled = false;
          this.loading = false;
          this.$notify({
            type: "danger",
            title: this.$t("failure"),
            message: `Unable to send your message right now. Try again.`
          });
          this.showErrors(err);
        });
    }
  }
};
</script>
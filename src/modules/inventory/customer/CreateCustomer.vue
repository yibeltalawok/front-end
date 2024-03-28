<template>
  <div>
<!-- yibeltal commit begin
      <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <p class="mt-3">Create customer</p>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <v-layout row justify-center my-3>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-layout column wrap justify-center my-3>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('customerName')"
                      v-model="item.customerName"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('phoneNumber')"
                      v-model="item.phoneNumber"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('country')"
                      v-model="item.country"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('country_state')"
                      v-model="item.state"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('city')"
                      v-model="item.city"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('postalcode')"
                      v-model="item.postalcode"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-layout row>
                    <v-flex pa-2>
                      <v-text-field
                        dense
                        :label="$t('latitude')"
                        v-model="location[0]"
                        outlined
                        :rules="inputRule"
                      ></v-text-field>
                    </v-flex>
                    <v-flex pa-2>
                      <v-text-field
                        dense
                        :label="$t('longtude')"
                        v-model="location[1]"
                        outlined
                        :rules="inputRule"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <input
                      type="file"
                      style="display:none"
                      @change="onCustomerFileSelected"
                      ref="fileInput1"
                    />
                    <v-btn
                      text
                      class="text-capitalize"
                      @click="$refs.fileInput1.click()"
                    >
                      <v-icon>attachment</v-icon>
                      {{ $t("customer-picture") }}
                    </v-btn>
                    <em class="text-capitalize primary--text">
                      <v-icon v-if="profileDone">done</v-icon>
                      {{ inventoryInfo }}
                    </em>
                  </v-flex>
                  <v-layout row justify-center>
                    <v-flex xs6 sm6 md5 lg5>
                      <v-btn class="primary" @click="save"
                        >{{ $t("save") }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    end of it is here -->
  </div>
</template>

<script>
/* this yibeltal commit 
import { api, path } from "@/api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      location: [0, 0],
      item: {
        location: []
      },
      selectedFileInventory: "",
      userInventoryImageUrl: "",
      inventoryInfo: "",
      profileDone: false,
      pathContainer: path.container,
      inputRule: [v => !!v || "This field is required"]
    };
  },
  methods: {
    ...mapActions("inventory", ["postData"]),
    save() {
      if (this.$refs.form.validate()) {

        if (this.profileDone) {
          this.uploadPicture(this.selectedFileInventory);
        }
        this.item.location = [
          parseFloat(this.location[0]),
          parseFloat(this.location[1])
        ];
        // TODO remove api call
        this.postData([this.item, path.customer])
          .then(() => {
            this.$router.push({ name: "customer-list" });
            this.$notify({
              type: "success",
              title: this.$t("create category"),
              message: `${this.$t("category")} ${this.$t(
                "registered Successfully"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
    }, 
    // eslint-disable-next-line no-unused-vars
    onCustomerFileSelected(event) {
      this.selectedFileInventory = event.target.files[0];
      this.userInventoryImageUrl = URL.createObjectURL(
        this.selectedFileInventory
      );
      this.inventoryInfo = this.selectedFileInventory.name;
      this.profileDone = true;
    },
    async uploadPicture(file) {
      const formData = new FormData();
      let name = this.item.phoneNumber;
      this.item.imagePath = name;
      formData.append("Image", file, name);
      alert(formData)
      await api.upload("customer", formData, this.pathContainer);
    }
  }
}; end of it */
</script>
<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <p class="mt-1">Update customer</p>
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
                  <v-flex mx-15>
                    <v-avatar height="50px" width="50px">
                    <img
                      :src="inventoryImage"
                      alt="No image"
                      height="130px"
                      width="100%"
                    />
                  </v-avatar>
                  </v-flex>
                  
                  <v-card-text>
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
                      <v-icon color="#555"> mdi-camera </v-icon>
                      {{ $t("customer-picture") }}
                    </v-btn>
                    <em class="text-capitalize primary--text">
                      <!-- <v-icon v-if="profileDone">done</v-icon> -->
                      {{ inventoryInfo }}
                    </em>
                  </v-card-text>

                </v-layout>

              </v-flex>
            </v-layout>
            
            <v-layout row justify-center my-3>

              <v-flex xs12 sm4 md4 lg4 pa-2>
                    
                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-text-field
                      dense
                      :label="$t('customerName')"
                      v-model="item.customerName"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-text-field
                      dense
                      :label="$t('phoneNumber')"
                      v-model="item.phoneNumber"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-text-field
                      dense
                      :label="$t('country')"
                      v-model="item.country"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
              </v-flex>

              <v-flex xs12 sm4 md4 lg4 pa-2>
                <v-flex xs12 sm12 md12 lg12 pa-2>
                  <v-text-field
                    dense
                    :label="$t('country_state')"
                    v-model="item.state"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 md12 lg12 pa-2>
                  <v-text-field
                    dense
                    :label="$t('city')"
                    v-model="item.city"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 12 lg12 pa-2>
                  <v-text-field
                    dense
                    :label="$t('postalcode')"
                    v-model="item.postalcode"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>
              </v-flex>

              <v-flex xs12 sm4 md4 lg4 pa-2>
                <v-flex pa-2>
                  <v-text-field
                    dense
                    :label="$t('latitude')"
                    v-model="item.location[0]"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>

                <v-flex pa-2>
                  <v-text-field
                    dense
                    :label="$t('longtude')"
                    v-model="item.location[1]"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>
              </v-flex>

              <v-layout row justify-center>
                <v-flex xs6 sm6 md5 lg5>
                  <v-btn
                  small
                  outlined
                  rounded
                  color="#ecbb44"
                  width="100px" 
                  @click="save"
                    >{{ $t("save") }}
                  </v-btn>
                </v-flex>
              </v-layout>

            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      location: [0, 0],
      item: {},
      customerId: "",
      selectedFileInventory: "",
      userInventoryImageUrl: "",
      inventoryInfo: "",
      profileDone: false,
      pathContainer: path.container,
      inputRule: [v => !!v || "This field is required"]
    };
  },
  async created() {
    const { customerId } = this.$route.params;
    this.customerId = customerId;
    this.item = await api.get(customerId, path.customer);
    this.getProfileImage(["customer/download", this.item.imagePath]);
  },
  computed: {
    ...mapState("inventory", ["inventoryImage"])
  },
  methods: {
    ...mapActions("inventory", ["getProfileImage"]),
    save() {
      if (this.$refs.form.validate()) {
        if (this.profileDone) {
          this.checkImage(this.selectedFileInventory);
        }
        api
          .update(this.item, path.customer)
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
    }, // eslint-disable-next-line no-unused-vars
    onCustomerFileSelected(event) {
      this.selectedFileInventory = event.target.files[0];
      this.userInventoryImageUrl = URL.createObjectURL(
        this.selectedFileInventory
      );
      this.inventoryInfo = this.selectedFileInventory.name;
      this.profileDone = true;
    },
    async checkImage(file) {
      await api
        .checkFile("customer", this.pathContainer, this.item.imagePath)
        .then(() => this.changePicture(file))
        .catch(() => this.uploadPicture(file));
    },
    async changePicture(file) {
      const path = this.pathContainer;
      await api
        .removeFile("customer", this.item.imagePath, path)
        .then(() => {
          const formData = new FormData();
          formData.append("Image", file, this.item.imagePath);
          api
            .upload("customer", formData, path)
            .then(() => {
              this.$notify({
                type: "success",
                title: this.$t("seccuess"),
                message: `${this.$t("picture changed  now ")} ${this.$t(
                  "primaryfully."
                )}`
              });
            })
            .catch(() => {
              this.$notify({
                type: "red",
                title: this.$t("Failure"),
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
    },
    async uploadPicture(file) {
      const formData = new FormData();
      let name = this.item.phoneNumber;
      this.item.imagePath = name;
      formData.append("Image", file, name);
      await api.upload("customer", formData, this.pathContainer);
    }}};
</script>
<style scoped>
.rounded-card {
  border-radius: 50px;
}

.avatarCard {
  height: 22vh;
  width: 48vh;
  border-radius: 20px;
  border: 2px solid #555;
  background: #bbb;
}
</style>

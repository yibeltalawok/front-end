<template>
  <div>
    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-3>
          <v-card outlined>
            <v-card-title>
              <v-btn
                text
                color="primary"
                class="text-capitalize"
                @click="$router.push({ name: 'hr' })"
              >
                <v-icon>arrow_back</v-icon>
                {{ $t("go_back") }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-divider vertical></v-divider>
              <h3 class="text-center grey--text mx-2">{{ item.fullName }}</h3>
              <v-divider vertical></v-divider>
              <h3 class="text-center grey--text mx-2">{{ item.gender }}</h3>
              <!-- <v-divider vertical></v-divider>
              <h3 class="text-center grey--text mx-2">
                <span class="mx-3">
                  Joined Since:
                  {{new Date(item.joiningDate).toLocaleDateString("en-US")}}
                </span>
              </h3>
              <v-divider vertical></v-divider>-->
              <h3 class="text-center grey--text mx-2">
                {{ $t("role") }}: {{ role.name }}
              </h3>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md8 lg8 pa-3>
          <v-card outlined flat>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.idno"
                      :error-messages="errors.collect('idno')"
                      :label="$t('idno')"
                      name="idno"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.fullName"
                      :error-messages="errors.collect('fullName')"
                      :label="$t('fullName')"
                      name="fullName"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md3 lg3 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.phoneNumber"
                      :error-messages="errors.collect('phoneNumber')"
                      :label="$t('phoneNumber')"
                      name="phoneNumber"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-select
                      :label="$t('gender')"
                      :items="gender"
                      v-model="item.gender"
                      autocomplete
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      :label="$t('joiningDate')"
                      placeholder="yyyy-mm-dd"
                      dense
                      outlined
                      v-model="item.joiningDate"
                      type="date"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-combobox
                      :items="roles"
                      v-model="role"
                      :label="$t('position')"
                      name="role"
                      item-text="name"
                      item-value="id"
                      dense
                      outlined
                      @input="selectedRole"
                      @keypress="searchRole"
                    >
                      <template v-slot:append>
                        <v-slide-x-reverse-transition mode="out-in">
                          <v-btn
                            small
                            icon
                            class="primary"
                            @click="dialog = true"
                          >
                            <v-icon color="white">add</v-icon>
                          </v-btn>
                        </v-slide-x-reverse-transition>
                      </template>
                    </v-combobox>
                  </v-flex>
                  <!-- <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.position"
                      :error-messages="errors.collect('position')"
                      :label="$t('position')"
                      name="position"
                      outlined
                      dense
                      type="string"
                  /></v-flex> -->
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.positionalAllow"
                      :error-messages="errors.collect('positionalAllow')"
                      :label="$t('positionalAllow')"
                      name="positionalAllow"
                      outlined
                      dense
                      type="number"
                  /></v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-combobox
                      v-model="item.department"
                      :label="$t('department')"
                      :items="department"
                      name="department"
                      autocomplete
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.subDept"
                      :error-messages="errors.collect('subDept')"
                      :label="$t('subDept')"
                      name="subDept"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.salary"
                      :error-messages="errors.collect('salary')"
                      :label="$t('salary')"
                      name="salary"
                      outlined
                      dense
                    />
                  </v-flex>

                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.responseAllow"
                      :error-messages="errors.collect('responseAllow')"
                      :label="$t('responseAllow')"
                      name="responseAllow"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.homeAllow"
                      :error-messages="errors.collect('homeAllow')"
                      :label="$t('homeAllow')"
                      name="homeAllow"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.taxableHomeAllow"
                      :error-messages="errors.collect('taxableHomeAllow')"
                      :label="$t('taxableHomeAllow')"
                      name="taxableHomeAllow"
                      outlined
                      dense
                      type="number"
                      @input="manageTaxableHomeAllow"
                    />
                  </v-flex>

                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.nonTaxableHomeAllow"
                      :error-messages="errors.collect('nonTaxableHomeAllow')"
                      :label="$t('nonTaxableHomeAllow')"
                      name="nonTaxableHomeAllow"
                      outlined
                      dense
                      type="number"
                      @input="manageNonTaxableHomeAllow"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.profAllow"
                      :error-messages="errors.collect('profAllow')"
                      :label="$t('profAllow')"
                      name="profAllow"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.taxableProfAllow"
                      :error-messages="errors.collect('taxableProfAllow')"
                      :label="$t('taxableProfAllow')"
                      name="taxableProfAllow"
                      outlined
                      dense
                      type="number"
                      @input="manageTaxableProfAllow"
                  /></v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.nonTaxableProfAllow"
                      :error-messages="errors.collect('nonTaxableProfAllow')"
                      :label="$t('nonTaxableProfAllow')"
                      name="nonTaxableProfAllow"
                      outlined
                      dense
                      type="number"
                      @input="manageNonTaxableProfAllow"
                  /></v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.mobileAllow"
                      :error-messages="errors.collect('mobileAllow')"
                      :label="$t('mobileAllow')"
                      name="mobileAllow"
                      outlined
                      dense
                      type="number"
                  /></v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.foodAllow"
                      :error-messages="errors.collect('foodAllow')"
                      :label="$t('foodAllow')"
                      name="foodAllow"
                      outlined
                      dense
                      type="number"
                  /></v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.bankAccountNum"
                      :error-messages="errors.collect('bankAccountNum')"
                      :label="$t('bankAccountNum')"
                      name="bankAccountNum"
                      outlined
                      dense
                      type="number"
                  /></v-flex>

                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-autocomplete
                      :label="$t('absentIncentive')"
                      v-model="item.absentIncentive"
                      :items="absentItem"
                      item-text="name"
                      item-value="name"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.transportPay"
                      :error-messages="errors.collect('transportPay')"
                      :label="$t('transportPay')"
                      name="transportPay"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.costSharing"
                      :error-messages="errors.collect('costSharing')"
                      :label="$t('costSharing')"
                      name="costSharing"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.ironIncentive"
                      :error-messages="errors.collect('ironIncentive')"
                      :label="$t('ironIncentive')"
                      name="ironIncentive"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      :label="$t('womanUnion')"
                      v-model="item.womanUnion"
                      :rules="inputRules"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      :label="$t('creditAssociation')"
                      v-model="item.creditAssociation"
                      :rules="inputRules"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      :label="$t('medicationDeduction')"
                      v-model="item.medicationDeduction"
                      :rules="inputRules"
                      outlined
                      dense
                    />
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 pa-3>
          <v-card height="100%" flat outlined>
            <v-card-text>
              <v-layout column justify-center align-center>
                <v-avatar height="200px" width="160px" color="grey lighten-4">
                  <img :src="profilePicUrl()" />
                </v-avatar>
              </v-layout>
              <input
                type="file"
                @change="onProfileFileSelected"
                style="display:none"
                ref="fileInput1"
              />
              <v-btn
                text
                class="text-capitalize"
                @click="$refs.fileInput1.click()"
              >
                <v-btn text small>
                  <v-icon>attachment</v-icon>
                </v-btn>
                {{ $t("profile-picture") }}
              </v-btn>
              <br />
              <em class="text-capitalize primary--text">
                <v-icon v-if="profileDone">done</v-icon>
                {{ profilePictureInfo }}
              </em>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-btn
            block
            outlined
            rounded
            color="primary"
            class="text-capitalize"
            @click="save"
            >{{ $t("save") }}</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>

    <!-- modal dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar height="35px" dark dense flat color="primary">
          Create New Role
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <app-role @close="close" />
      </v-card>
    </v-dialog>
    <!-- modal dialog -->
  </div>
</template>

<script>
import { api, path, API_ROOT } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import AppRole from "@/modules/role/new/Modal";
import { mapActions } from "vuex";

export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      pathEmployee: path.employee,
      pathRole: path.userRole,
      pathContainer: path.container,
      joinDate: null,
      pickedDate: null,
      menu: false,
      modal: false,
      menu2: false,
      gender: ["Male", "Female", "Other"],
      department: [
        "Sampling",
        "Designing",
        "Merchandising",
        "Stores - Fabric",
        "Stores - Trims",
        "Stores - Finished Goods",
        "HR",
        "Adminstration",
        "Finance",
        "Cutting",
        "Embroidery",
        "Washing",
        "Sewing",
        "Finishing",
        "Packing",
        "Quality",
        "Dispatch",
        "Maintenance",
        "Security"
      ],
      roles: [],
      role: "",
      item: {
        phoneNo: "+251 "
      },
      isLoading: false,

      dialog: false,
      profilePictureInfo: "",
      idPictureInfo: "",
      selectedFilePrfofile: null,
      selectedFileId: null,

      profileDone: false,
      idDone: false,
      absentItem: [{ name: "Yes" }, { name: "No" }],
      inputRules: [v => !!v || "This field is required"]
    };
  },
  components: {
    AppRole
  },
  async created() {
    this.searchRole("init");
    const { employeeId } = this.$route.params;
    let filter = {
      include: ["userRole"]
    };
    this.item = await api.get(employeeId, this.pathEmployee, filter);
    this.role = this.item.userRole.name;
  },
  methods: {
    ...mapActions("inventory", ["updateData"]),
    manageTaxableHomeAllow() {
      this.item.nonTaxableHomeAllow =
        this.item.homeAllow - this.item.taxableHomeAllow;
    },
    manageNonTaxableHomeAllow() {
      this.item.taxableHomeAllow =
        this.item.homeAllow - this.item.nonTaxableHomeAllow;
    },
    manageTaxableProfAllow() {
      this.item.nonTaxableProfAllow =
        this.item.profAllow - this.item.taxableProfAllow;
    },
    manageNonTaxableProfAllow() {
      this.item.taxableProfAllow =
        this.item.profAllow - this.item.nonTaxableProfAllow;
    },
    selectedRole(role) {
      this.item.userRoleId = role.id;
    },
    //seacrh role
    async searchRole(val) {
      let f1 = {
        where: {
          name: { regexp: "/" + val.key + "/i" }
        }
      };
      let f2 = {
        limit: 6
      };
      let filter = val == "init" ? f2 : f1;
      this.roles = (await api.all(this.pathRole, filter)).rows;
    },

    onProfileFileSelected(event) {
      this.selectedFilePicture = event.target.files[0];
      this.profilePictureInfo = this.selectedFilePicture.name;
      this.checkImage(this.selectedFilePicture);
      this.profileDone = true;
    },
    // eslint-disable-next-line no-unused-vars
    async checkImage(file) {
      await api
        .checkFile("/profilePictures", this.item.phoneNumber, this.pathContainer)
        .then(() => this.changePicture(file))
        .catch(() => this.uploadPicture(file));
    },
    async uploadPicture(file) {
      const formData = new FormData();
      formData.append("Image", file, this.item.phoneNumber);
      await api
        .upload("profilePictures", formData, this.pathContainer)
        .then(() => {
          this.$notify({
            type: "success",
            title: this.$t("primary"),
            message: `${this.$t("picture")} ${this.$t("updated_primaryfully")}`
          });
        })
        .catch(() => {
          this.$notify({
            type: "red",
            title: this.$t("Failure"),
            message: `${this.$t("picture not uploaded right now.")} ${this.$t(
              "Try later."
            )}`
          });
        });
    },

    async changePicture(file) {
      const path = this.pathContainer;
      await api
        .remove("profilePictures", this.item.phoneNumber, path)
        .then(() => {
          const formData = new FormData();
          formData.append("Image", file, this.item.phoneNumber);
          api
            .upload("profilePictures", formData, path)
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

    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          delete this.item.confirmPassword;
          this.item.profilePicture = this.item.phoneNumber;
          this.item.idPicture = this.item.phoneNumber;
          this.errorMessage = null;
          this.dialog = false;
          this.item.userRoleId = this.item.userRoleId;
          this.item.totalSalary =
            parseFloat(this.item.salary) +
            parseFloat(this.item.incentiveSalary);
          this.updateData([this.item, this.pathEmployee])
            .then(() => {
              this.$notify({
                type: "success",
                title: this.$t("Update Information"),
                message: `${this.$t("Employee")} ${this.$t(
                  "Information successfully updated!"
                )}`
              });
              this.$router.push({
                name: "hr"
              });
            })
            .catch(err => {
              this.showErrors(err);
            });
          // api
          //   .update(this.item, this.pathEmployee)
          //   .then(() => {
          //     this.$notify({
          //       type: "success",
          //       title: this.$t("Update Information"),
          //       message: `${this.$t("Employee")} ${this.$t(
          //         "Information successfully updated!"
          //       )}`
          //     });
          //     this.$router.push({
          //       name: "hr"
          //     });
          //   })
          //   .catch(err => {
          //     this.showErrors(err);
          //   });
        }
      });
    },
    profilePicUrl() {
      return (
        API_ROOT +
        "/containers" +
        "/profilePictures" +
        "/download/" +
        this.item.phoneNumber
      );
    }
  }
};
</script>

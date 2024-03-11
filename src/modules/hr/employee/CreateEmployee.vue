<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'hr' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout wrap row justify-center>
            <v-flex xs12 sm12 md5 lg5 pa-2 v-if="isEmployeeExist">
              <v-alert type="error"
                >{{ $t("employee") }} {{ $t("idno") }} {{ item.idno }}
                {{ $t("already-exist") }}!</v-alert
              >
            </v-flex>
          </v-layout>
          <v-layout wrap row justify-center>
            <v-flex xs12 sm12 md8 lg8 pa-3>
              <v-card flat>
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
                          @input="checkEmployee(item.idno)"
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md5 lg5 pa-2>
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
                      <v-flex xs12 sm12 md4 lg4 pa-2>
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
                        <v-autocomplete
                          :label="$t('gender')"
                          :items="gender"
                          v-model="item.gender"
                          v-validate="'required'"
                          :error-messages="errors.collect('gender')"
                          name="gender"
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
                          v-validate="'required'"
                          :error-messages="errors.collect('joiningDate')"
                          v-model="item.joiningDate"
                          name="joiningDate"
                          type="date"
                        />
                      </v-flex>

                      <v-flex xs12 sm12 md4 lg4 pa-2>
                        <Select
                          v-validate="'required'"
                          :items="roles"
                          v-model="selectedRole"
                          :error-messages="errors.collect('role')"
                          :label="$t('position')"
                          name="role"
                          :item-text="title"
                          item-value="id"
                          :search-input.sync="search"
                          hide-selected
                          multiple
                          persistent-hint
                          small-chips
                          :noData="noData"
                          :loading="isLoading"
                          :addNewBtn="addNewBtn"
                          @selected="getValue"
                          @onNewItem="show"
                          @search="onRoleSearch"
                          outline
                        />
                      </v-flex>

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
                        <v-autocomplete
                          v-model="item.department"
                          :label="$t('department')"
                          :items="department"
                          name="department"
                          v-validate="'required'"
                          :error-messages="errors.collect('department')"
                          outlined
                          dense
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md4 lg4 pa-2>
                        <v-text-field
                          v-validate="'required'"
                          v-model="item.subDept"
                          :label="$t('subDept')"
                          :error-messages="errors.collect('salary')"
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
                          @input="allowHome"
                      /></v-flex>
                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-model="item.taxableHomeAllow"
                          :error-messages="errors.collect('taxableHomeAllow')"
                          :label="$t('taxableHomeAllow')"
                          name="taxableHomeAllow"
                          :disabled="isHome"
                          outlined
                          dense
                          type="number"
                          @input="manageTaxableHomeAllow"
                        />
                      </v-flex>

                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-model="item.nonTaxableHomeAllow"
                          :error-messages="
                            errors.collect('nonTaxableHomeAllow')
                          "
                          :label="$t('nonTaxableHomeAllow')"
                          name="nonTaxableHomeAllow"
                          outlined
                          :disabled="isHome"
                          dense
                          type="number"
                          @input="manageNonTaxableHomeAllow"
                        />
                      </v-flex>

                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-model="item.profAllow"
                          :error-messages="errors.collect('professional Allow')"
                          :label="$t('profAllow')"
                          name="profAllow"
                          outlined
                          dense
                          type="number"
                          @input="allowProfessional"
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md5 lg5 pa-1>
                        <v-text-field
                          v-model="item.taxableProfAllow"
                          :error-messages="errors.collect('taxableProfAllow')"
                          :label="$t('taxableProfAllow')"
                          name="taxableProfAllow"
                          outlined
                          :disabled="isProfessional"
                          dense
                          type="number"
                          @input="manageTaxableProfAllow"
                      /></v-flex>
                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-model="item.nonTaxableProfAllow"
                          :error-messages="
                            errors.collect('nonTaxableProfAllow')
                          "
                          :disabled="isProfessional"
                          :label="$t('nonTaxableProfAllow')"
                          name="nonTaxableProfAllow"
                          outlined
                          dense
                          type="number"
                          @input="manageNonTaxableProfAllow"
                      /></v-flex>

                      <v-flex xs12 sm12 md3 lg3 pa-1>
                        <v-text-field
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
                          v-validate="'required'"
                          :error-messages="errors.collect('absentItem')"
                          name="absentItem"
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
                          v-validate="'required'"
                          :error-messages="errors.collect('womanUnion')"
                          :label="$t('womanUnion')"
                          name="womanUnion"
                          v-model="item.womanUnion"
                          outlined
                          dense
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-validate="'required'"
                          :error-messages="errors.collect('creditAssociation')"
                          name="creditAssociation"
                          :label="$t('creditAssociation')"
                          v-model="item.creditAssociation"
                          outlined
                          dense
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md4 lg4 pa-1>
                        <v-text-field
                          v-validate="'required'"
                          :error-messages="
                            errors.collect('medicationDeduction')
                          "
                          name="medicationDeduction"
                          :label="$t('medicationDeduction')"
                          v-model="item.medicationDeduction"
                          outlined
                          dense
                        />
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md1 lg1 pa-3>
              <v-divider vertical></v-divider>
            </v-flex>
            <v-flex xs12 sm12 md3 lg3 py-3>
              <v-row>
                <v-spacer />
                <v-avatar>
                  <v-img
                    v-if="userProfileImageUrl"
                    :src="userProfileImageUrl"
                    width="250px"
                  />
                </v-avatar>
                <v-spacer />
              </v-row>
              <input
                type="file"
                @change="onProfileFileSelected"
                style="display: none"
                ref="fileInput1"
              />
              <v-btn
                text
                class="text-capitalize"
                @click="$refs.fileInput1.click()"
              >
                <v-icon>attachment</v-icon>
                {{ $t("employ") }}
                {{ $t("profile-picture") }}
              </v-btn>
              <br />
              <em class="text-capitalize primary--text">
                <v-icon v-if="profileDone">done</v-icon>
                {{ profilePictureInfo }}
              </em>
              <input
                type="file"
                @change="onIdFileSelected"
                style="display: none"
                ref="fileInput2"
              />
              <v-btn
                text
                class="text-capitalize"
                @click="$refs.fileInput2.click()"
              >
                <v-icon>attachment</v-icon>
                {{ $t("employ") }} {{ $t("id-picture") }}
              </v-btn>
              <br />
              <em class="text-capitalize primary--text">
                <v-icon v-if="idDone">done</v-icon>
                {{ idPictureInfo }}
              </em>

              <v-img
                v-if="userIdImageUrl"
                :src="userIdImageUrl"
                width="200px"
              />
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
        </v-card-text>
      </v-card>
    </v-container>

    <!-- <v-btn @click="test">Some</v-btn> -->

    <!-- modal dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <app-role @close="close" />
    </v-dialog>
    <!-- modal dialog -->
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import Select from "@/shared/select/Select";
import AppRole from "@/modules/role/new/Modal";

export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      pathEmployee: path.employee,
      pathRole: path.userRole,
      pathContainer: path.container,
      userIdImageUrl: undefined,
      userProfileImageUrl: undefined,
      menu: false,
      modal: false,
      menu2: false,
      title: "name",
      gender: ["Male", "Female", "Other"],
      department: [
        "Supervisor",
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
        "Security",
      ],
      subDept: ["Sewing 1", "Sewing 2", "Sewing 3", "Sewing 4"],
      selectedRole: null,
      roles: [],
      item: {
        phoneNo: "+251 ",
      },
      isLoading: false,
      noData: "No matching result ",
      isModalVisible: false,
      addNewBtn: "Add New Role",
      dialog: false,
      profilePictureInfo: "",
      idPictureInfo: "",
      selectedFilePrfofile: null,
      selectedFileId: null,
      profileDone: false,
      idDone: false,
      checkEmployeeId: {},
      isEmployeeExist: false,
      absentItem: [{ name: "Yes" }, { name: "No" }],
      isHome: true,
      isProfessional: true,
    };
  },
  components: {
    Select,
    AppRole,
  },

  computed: {
    ...mapState("employee", ["vroles"]),
  },

  async created() {
    this.onRoleSearch();
  },
  methods: {
    ...mapActions("attendance", ["mapAttendance"]),
    ...mapActions("inventory", ["postData"]),
    ...mapMutations("employee", ["setRoles"]),
    allowHome() {
      if (this.item.homeAllow > 0) {
        this.isHome = false;
      } else {
        this.isHome = true;
      }
    },
    allowProfessional() {
      if (this.item.profAllow > 0) {
        this.isProfessional = false;
      } else {
        this.isProfessional = true;
      }
    },
    manageTaxableProfAllow() {
      this.item.nonTaxableProfAllow =
        this.item.profAllow - this.item.taxableProfAllow;
    },
    manageNonTaxableProfAllow() {
      this.item.taxableProfAllow =
        this.item.profAllow - this.item.nonTaxableProfAllow;
    },
    manageTaxableHomeAllow() {
      this.item.nonTaxableHomeAllow =
        this.item.homeAllow - this.item.taxableHomeAllow;
    },
    manageNonTaxableHomeAllow() {
      this.item.taxableHomeAllow =
        this.item.homeAllow - this.item.nonTaxableHomeAllow;
    },
    async checkEmployee(idno) {
      let f = { where: { idno: idno } };
      this.isEmployeeExist = false;
      this.checkEmployeeId = (await api.all(path.employee, f)).rows;
      if (this.checkEmployeeId.length > 0) {
        this.isEmployeeExist = true;
      }
    },
    onProfileFileSelected(event) {
      this.selectedFilePicture = event.target.files[0];
      this.userProfileImageUrl = URL.createObjectURL(this.selectedFilePicture);
      this.profilePictureInfo = this.selectedFilePicture.name;
      this.uploadPicture(this.selectedFilePicture, "/profilePictures");
    },
    onIdFileSelected(event) {
      this.selectedFileId = event.target.files[0];
      this.userIdImageUrl = URL.createObjectURL(this.selectedFileId);
      this.idPictureInfo = this.selectedFileId.name;
      this.uploadPicture(this.selectedFileId, "/idPictures");
    },
    async uploadPicture(file, container) {
      const formData = new FormData();
      let name =
        this.item.phoneNumber != null ? this.item.phoneNumber : "random name";
      formData.append("Image", file, name);
      await api.upload(container, formData, this.pathContainer);
      container == "/idPictures"
        ? (this.idDone = true)
        : (this.profileDone = true);
    },
    show(show) {
      this.dialog = show;
    },
    async onRoleSearch(val) {
      let f1 = {
        where: {
          name: { regexp: "/" + val + "/i" },
        },
      };
      let f2 = {
        limit: 3,
      };
      let filter = val ? f1 : f2;
      this.roles = (await api.all(this.pathRole, filter)).rows;
      this.setRoles(this.roles);
    },

    close() {
      this.dialog = false;
    },
    save() {
      if (!this.isEmployeeExist) {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            delete this.item.confirmPassword;
            this.item.userRoleId = this.selectedRole;
            this.item.profilePicture = this.item.phoneNumber;
            this.item.idPicture = this.item.phoneNumber;
            this.item.totalSalary = this.item.salary;
            this.errorMessage = null;
            this.postData([this.item, this.pathEmployee]).then(() => {
              this.item = {};
              this.$notify({
                type: "success",
                title: this.$t("Add New Employee"),
                message: `${this.$t("Employee")} ${this.$t(
                  "registered Successfully"
                )}`,
              });
              this.mapAttendance(new Date().toISOString().substr(0, 10));
              this.$router.push({
                name: "hr",
              });
            });
          }
        });
      }
    },
  },
};
</script>

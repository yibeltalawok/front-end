<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize"
            @click="$router.push({ name: 'user' })"
          >
            <v-icon>arrow_back</v-icon>{{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />

            <v-layout row justify-center>
              <v-flex xs12 sm12 md2 lg2 pa-2>
                <v-combobox
                  v-model="select"
                  color=""
                  label="User type"
                  :items="userTypes"
                  @input="selectedUser"
                  outlined
                  dense
                  :rules="inputRule"
                ></v-combobox>
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2 v-if="isEmployee">
                <v-autocomplete
                  :label="$t('Select employee')"
                  :items="employee"
                  item-text="fullName"
                  item-value="id"
                  name="employeeId"
                  outlined
                  dense
                  :rules="inputRule"
                  v-model="item.employeeId"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2 v-if="isCustomer">
                <v-autocomplete
                  :label="$t('Customer')"
                  :items="customer"
                  item-text="customerName"
                  item-value="id"
                  name="customorId"
                  outlined
                  dense
                  :rules="inputRule"
                  v-model="item.customerId"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
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
                  v-validate="'required|email'"
                  v-model="item.email"
                  :error-messages="errors.collect('email')"
                  :label="$t('email')"
                  name="email"
                  type="email"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  v-model="item.phoneNo"
                  :error-messages="errors.collect('phoneNo')"
                  :label="$t('phoneNumber')"
                  placeholder="09########"
                  mask="##########"
                  return-masked-value
                  name="phoneNo"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <Select
                  v-validate="'required'"
                  :items="roles"
                  v-model="selectedRole"
                  :error-messages="errors.collect('role')"
                  :label="$t('role')"
                  name="role"
                  item-text="name"
                  return-object
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
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  v-validate="'required|min:5'"
                  ref="password"
                  v-model="item.password"
                  :error-messages="errors.collect('password')"
                  :label="$t('password')"
                  name="password"
                  type="password"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  v-validate="'required|confirmed:password'"
                  v-model="item.confirmPassword"
                  :error-messages="errors.collect('password_confirmation')"
                  :label="$t('confirmPassword')"
                  name="password_confirmation"
                  type="password"
                  data-vv-as="password"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-3>
                <v-btn
                  rounded
                  outlined
                  block
                  color="primary"
                  class="text-capitalize"
                  type="submit"
                  >{{ $t("save") }}</v-btn
                >
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- modal dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <app-role @close="close" />
    </v-dialog>
    <!-- modal dialog -->
  </div>
</template>


<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import Select from "@/shared/select/Select";
import AppRole from "@/modules/role/new/Modal";
import { mapState, mapActions } from "vuex";

export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      pathUser: path.user,
      pathRole: path.userRole,
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
      userTypes: ["Employee", "Customer"],
      isCustomer: false,
      isEmployee: false,
      inputRule: [(v) => !!v || "This field is required"],
    };
  },
  components: {
    Select,
    AppRole,
  },

  async created() {
    this.onRoleSearch();
  },
  computed: {
    ...mapState("inventory", ["customer", "employee"]),
  },
  methods: {
    ...mapActions("inventory", ["getEmployee", "getCustomer"]),
    selectedUser(value) {
      if (value == "Employee") {
        this.getEmployee();
        this.isCustomer = false;
        this.isEmployee = true;
      } else {
        this.getCustomer();
        this.isCustomer = true;
        this.isEmployee = false;
      }
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
      this.roles = (await api.all(path.userRole, filter)).rows;
    },
    close() {
      this.dialog = false;
    },
    save() {
      this.$validator.validateAll().then((valid) => {
        if (valid) {
          delete this.item.confirmPassword;
          this.item.userRoleId = this.selectedRole;
          this.errorMessage = null;
          api
            .create(this.item, path.user)
            .then(() => {
              this.item = {};
              this.$notify({
                type: "success",
                title: this.$t("success"),
                message: `${this.$t("user")} ${this.$t(
                  "created_successfully"
                )}`,
              });
              this.$router.push({
                name: "user",
              });
            })
            .catch((err) => {
              this.showErrors(err);
            });
        }
      });
    },
  },
};
</script>
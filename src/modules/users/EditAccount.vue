<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
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
              <v-flex xs12 sm12 md4 lg4 pa-2>
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
              <v-flex xs12 sm12 md4 lg4 pa-2>
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
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  v-model="role"
                  :items="roles"
                  :label="$t('role')"
                  item-text="name"
                  return-object
                  item-value="id"
                  dense
                  outlined
                  @input="selectedRole"
                  @keypress="searchRole"
                >
                  <template v-slot:append>
                    <v-slide-x-reverse-transition mode="out-in">
                      <v-btn small icon class="primary" @click="dialog = true">
                        <v-icon color="white">add</v-icon>
                      </v-btn>
                    </v-slide-x-reverse-transition>
                  </template>
                </v-combobox>
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-3>
                <v-btn
                  rounded
                  outlined
                  color="primary"
                  block
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
      <v-card>
        <v-toolbar dark dense flat height="35px" color="primary">
          Create New role
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <app-role />
      </v-card>
    </v-dialog>
    <!-- modal dialog -->
  </div>
</template>


<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import AppRole from "@/modules/role/new/Modal";

export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      role: "",
      pathUser: path.user,
      pathRole: path.userRole,
      selectedRole: null,
      roles: [],
      item: {
        phoneNo: "+251 "
      },
      isLoading: false,
      noData: "No matching result ",
      isModalVisible: false,
      addNewBtn: "Add New Role",
      dialog: false
    };
  },
  components: {
   AppRole
  },
  async created() {
    const { userId } = this.$route.params;
    let filter = {
      include: ["userRole"]
    };

    this.item = await api.get(userId, this.pathUser, filter);
    this.role = this.item.userRole.name;
    this.searchRole("init");
  },
  methods: {
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
    save() {
  // eslint-disable-next-line no-console
    console.log("items=",this.roles)
      this.$validator.validateAll().then(valid => {
        if (valid) {
          delete this.item.confirmPassword;
          this.item.userRoleId = this.selectedRole
            ? this.selectedRole
            : this.item.userRoleId;
          this.errorMessage = null;
          api
            .update(this.item, this.pathUser)
            .then(() => {
              this.item = {};
              this.$notify({
                type: "success",
                title: this.$t("success"),
                message: `${this.$t("user")} ${this.$t("created_successfully")}`
              });
              this.$router.push({
                name: "user-list"
              });
            })
            .catch(err => {
              this.showErrors(err);
            });
        }
      });
    }
  }
};
</script>
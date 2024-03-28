<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'dashboard' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>{{ $t("dashboard") }}
          </v-btn>
        </v-toolbar>

        <v-divider></v-divider>
        <v-card-text>
          <v-layout row justify-center>
            <v-flex xs6>
              <v-tabs fixed-tabs slider-color="primary">
                <v-tab ripple class="text-capitalize">
                  <v-icon class="mx-1">account_circle</v-icon>
                  {{ $t("my_profile") }}
                </v-tab>
                <v-tab ripple class="text-capitalize">
                  <v-icon class="mx-1">lock</v-icon>
                  {{ $t("change_password") }}
                </v-tab>

                <v-tab-item>
                  <v-card flat ref="card" color="white" class="py-5">
                    <v-layout column wrap justify-center >
                        <v-text-field
                          :value="this.user.fullName"
                          rounded
                          outlined
                          dense
                         />
                        <v-text-field
                          :value="this.user.role"
                          rounded
                          outlined
                          dense
                         />
                        <v-text-field
                          :value="this.user.phoneNo"
                          rounded
                          outlined
                          dense
                         />

                         <v-btn
                            outlined
                            
                            color="primary"
                            >Update Profile</v-btn>
                    </v-layout>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <form-error-messages :messages="errorMessage" />
                  <v-card flat class="py-5" color="white">
                    <v-form @submit.prevent="update">
                      <v-layout row>
                        <v-flex xs8 offset-xs2 pb-0 pt-0>
                          <v-text-field
                            v-validate="'required|min:5'"
                            ref="oldPassword"
                            v-model="item.oldPassword"
                            :error-messages="errors.collect('oldPassword')"
                            :label="$t('old_password')"
                            name="oldPassword"
                            type="password"
                            rounded
                            outlined
                            dense
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs8 offset-xs2 pb-0 pt-0>
                          <v-text-field
                            v-validate="'required|min:5'"
                            ref="newPassword"
                            v-model="item.newPassword"
                            :error-messages="errors.collect('newPassword')"
                            :label="$t('new_password')"
                            name="newPassword"
                            type="password"
                            rounded
                            outlined
                            dense
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs8 offset-xs2 pb-0 pt-0>
                          <v-text-field
                            v-validate="'required|confirmed:newPassword'"
                            v-model="item.confirmPassword"
                            :error-messages="
                              errors.collect('password_confirmation')
                            "
                            :label="$t('confirmPassword')"
                            name="password_confirmation"
                            type="password"
                            outlined
                            dense
                            rounded
                          />
                        </v-flex>
                        <v-flex xs8 offset-xs2 pb-0 pt-0>
                          <v-btn
                            @click="update"
                            rounded
                            block
                            outlined
                            type="submit"
                            color="primary"
                            >{{ $t("save") }}</v-btn
                          >
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import AccountService from "@/shared/services";

export default {
  data() {
    return {
      errorMessage: null,
      user: AccountService.getProfile(),
      item: {}
    };
  },
  methods: {
    update() {
      let filter = this.user.auth_token;
      delete this.item.confirmPassword;
      this.errorMessage = null;
      this.$validator.validateAll().then(valid => {
        if (valid) {
          api
            .resetPassword(this.item, path.passwordReset, filter)
            .then(res => {
              this.$notify({
                type: "success",
                title: this.$t("success"),
                message: `${this.$t("password")} ${this.$t(
                  "updated_successfully"
                )}`
              });
              AccountService.updateToken(res.tokenId);
            })
            .catch(err => {
              if (err.statusCode === 401) {
                this.errorMessage = err.message;
              }
            })
            .finally(() => {
              this.item = {};
            });
        }
      });
    }
  }
};
</script>

<style>
.tab-class {
  border: 1px solid #c0c0c0;
  background-color: white;
  border-radius: 1px;
}
</style>
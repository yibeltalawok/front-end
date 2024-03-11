<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 md12 lg12 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />

                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      label="Role name"
                      v-model="item.name"
                      name="role name"
                      :error-messages="errors.collect('role name')"
                      outlined
                      rounded
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-textarea
                      label="Description"
                      v-model="item.description"
                      outlined
                      rounded
                      dense
                    />
                    <div class="text-xs-right"></div>
                  </v-flex>
                  <v-flex xs12></v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <div class="text-center">
                      <v-btn
                        rounded
                        block
                        outlined
                        color="primary"
                        @click="save"
                        class="text-capitalize"
                      >Save Changes</v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api/";
export default {
  data() {
    return {
      item: {},
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Setting",
          disabled: true
        },
        {
          text: "Role",
          disabled: false,
          to: "/app/role/list"
        },
        {
          text: "Update Role",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { roleId } = this.$route.params;

    this.item = await api.get(roleId, path.userRole);
  },
  methods: {
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.errorMessage = null;
        try {
          await api.update(this.item, path.userRole);
          this.$notify({
            type: "primary",
            title: this.$t("primary"),
            text: `Role updated successfully`
          });
          this.$router.push({ name: "role-list" });
        } catch (err) {
          if (err.statusCode === 422) {
            const { messages } = err.details;
            this.errorMessage = messages;
          }
        }
      }
    }
  }
};
</script>
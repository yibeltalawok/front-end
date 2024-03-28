<template>
  <div>
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
                    <v-btn
                      rounded
                      outlined
                      block
                      color="primary"
                      class="text-capitalize"
                      @click="save"
                      >Save</v-btn
                    >
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
      path: path.userRole,
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Setting",
          disabled: true,
        },
        {
          text: "Role",
          disabled: false,
          to: "/app/role/list",
        },
        {
          text: "Add New Role",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.errorMessage = null;
        try {
          await api.create(this.item, path.userRole);
          this.$notify({
            type: "primary",
            title: this.$t("primary"),
            text: `Role Created Successfully`,
          });
          this.$router.push({ name: "role-list" });
        } catch (err) {
          if (err.statusCode === 422) {
            const { messages } = err.details;
            this.errorMessage = messages;
          }
        }
      }
    },
  },
};
</script>
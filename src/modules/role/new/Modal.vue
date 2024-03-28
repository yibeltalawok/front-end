<template>
  <v-form @submit.prevent="save">
    <form-error-messages :messages="errorMessage" />
    <v-card>
      <v-card-text>
        <v-container grid-list-xs>
          <v-text-field
            v-validate="'required'"
            outlined
            dense
            label="Role name"
            v-model="item.name"
            name="role name"
            :error-messages="errors.collect('role name')"
          />
          <v-textarea
            dense
            outlined
            label="Description"
            v-model="item.description"
          />
          <div class="text-center">
            <v-btn color="primary" @click="save">Save</v-btn>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import { api, path } from "@/api/";
export default {
  data() {
    return {
      item: {},
      path: path.userRole,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.errorMessage = null;
        try {
          await api.create(this.item, path.userRole);
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: `${this.$t(this.resourceName)} ${this.$t(
              "created"
            )} ${this.$t("successfully")}.`,
          });
          this.closeModal();
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

<style>
</style>

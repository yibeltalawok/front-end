<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-toolbar dense flat>
          <v-btn
            text
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push({ name: 'slabe-list' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md3 lg3 pa-2>
            <v-card outlined>
              <v-card-text>
                <v-text-field
                  v-model="item.performance"
                  :disabled="!isEditing"
                  dense
                  :label="$t('performance')"
                />
                <v-text-field
                  v-model="item.quality"
                  :disabled="!isEditing"
                  dense
                  :label="$t('quality')"
                />
                <v-text-field
                  v-model="item.discipline"
                  :disabled="!isEditing"
                  dense
                  :label="$t('discipline')"
                />
              </v-card-text>
              <v-toolbar flat dense>
                <v-btn
                  color="purple white--text"
                  fab
                  small
                  @click="isEditing = !isEditing"
                >
                  <v-icon v-if="isEditing">mdi-close</v-icon>
                  <v-icon v-else>mdi-pencil</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!isEditing"
                  small
                  color="primary"
                  @click="save"
                  >{{ $t("save") }}</v-btn
                >
              </v-toolbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card></v-container
    >
  </div>
</template>
<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      isEditing: null,
      model: null,

      item: {},
      size: 160,
    };
  },

  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let items = (await api.all(path.weightage)).rows;
      if (items.length > 0) {
        this.item = items[0];
      }
    },
    save() {
      if (this.item.id == null) {
        api
          .create(this.item, path.weightage)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Weightage",
              message: `Weightage is created successfully.`,
            });
            this.isEditing = !this.isEditing;
            this.loadData();
          })
          .catch((err) => {
            this.showErrors(err);
          });
      } else {
        api
          .update(this.item, path.weightage)
          .then(() => {
            this.$notify({
              type: "success",
              title: "Weightage",
              message: `Weightage update successfully.`,
            });
            this.isEditing = !this.isEditing;
            this.loadData();
          })
          .catch((err) => {
            this.showErrors(err);
          });
      }
    },
  },
};
</script>
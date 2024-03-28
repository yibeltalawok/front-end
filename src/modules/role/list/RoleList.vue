<template>
  <div class="roleMain">
    <v-card outlined class="addNewRole">
      <v-form @submit.prevent="save">
        <form-error-messages :messages="errorMessage" />
        <v-card-text>
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
          <div style="display: flex">
            <v-btn
              color="yellow"
              :disabled="validatedUpdate"
              @click="updateToDatabase()"
              >Update</v-btn
            >
            <v-spacer />
            <v-btn color="red" @click="reset">Reset</v-btn>
            <v-spacer />
            <v-btn color="primary" :disabled="validatedSave" @click="save"
              >Save</v-btn
            >
          </div>
        </v-card-text>
      </v-form>
    </v-card>

    <v-card outlined class="roleList" scrolable>
      <v-toolbar dense flat>
        <v-text-field
          hide-details
          flat
          prepend-inner-icon="search"
          color="primary"
          dense
          solo
          rounded
          v-model="search"
          :label="$t('search-role')"
        />
      </v-toolbar>
      <v-divider />
      <!-- <p>List of Registered Roles</p> -->

      <v-divider />
      <h4 v-if="items.length > 0" style="margin: 10px; color: green">
        Currently we have {{ items.length }} users!
      </h4>
      <h4 v-else style="margin: 10px; color: red">
        Currently we have {{ items.length }} users!
      </h4>
      <v-divider />

      <v-data-table
        :headers="headers"
        :pagination.sync="pagination"
        :loading="loading"
        :items="items"
        item-key="id"
        :total-items="totalItems"
        :rows-per-page-text="`${$t('drivers')} per page`"
      >
        <template slot="headerCell" slot-scope="props">
          <span class="table-header-text caption font-weight-bold">{{
            $t(props.header.text)
          }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            text
            color="primary"
            @click="update(item.id, item.name, item.description)"
          >
            <v-icon class="mr-2">edit</v-icon>
          </v-btn>
          <v-btn text color="red" @click="deleteItem(item.id, path)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { api, path } from "@/api/";
import { tableMixin } from "@/shared/mixins";

export default {
  methods: {
    async reset() {
      this.validatedUpdate = true;
      this.validatedSave = false;

      this.item.id = "";
      this.item.name = "";
      this.item.description = "";
    },
    //to save/update database based on input update
    async updateToDatabase() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.errorMessage = null;
        try {
          await api.update(this.item, path.userRole);
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: `Role updated successfully`,
          });
        } catch (err) {
          if (err.statusCode === 422) {
            const { messages } = err.details;
            this.errorMessage = messages;
          }
        }
        //Used to empty input value after save/reocrd new role
        this.item.id = "";
        this.item.name = "";
        this.item.description = "";

        //used to refreh table
        this.loadData();
      }
    },

    //it helps enable and disable update and save button
    async update(id, name, description) {
      if (this.validatedUpdate === true) {
        this.validatedUpdate = false;
        this.validatedSave = true;
      } else {
        this.validatedUpdate = true;
        this.validatedSave = false;
      }

      this.item.id = id;
      this.item.name = name;
      this.item.description = description;
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
        } catch (err) {
          if (err.statusCode === 422) {
            const { messages } = err.details;
            this.errorMessage = messages;
          }
        }
        //Used to empty input value after save/reocrd new role
        this.item.id = "";
        this.item.name = "";
        this.item.description = "";

        //used to refreh table
        this.loadData();
      }
    },
  },
  name: "Role List",
  mixins: [tableMixin],
  data() {
    return {
      validatedUpdate: true,
      validatedSave: false,
      item: {},
      path: path.userRole,
      filter: {},
      resource: api,
      resourceName: "role",
      searchField: "name",

      headers: [
        {
          text: "Name",
          align: "left",
          value: "name",
        },
        {
          text: "Description",
          value: "description",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style>
.roleMain {
  display: flex;
  width: 100%;
}

.roleList {
  width: 130%;
}

.addNewRole {
  width: 70%;
}
</style>

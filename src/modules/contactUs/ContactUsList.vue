<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({name:'contact-us'})"
          >
            <v-icon class="mx-2">message</v-icon>Send Message
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :loading="loading"
          :items="items"
          item-key="id"
          :total-items="totalItems"
          :rows-per-page-text="`${$t('messages')} per page`"
        >
          <template v-slot:item.sentAt="{ item }">
            <span>
              {{new Date(item.sentAt).
              toLocaleDateString("en-US")}}
            </span>
          </template>
          <template v-slot:item.read="{ item }">
            <span v-if="item.read==false">
              <b>Unread</b>
            </span>
            <span v-else>Read</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small text color="red" @click="deleteItem(item.id,path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
export default {
  mixins: [tableMixin],
  data() {
    return {
      path: path.contactUs,
      filter: {
        order: "date DESC",
      },
      resource: api,
      resourceName: "Message",
      searchField: "email",
      headers: [
        {
          text: "Date",
          value: "sentAt",
        },
        {
          text: "Full Name",
          value: "fullName",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Phone Number",
          value: "phoneNumber",
        },
        {
          text: "Message",
          value: "message",
        },
        {
          text: "Attachment",
          value: "attachment",
        },
        {
          text: "Status",
          value: "read",
        },
        {
          text: "Actions",
          sortable: false,
          align: "center",
          value: "action",
        },
      ],
    };
  },
};
</script>
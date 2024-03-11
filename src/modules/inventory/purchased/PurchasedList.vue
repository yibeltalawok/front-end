<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
        <v-toolbar dense flat>
          <div>
            <v-text-field
              hide-details
              flat
              prepend-inner-icon="search"
              color="primary"
              dense
              solo
              rounded
              v-model="search"
              :label="$t('search-purchased')"
            />
          </div>
          <v-spacer></v-spacer>
          <v-btn
            dense
            class="text-capitalize primary"
            @click="$router.push({ name: 'create-purchased' })"
          >
            {{ $t('addNew') }}
          </v-btn>
        </v-toolbar>
        <v-divider />

        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :items="purchased"
          item-key="id"
          :search="search"
          footer-props.items-per-page-text="`${$t('users')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{ $t(props.header.text) }}
            </span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              small
              text
              color="primary"
              @click="
                $router.push({
                  name: 'update-purchased',
                  params: { purchasedId: item.id },
                })
              "
            >
              <v-icon class="mr-2">edit</v-icon>
            </v-btn>
            <v-btn small text color="red" @click="deleteItem(item.id, path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from '@/api'
import { tableMixin, csvDownloadMixin } from '@/shared/mixins'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'UserList',
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      search: '',
      path: path.purchased,
      resource: api,
      headers: [
        {
          text: this.$t('Inventory'),
          value: 'inventory.inventoryName',
        },
        {
          text: this.$t('Purchased date'),
          value: 'purchaseDate',
        },
        {
          text: this.$t('Customer'),
          value: 'customer.customerName',
        },
        {
          text: this.$t('Type'),
          value: 'type',
        },
        {
          text: this.$t('action'),
          value: 'action',
        },
      ],
    }
  },
  computed: {
    ...mapState('inventory', ['purchased']),
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('inventory', ['getPurchased']),
    loadData() {
      this.getPurchased()
    },
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t('are_you_sure'), {
        buttonTrueText: this.$t('yes'),
        buttonFalseText: this.$t('no'),
      })
      if (confirmed) {
        await this.resource.remove(id, path)
        this.$notify({
          type: 'danger',
          title: 'Deleted!',
          message: `${this.resourceName} ${this.$t('deleted')} ${this.$t(
            'successfully',
          )}.`,
        })
        this.loadData()
      }
    },
  },
}
</script>

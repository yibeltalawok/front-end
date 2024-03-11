<template>
  <div>
    <v-container >
      <v-toolbar dense flat>
        <v-spacer />
        <v-btn
          class="text-capitalize white--text amber "
          small
          @click="$router.push({ name: 'inventory-creation' })"
        >
          {{ $t('addNew') }}
        </v-btn>

        <v-btn icon color="amber">
          <v-icon>help</v-icon>
        </v-btn>

      </v-toolbar>

            <inventoryCardView
              :cards="inventory"
              @deleteInv="localDeleteInventory"
            />

      <v-card flat outlined style="margin-top: 30px;">
        <v-toolbar dense flat>
          <v-combobox
            v-model="scategory"
            background-color="white"
            item-color="black"
            light
            hideDetails
            dense
            :label="$t('byCategory')"
            :items="category"
            item-text="categoryName"
            item-value="categoryId"
            style="max-width: 20%;"
            flat
            @input="getCategoryName(scategory.id)"
          />
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <inventoryCardView :cards="idInventory" />
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import inventoryCardView from './cardView.vue'
export default {
  data() {
    return {
      scategory: '',
      item: {},
      items: [],
      filteredItem: [],
    }
  },
  components: {
    inventoryCardView,
  },
  computed: {
    ...mapState('inventory', [
      'inventory',
      'idInventory',
      'inventoryImage',
      'category',
    ]),
  },
  mounted() {
    this.getInventory().then((res) => {
      res

      if (this.inventory.length > 0) {
        this.getCategoryName(this.inventory[0].categoryId)
      }
    })

    this.getCategory()
  },
  methods: {
    ...mapActions('inventory', [
      'getInventory',
      'getProfileImage',
      'deleteInventory',
      'getCategory',
      'filterByCategory',
    ]),
    getCategoryName(categoryId) {
      this.filterByCategory(categoryId)
    },
    async localDeleteInventory(e) {
      await this.deleteInventory(e).then((re) => {
        re
        this.getInventory()
      })
    },
  },
}
</script>

<style scoped></style>

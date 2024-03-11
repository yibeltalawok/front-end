<template>
  <div>
    <v-container grid-list-xs>
      <v-card flat style="border-radius: 12px;">
        <v-row dense flat>
          <v-spacer></v-spacer>
          <v-btn
            dense
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="createProductDialog()"
          >
            {{ $t('addNew') }}
          </v-btn>
        </v-row>


        <createProduct :createProductDialog="showCreateProductDialog" />

        <productCardView :cards="productData" />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import createProduct from './createProduct'
import productCardView from './ProductCardView.vue'

export default {
  components: {
    createProduct,
    productCardView,
  },
  data() {
    return {
      showCreateProductDialog: false,
    }
  },
  computed: {
    ...mapState('inventory', ['productData']),
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('inventory', ['getProduct']),
    loadData() {
      this.getProduct()
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
          message: `${'data'} ${this.$t('deleted')} ${this.$t(
            'successfully',
          )}.`,
        })
        this.loadData()
      }
    },

    createProductDialog() {
      if (this.showCreateProductDialog === false)
        this.showCreateProductDialog = true
      else this.showCreateProductDialog = false
    },
  },
}
</script>

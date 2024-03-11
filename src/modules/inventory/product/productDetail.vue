<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
        <v-toolbar flat outlined class="mb-4">
          <v-spacer />

          <h3>
            {{ $t('The product') }}
            <e>
              <b style="color: green;" class="ml-1 mr-1">
                ''{{ item.productName }}''
              </b>
            </e>
            {{ $t(' detail ') }}
          </h3>

          <v-spacer />
          <v-spacer />
          <v-spacer />
          <v-spacer />
          <v-spacer />
          <v-spacer />
          <v-spacer></v-spacer>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-layout row>
            <v-flex xs12 sm4 md4 lg4>
              <img :src="item.imagePath" style="width: 70%; height: 90%;" />
            </v-flex>

            <v-flex xs12 sm4 md4 lg4>
              <v-layout column wrap>
                <p>
                  <b>{{ $t('Product code') }}:</b>
                  {{ item.productCode }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Product name') }}:</b>
                  {{ item.productName }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Unit of measure') }}:</b>
                  {{ item.unitofMeasure }}
                </p>
                <p>
                  <b>{{ $t('Stock') }}:</b>
                  {{ item.stock }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Safety stock') }}:</b>
                  {{ item.safetyStock }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Waranty Period') }}:</b>
                  {{ item.warantyperiod }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Expirable') }}:</b>
                  {{ item.expirable }}
                </p>
              </v-layout>
            </v-flex>

            <v-flex xs12 sm4 md4 lg4>
              <v-layout column wrap>
                <p>
                  <b>{{ $t('Brand') }}:</b>
                  {{ item.brand }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Description') }}:</b>
                  {{ item.description }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('Expire Date') }}:</b>
                  {{ item.expiredate }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('minimum Order Quantity') }}:</b>
                  {{ item.minimumOrderQt }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('weight Per Unit') }}:</b>
                  {{ item.weightPerUnit }}
                </p>
                <p>
                  <b>{{ $t('standard Selling Rate') }}:</b>
                  {{ item.standardSellingRate }}
                </p>
                <v-spacer></v-spacer>
                <p>
                  <b>{{ $t('category') }}:</b>
                  {{ categoryName }}
                </p>
                <!-- <v-spacer></v-spacer>
                  <p>
                    <b>{{ $t("gender") }}:</b>
                  </p> -->
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
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
      item: {},
      search: '',
      path: path.purchased,
      categoryName: '',
      resource: api,
    }
  },
  async created() {
    const { productId } = this.$route.params
    this.item = await api.get(productId, path.product)

    await this.getProfileImage(['product/download', this.item.imagePath])
    this.item.imagePath = this.productImage

    this.items.categoryId
    await api.get(this.item.categoryId, path.category).then((res) => {
      res
      this.categoryName = res.categoryName
    })
  },
  computed: {
    ...mapState('inventory', ['productData', 'productImage']),
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('inventory', ['getProduct', 'getProfileImage']),
    loadData() {
      this.getProduct()
    },
  },
}
</script>

<template>
  <div>
    <v-card wrap outlined style="border-radius: 1px;">
      <v-card-text>
        <v-form @submit.prevent="save" ref="form" lazy-validation>
          {{ categoryExist }}
          <v-alert
            v-if="categoryExist === true"
            type="error"
            class="erroralert"
          >
            Category Exist!
          </v-alert>
          <v-layout row justify-center my-3>
            <v-flex xs12 sm12 md12 lg12 pa-2>
              <v-layout column wrap justify-center my-3>
                <v-flex xs12 sm12 md9 lg9 pa-2>
                  <v-text-field
                    :label="$t('date')"
                    placeholder="yyyy-mm-dd"
                    dense
                    outlined
                    v-model="item.date"
                    hide-details
                    name="date"
                    type="date"
                  />
                </v-flex>
                <v-flex xs12 sm12 md9 lg9 pa-2>
                  <v-text-field
                    dense
                    :label="$t('categoryName')"
                    v-model="item.categoryName"
                    outlined
                    :rules="inputRule"
                    @input="validateExisting(item.categoryName)"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm12 md9 lg9 pa-2>
                  <v-text-field
                    dense
                    :label="$t('createdBy')"
                    v-model="item.createdBy"
                    outlined
                    disabled
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      messageAlert: '',
      inputRule: [(v) => !!v || 'This field is required'],
    }
  },
  name: 'CategoryPopup',
  props: ['item'],
  computed: {
    ...mapState('inventory', ['categoryExist']),
  },
  methods: {
    ...mapActions('inventory', ['checkCategoryExistance']),

    async validateExisting(categoryName) {
      this.checkCategoryExistance(categoryName)
    },
  },
}
</script>

<style scoped>
.erroralert {
  font-size: 11px;
  padding: 10px;
}
</style>

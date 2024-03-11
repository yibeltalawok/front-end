<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize primary--text"
            @click="$router.push({ name: 'purchased-list' })"
          >
            <v-icon class="mx-3">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            @submit.prevent="save"
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-layout row justify-center my-3>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-layout column wrap justify-center my-3>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-autocomplete
                      :label="$t('Inventory')"
                      :items="inventory"
                      item-text="inventoryName"
                      item-value="id"
                      name="inventoryId"
                      outlined
                      dense
                      :rules="inputRule"
                      v-model="item.inventoryId"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      :label="$t('Purchased date')"
                      placeholder="yyyy-mm-dd"
                      dense
                      outlined
                      v-model="item.purchaseDate"
                      hide-details
                      name="date"
                      type="date"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
                    <v-autocomplete
                      :label="$t('Customer')"
                      :items="customer"
                      item-text="customerName"
                      item-value="id"
                      name="customorId"
                      outlined
                      dense
                      :rules="inputRule"
                      v-model="item.customerId"
                    />
                  </v-flex>

                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      label="Type"
                      v-model="item.type"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>
                  <v-layout row justify-center>
                    <v-flex xs6 sm6 md5 lg5>
                      <v-btn class="primary" @click="save">Save </v-btn>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      item: {},
      inputRule: [v => !!v || "This field is required"]
    };
  },
  async created() {
    const { purchasedId } = this.$route.params;
    this.item = await api.get(purchasedId, path.purchased);
    this.getCustomer();
    this.getInventory();
  },
  computed: {
    ...mapState("inventory", ["customer", "inventory"])
  },
  methods: {
    ...mapActions("inventory", ["getCustomer", "getInventory"]),
    save() {
      if (this.$refs.form.validate()) {
        api
          .update(this.item, path.purchased)
          .then(() => {
            this.$router.push({ name: "purchased-list" });
            this.$notify({
              type: "success",
              title: this.$t("update purchased"),
              message: `${this.$t("purchased")} ${this.$t(
                "updated Successfully"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
    }
  }
};
</script>
<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <p class="mt-3">Update category</p>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save" ref="form" lazy-validation>
            <v-layout row justify-center my-3>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-layout column wrap justify-center my-3>
                  <v-flex xs12 sm12 md7 lg7 pa-2>
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
                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('categoryName')"
                      v-model="item.categoryName"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md7 lg7 pa-2>
                    <v-text-field
                      dense
                      :label="$t('createdBy')"
                      v-model="item.createdBy"
                      outlined
                      disabled
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-layout row justify-center>
                    <v-flex xs6 sm6 md5 lg5>
                      <v-btn class="primary" @click="save"
                        >{{ $t("save") }}
                      </v-btn>
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
import { path } from "@/api";
import AccountService from "@/shared/services";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      user: AccountService.getProfile(),
      item: {},
      categoryId: "",
      inputRule: [v => !!v || "This field is required"]
    };
  },
  async created() {
    const { categoryId } = this.$route.params;
    this.categoryId = categoryId;
    this.getDataById([this.categoryId, path.category]).then(res => {
      res;
      this.item = this.itemById;
    });
    // this.item = await api.get(this.categoryId, path.category);
  },
  computed: {
    ...mapState("inventory", ["itemById"])
  },
  methods: {
    ...mapActions("inventory", ["updateData", "getDataById"]),
    save() {
      if (this.$refs.form.validate()) {
        this.updateData([this.item, path.category])
          .then(() => {
            this.$router.push({ name: "category-list" });
            this.$notify({
              type: "success",
              title: this.$t("create category"),
              message: `${this.$t("category")} ${this.$t(
                "registered Successfully"
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
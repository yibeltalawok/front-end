<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px; padding-left: 20px; padding-right: 20px">
        <v-toolbar dense flat>
          <p class="mt-3">Create Supplier</p>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form @submit.prevent="save" ref="form" class="mt-4" lazy-validation>
          <v-layout row >

                <v-flex class="ml-3 mt-2 mr-1" xs12 sm12 md4 lg4 >
                  <v-text-field
                    dense
                    :label="$t('supplierCode')"
                    v-model="item.supplierCode"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>

                <v-flex class="mt-2 mr-1" xs12 sm12 md4 lg4 >
                  <v-text-field
                    dense
                    :label="$t('supplierName')"
                    v-model="item.supplierName"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>

                <v-flex class="mt-2" xs12 sm12 md3 lg3 >
                  <v-text-field
                    dense
                    :label="$t('postalCode')"
                    v-model="item.postalCode"
                    outlined
                    :rules="inputRule"
                  ></v-text-field>
                </v-flex>

                  <v-flex class="ml-3 mr-2" xs12 sm12 md3 lg3>
                    <v-text-field
                      dense
                      :label="$t('taxRate')"
                      v-model="item.taxRate"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex class="mr-2" xs12 sm12 md4 lg4 >
                    <v-text-field
                      dense
                      :label="$t('country')"
                      v-model="item.country"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                  <v-flex class="mr-2" xs12 sm12 md4 lg4>
                    <v-text-field
                      dense
                      :label="$t('city')"
                      v-model="item.city"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                 <v-flex class="ml-3" xs12 sm12 md3 lg3>
                    <v-text-field
                      dense
                      :label="$t('phone number')"
                      v-model="item.phoneNumber"
                      outlined
                      :rules="inputRule"
                    ></v-text-field>
                  </v-flex>

                    <v-flex class="mr-2" xs12 sm12 md3 lg3 >
                      <v-text-field
                        dense
                        :label="$t('latitude')"
                        v-model="location[0]"
                        outlined
                        :rules="inputRule"
                      ></v-text-field>
                    </v-flex>

                    <v-flex class="mr-2" xs12 sm12 md3 lg3>
                      <v-text-field
                        dense
                        :label="$t('longtude')"
                        v-model="location[1]"
                        outlined
                        :rules="inputRule"
                      ></v-text-field>
                    </v-flex>
                    
                   </v-layout>
               <v-layout row justify-center>
             <v-flex class="mb-5" xs6 sm6 md5 lg5 pa-2>
              <v-btn small class="pl-9 pr-9 white--text" color="amber" @click="save">{{ $t("save") }} </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import {path} from "@/api"
export default {
  data() {
    return {
       location: [0, 0],
       item: {
        location: []
      },
      pathContainer: path.container,
      inputRule: [(v) => !!v || "This field is required"],
    };
  },
  async created() {},
  methods: {
    ...mapActions("inventory", ["postData", "postsuplier"]),
    async save() {
      if (this.$refs.form.validate()) {
          if (this.profileDone) {
          this.uploadPicture(this.selectedFileSupplier);
         // alert(this.selectedFileSupplier[0])
        }
          this.item.location = [
          parseFloat(this.location[0]),
          parseFloat(this.location[1])
        ];
        //alert(this.item.location[0])
      this.postsuplier([this.item]).then(() => {
        this.$router.push({ name: "suplier-list" });
      });

    }
    },



  },
};
</script>

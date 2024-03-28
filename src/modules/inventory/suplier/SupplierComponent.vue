<template>

  <div>
    <v-card wrap outlined style="border-radius:1px">
       <v-card-text>
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <v-layout row justify-center my-3>
                  <v-flex xs12 sm12 md12 lg12 pa-5>
                    <v-layout column wrap justify-center my-3>

                      <v-layout row justify-center pt-2>
                        <!-- Col -1 -->
                        <v-flex xs12 sm12 md4 lg4 pr-2>
                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12 >
                            <v-text-field
                              dense
                              :label="$t('supplierCode')"
                              v-model="item.supplierCode"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12 >
                            <v-text-field
                              dense
                              :label="$t('supplierName')"
                              v-model="item.supplierName"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2" xs12 sm12 md12 lg12 >
                            <v-text-field
                              dense
                              :label="$t('postalCode')"
                              v-model="item.postalCode"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>
                        </v-flex>

                        <!-- Col -2 -->
                        <v-flex xs12 sm12 md4 lg4 pr-2>
                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12>
                            <v-text-field
                              dense
                              :label="$t('taxRate')"
                              v-model="item.taxRate"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12 >
                            <v-text-field
                              dense
                              :label="$t('country')"
                              v-model="item.country"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2" xs12 sm12 md12 lg12>
                            <v-text-field
                              dense
                              :label="$t('city')"
                              v-model="item.city"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>
                        </v-flex>

                        <!-- Col -3 -->
                        <v-flex xs12 sm12 md4 lg4>
                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12>
                            <v-text-field
                              dense
                              :label="$t('phone number')"
                              v-model="item.phoneNumber"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2 mr-1" xs12 sm12 md12 lg12 >
                            <v-text-field
                              dense
                              :label="$t('latitude')"
                              v-model="location[0]"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>

                          <v-flex class="mt-2" xs12 sm12 md12 lg12>
                            <v-text-field
                              dense
                              :label="$t('longtude')"
                              v-model="location[1]"
                              outlined
                              :rules="inputRule"
                            ></v-text-field>
                          </v-flex>
                        </v-flex>
                      </v-layout>
                      
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>     
    </v-card>
  </div>
</template>
<script>
export default {

    data(){
        return{
            inputRule: [v => !!v || "This field is required"],
        }
    },
    name: "SupplierComponent",
    props: ["item", "location"],
    computed: {
        
    }
}
</script>

<style scoped>

</style>
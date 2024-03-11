<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
                <v-toolbar flat outlined class="mb-4">
          <v-spacer />
          <v-spacer/>
                    <h3>{{ $t("The Supplier")}}
                   <e><b class="ml-1 mr-1"> {{item.supplierName}}</b></e>
                   {{ $t(" detail ") }}</h3>
          <v-spacer/>
          <v-spacer />
          <v-spacer/>
         <v-spacer/>
          <v-spacer />
          <v-spacer/>
          <v-spacer></v-spacer>
          <v-spacer/>
        </v-toolbar>
      <v-card-text>
        <v-layout row>
          <v-flex class="ml-5" xs12 sm12 md5 lg5>
                <v-layout column wrap>
                  <p>
                    <b>{{ $t("supplier code") }}:</b>
                    {{item.supplierCode}}

                  </p>
                  <v-spacer></v-spacer>
                  <p>
                    <b>{{ $t("supplier name") }}:</b>
                    {{item.supplierName}}
                  </p>
                  <v-spacer></v-spacer>
                  <p>
                    <b>{{ $t("taxRate") }}:</b>
                    {{item.taxRate}}
                  </p>
                  <p>
                    <b>{{ $t("country") }}:</b>
                    {{item.country}}
                  </p>
                 <v-spacer></v-spacer>
                 <p>
                  <b>{{ $t("city") }}:</b>
                    {{item.city}}
                  </p>
                  <v-spacer></v-spacer>
                  <p>
                    <b>{{ $t("postal Code") }}:</b>
                    {{item.postalCode}}
                  </p>
                 </v-layout>
                </v-flex>
        </v-layout>
      </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  name: "UserList",
  data() {
    return {
      item:{},
      resource: api,

    };
  },
  async created(){
    const {supplierId } = this.$route.params;
    this.item = await api.get(supplierId, path.supplier) 
  },
  computed: {
    ...mapState("inventory", ["productData"])
  },
  mounted() {
    this.loadData();
  },
  methods: {
    ...mapActions("inventory", ["getProduct"]),
    loadData() {
      this.getProduct();
    },

  }
};
</script>
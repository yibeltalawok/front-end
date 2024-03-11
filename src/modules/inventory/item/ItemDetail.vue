<template>
  <div>
    <v-container grid-list-xs>
      <v-fab-transition>
      <v-card v-if="item != undefined" outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'item-list',
                params: { inventoryId: inventoryId }
              })
            "
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>

        <v-card-text>
          <v-layout row wrap justify-center>

            <v-flex xs12 sm12 md5 lg5 pa-3>
              <v-card height="100%" outlined>
                <v-card-text>
                  <v-layout column justify-center align-left ml-5 mt-5>
                    <p>
                      <b>{{ $t("itemNumber") }}:</b>
                      {{ item.itemNumber }}
                    </p>
                    <p>
                      <b>{{ $t("binCardNumber") }}:</b>
                      {{ item.binCardNumber }}
                    </p>
      
                    <p>
                      <b>{{ $t("itemName") }}:</b>
                      {{ item.itemName }}
                    </p>
                    <p>
                      <b>{{ $t("type") }}:</b>
                      {{ item.materialType }}
                    </p>
                    <p>
                      <b>{{ $t("inHouse Date") }}:</b>
                      {{ item.inHouseDate }}
                    </p>
                    <p>
                      <b>{{ $t("state") }}:</b>
                      {{ item.materialStatus }}
                    </p>
                    <p>
                      <b>{{ $t("description") }}:</b>
                      {{ item.description }}
                    </p>
                    <p>
                    
                      <b>{{ $t("inventory") }}:</b>
                      {{ item.inventory.inventoryName }}
                    </p>
                    <p>
                      <b>{{ $t("purchasedDate") }}:</b>
                      {{ item.purchasedDate }}
                    </p>
                    
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 sm12 md5 lg5 pa-3>
              <v-card height="100%" outlined>
                <v-card-text>
                  <v-layout column justify-center align-left ml-5 mt-5>
                    <p>
                      <b>{{ $t("supplier") }}:</b>
                      {{ item.supplier.supplierName }}
                    </p>
                      <p>
                      <b>{{ $t("unitOfMeasure") }}:</b>
                      {{ item.unitOfMeasure }}
                    </p> 
                    <p>
                    
                      <b>{{ $t("color") }}:</b>
                      {{ item.color }}
                    </p>
                    <p>
                      <b>{{ $t("invoiceNo") }}:</b>
                      {{ item.invoiceNo }}
                    </p>
                    <p>
                    
                      <b>{{ $t("unitprice") }}:</b>
                      {{ item.unitPrice }}
                    </p>
                    <p>
                      <b>{{ $t("Total Quantity") }}:</b>
                      {{ item.totalQuantity }}
                    </p>
                    <p>
                      <b>{{ $t("totalPrice") }}:</b>
                      {{ item.totalPrice }}
                    </p>
                      <p>
                      <b>{{ $t("poNo.") }}:</b>
                      {{ item.poNo }}
                    </p>

                      <p>  
                      <b>{{ $t("GRN num") }}:</b>
                      {{ item.GRNno }}
                    </p>
              
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

          </v-layout>
        </v-card-text>
      </v-card>
      </v-fab-transition>
    </v-container>
  </div>
</template>

<script>
import { path } from "@/api";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      item: undefined,
      inventoryId: "",
      itemId: "",
      inputRule: [v => !!v || "This field is required"]
    };
  },
  computed: {
    ...mapState("inventory", ["itemById"])
  },
  async created() {
    const { inventoryId, itemId } = this.$route.params;
    this.inventoryId = inventoryId;
    this.itemId = itemId;
    let filter = { include: ["inventory", "supplier"] };
    this.getDataByIdWithF([itemId, path.item, filter])
      .then(result => {
        result;
        this.item = this.itemById;
      })
      .catch(err => {
        err;
      });
    // this.item = await api.get(itemId, path.item, filter);
  },
  methods: {
    ...mapActions("inventory", ["getDataByIdWithF"])
  }
};
</script>

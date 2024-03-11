 <template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize primary--text"
            @click="
              $router.push({
                name: 'item-list',
                params: { inventoryId: inventoryId }
              })
            "
          >
            <v-icon class="mx-3">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout wrap row pa-3>
           <h4 class="">Update Item</h4>
            <!-- <v-divider style="width: 50%;"></v-divider> -->
            <br />
        </v-layout>

        <ItemComponent :item="item" :supplier="this.supplier" :items="this.items" :priceValue="priceValue" />
              

        <v-layout row wrap float-right>
          <v-flex style="margin-top: -80px; margin-right: 90px">
            <v-btn
              small
              rounded
              color="amber"
              class="text-capitalize white--text"
              style="margin-left: 30%"
              width = "100px"
              @click="save"
              
            >
              {{ $t('update') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { path } from "@/api";
import ItemComponent from "./ItemComponent"
export default {
  data() {
    return {
      item: {},
      inventoryId: "",
      itemId: "",
      items: ["Available", "Not Available", "Maintenance"],
      inputRule: [v => !!v || "This field is required"]
    };
  },

  components: {
    ItemComponent
  },

  async created() {
    const { inventoryId, itemId } = this.$route.params;
    this.inventoryId = inventoryId;
    this.itemId = itemId;
    this.getDataById([itemId, path.item]).then(() => {
      this.item = this.itemById;
    });
    this.getSupplier();
  },
  computed: {
    ...mapState("inventory", ["customer" , "supplier" ,  "itemById"])
  },
  methods: {
    ...mapActions("inventory", ["getCustomer", "getSupplier", "updateData", "getDataById"]),
    save() {
        this.updateData([this.item, path.item])
          .then(() => {
            this.item = {};
            this.$router.push({
              name: "item-list",
              params: { inventoryId: this.inventoryId }
            });
            this.$notify({
              type: "success",
              title: this.$t("Update item"),
              message: `${this.$t("item")} ${this.$t(
                "registered Successfully"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      
    },
        priceValue(){
     this.item.totalPrice= parseFloat(this.item.totalQuantity)*parseFloat(this.item.unitPrice)
     },
  }
};
</script>
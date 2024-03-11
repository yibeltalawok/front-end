<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar>
          <v-btn
            text
            class="text-capitalize"
            @click="$router.push({ name: 'order' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            <!-- <v-icon class="mx-3">mdi-chevron-left</v-icon> -->
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout justify-center row>
          <v-flex xs12 sm12 md4 lg4>
            <v-card outlined height="100%">
              <v-card-text>
                <p>
                  <b>{{ $t("created date") }}</b>
                  :{{ item.date }}
                </p>
                <p>
                  <b>{{ $t("shipmentDate") }}</b>
                  :{{ item.shipmentDate }}
                </p>
                <p>
                  <b>{{ $t("customer") }}</b>
                  :{{ customerName }}
                </p>
                 <p>
                  <b>{{ $t("product") }}</b>
                  :{{ productName }}
                </p>
                <p>
                  <b>{{ $t("styleName") }}</b>
                  :{{ item.styleName }}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4>
            <v-card outlined height="100%">
              <v-card-text>
                <p>
                  <b>{{ $t("po_number") }}</b>
                  :{{ item.poNo }}
                </p>
                <p>
                  <b>{{ $t("extra") }}</b>
                  :{{ item.extra }}
                </p>

                <p>
                  <b>{{ $t("orderQuantity") }}</b>
                  :{{ item.quantity }}
                </p>
                <p>
                  <b>{{ $t("extra") }}</b>
                  :{{ item.extra }}
                </p>
                <p>
                  <b>{{ $t("actualOrder") }}</b>
                  :{{ item.actualOrder }}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4>
            <v-card outlined height="100%">
              <v-card-text>
                <p>
                  <b>{{ $t("styleNumber") }}</b>
                  :{{ item.styleNumber }}
                </p>
                <p>
                  <b>{{ $t("orderNumber") }}</b>
                  :{{ item.orderNumber }}
                </p>
                <p>
                  <b>{{ $t("design") }}</b>
                  :{{ item.design }}
                </p>
                <p>
                  <b>{{ $t("fabricDescription") }}</b>
                  :{{ item.fabricDescription }}
                </p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12>
            <table>
              <thead>
                <tr>
                  <th colspan="2" class="title">{{ $t("size") }}</th>
                  <th v-for="size in item.data" :key="size.size">
                    {{ size.size }}
                  </th>
                </tr>
              </thead>
              <tr>
                <th>{{ $t("color") }}</th>
                <th>{{ $t("ratio") }}</th>
                <td v-for="size in item.data" :key="size.ratio">
                  {{ size.ratio }}
                </td>
              </tr>
              <tr v-for="(col, i) in color" :key="col.color">
                <td>{{ col.color }}</td>
                <td>{{ col.ratio }}</td>
                <td v-for="(size, j) in parseInt(item.data.length)" :key="j">
                  {{ value[j + i * item.data.length] }}
                </td>
              </tr>
              <tr>
                <th colspan="2" class="title">{{ $t("total") }}</th>
                <th v-for="size in item.data" :key="size.total">
                  {{ size.total }}
                </th>
              </tr>
            </table>

            <v-layout row justify-center>
              <v-flex xs10 sm10 md3 lg3 pa-3>
                <v-btn
                  outlined
                  rounded
                  block
                  color="primary"
                  @click="
                    $router.push({ name: 'update-order', params: item.id })
                  "
                  >{{ $t("change_info") }}</v-btn
                >
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { path,api } from "@/api";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      productName:"",
      colors: [],
      item: [],
      orderId: "",
      displaydColor: [],
      color: [],
      ratio: [],
      value: []
    };
  },
  computed: {
    ...mapState("inventory", ["itemById"])
  },
  async created() {
    const { orderId } = this.$route.params;
    this.item = await api.get(orderId, path.order) 
     await api.get(this.item.productId,path.product).then(res => {
       res;
    this.productName=res.productName
     });
     await api.get(this.item.CustomerId,path.customer).then(res => {
       res;
    this.customerName=res.customerName
     });
    this.orderId = orderId;
    // this.item = await api.get(this.orderId, path.order);
    await this.getDataById([this.orderId, path.order]).then(() => {
      this.item = this.itemById;
      for (let i = 0; i < this.item.data[0].colors.length; i++) {
        for (let j = 0; j < this.item.data.length; j++) {
          this.value.push(this.item.data[j].colors[i].value);
        }
      }
      for (let i = 0; i < this.item.data[0].colors.length; i++) {
        this.color.push({
          color: this.item.data[0].colors[i].color,
          ratio: this.item.data[0].colors[i].ratio
        });
      }
    });
    },
  methods: {
    ...mapActions("inventory", ["getDataById"])
  }
};
</script>


<style lang="css" scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid black;
  text-align: center;
  padding: 1px;
  font-size: 14px;
}
th {
  cursor: pointer;
}
</style>
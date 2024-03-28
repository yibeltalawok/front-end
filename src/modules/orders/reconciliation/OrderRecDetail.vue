<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({name:'order-rec'})"
          >
            <v-icon>arrow_back</v-icon>
            {{$t('go_back')}}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md12 lg12 pa-2>
              <v-card outlined>
                <v-card-text>
                  <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md2 lg2 pa-2>
                      <b>{{$t('orderNumber')}}</b>
                      :
                      <span class="success--text">{{item.order.orderNumber}}</span>
                    </v-flex>
                    <v-flex xs12 sm12 md2 lg2 pa-2>
                      <b>{{$t('orderNumber')}}</b>
                      :
                      <span class="success--text">{{item.order.styleNumber}}</span>
                    </v-flex>

                    <v-flex xs12 sm12 md3 lg3 pa-2>
                      <b>{{$t('styleName')}}</b>
                      :
                      <span class="success--text">{{item.order.styleName}}</span>
                    </v-flex>

                    <v-flex xs12 sm12 md2 lg2 pa-2>
                      <b>{{$t('orderQuantity')}}</b>
                      :
                      <span class="success--text">{{item.order.quantity}}</span>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex 2 sm12 md4 lg4 pa-2>
              <v-card outlined>
                <v-card-text>
                  <p>
                    <b>{{$t('planned-consumption-per-piece')}}:</b>
                    {{item.plannedFabricConsumed}}
                  </p>
                  <p>
                    <b>{{$t('actual-consumption-per-piece')}}:</b>
                    {{item.fabricConsumption}}
                  </p>
                  <p>
                    <b>{{$t('total-planned-fabric')}} :</b>
                    {{item.totalPlennedFabric}}
                  </p>
                  <p>
                    <b>{{$t('actual-fabric-consumed')}}:</b>
                    {{item.actualFabricConsumed}}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex 2 sm12 md4 lg4 pa-2>
              <v-card outlined height="100%">
                <v-card-text>
                  <p>
                    <b>{{$t('extra-fabric-consumed')}} :</b>
                    {{item.extra}}
                  </p>

                  <p>
                    <b>{{$t('actual-shipment')}}:</b>
                    {{item.actualShipment}}
                  </p>

                  <p>
                    <b>{{$t('rejected-piece')}}:</b>
                    {{item.rejectedPiece}}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 pa-2></v-flex>
            <v-flex xs12 sm12 md4 lg4 pa-2>
              <v-btn
                rounded
                outlined
                color="primary"
                class="text-capitalize"
                @click="
                $router.push({
                  name: 'update-order-rec',
                  params: { orderRecId: orderRecId }
                })
              "
              >
                <v-icon class="mx-2">edit</v-icon>
                {{$t('change_info')}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      item: {},
      orderRecId: "",
      filter: {
        include: ["order"]
      }
    };
  },
  async created() {
    const { recId } = this.$route.params;
    this.orderRecId = recId;
    this.item = await api.get(recId, path.reconciliation, this.filter);
  }
};
</script>
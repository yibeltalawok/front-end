<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn text class="text-capitalize primary--text" @click="$router.push({name:'tna'})">
            <v-icon class="mx-3">arrow_back</v-icon>
            {{$t('go_back')}}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <v-layout row wrap justify-center my-3>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('order-recieving-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.recievingDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('order-confirmation-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.confirmationDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-cut-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.startPlannedCutDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-cut-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.startActualCutDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-cut-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.endPlannedCutDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-cut-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.endActualCutDate"
                  name="cutDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-sewing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedSewingStart"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-sewing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualSewingStart"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-sewing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedSewingEnd"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="('actual-sewing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualSewingEnd"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-finishing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedFinishStart"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-finishing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualFinishStart"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-finishing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedFinishEnd"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-finishing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualFinishEnd"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-packing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedPackingStart"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-packing-start-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualPackedStart"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-packing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedPackingEnd"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('actual-packing-end-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualPackedEnd"
                  type="date"
                />
              </v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="$t('planned-shipping-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.plannedShippingDate"
                  type="date"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-text-field
                  :label="('actual-shipping-date')"
                  placeholder="yyyy-mm-dd"
                  dense
                  outlined
                  v-model="item.actualShipedDate"
                  type="date"
                />
              </v-flex>
              <v-flex xs12></v-flex>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-btn
                  color="primary"
                  outlined
                  block
                  class="text-capitalize"
                  rounded
                  @click="save"
                >{{$t('save')}}</v-btn>
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
export default {
  data() {
    return {
      item: {},
      orders: [],
      filter: {
        include: ["order"],
        where: {}
      }
    };
  },
  async created() {
    const { tnaId } = this.$route.params;
    this.orders = (await api.all(path.order)).rows;
    this.item = await api.get(tnaId, path.timeAction, this.filter);
  },
  methods: {
    save() {
      api
        .update(this.item, path.timeAction)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Time and Action",
            message: `Time and Action Calendar information successfully updated.`
          });
          this.$router.push({ name: "tna" });
        })
        .catch(() => {
          this.$notify({
            type: "red",
            title: "Failure",
            message: `Failed to update the information. Try later on.`
          });
        });
    }
  }
};
</script>
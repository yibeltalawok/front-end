<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-text-field
            solo
            flat
            dense
            hide-details
            :label="$t('search-for-style')"
            prepend-inner-icon="search"
            v-model="search"
          />

          <v-spacer></v-spacer>

          <v-btn
            rounded
            small
            class="text-capitalize primary"
            @click="(dialog = true), (disablePoloshirt = false)"
            >{{ $t("addNew") }}</v-btn
          >

          <v-btn icon
          @click="refresh()"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.lastDateOfRevision="{ item }">
            <span>
              {{
                new Date(item.lastDateOfRevision).toLocaleDateString("en-US")
              }}
            </span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-menu bottom left transition="slide-x-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  rounded
                  small
                  v-on="on"
                  color="primary"
                  class="text-capitalize"
                  >{{ $t("clickHere") }}</v-btn
                >
              </template>

              <v-card>
                <v-btn
                  text
                  small
                  color="teal"
                  class="text-capitalize"
                  @click="
                    $router.push({
                      name: 'moduleDetails',
                      params: { styleId: item.id }
                    })
                  "
                  >{{ $t("modules") }}</v-btn
                >

                <v-btn
                  text
                  small
                  color="primary"
                  class="text-capitalize"
                  @click="
                    $router.push({
                      name: 'operation-list',
                      params: { styleId: item.id }
                    })
                  "
                  >{{ $t("operation") }}</v-btn
                >

                <v-btn
                  text
                  small
                  color="success"
                  class="text-capitalize"
                  @click="
                    $router.push({
                      name: 'style-detail',
                      params: { styleId: item.id }
                    })
                  "
                  >{{ $t("more_detail") }}</v-btn
                >
                <v-btn
                  text
                  small
                  color="info"
                  class="text-capitalize"
                  @click="updateOrder(item)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  text
                  small
                  color="success"
                  class="text-capitalize"
                  @click="deleteItem(item.id, path)"
                >
                  <v-icon small class="red--text">delete</v-icon>
                </v-btn>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card flat>
        <v-toolbar dark dense flat color="primary">
          {{ $t("add-new-style") }}
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-form @submit.prevent="save">
          <v-card-text>
            <v-combobox
              :items="orders"
              v-model="item.order"
              :label="$t('product')"
              v-validate="'required'"
              :error-messages="errors.collect('product')"
              name="product"
              :disabled="disablePoloshirt"
              item-text="styleName"
              item-value="id"
            />
            <!-- <v-textField dense v-model="item.product" label="Product" /> -->
            <v-text-field
              dense
              v-model="item.outputPiecesPerDay"
              v-validate="'required'"
              :error-messages="errors.collect('outputPiecesPerDay')"
              name="outputPiecesPerDay"
              :label="$t('outputPiecesPerDay')"
            />
            <v-text-field
              dense
              v-model="item.targetEfficiency"
              :label="$t('targetEfficiency')"
              v-validate="'required'"
              :error-messages="errors.collect('targetEfficiency')"
              name="targetEfficiency"
            />
            <v-text-field
              v-model="item.lastDateOfRevision"
              :label="$t('lastDateOfRevision')"
              v-validate="'required'"
              :error-messages="errors.collect('lastDateOfRevision')"
              name="lastDateOfRevision"
              dense
              type="date"
            />
            <v-text-field
              dense
              v-model="item.minutesPerDay"
              :label="$t('minutesPerDay')"
              v-validate="'required'"
              :error-messages="errors.collect('minutesPerDay')"
              name="minutesPerDay"
            />
            <div class="text-center">
              <v-btn color="primary" @click="save" v-if="!disablePoloshirt">{{
                $t("save")
              }}</v-btn>
              <v-btn color="primary" @click="update" v-if="disablePoloshirt">{{
                $t("edit")
              }}</v-btn>
            </div>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
import { mapActions, mapState } from "vuex";
export default {
  mixins: [tableMixin],
  data() {
    return {
      // orders: [],
      component: "Operation bulletin",
      ifNoData: "create-style",
      item: {},
      test: {},
      disablePoloshirt: false,
      dialog: false,
      filter: {
        include: ["order"]
      },
      resource: api,
      path: path.oprBltn,
      resourceName: "Style",
      searchField: "product",
      headers: [
        {
          text: this.$t("product"),
          value: "order.styleName"
        },
        {
          text: this.$t("outputPiecesPerDay"),
          value: "outputPiecesPerDay"
        },
        {
          text: this.$t("targetEfficiency"),
          value: "targetEfficiency"
        },
        {
          text: this.$t("lastDateOfRevision"),
          value: "lastDateOfRevision"
        },
        {
          text: this.$t("minutesPerDay"),
          value: "minutesPerDay"
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  computed: {
    ...mapState("SelectItem", ["orders"])
  },
  created() {
    this.orderItem();

    // this.loadValues();
  },
  methods: {
    ...mapActions("SelectItem", ["orderItem"]),
    async loadValues() {
      this.orders = (await api.all(path.order)).rows.map(x => {
        return {
          id: x.id,
          styleName: `${x.styleName}(#${x.orderNumber})`,
          product: x.styleName
        };
      });
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.orderId = this.item.order.id;
          this.item.product = this.item.order.product;
          this.item;
          api
            .create(this.item, path.oprBltn)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Operation bulletin",
                message: `Operation bulletin created successfully.`
              });
              this.loadData();
            })
            .catch(err => {
              this.showErrors(err);
            });
          this.dialog = false;
          this.loadValues();
        }
      });
    },
    updateOrder(item) {
      this.disablePoloshirt = true;
      this.dialog = true;
      this.test = item;
      this.item.order = {
        id: item.order.id,
        quantity: item.order.quantity,
        orderNumber: item.order.orderNumber + "=>" + item.order.styleName,
        styleName: item.order.styleName + "(" + item.order.orderNumber + ")",
        producedOrder: item.producedOrder,
        styleNumber: item.styleNumber
      };
      this.item.outputPiecesPerDay = item.outputPiecesPerDay;
      this.item.targetEfficiency = item.targetEfficiency;
      this.item.lastDateOfRevision = new Date(item.lastDateOfRevision)
        .toISOString()
        .substr(0, 10);
      this.item.minutesPerDay = item.minutesPerDay;
      this.item.id = item.id;
    },
    update() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.orderId = this.item.order.id;
          this.item.product = this.item.order.product;
          this.item;
          api
            .update(this.item, path.oprBltn)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Operation bulletin",
                message: `Operation bulletin updated successfully.`
              });
              this.loadData();
              this.item = {};
            })
            .catch(err => {
              this.showErrors(err);
            });
          this.dialog = false;
          this.disablePoloshirt = false;
          this.loadValues();
        }
      });
    },
    refresh(){
location.reload()
    }
  }
};
</script>

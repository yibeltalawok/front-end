<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({name:'operation-list',
              params:{ styleId: styleId }})"
          >
            <v-icon>arrow_back</v-icon>
            {{$t('go_back')}}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />

            <v-layout row justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  :items="oprBltns"
                  v-model="item.oprBltns.product"
                  :label="$t('product')"
                  outlined
                  dense
                  disabled
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.sr"
                  :error-messages="errors.collect('sr')"
                  :label="$t('sr')"
                  name="sr"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.operationName"
                  :error-messages="errors.collect('operationName')"
                  :label="$t('operationName')"
                  name="operationName"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.section"
                  :error-messages="errors.collect('section')"
                  :label="$t('section')"
                  name="section"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field :label="$t('folder')" v-model="item.folder" dense outlined />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  :items="categories"
                  :label="$t('category')"
                  outlined
                  dense
                  item-text="title"
                  item-value="value"
                  v-model="item.category"
                  v-validate="'required'"
                  :error-messages="errors.collect('category')"
                  name="category"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  :items="machines"
                  v-model="currentMachine"
                  v-validate="'required'"
                  :error-messages="errors.collect('machine')"
                  :label="$t('select-machine')"
                  name="machine"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  @input="selectedMachine"
                  @keypress="searchMachine"
                >
                  <template v-slot:append>
                    <v-slide-x-reverse-transition mode="out-in">
                      <v-btn small icon class="primary" @click="dialog=true">
                        <v-icon color="white">mdi-plus</v-icon>
                      </v-btn>
                    </v-slide-x-reverse-transition>
                  </template>
                </v-combobox>
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  v-model="code"
                  :items="sams"
                  :label="$t('code')"
                  outlined
                  dense
                  v-validate="'required'"
                  :error-messages="errors.collect('code')"
                  name="code"
                  item-text="code"
                  @input="samSelected"
                />
              </v-flex>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  :disabled="samDisabled"
                  outlined
                  dense
                  v-model="samValue"
                  :label="$t('sam')"
                  v-validate="'required'"
                  :error-messages="errors.collect('sam')"
                  name="sam"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-btn
                  rounded
                  outlined
                  block
                  color="primary"
                  class="text-capitalize"
                  @click="save"
                >{{$t('save')}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- machine dialog -->
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-toolbar height="35px" dark dense flat color="primary">
          {{$t('add-new-machine')}}
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="dialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <machine />
      </v-card>
    </v-dialog>
    <!-- machine dialog -->
  </div>
</template>
<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import Machine from "../machine/CreateMachine";

export default {
  name: "CreateOperation",
  mixins: [formErrorHandling],

  data() {
    return {
      samValue: "",
      code: null,
      styleId: "",
      machines: [],
      currentMachine: "",
      oprBltns: [],
      bulletins: {},
      sams: [],
      item: {},
      isLoading: false,
      samDisabled: false,
      dialog: false,
      categories: [
        {
          title: this.$t("operator"),
          value: "O"
        },
        {
          title: this.$t("helpper"),
          value: "H"
        },
        {
          title: this.$t("ironer"),
          value: "I"
        },
        {
          title: this.$t("checker"),
          value: "C"
        }
      ]
    };
  },
  components: {
    Machine
  },

  async created() {
    const { styleId } = this.$route.params;
    this.styleId = styleId;
    this.camps = [
      {
        text: "Dashboard",
        disabled: false,
        to: "dasboard"
      },
      {
        text: "Operation",
        disabled: false,
        to: "/app/operation/" + styleId + "/list"
      },
      {
        text: "edit Operation",
        disabled: true
      }
    ];
    const { operationId } = this.$route.params;
    let filter = {
      include: ["machine", "oprBltns"]
    };
    this.item = await api.get(operationId, path.operation, filter);
    this.selectedOprBltn = this.item.oprBltns.product;
    this.code = this.item.code;
    this.samValue = this.item.sam;
    this.currentMachine = this.item.machine.modelNumber;
    //look for a machine
    this.searchMachine("init");
    this.sams = (await api.all(path.operation)).rows.map(x => {
      return {
        id: x.id,
        code: x.code,
        sam: x.sam
      };
    });

    this.oprBltns = (await api.all(path.oprBltn)).rows;

    this.bulletins = await api.get(this.styleId, path.oprBltn);
  },
  methods: {
    //search machine
    async searchMachine(val) {
      let f1 = {
        where: {
          modelNumber: { regexp: "/" + val.key + "/i" }
        }
      };
      let f2 = {
        limit: 5
      };
      let filter = val == "init" ? f2 : f1;
      this.machines = (await api.all(path.machine, filter)).rows.map(x => {
        return {
          id: x.id,
          name: x.description + "=>" + x.modelNumber,
          modelNumber: x.modelNumber
        };
      });
    },
    selectedMachine(machine) {
      this.item.machineId = machine.id;
      this.dialog = false;
    },
    samSelected(val) {
      this.samValue = val.sam;
      this.selectedSam = val.code;
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.code = this.selectedSam;
          this.item.sam = this.samValue;
          this.item.oprBltnId = this.styleId;
          this.item.category = this.item.category.value;

          // calculate related operational fields
          this.item.outputPerHour = (60 / parseFloat(this.samValue)).toFixed(2);
          let a = parseFloat(this.bulletins.outputPiecesPerDay);
          let b = parseFloat(this.samValue);
          let c = parseFloat(this.bulletins.minutesPerDay);
          let d = parseFloat(this.bulletins.targetEfficiency);
          let output = (100 * (a * b)) / (c * d);
          this.item.mpRqrd = output.toFixed(1);
          this.item.mcAllocated = Math.ceil(output);
          this.item.mpAllocated =
            output % 1 == 0 ? output.toFixed(0) : output.toFixed(2);
          this.item.sewingOprAlltd =
            this.item.category == "O" ? this.item.mpRqrd : 0;
          // calculate related operational fields

          api
            .update(this.item, path.operation)
            .then(() => {
              this.$notify({
                type: "success",
                title: "Operation",
                message: `Operation information saved successfully.`
              });
              this.$router.push({
                name: "operation-list",
                params: { styleId: this.item.oprBltnId }
              });
            })
            .catch(err => {
              this.showErrors(err);
            });
        }
      });
    }
  }
};
</script>
<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'operation-list',
                params: { styleId: styleId }
              })
            "
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />

            <v-layout row justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  v-model="bulletins.product"
                  name="oprBltns"
                  :label="$t('operation-bulletins-product')"
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
                <v-text-field
                  :label="$t('folder')"
                  v-model="item.folder"
                  dense
                  outlined
                />
              </v-flex>
             

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-combobox
                  v-model="model"
                  :hide-no-data="!search"
                  :items="sams"
                  :search-input.sync="search"
                  hide-selected
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
                  @input="calculate"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-select
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
                  @input="calculate"
                />
              </v-flex>

               <v-flex xs12 sm12 md4 lg4 pa-2>
                <Select
                  :items="machines"
                  v-model="selectedMachine"
                  v-validate="'required'"
                  :error-messages="errors.collect('machine')"
                  :label="
                    $t('select-machine') + ' ' + $t('search-with-machine-name')
                  "
                  name="machine"
                  item-text="name"
                  item-value="id"
                  :search-input.sync="search"
                  hide-selected
                  persistent-hint
                  small-chips
                  :noData="noData"
                  :loading="isLoading"
                  :addNewBtn="addNewMachineBtn"
                  @selected="onLocalChange"
                  @onNewItem="showMachine"
                  @search="onMachineSearch"
                  outline
                />
              </v-flex>

               <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-text-field
                  :disabled="true"
                  outlined
                  dense
                  v-model="this.item.mcAllocated"
                  label="machine allocated"
                  v-validate="'required'"
                  :error-messages="errors.collect('sam')"
                  name="mcal"
                />
              </v-flex>

              <v-flex xs12 sm12 md4 lg4 pa-2>
                <v-btn
                  rounded
                  outlined
                  block
                  :disabled="savebtn"
                  color="primary"
                  class="text-capitalize"
                  @click="save"
                  >{{ $t("save") }}</v-btn
                >
              </v-flex>
              
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- machine dialog -->
    <v-dialog v-model="machineDialog" max-width="500px">
      <v-card>
        <Machine @close="closeMachine" />
      </v-card>
    </v-dialog>
    <!-- machine dialog -->
  </div>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import Select from "@/shared/select/Select";
import Machine from "../machine/CreateMachine";
import {mapActions, mapState} from "vuex";

export default {
  name: "CreateOperation",
  mixins: [formErrorHandling],

  data() {
    return {
      savebtn: false,
      selectedMachine: null,
      selectedSam: null,
      styleId: "",
      samValue: "",
      search: "",
      model: "",
      filter: "",
      selectedOprBltn: null,
      machines: [],
      oprBltns: [],
      bulletins: {},
      sams: [],
      item: {},
      isLoading: false,
      samDisabled: false,
      noData: "No matching result ",
      isModalVisible: false,
      addNewMachineBtn: this.$t("add-new-machine"),

      addNewOprBltnsBtn: "Add New Operation Bulletin",
      machineDialog: false,

      oprBltnDialog: false,
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
          title: this.$t("packer"),
          value: "p"
        },
        {
          title: this.$t("checker"),
          value: "C"
        }
      ],
      camps: []
    };
  },
  components: {
    Select,
    Machine
  },

  computed: {
    ...mapState("machines", [
      "ocupiedmachinelist"
    ])
  },

  async created() {
    this.fetchOcupiedMachines()
    const { styleId } = this.$route.params;
    this.styleId = styleId;

    this.onMachineSearch();
    this.sams = (await api.all(path.operation)).rows.map(x => {
      return {
        id: x.id,
        code: x.code,
        sam: x.sam
      };
    });

    let fltr = {
      include: ["order"]
    };
    this.bulletins = await api.get(this.styleId, path.oprBltn, fltr);
    this.bulletins.product = this.bulletins.order.styleName;
  },
  methods: {

    ...mapActions("machines", [
        "fetchOcupiedMachines"
    ]),
    samSelected(val) {
      if (val.id == null) {
        this.samDisabled = false;
        this.selectedSam = val;
      } else {
        this.samDisabled = true;
        this.samValue = val.sam;
        this.selectedSam = val.code;
      }
      // eslint-disable-next-line no-console
      console.log("this.item.mcAllocated")
      // this.calculate()
    },

    onLocalChange(value){
          for(let i =0; i < this.ocupiedmachinelist.length; i++){
            if(this.ocupiedmachinelist[i].machineid == value){
              let aval = this.ocupiedmachinelist[i].stock - this.ocupiedmachinelist[i].alp
              // eslint-disable-next-line no-console
              console.log(aval)
              if(aval < this.item.mcAllocated){
                this.savebtn = true
                this.$notify({
                    type: "danger",
                    title: "Machine Error",
                    message: "You don't have enough machine to allocate"
                  });
                break
              }
              else {
                 this.savebtn = false
                break
              }
              
            }
            else {
                 this.savebtn = false
              }
          }
      
    },

    showMachine(show) {
      this.machineDialog = show;
      
    },
    async onMachineSearch(val) {
      let f1 = {
        where: {
          description: { regexp: "/" + val + "/i" }
        }
      };
      let f2 = {
        limit: 3
      };
      let filter = val ? f1 : f2;
      let machines = (await api.all(path.machine, filter)).rows;
      this.machines = machines.map(x => {
        return {
          id: x.id,
          name: x.description + "=>" + x.modelNumber
        };
      });
    },

    closeMachine() {
      this.machineDialog = false;
    },

    calculate(){
      let a = parseFloat(this.bulletins.outputPiecesPerDay);
      let b = parseFloat(this.samValue);
      let c = parseFloat(this.bulletins.minutesPerDay);
      let d = parseFloat(this.bulletins.targetEfficiency);
      let output = (100 * (a * b)) / (c * d);
      this.item.mcAllocated =
            this.item.category == "H" ? "" : Math.ceil(output);
      this.onLocalChange(this.selectedMachine)
      // eslint-disable-next-line no-console
      console.log(this.item.mcAllocated)
    },
    

    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.machineId = this.selectedMachine;
          this.item.code = this.selectedSam;
          this.item.sam = this.samValue;
          this.item.oprBltnId = this.styleId;
          // calculate related operational fields
          this.item.outputPerHour = (60 / parseFloat(this.samValue)).toFixed(2);
          let a = parseFloat(this.bulletins.outputPiecesPerDay);
          let b = parseFloat(this.samValue);
          let c = parseFloat(this.bulletins.minutesPerDay);
          let d = parseFloat(this.bulletins.targetEfficiency);
          let output = (100 * (a * b)) / (c * d);
          this.item.mpRqrd = output.toFixed(1);
          this.item.mcAllocated =
            this.item.category == "H" ? "" : Math.ceil(output);
          this.item.mpAllocated =
            output % 1 == 0 ? output.toFixed(0) : output.toFixed(2);
          this.item.sewingOprAlltd =
            this.item.category == "O" ? this.item.mpRqrd : 0;
          // calculate related operational fields

          if (this.item.machineId == "Add New") {
            this.$notify({
              type: "danger",
              title: "Machine ",
              message: `Wrong Machine Model Number selected.`
            });
          } else {
            api
              .create(this.item, path.operation)
              .then(() => {
                this.$notify({
                  type: "success",
                  title: "Operation",
                  message: `Operation information saved successfully.`
                });
                this.$router.push({
                  name: "operation-list",
                  params: { styleId: this.styleId }
                });
              })
              .catch(err => {
                this.showErrors(err);
              });
          }
        }
      });
    }
  }
};
</script>

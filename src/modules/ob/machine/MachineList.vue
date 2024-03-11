<template>
  <v-container grid-list-xs>
    <v-card outlined style="border-radius:12px">
      <v-toolbar dense flat>
        <v-text-field
          hide-details
          solo
          flat
          prepend-inner-icon="mdi-magnify"
          color="primary"
          dense
          v-model="search"
          :label="$t('search-machine')"
          single-line
        />
        <v-spacer/>
     <v-flex xs10 ms10 md4 lg4 pa-1>
       <v-row>
       <v-flex pa-1>
        <v-btn
          small
          color="primary"
          class="text-capitalize"
          @click="$router.push({ name: 'create-machine' })"
          >{{ $t("addNew") }}</v-btn>
       </v-flex>
                <v-flex pa-1>

            <div class="form-group">
              <input
                type="file"
                id="csv_file"
                style="display:none"
                ref="csvfileInput"
                name="csv_file"
                class="form-control"
                @change="loadCSV($event)"
              />
            </div>
            <v-btn
              rounded
              small
              color="info"
              class="text-capitalize"
              @click.stop="$refs.csvfileInput.click()"
            >
              <v-icon small style="margin-right: 10px;">mdi-file</v-icon>
              {{ $t("upload-database") }}
            </v-btn>
                </v-flex>
          </v-row>
        </v-flex>

        <v-btn icon 
        @click="Refresh()"
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
        :items="this.machinelist"
        item-key="id"
        :search="search"
      >
        <template slot="headerCell" slot-scope="props">
          <span class="table-header-text caption font-weight-bold">{{
            $t(props.header.text)
          }}</span>
        </template>

        <!-- Colored Chips -->
        <template v-slot:item.color="{ item }">
          <v-chip :color="item.color" label></v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            text
            small
            color="success"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'machine-detail',
                params: { machineId: item.id }
              })
            "
            >{{ $t("more_detail") }}</v-btn
          >
          <v-btn
            text
            small
            color="success"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'update-machine',
                params: { machineId: item.id }
              })
            "
          >
            <v-icon small class="primary--text">edit</v-icon>
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
        </template>
      </v-data-table>
    </v-card>

    <v-fab-transition>
      <v-card
        style="margin-top: 30px;"
        elevation="5"
        v-if="this.csv_machinelist.length > 0"
      >
        <v-toolbar dense flat v-if="this.csv_machinelist.length > 0">
          <v-spacer />
          <v-btn
            outlined
            small
            color="info"
            @click.stop="localRegisterBulkMachine()"
          >
            <v-icon style="margin-right: 10px;">mdi-upload</v-icon>Rgister all
          </v-btn>
        </v-toolbar>

        <v-data-table
          :items="this.csv_machinelist"
          :headers="headers"
          :items-per-page="10"
          v-if="this.csv_machinelist.length > 0"
          style="margin-top: 20px"
        >
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color" label></v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-fab-transition>
  </v-container>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "MachineList",
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "Machine",
      ifNoData: "machine-create",
      filter: {},
      search: "",
      resource: api,
      path: path.machine,
      sortOrders: [],
      csv_headers: {},
      resourceName: "Machine",
      searchField: "serialNumber",
      parse_csv: null,
      status: "work",
      parse_header: [],
      headers: [
        {
          text: this.$t("sr"),
          value: "serialNumber"
        },
        {
          text: this.$t("machine-model-number"),
          value: "modelNumber"
        },
        {
          text: this.$t("description"),
          value: "description"
        },
        {
          text: this.$t("make"),
          value: "make"
        },
        {
          text: this.$t("operation-row-color"),
          value: "color",
          align: "center"
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
    ...mapState("machines", ["machinelist", "csv_machinelist"])
  },

  mounted() {
    this.fetchAllMachines();
  },
  methods: {
    ...mapActions("machines", ["fetchAllMachines", "registerBulkMachines"]),
    ...mapMutations("machines", ["setCsvMachineList"]),
    async localRegisterBulkMachine() {
      await this.registerBulkMachines().then(r => {
        if (r) {
          this.$notify({
            type: "success",
            title: this.$t("Add New Machine"),
            message: `${this.$t("Machine")} ${this.$t(
              "registered Successfully"
            )}`
          });
          this.loadData();
        } else {
          this.$notify({
            type: "danger",
            title: "Error",
            message: "Error registering"
          });
        }
      });
    },

    sortBy(key) {
      var vm = this;
      vm.sortKey = key;
      vm.sortOrders[key] = vm.sortOrders[key] * -1;
    },

    csvJSON(csv) {
      var vm = this;
      var lines = csv.split("\n");
      var result = [];

      lines[0].split(",").forEach(function(key) {
        vm.sortOrders[key] = 1;
      });

      var duplicate = [];

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return; // Jump header line

        var currentline = line.split(",");
        var found = false;

        for (var j = 0; j < vm.machinelist.length; j++) {
          // eslint-disable-next-line no-console
          // console.log(currentline[0] + " " + vm.machinelist[j].sr);
          if (currentline[0] == vm.machinelist[j].sr) {
            duplicate.push(j);
            found = true;
            break;
          }
        }

        if (!found) {
          vm.csv_headers = {
            serialNumber: currentline[0] == "" ? "NA" : currentline[0],
            make: currentline[3] == "" ? "NA" : currentline[3],
            modelNumber: currentline[1] == "" ? "NA" : currentline[1],
            description: currentline[2] == "" ? "NA" : currentline[2],
            color: vm.getRandomColor()
          };
          result.push(Object.assign({}, vm.csv_headers));
        }
      });
      if (duplicate.length > 0) {
        this.$notify({
          type: "success",
          title: `${this.$t("duplicate_found")} `,
          message: `${duplicate}`
        });
        // eslint-disable-next-line no-console
        console.log(duplicate);
      }
      result.pop(); // remove the last item because undefined values

      this.setCsvMachineList(result);
      return result; // JavaScript object
    },

    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },

    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
        };
        reader.onerror = function(evt) {
          if (evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert("FileReader are not supported in this browser.");
      }
    },
    Refresh(){
     location.reload()
    }
  }
};
</script>

<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'ob' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="csv-download-icon primary--text"
            @click="csv(summaries)"
          >
            <v-icon>file_download</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :items="summaries"
          item-key="id"
          :total-items="totalItems"
          :rows-per-page-text="`item per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>



<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
export default {
  name: "UserList",
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "Operation ",
      ifNoData: "create-operation",
      path: path,
      loading: false,
      resource: api,
      resourceName: "OprBltn",
      summaries: [],
      machines: [],
      operations: [],
      sam: 0,
      filter: {
        include: ["machine"]
      },
      headers: [
        {
          text: this.$t("machine-model-number"),
          value: "modelNumber"
        },
        {
          text: this.$t("machine-description"),
          value: "description",
          sortable: false
        },
        {
          text: this.$t("sam"),
          value: "sam"
        },
        {
          text: this.$t("number-of-machines"),
          value: "noOfMc"
        },
        {
          text: this.$t("folder"),
          value: "folder"
        }
      ],
      camps: []
    };
  },
  async created() {
    const { styleId } = this.$route.params;
    let filter = {
      where: {
        oprBltnId: styleId
      },
      include: ["machine"]
    };
    let ops = (await api.all(path.operation, filter)).rows;
    let machines = ops.map(m => m.machine);

    //unique machine
    const key = "id";
    const uniqueMachine = [
      ...new Map(machines.map(item => [item[key], item])).values()
    ];
    //unique machine

    if (ops.length > 0) uniqueMachine.map(x => this.getSam(x));
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
        text: "Operation summary",
        disabled: true
      }
    ];
  },
  methods: {
    async getSam(x) {
      const { styleId } = this.$route.params;

      let filter = {
        where: {
          machineId: x.id,
          oprBltnId: styleId
        }
      };
      let output = (await api.all(path.operation, filter)).rows.reduce(
        (acc, s) => acc + parseFloat(s.sam),
        0
      );

      let mc = (await api.all(path.operation, filter)).rows.reduce(
        (acc, mc) => acc + parseFloat(mc.mcAllocated),
        0
      );

      let fldr = (await api.all(path.operation, filter)).rows.map(x => {
        return {
          folder:
            x.folder != null || x.folder != undefined ? x.folder + "," : ""
        };
      });
      let folder = fldr.reduce((acc, f) => acc + f.folder, "");

      //get unique machine

      this.machines.push({
        id: x.id,
        modelNumber: x.modelNumber,
        description: x.description,
        sam: output.toFixed(2),
        noOfMc: mc.toFixed(0),
        folder: folder
      });
      this.summaries = this.machines;
    },
    csv(items) {
      var csvOut = items.map(d => {
        return {
          modelNumber: d.modelNumber,
          description: d.description,
          sam: d.sam,
          noOfMc: d.noOfMc,
          folder: d.folder
        };
      });

      this.downloadDataAsCsv("opmsOperationSummaryList", csvOut);
    }
  }
};
</script>

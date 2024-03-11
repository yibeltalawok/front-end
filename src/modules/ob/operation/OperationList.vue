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
          <v-spacer />
          <p class="mt-7">
            <b
              >{{ $t("line-efficiency-(balancing-plan)") }}:
              {{ lineEfficiency }}</b
            >
          </p>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'create-operation',
                params: { styleId: styleId }
              })
            "
            >{{ $t("addNew") }}</v-btn
          >
          <v-btn
            text
            small
            color="primary"
            class="text-capitalize"
            @click="showAllQrcodes"
            >{{ $t("qr-code") }}</v-btn
          >
          <v-btn
            text
            small
            color="info"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'opr-summary',
                params: { styleId: styleId }
              })
            "
            >{{ $t("summary") }}</v-btn
          >
          <v-btn
            small
            text
            color="purple"
            class="text-capitalize"
            @click="mergeDialog"
            >{{ $t("combine") }}</v-btn
          >

          <v-btn
            small
            text
            class="csv-download-icon primary--text"
            @click="csv(items)"
          >
            <v-icon>file_download</v-icon>
          </v-btn>

          <v-flex style="margin-right: 30px;">
            <v-row>
              <v-spacer />

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
                @click="$refs.csvfileInput.click()"
              >
                <v-icon small style="margin-right: 10px;">mdi-file</v-icon>
                {{ $t("upload-ob") }}
              </v-btn>
            </v-row>
          </v-flex>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <table id="myTable">
            <thead>
              <th v-for="(header, i) in headers" :key="i" @click="sortTable(i)">
                {{ header }}
              </th>
            </thead>

            <tr
              v-for="(item, i) in items"
              :key="i"
              :style="'background-color:' + item.machine.color"
            >
              <td>
                <input type="checkbox" @change="merge(item)" />
              </td>
              <td>{{ item.sr }}</td>
              <td>{{ item.operationName }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.sam }}</td>
              <td>{{ item.machine.modelNumber }}</td>
              <td>{{ item.machine.description }}</td>
              <td>{{ item.folder }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.outputPerHour }}</td>
              <td>{{ item.mpRqrd }}</td>
              <td>
                <v-edit-dialog
                  :return-value.sync="item.name"
                  @save="save"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                >
                  {{ item.mpAllocated }}
                  <template v-slot:input>
                    <v-text-field
                      dense
                      v-model="item.mpAllocated"
                      label="Edit"
                      single-line
                    ></v-text-field>
                    <v-btn
                      @click="saveMp(item, item.mpAllocated)"
                      small
                      block
                      rounded
                      class="text-capitalize"
                      color="primary"
                      >Save changes</v-btn
                    >
                    <div style="height:20px"></div>
                  </template>
                </v-edit-dialog>
              </td>
              <td>{{ item.mcAllocated }}</td>
              <td>{{ item.sewingOprAlltd }}</td>
              <td>
                <span v-if="item.remark != null">[{{ item.remark }}]</span>
              </td>
              <td>
                <v-menu offset-y max-width="200px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      small
                      text
                      color="primary"
                      dark
                      v-on="on"
                      class="text-capitalize"
                      >{{ $t("action") }}</v-btn
                    >
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item @click="showQrcode(item.id)">
                        <v-list-item-title>
                          <v-icon small class="mx-2">mdi-camera</v-icon>
                          {{ $t("qr-code") }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="
                          $router.push({
                            name: 'update-operation',
                            params: { operationId: item.id, styleId: styleId }
                          })
                        "
                      >
                        <v-list-item-title>
                          <v-icon small class="mx-2">edit</v-icon>
                          {{ $t("edit") }}
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="deleteItem(item.id, path)">
                        <v-list-item-title>
                          <v-icon small class="red--text mx-2">delete</v-icon>
                          {{ $t("delete") }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- csvDialog dialog  -->
    <v-dialog
      v-model="csvDialog"
      persistent
      :overlay="true"
      max-width="80%"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat dense dark color="primary ">
          Register from CSV files
          <v-spacer />
          <v-btn icon @click="csvDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="csvheaders"
            :search="search2"
            :items-per-page="10"
            :items="this.csvdata"
            item-key="id"
            footer-props.items-per-page-text="`Performance per page`"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="uploadtoServer()" outlined small>
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- qr code dialog  -->
    <v-dialog
      v-model="qrcodeDialog"
      persistent
      :overlay="false"
      max-width="300"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat dense dark color="primary ">
          {{ $t("sr") }}: {{ qrcode.sr }}
          <v-spacer />
          <v-btn icon @click="qrcodeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div ref="content" class="mt-5 text-center">
          <qrcode-vue
            :value="JSON.stringify(qrcode)"
            :size="size"
            level="H"
          ></qrcode-vue>
        </div>
        <v-toolbar flat dense>
          <v-spacer></v-spacer>
          <v-btn
            small
            rounded
            outlined
            color="primary"
            class="text-capitalize"
            @click="print"
            >{{ $t("print") }}</v-btn
          >
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card>
    </v-dialog>
    <!-- qr code dialog  -->

    <v-dialog
      v-model="dialog"
      persistent
      :overlay="false"
      max-width="40%"
      transition="dialog-transition"
    >
      <v-card flat class="info">
        <v-toolbar height="35px" dense flat>
          <v-btn icon color="red" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          {{ $t("total-manpower-for-the") }}{{ mergeItems.length }}
          {{ $t("operation") }}:
          <span class="info--text mx-3">{{ totalMp }}</span>
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            class="primary text-capitalize"
            @click="submitMerge(mergeItems)"
            >{{ $t("combine") }}</v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap justify-center>
            <v-flex
              xs12
              sm12
              md12
              lg12
              pa-2
              v-for="(item, i) in mergeItems"
              :key="i"
            >
              <v-card>
                <table>
                  <tr>
                    <th>{{ $t("sr") }}</th>
                    <th>{{ $t("m/p-rqrd") }}</th>
                    <th>{{ $t("m/c-allocated") }}</th>
                    <th>{{ $t("m/p-allocated") }}</th>
                    <th>{{ $t("sewing-opr-alltd") }}</th>
                  </tr>
                  <tr>
                    <td>{{ item.sr }}</td>
                    <td>{{ item.mpRqrd }}</td>
                    <td>{{ item.mcAllocated }}</td>
                    <td>
                      <input
                        type="text"
                        v-model="item.mpAllocated"
                        @input="item.sewingOprAlltd = item.mpAllocated"
                        style="width:100%;padding-left:50%"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="item.sewingOprAlltd"
                        style="width:100%;padding-left:50%"
                      />
                    </td>
                  </tr>
                </table>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- all operation qr code -->
    <v-dialog
      v-model="operationQRDialog"
      persistent
      :overlay="false"
      transition="dialog-transition"
      max-width="900"
    >
      <v-card>
        <v-toolbar dark dense flat color="primary">
          {{ $t("qr-code-for-all-operations") }}
          <v-spacer></v-spacer>
          <v-btn
            small
            rounded
            color="success"
            class="text-capitalize"
            @click="printAllQrCode"
            >{{ $t("print") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn icon color="pink" @click="operationQRDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container grid-list-xs ref="content2">
          <v-row>
            <v-col cols="10">
              <v-row align="center" justify="center">
                <v-card flat v-for="(item, i) in qrcds" :key="i" class="ma-3">
                  <qrcode-vue
                    :value="JSON.stringify(item)"
                    size="120"
                    level="H"
                  ></qrcode-vue>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { api, path } from "@/api";

//qr code
import QrcodeVue from "qrcode.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { csvDownloadMixin } from "@/shared/mixins";
import { mapActions } from "vuex";

export default {
  name: "OperationList",
  mixins: [csvDownloadMixin],
  data() {
    return {
      samt: ["sam", "deed"],
      styleId: "",
      serach2: "",
      component: "Operation",
      ifNoData: "create-operation",
      dialog: false,
      qrcodeDialog: false,
      csvDialog: false,
      operationQRDialog: false,
      qrcode: {},
      qrcodes: [],
      qrcds: [],
      size: 120,
      resource: api,
      path: path.operation,
      items: [],
      ops: [],
      remark: [],
      csvheaders: [
        {
          text: "Serial Number",
          value: "sr"
        },
        {
          text: "Operation Name",
          value: "operationName"
        },
        {
          text: "Section",
          value: "section"
        },
        {
          text: "Sam",
          value: "sam"
        },
        {
          text: "Folder",
          value: "folder"
        },
        {
          text: "category",
          value: "category"
        },
        {
          text: "outputPerHour",
          value: "outputPerHour"
        },
        {
          text: "mpRqrd",
          value: "mpRqrd"
        },
        {
          text: "mcAllocated",
          value: "mcAllocated"
        },
        {
          text: "mpAllocated",
          value: "mpAllocated"
        },
        {
          text: "sewingOprAlltd",
          value: "sewingOprAlltd"
        },
        {
          text: "machineId",
          value: "machineId"
        }
      ],
      sortKey: null,
      sortOrders: [],
      parse_header: [],
      csvdata: [],
      csv_headers: {
        num: 0,
        "Id number": "",
        "Full name": "",
        "phone number": "",
        Gender: "",
        "Date of joining": "",
        role: "",
        department: "",
        "sub department": "",
        salary: "",
        "Resposibility allowance": "",
        incentiveSalary: "",
        "Home allowance": "",
        "Allow absent incentive": "",
        "Transport pay": "",
        "Cost sharing": "",
        userRoleId: "",
        "Ironing incentive": ""
      },
      mergeItems: [],
      totalMp: 0,
      filter: {},
      oprBltns: [],
      resourceName: "Operation",
      searchField: "operationCode",
      search2: "",
      headers: [
        this.$t("select"),
        this.$t("sr"),
        this.$t("operationName"),
        this.$t("section"),
        this.$t("code"),
        this.$t("sam"),
        this.$t("machine-model-number"),
        this.$t("machine-description"),
        this.$t("folder"),
        this.$t("category"),
        this.$t("output/Hr"),
        this.$t("m/p-rqrd"),
        this.$t("m/p-allocated"),
        this.$t("m/c-allocated"),
        this.$t("sewing-opr-alltd"),
        this.$t("remark"),
        this.$t("action")
      ],
      ordBltn: {},
      lineEfficiency: "",
      summaries: [],
      machines: [],
      operations: [],
      sam: 0,
      filterm: {
        include: ["machine"]
      }
    };
  },
  components: {
    QrcodeVue
  },

  async created() {
    const { styleId } = this.$route.params;
    this.styleId = styleId;
    this.machines = (await api.all(path.machine)).rows;
    this.loadData();
  },

  methods: {
    ...mapActions("operation", ["uploadOperations"]),
    async loadData() {
      let filter = {
        include: ["machine", "oprBltns"],
        where: {
          oprBltnId: this.styleId
        }
      };
      this.items = (await api.all(path.operation, filter)).rows;
      this.oprBltn = await api.get(this.styleId, path.oprBltn);
      let totalSams = this.items.reduce(
        (acc, sam) => acc + parseFloat(sam.sam),
        0
      );
      let totalMpAlloted = this.items.reduce(
        (acc, mp) => acc + parseFloat(mp.mpAllocated),
        0
      );
      this.lineEfficiency = (
        ((parseFloat(this.oprBltn.outputPiecesPerDay) * parseFloat(totalSams)) /
          (parseFloat(totalMpAlloted) *
            parseFloat(this.oprBltn.minutesPerDay))) *
        100
      ).toFixed(2);
    },
    async showQrcode(id) {
      let filter = {
        include: ["machine"],
        where: {
          oprBltnId: this.styleId
        }
      };
      let qrcode = await api.get(id, path.operation, filter);
      this.qrcode = {
        id: qrcode.id,
        operationName: qrcode.operationName,
        machine: `${qrcode.machine.serialNumber}_${qrcode.machine.modelNumber}`,
        type: "operation"
      };
      this.qrcodeDialog = true;
    },
    async showAllQrcodes() {
      let filter = {
        include: ["machine", "oprBltns"],
        where: {
          oprBltnId: this.styleId
        }
      };
      this.qrcds = (await api.all(path.operation, filter)).rows.map(qrcode => {
        return {
          id: qrcode.id,
          operationName: qrcode.operationName,
          machine: `${qrcode.machine.serialNumber}_${qrcode.machine.modelNumber}`,
          type: "operation"
        };
      });
      this.operationQRDialog = true;
    },
    mergeDialog() {
      if (this.mergeItems.length > 1) this.dialog = true;
      else {
        this.dialog = false;
        this.$notify({
          type: "warning",
          title: "Merge modal dialog",
          message: `Select atleast two rows. Only two or more rows 
          can be merged togather.`
        });
      }
    },
    merge(v) {
      this.mergeItems.push(v);
      let filteredItems = this.mergeItems.map(x => {
        return {
          mp: x.mpAllocated
        };
      });

      this.totalMp = filteredItems.reduce(
        (acc, hw) => acc + parseFloat(hw.mp),
        0
      );
      this.item.sewingOprAlltd = this.item.mpAllocated;
    },
    submitMerge(items) {
      items.map(x => this.saveChanges(x));
      this.remark.push(items.map(x => x.sr));
    },

    saveChanges(item) {
      this.item = item;
      this.item.sewingOprAlltd = item.sewingOprAlltd;
      this.item.remark = this.remark;
      api
        .update(this.item, path.operation)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Operation bulletin",
            message: `Operation bulletin update successfully.`
          });
          this.dialog = false;
          this.loadData();
        })
        .catch(err => {
          this.showErrors(err);
        });
    },

    sortTable(n) {
      var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
      table = document.getElementById("myTable");
      switching = true;
      dir = "asc";

      while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < rows.length - 1; i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[n];
          y = rows[i + 1].getElementsByTagName("TD")[n];
          if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;

          switchcount++;
        } else {
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
    },
    saveMp(item, val) {
      this.item = item;
      this.item.mpAllocated = val;
      this.item.sewingOprAlltd = item.category == "H" ? 0 : val;
      api
        .update(this.item, path.operation)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Manpower allocated",
            message: `Manpower allocated successfully.`
          });
          this.loadData();
        })
        .catch(err => {
          this.showErrors(err);
        });
    },
    print() {
      const doc = new jsPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/png", 10);
        doc.addImage(img, "JPEG", 50, 50);
        doc.save("operation.pdf");
      });
    },
    printAllQrCode() {
      const doc = new jsPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content2, {
        canvas: canvasElement
      }).then(function(canvas) {
        const img = canvas.toDataURL("image/png", 0);
        doc.addImage(img, "JPEG", 0, 0);
        doc.save("allOperation.pdf");
      });
    },
    // eslint-disable-next-line no-unused-vars
    async csv(items) {
      (this.summaries = []), (this.machines = []);
      let filter = {
        where: {
          oprBltnId: this.styleId
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

      if (ops.length > 0)
        uniqueMachine.map(x => this.getSam(x, uniqueMachine.length, items));

      // this.downloadDataAsCsv("opmsOperationList", csvOut);
    },

    async getSam(x, length, items) {
      let filter = {
        where: {
          machineId: x.id,
          oprBltnId: this.styleId
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

      if (this.summaries.length == length) {
        var csvOut = items.map(d => {
          return {
            sr: d.sr,
            operationName: d.operationName,
            section: d.section,
            code: d.code,
            sam: d.sam,
            modelNumber: d.machine.modelNumber,
            description: d.machine.description,
            folder: d.folder,
            category: d.category,
            outputPerHour: d.outputPerHour,
            mpRqrd: d.mpRqrd,
            mpAllocated: d.mpAllocated,
            mcAllocated: d.mcAllocated,
            sewingOprAlltd: d.sewingOprAlltd
          };
        });
        var mCsvOut = this.summaries.map(d => {
          return {
            modelNumber: d.modelNumber,
            description: d.description,
            sam: d.sam,
            noOfMc: d.noOfMc,
            folder: d.folder
          };
        });
        this.eprt_csv(csvOut, mCsvOut);
      }
    },
    eprt_csv(operation, machine) {
      // eslint-disable-next-line no-unused-vars
      let arrayHeader = [
        this.$t("Serial Number"),
        this.$t("Operation Name"),
        this.$t("Section"),
        this.$t("Code"),
        this.$t("SAM"),
        this.$t("Machine Model Number"),
        this.$t("Machine Description"),
        this.$t("Folder"),
        this.$t("Category"),
        this.$t("Output Per Hour"),
        this.$t("Man Power Rqrd"),
        this.$t("Man Power Allocated"),
        this.$t("Machine Allocated"),
        this.$t("Sewing Oprator Allocated")
      ];
      let items = [];
      if (operation.length > 0) {
        for (const iterator of operation) {
          items.push(iterator);
        }
      }
      if (machine.length > 0) {
        items.push(
          {},
          {
            a: "",
            b: "",
            title: "Order Reconcolation CSV File"
          },
          {
            column1: this.$t("Machine Model Number"),
            column2: this.$t("Machine Description"),
            column3: this.$t("SAM"),
            column4: this.$t("Number of Machines"),
            column: this.$t("Folder Attachement")
          }
        );
        for (const iterator of machine) {
          items.push(iterator);
        }
      }
      let fileName = "Operation and it summary";
      let delimiter = ",";

      let header = arrayHeader.join(delimiter) + "\n";
      let csv = header;
      if (items.length > 0) {
        items.forEach(obj => {
          let row = [];
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              row.push(obj[key]);
            }
          }
          csv += row.join(delimiter) + "\n";
        });

        let csvData = new Blob([csv], { type: "text/csv" });
        let csvUrl = URL.createObjectURL(csvData);

        let hiddenElement = document.createElement("a");
        hiddenElement.href = csvUrl;
        hiddenElement.target = "_blank";
        hiddenElement.download = fileName + ".csv";
        hiddenElement.click();
      }
    },
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.$notify({
          type: "success",
          title: "Success",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`
        });
        this.loadData();
      }
    },

    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.csvJSON(csv);
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

    async uploadtoServer() {
      await this.uploadOperations(this.csvdata).then(r => {
        // eslint-disable-next-line no-console
        if (r) {
          this.$notify({
            type: "success",
            title: "Operations",
            message: `Operation Registered from csv`
          });
          this.$router.push({
            name: "operation-list",
            params: { styleId: this.styleId }
          });
          this.csvDialog = true;
          this.csvDialog = false;
        } else {
          this.$notify({
            type: "danger",
            title: "Error",
            message: `Server Error, Could not upload your data please try again.`
          });
          this.csvDialog = true;
          this.csvDialog = false;
        }
      });
    },

    csvJSON(csv) {
      var vm = this;
      var lines = csv.split("\n");
      var dup = [];

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return; // Jump header line

        var currentline = line.split(",");
        let output =
          (100 *
            (parseFloat(vm.oprBltn.outputPiecesPerDay) *
              parseFloat(currentline[7]))) /
          (parseFloat(vm.oprBltn.minutesPerDay) *
            parseFloat(vm.oprBltn.targetEfficiency));

        // eslint-disable-next-line no-unused-vars
        let checkmachine = function(sr) {
          for (let i = 0; i < vm.machines.length; i++) {
            // eslint-disable-next-line no-console
            // console.log(sr + " == " + vm.machines[i].serialNumber)

            if (vm.machines[i].serialNumber == sr) return i;
          }
          return -1;
        };
        let idx = checkmachine(currentline[5]);
        if (idx != -1) {
          var csv_headers = {
            sr: currentline[0],
            operationName: currentline[1],
            section: currentline[2],
            sam: currentline[7],
            folder: currentline[4],
            category: currentline[3],
            outputPerHour: (60 / parseFloat(currentline[7])).toFixed(2),
            mpRqrd: output.toFixed(1),
            mcAllocated: currentline[3] == "H" ? "" : Math.ceil(output),
            mpAllocated:
              output % 1 == 0 ? output.toFixed(0) : output.toFixed(2),
            sewingOprAlltd: currentline[3] == "O" ? output.toFixed(1) : 0,
            machineId: vm.machines[idx].id,
            oprBltnId: vm.styleId,
            code: currentline[6]
          };

          vm.csvdata.push(Object.assign({}, csv_headers));
          // eslint-disable-next-line no-console
        } else {
          dup.push(currentline[0]);
        }
      });

      if (dup.length != 0) {
        this.$notify({
          type: "danger",
          title:
            "machine is not registered for the following operation serial numbers",
          message: `${dup}`
        });
      }

      // vm.csvdata.pop(); // remove the last item because undefined values
      vm.csvDialog = false;
      vm.csvDialog = true;
      // eslint-disable-next-line no-console
      console.log(vm.csvdata);
      // this.setCSVemployeeList(result);
    }
  }
};
</script>

<style lang="css" scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #5e7c8a;
  text-align: left;
  padding: 8px;
  font-size: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* tr:nth-child(even) {
  background-color: #dddddd;
} */
th {
  cursor: pointer;
}
</style>


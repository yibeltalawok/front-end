<template>
  <div>
    <div class="form-group">
      <input
        type="file"
        id="csv_file"
        style="display: none;"
        ref="csvfileInput"
        name="csv_file"
        class="form-control"
        @change="loadCSV($event)"
      />
    </div>
    <v-card outlined style="border-radius: 12px;" class="mt-5">
      <v-toolbar dense flat>
        <p class="mt-4">Inventory detail</p>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-divider />
      <!-- ====== Inventory Detail ===== -->
      <v-layout row justify-center>
        <v-flex xs12 sm12 md11 lg11>
          <v-layout row justify-center class="mt-10">
            <v-flex xs12 sm12 md4 lg4 pt-4>
              <!-- <v-card outlined class="rounded-t-xl rounded-b-xl width"> -->
              <v-layout row justify-center>
                <img :src="invnetory.imagePath" />
              </v-layout>
              <!-- </v-card> -->
            </v-flex>
            <v-flex xs12 sm12 md3 lg3 pl-3>
              <h1>{{ idInventory.inventoryName }}</h1>

              <p class="desc">Description : {{ idInventory.description }}</p>

              <h4 class="category">Category: {{ invnetory.categoryName }}</h4>
              <p class="date">Created on: {{ idInventory.date }}</p>
            </v-flex>
            <v-flex xs6 sm4 md5 lg5>
              <div id="chartdiv"></div>
            </v-flex>
          </v-layout>
          <!-- </v-card> -->
          <v-toolbar dense flat class="mt-7">
            <h2 class="ml-7">
              <b>Available stock</b>
              : {{ invnetory.length }}
            </h2>
            <v-spacer />
            <v-btn
              small
              color="amber"
              class="text-capitalize white--text ml-7"
              @click="$refs.csvfileInput.click()"
            >
              <uploadIcon small style="margin-right: 10px;" />
              {{ $t('upload') }}
            </v-btn>

            <v-btn
              small
              @click="qrdialog = true"
              color="amber"
              class="text-capitalize white--text ml-7"
            >
              <camera small style="margin-right: 10px;" />
              Qr-Codes
            </v-btn>

            <v-btn
              small
              @click="
                $router.push({
                  name: 'create-item',
                  parms: { inventoryId: inventoryId },
                })
              "
              class="text-capitalize white--text ml-7 mr-15"
              color="amber"
            >
              <add small style="margin-right: 10px;" />

              {{ $t('addNew') }}
            </v-btn>
          </v-toolbar>
          <v-data-table
            :headers="headers"
            :items-per-page="10"
            v-model="selected"
            show-select
            :items="items"
            item-key="id"
          >
            <template slot="headerCell" slot-scope="props">
              <span class="table-header-text caption font-weight-bold">
                {{ $t(props.header.text) }}
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
                  >
                    {{ $t('clickHere') }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <v-btn
                      text
                      small
                      color="info"
                      class="text-capitalize"
                      @click="
                        $router.push({
                          name: 'detail-item',
                          params: { itemId: item.id, inventoryId: inventoryId },
                        })
                      "
                    >
                      {{ $t('more_detail') }}
                    </v-btn>
                    <v-btn
                      text
                      small
                      color="success"
                      class="text-capitalize"
                      @click="
                        $router.push({
                          name: 'update-item',
                          params: { itemId: item.id, inventoryId: inventoryId },
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
                      @click="delItem(item.id, path)"
                    >
                      <v-icon small class="red--text">delete</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
      <!-- <v-card-actions>
          <v-btn @click.stop="uploadtoServer()" outlined small>
            Upload
          </v-btn>
        </v-card-actions> -->
    </v-card>

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
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="csvheaders"
            :items-per-page="10"
            :items="csvData"
            footer-props.items-per-page-text="`Performance per page`"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="uploadtoServer()" outlined small>
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="qrdialog" scrollable max-width="1100px">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <h2 class="lime--text darken-4">Item qr codes</h2>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="print" v-if="items.length > 0">
            <v-icon class="mr-2">print</v-icon>
            {{ $t('print') }}
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 800px;">
          <v-row>
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-card
                  v-for="(item, i) in items"
                  :key="i"
                  class="ma-3 primary"
                >
                  <v-toolbar dense flat height="20px" color="grey lighten-2">
                    {{ item.itemNumber }}
                  </v-toolbar>
                  <div class="pa-1 text-center white">
                    <qrcode-vue
                      :value="
                        JSON.stringify(
                          'Name : ' +
                            item.itemName +
                            ',# :' +
                            item.totalQuantity +
                            ', Status: ' +
                            item.materialStatus,
                        )
                      "
                      :size="size"
                      level="H"
                    />
                  </div>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { path } from '@/api'
import QrcodeVue from 'qrcode.vue'
import uploadIcon from '@/assets/icons/upload.svg'
import camera from '@/assets/icons/camera.svg'
import add from '@/assets/icons/add.svg'
import AccountService from '@/shared/services'

import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

export default {
  name: 'list',

  data() {
    return {
      dialg: false,
      qrdialog: false,
      qrCode: [],
      size: 95,
      id: '',
      dialog: false,
      inventoryId: '',
      user: AccountService.getProfile(),
      path: path.item,
      resourceName: 'Item',
      invnetory: {},
      headers: [
        {
          text: this.$t('Inhouse date'),
          value: 'inHouseDate',
        },
        {
          text: this.$t('Invoice No'),
          value: 'invoiceNo',
        },
        {
          text: this.$t('Supplier'),
          value: 'supplier.supplierName',
        },

        {
          text: this.$t('UoM'),
          value: 'unitOfMeasure',
        },
        {
          text: this.$t('TQY'),
          value: 'totalQuantity',
        },
        //  {
        //   text: this.$t("material status"),
        //   value: "materialStatus"
        // },

        {
          text: this.$t('Unit Price'),
          value: 'unitPrice',
        },
        {
          text: this.$t('action'),
          value: 'action',
          sortable: false,
          align: 'center',
        },
      ],
      selecteHeaders: [
        {
          text: 'Date',
          value: 'date',
        },
        {
          text: 'Narration',
          value: 'narration',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Amount',
          value: 'amount',
        },
      ],
      selectedItems: [],
      selected: [],
      item: {},
      issuedBy: '',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          align: 'right',
          labels: {
            render: 'percentage',
            fontColor: ['green', 'white', 'red'],
            precision: 2,
          },
        },
      },
      csvheaders: [
        {
          text: this.$t('Item no'),
          value: 'itemNumber',
        },
        {
          text: this.$t('Item name'),
          value: 'itemName',
        },
        {
          text: this.$t('GRN no'),
          value: 'GRNno',
        },
        {
          text: this.$t('Bin card no'),
          value: 'binCardNumber',
        },

        {
          text: this.$t('Inhouse date'),
          value: 'inHouseDate',
        },
        {
          text: this.$t('Invoice No'),
          value: 'invoiceNo',
        },
        {
          text: this.$t('suppliers'),
          value: 'suppliers',
        },
        {
          text: this.$t('Material description'),
          value: 'description',
        },
        {
          text: this.$t('Material type'),
          value: 'materialType',
        },
        {
          text: this.$t('Color'),
          value: 'color',
        },
        {
          text: this.$t('UoM'),
          value: 'unitOfMeasure',
        },
        {
          text: this.$t('TQY'),
          value: 'totalQuantity',
        },
        {
          text: this.$t('material status'),
          value: 'materialStatus',
        },

        {
          text: this.$t('Unit Price'),
          value: 'unitPrice',
        },
        {
          text: this.$t('Ttl Price'),
          value: 'totalPrice',
        },

        {
          text: this.$t('PO NO'),
          value: 'poNo',
        },
        {
          text: this.$t('Issue Dept'),
          value: 'issueDept',
        },
        {
          text: this.$t('Issue QTY'),
          value: 'issueQTY',
        },
        {
          text: this.$t('Purchased date'),
          value: 'purchasedDate',
        },

        {
          text: this.$t('Balance'),
          value: 'balance',
        },
        {
          text: this.$t('Remarks'),
          value: 'remarks',
        },
      ],
      csvData: [],
      csvDialog: false,
      testData: [],
      inventoryItem: [],

      inputRule: [(v) => !!v || 'This field is required'],
    }
  },

  async created() {
    this.item.issuedById = this.user.id
    this.item.state = 'pendding'
    this.issuedBy = this.user.fullName
    this.item.issueDate = new Date()
    const { inventoryId } = this.$route.params
    this.inventoryId = inventoryId
    this.item.inventoryId = this.inventoryId
    this.loadData()
  },
  computed: {
    ...mapState('inventory', [
      'items',
      'inventoryImage',
      'idInventory',
      'stateChart',
      'supplier',
    ]),
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QrcodeVue,
    uploadIcon,
    camera,
    add,
  },
  methods: {
    ...mapActions('inventory', [
      'getItem',
      'getInventoryById',
      'getProfileImage',
      'getChartData',
      'postData',
      'deleteItem',
      'printItemQrCode',
      'deleteItem',
      'uploadItemData',
      'getSupplier',
    ]),
    async print() {
      this.printItemQrCode(this.items)
      this.qrdialog = false
    },

    closeDialog() {
      this.csvDialog = false
      this.csvData = []
    },
    loadCSV(e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result
          vm.csvJSON(csv)
        }
        reader.onerror = function (evt) {
          if (evt.target.error.name == 'NotReadableError') {
            alert("Canno't read file !")
          }
        }
      } else {
        alert('FileReader are not supported in this browser.')
      }
    },
    csvJSON(csv) {
      var vm = this
      var lines = csv.split('\n')

      lines.map(function (line, indexLine) {
        if (indexLine < 1) return // Jump header line
        var currentline = line.split(',')
        //assign value of each row to object
        var csv_headers = {
          inHouseDate: currentline[4],
          invoiceNo: currentline[5],
          suppliers: currentline[6],
          description: currentline[7],
          materialType: currentline[8],
          totalQuantity: currentline[11],
          materialStatus: currentline[12],
          color: currentline[9],
          unitPrice: currentline[13],
          totalPrice: currentline[14],
          unitOfMeasure: currentline[10],
          itemCatagory: currentline[15],
          poNo: currentline[16],
          issueDept: currentline[17],
          issueQTY: currentline[18],
          balance: currentline[20],
          purchasedDate: currentline[19],
          itemNumber: currentline[0],
          binCardNumber: currentline[3],
          itemName: currentline[1],
          GRNno: currentline[2],
          remarks: currentline[21],
        }
        //push object to array
        vm.csvData.push(Object.assign({}, csv_headers))
      })
      vm.csvData.pop()
      vm.csvDialog = false
      vm.csvDialog = true
      // eslint-disable-next-line no-console
      console.log(vm.csvData)
    },

    async uploadtoServer() {
      this.csvData.forEach((element) => {
        element.inventoryId = this.$route.params.inventoryId
        for (var i in this.supplier) {
          if (this.supplier[i].supplierName == element.suppliers) {
            element.supplierId = this.supplier[i].id
            delete element.suppliers
          }
        }
      })

      await this.uploadItemData(this.csvData).then((r) => {
        // eslint-disable-next-line no-console
        if (r) {
          this.$notify({
            type: 'success',
            title: 'ItemvList cost',
            message: `ItemvList cost Registered from csv`,
          })

          location.reload()
          this.csvDialog = true
          this.csvDialog = false
        } else {
          this.$notify({
            type: 'danger',
            title: 'Error',
            message: `Server Error, Could not upload your data please try again.`,
          })
          this.csvDialog = true
          this.csvDialog = false
        }
      })
    },
    async drawChart() {
      var data = []
      var dataExist = 0

      for (let i = 0; i < this.items.length; i++) {
        for (let d = 0; d < data.length; d++) {
          if (this.items[i].materialStatus === data[d].materialStatus) {
            dataExist = 1

            data[d].total = parseInt(data[d].total) + 1
            break
          } else dataExist = 0
        }

        if (dataExist === 0)
          data.push({ total: 1, materialStatus: this.items[i].materialStatus })
      }

      am4core.useTheme(am4themes_animated)
      let chart = am4core.create('chartdiv', am4charts.PieChart)

      chart.data = data
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries())
      pieSeries.dataFields.value = 'total'
      pieSeries.dataFields.category = 'materialStatus'
      pieSeries.slices.template.stroke = am4core.color('#fff')
      pieSeries.slices.template.strokeOpacity = 1

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1
      pieSeries.hiddenState.properties.endAngle = -90
      pieSeries.hiddenState.properties.startAngle = -90

      chart.hiddenState.properties.radius = am4core.percent(0)
    },
    async loadData() {
      this.getSupplier().then(() => {})
      await this.getItem(this.inventoryId)
      this.drawChart()
      this.getChartData(this.inventoryId)
      this.getInventoryById(this.inventoryId).then((res) => {
        res
        this.getProfileImage([
          'inventory/download',
          this.idInventory.imagePath,
        ]).then((at) => {
          at
          this.invnetory = {
            inventoryName: this.idInventory.inventoryName,
            createdBy: this.idInventory.createdBy,
            date: this.idInventory.date,
            imagePath: this.inventoryImage,
            categoryName: this.idInventory.category.categoryName,
            description: this.inventoryId.description,
            stock: this.inventoryId.stock,
          }
        })
      })
    },
    selectedItem(item) {
      const index = this.selected.indexOf(item.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
        this.selectedItems.splice(index, 1)
      } else {
        this.selected.push(item.id)
        this.selectedItems.push({
          itemName: item.itemName,
          totalQuantity: item.totalQuantity,
          cost: item.cost,
          description: item.description,
          type: item.type,
        })
      }
      this.item.items = this.selected
      this.showBtn = this.selected.length > 0 ? true : false
    },
    redo() {
      this.$refs.editor.redo()
    },

    pen() {
      this.$refs.editor.set('freeDrawing', { stroke: 'red' })
    },

    undo() {
      this.$refs.editor.undo()
    },
    save() {
      if (this.$refs.form.validate()) {
        const blob = this.$refs.editor.saveImage()
        this.item.issueSignature = blob.replace(/^data:image.+;base64,/, '')
        this.postData([this.item, path.issue])
          .then(() => {
            this.item = {}
            this.$router.push({
              name: 'issue-list',
            })
            this.$notify({
              type: 'success',
              title: this.$t('  New issue'),
              message: `${this.$t('Issue')} ${this.$t('created Successfully')}`,
            })
          })
          .catch((err) => {
            this.showErrors(err)
          })
      }
    },
    async delItem(id, path) {
      const confirmed = await this.$confirm(this.$t('are_you_sure'), {
        buttonTrueText: this.$t('yes'),
        buttonFalseText: this.$t('no'),
      })
      if (confirmed) {
        this.deleteItem([id, path]).then(() => {
          this.$notify({
            type: 'danger',
            title: 'Deleted!',
            message: `${this.resourceName} ${this.$t('deleted')} ${this.$t(
              'successfully',
            )}.`,
          })

          this.loadData()
        })
      }
    },
  },
}
</script>
<style scoped>
.rounded-card {
  border-radius: 50px;
}

img {
  height: 22vh;
  width: 60%;
  /* border-radius: 20px;
  border: 1px solid #555; */
}
.pieChart {
  height: 28vh;
}
span {
  font-size: 15px;
}
div {
  text-align: justify;
  text-justify: inter-word;
}
.desc {
  margin-bottom: 1px;
}
.date {
  margin-top: 2px;
}
#chartdiv {
  width: 100%;
  height: 200px;
}
</style>

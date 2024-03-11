<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md3 lg3 pa-3>
            <h2 class="grey--text">Master List</h2>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-3>
            <v-text-field
              flat
              prepend-inner-icon="mdi-magnify"
              color="primary"
              dense
              solo-inverted
              rounded
              v-model="search"
              label="Search Salary"
            />
          </v-flex>
          <v-flex xs12 sm12 md5 lg5 pa-3>
            <div class="text-right">
              <!--<v-btn
                rounded
                outlined
                color="success"
                class="mx-2"
                @click="$router.push({name:'employee-qrcode'})"
              >QR Code</v-btn>-->
              <v-btn
                outlined
                rounded
                color="primary"
                class="text-capitalize"
                @click="$router.push({name:'create-master'})"
              >Add New Master</v-btn>
              <v-tooltip bottom v-if="mappedItem.length > 0">
                <v-btn
                  slot="activator"
                  text
                  class="csv-download-icon primary--text"
                  @click="downloadDataAsCsv('opmsSalaryMasterList',mappedItem)"
                >
                  <v-icon large>open_in_browser</v-icon>
                </v-btn>
                <span>{{ $t("Download CSV") }}</span>
              </v-tooltip>
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :items="mappedItem"
          item-key="id"
          :total-items="totalItems"
          :rows-per-page-text="`${$t('master')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{ $t(props.header.text) }}</span>
          </template>
          <template v-slot:item.joiningDate="{ item }">
            <span>{{new Date(item.joiningDate).toLocaleDateString("en-US")}}</span>
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
                  Click here
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
                        name: 'master-info',
                        params: { masterId: item.id }
                      })
                    "
                  >
                    more info
                  </v-btn>

                  <v-btn
                    text
                    small
                    color="primary"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'update-master',
                        params: { masterId: item.id }
                      })
                    "
                  >
                    <v-icon small>edit</v-icon>
                    edit
                  </v-btn>

                  <v-btn
                    text
                    small
                    color="red"
                    class="text-capitalize"
                    @click="deleteItem(item.id, path)"
                  >
                    <v-icon small>delete</v-icon>
                    delete
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>


<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadSalaryMixin } from "@/shared/mixins";
export default {
  name: "Salary Master List",
  mixins: [tableMixin, csvDownloadSalaryMixin],
  data() {
    return {
      component: "salary",
      ifNoData: "create-master",
      length: 0,
      filter: {
        include: ["employee"],
      },
      item: [],
      exp: [],
      mappedItem: [],
      resource: api,
      resourceName: "User",
      searchField: "idno",
      path: path.master,
      headers: [
        {
          text: "ID NO",
          value: "idno",
        },
        {
          text: "EMPLOYEE",
          value: "fullName",
        },
        {
          text: "Sex",
          value: "gender",
        },
        {
          text: "DEPARTMENT",
          value: "department",
        },
        {
          text: "Resp Allow",
          value: "responseAllow",
        },
        {
          text: "Home Allow",
          value: "homeAllow",
        },
        {
          text: "Transport Pay",
          value: "transportPay",
        },
        {
          text: "ACTION",
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Salary",
          disabled: true,
        },
        {
          text: "Master",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.item = (await api.all(this.path, this.filter)).rows;
      this.getExperaince();
    },
    getExperaince() {
      this.exp = [];
      for (let iterator of this.item) {
        // ===================Joining Date===================================
        let jod = new Date(iterator.employee.joiningDate);
        let jd = jod.getDate();
        let jm = jod.getMonth() + 1;
        let jy = jod.getFullYear();
        // ===================Current Date===================================
        let date = new Date();
        let cd = date.getDate();
        let cm = date.getMonth() + 1;
        let cy = date.getFullYear();
        let m, y, d;
        y = cy - jy;
        if (cm >= jm) m = cm - jm;
        else {
          y--;
          m = 12 + cm - jm;
        }

        if (cd >= jd) d = cd - jd;
        else {
          m--;
          d = 31 + cd - jd;

          if (m < 0) {
            m = 11;
            y--;
          }
        }
        this.exp.push(d + "-" + m + "-" + y);
      }
      this.mapForPrint();
    },
    mapForPrint() {
      this.mappedItem = [];
      for (let i = 0; i < this.item.length; i++) {
        this.mappedItem.push({
          idno: this.item[i].employee.idno,
          fullName: this.item[i].employee.fullName,
          gender: this.item[i].employee.gender,
          joiningDate: new Date(
            this.item[i].employee.joiningDate
          ).toLocaleDateString("en-US"),
          salary: this.item[i].employee.salary,
          department: this.item[i].employee.department,
          subDept: this.item[i].employee.subDept,
          responseAllow: this.item[i].responseAllow,
          homeAllow: this.item[i].homeAllow,
          absentIncentive: this.item[i].absentIncentive,
          transportPay: this.item[i].transportPay,
          costSharing: this.item[i].costSharing,
          ironIncentive: this.item[i].ironIncentive,
          labourContribution: this.item[i].labourContribution,
          exp: this.exp[i],
          id: this.item[i].id,
        });
      }
    },
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.$notify({
          type: "success",
          title: "Success",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`,
        });
        this.loadData();
      }
    },
  },
};
</script>
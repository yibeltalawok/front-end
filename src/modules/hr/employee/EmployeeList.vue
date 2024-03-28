<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-text-field
            hide-details
            flat
            prepend-inner-icon="search"
            color="amber"
            dense
            solo
            rounded
            v-model="search"
            :label="$t('employ') + ' ' + $t('search')"
          />
          <v-spacer />
          <v-spacer />
          <Registercsv />
          <v-btn
           rounded
              small
              outlined
              color="#ECBB44"
              class="text-capitalize ml-3 mr-3"
            @click="$router.push({ name: 'create-emploayee' })"
            > <span> {{ $t("addNew") }} </span> </v-btn
          >
          <v-btn
            text
            color="amber"
            class="text-capitalize"
            @click="$router.push({ name: 'employee-qrcode' })"
          >
            <v-icon>camera</v-icon>
            <span>{{ $t("qr-code") }}</span>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }" class="mainbtn">
              <v-btn
                rounded
                small
                outlined
                color="#ecbb44"
                class="text-capitalize mainbtn"
                @click="generatecsv()"
              >
                <Download v-on="on" v-bind="attrs" style="margin: 0 0.1em;"/>
              </v-btn>
            </template>
            <span>Download report in CSV</span>
          </v-tooltip>
          <!-- <v-spacer style="width: 0;"/> -->
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }" class="mainbtn">
                <More style="width: 24px; height: 24px; margin-left: 0.5em;" v-on="on" v-bind="attrs"/>
            </template>
            <span>Show more</span>
          </v-tooltip>
        </v-toolbar>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="this.employeeList"
          item-key="id"
          :search="search"
          footer-props.items-per-page-text="`${$t('employee')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.joiningDate="{ item }">
            <span>{{
              new Date(item.joiningDate).toLocaleDateString("en-US")
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'employee-detail',
                  params: { employeeId: item.id }
                })
              "
              >{{ $t("more_detail") }}</v-btn
            >
            <v-btn
              text
              small
              color="info"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'update-employee',
                  params: { employeeId: item.id }
                })
              "
            >
              <Edit style="width: 20px; height: 20px;"/>
            </v-btn>

            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="deleteItem(item.id, path)"
            >
              <Delete style="width: 20px; height: 20px;"/>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-fab-transition>
        <v-card
          style="margin-top: 30px;"
          elevation="5"
          v-if="this.csv_employeeList.length > 0"
        >
          <v-toolbar dense flat v-if="this.csv_employeeList.length > 0">
            <v-spacer />
            <v-btn
              outlined
              small
              color="amber"
              @click.stop="localRegisterBulkEmployees()"
            >
              <v-icon style="margin-right: 10px;">mdi-upload</v-icon>Rgister all
            </v-btn>
          </v-toolbar>

          <v-data-table
            :items="this.csv_employeeList"
            :headers="headers2"
            :items-per-page="10"
            v-if="this.csv_employeeList.length > 0"
            style="margin-top: 20px"
          />
        </v-card>
      </v-fab-transition>
              <v-btn
              outlined
              small
              color="amber"
              @click.stop="viewFetchAllEmployees()"
            >
          List
            </v-btn>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import { mapState, mapActions, mapMutations } from "vuex";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
import Registercsv from "../employee/register_with_csv.vue";
import Edit from "@/assets/icons/edit_icon.svg"
import Delete from "@/assets/icons/delete_icon.svg"
import Download from "@/assets/icons/arrow-down.svg"
import More from "@/assets/icons/more-icon.svg"
export default {
  name: "EmployeeList",
  mixins: [tableMixin, csvDownloadMixin],
  components: {
    Registercsv,
    Edit,
    Delete,
    Download,
    More
  },
  data() {
    return {
      component: "employee",
      parseCsv: null,
     search:"",
      ifNoData: "employee-create",
      length: 0,
      filter: {
        include: ["userRole"]
      },
      resource: api,
      item: [],
      resourceName: "User",
      searchField: "fullName",
      path: path.employee,
      headers2: [
        { text: "Id number", value: "idno" },
        { text: "Full name", value: "fullName" },
        { text: "Phone number", value: "phoneNumber" },
        { text: "Gender", value: "gender" },
        { text: "Date of joining", value: "joiningDate" },
        { text: "Position", value: "position" },
        { text: "Department", value: "department" },
        { text: "Sub department", value: "subDept" },
        { text: "Salary", value: "salary" },
        { text: "Resposibility allowance", value: "responseAllow" },
        { text: "Home allowance", value: "homeAllow" },
        { text: "Allow absent incentive", value: "absentIncentive" },
        { text: "Transport pay", value: "transportPay" },
        { text: "Cost sharing", value: "costSharing" },
        { text: "Ironing incentive", value: "ironIncentive" },
        { text: "Food Allowance", value: "foodallow" },
        { text: "Mobile Allowance", value: "mobileallow" },
        { text: "Position Allowance", value: "positionallow" },
        { text: "Bank account", value: "bankaccnum" }
      ],

      headers: [
        {
          text: this.$t("idno"),
          value: "idno"
        },
        {
          text: this.$t("fullName"),
          value: "fullName"
        },
        {
          text: this.$t("department"),
          value: "department"
        },
        // {
        //   text: "Position",
        //   value: "position"
        // },
        {
          text: this.$t("subDept"),
          value: "subDept"
        },
        // {
        //   text: this.$t("role"),
        //   value: "userRole.name"
        // },
        {
          text: this.$t("salary"),
          value: "salary"
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
    ...mapState("employee", ["csv_employeeList", "vroles", "employeeList"])
  },
  mounted() {
    this.localFetchRoles();
  },
  methods: {
    ...mapActions("employee", ["registerBulkEmployees","fetchAllEmployees"]),
    ...mapMutations("employee", ["setRoles"]),
    async localFetchRoles() {
      await api.all(path.userRole).then(values => {
        this.setRoles(values.rows);
      });
    },

    generatecsv() {
      this.item = this.items.map(x => {
        return {
          idno: x.idno,
          fullName: x.fullName,
          gender: x.gender,
          role: x.userRole.name,
          phoneNumber: x.phoneNumber,
          perfrm: x.prfrm,
          joiningDate: new Date(x.joiningDate).toLocaleDateString("en-US"),
          department: x.department,
          experience: this.calcuExp(x.joiningDate),
          subDept: x.subDept,
          salary: x.salary,
          incentiveSalary: x.incentiveSalary == null ? 0 : x.incentiveSalary,
          totalSalary: x.totalSalary,
          responseAllow: x.responseAllow,
          homeAllow: x.homeAllow,
          transportPay: x.transportPay,
          ironIncentive: x.ironIncentive,
          absentIncentive: x.absentIncentive,
          costSharing: x.costSharing
        };
      });
      this.downloadDataAsCsv("opmsEmployeeList", this.item);
    },
    calcuExp(joiningDate) {
      // ===================Joining Date===================================
      let jod = new Date(joiningDate);
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
      return d + "-" + m + "-" + y;
    },
   async viewFetchAllEmployees() {
    await this.fetchAllEmployees().then(r=>{
      console("action==",r)
    })
    },
    async localRegisterBulkEmployees() {
      await this.registerBulkEmployees().then(r => {
        if (r) {
          this.$notify({
            type: "success",
            title: this.$t("Add New Employee"),
            message: `${this.$t("Employee")} ${this.$t(
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
    async deleteItem(id) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
        buttonTrueColor: "#d9534f",
        buttonFalseColor: "#5cb85c"
      });
      if (confirmed) {
        await api.create({ employeeId: id }, path.deleteEmployee);
        this.loadData();
      }
    }
  }
};
</script>
<style scoped>
.mainbtn:focus{
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
 }

</style>
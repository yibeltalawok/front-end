<template>
  <div>
    <v-toolbar dense flat>
      <v-breadcrumbs :items="camps">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer />  
        <v-autocomplete
          label="Filter by Department"
          v-model="department"
          :items="departments"
          item-text="department"
          item-value="department"
          outlined
          dense
          hide-details
          @input="getByDept(department)"
        /> <v-spacer></v-spacer>
         <v-text-field
                     :label="$t('filter-by-date')"
                           placeholder="YYYY-MM"
                          dense
                          outlined
                          v-validate="'required'"
                          :error-messages="errors.collect('joiningDate')"
                          v-model="dat"
                          hide-details
                          name="joiningDate"
                          type="month"
                          @input="loadData"
                        />


<!-- 

 <v-flex xs12 sm12 md4 lg4 pa-2>
        <v-text-field
          :label="$t('filter-by-date')"
          placeholder="YYYY-MM"
          dense
          outlined
          hide-details
          v-model="da"
          v-validate="'required'"
          type="month"
          @input="getData"
        />
      </v-flex> -->





                        <v-spacer></v-spacer>
           <v-btn
           style="margin-right: 20px;"
                outlined
                color="blue" 
       @click="viewAllData()"
       >View all</v-btn>  
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-capitalize"
        @click="downloadDataAsCsv('opmsPayrollSummarySheetList',tableValue)"
        v-if="tableValue.length>0"
      >Print</v-btn>
    </v-toolbar>
    <v-container grid-list-xs fluid> 
        <v-data-table
          :headers="headers"
          :rows-per-page="10"
          :loading="loading"
          :items="tableValue"
          item-key="id"
          footer-props.items-per-page-text="`${$t('master')} per page`"
                 >
          <!-- <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template> -->
          <!-- <template v-slot:item.joiningDate="{ item }">
            <span>{{
              new Date(item.joiningDate).toLocaleDateString("en-US")
            }}</span>
          </template>  -->
        </v-data-table>



      <!-- <table id="myTable">
        <thead style="background:#bbb">
          <th v-for="(header,i) in headers" :key="i" @click="sortTable(i)">{{header}}</th>
        </thead>

        <tr v-for="(item,i) in tableValue" :key="i">
          <td>{{item.idno}}</td>
          <td>{{item.fullName}}</td>
          <td>{{item.department}}</td>
          <td>{{item.subDept}}</td>
          <td>{{item.salary}}</td>
          <td>{{item.ironIncentive}}</td>
          <td>{{item.miscPayment}}</td>
          <td>{{item.incentive}}</td>
          <td>{{item.transportPay}}</td>
          <td>{{item.costSharing}}</td>
          <td>{{item.otHr15}}</td>
          <td>{{item.otHr20}}</td>
          <td>{{item.otHr25}}</td>
          <td>{{item.otBirr}}</td>
          <td>{{item.absentIncentive}}</td>
          <td>{{item.absent}}</td>
          <td>{{item.incomeTax}}</td>
          <td>{{item.pensionContribution}}</td>
          <td>{{item.pensionDeduction}}</td>
          <td>{{item.payback}}</td>
          <td>{{item.totalDeduction}}</td>
          <td>{{item.grossSalary}}</td>
          <td>{{item.netPay}}</td>
        </tr>
        <tr v-if="tableValue.length==0">
          <td></td>
          <td colspan="21">
            <v-layout row justify-center>
              <h1 class="red--text">No data is found!!</h1>
            </v-layout>
          </td>
          <td></td>
        </tr>
      </table> -->
    </v-container>
  </div>
</template>

<script>
import { csvDownloadSummarySheetMixin } from "@/shared/mixins";
import {api,path} from "@/api"
// import manageDbData from "./manageDbData";
export default {
  name: "SummarySheet",
  mixins: [csvDownloadSummarySheetMixin,],
  data() {
    return {
      headers: [
        {text:"Id No",value:"idno"},
        {text:"Name",value:"fullName"},
        {text:"Dept",value:"department"},
        {text:"Sub Dept",value:"subDept"},
        {text:"Salary",value:"salary"},
        {text:"Iron incentive",value:"ironIncentive"},
        {text:"MISC payment",value:"miscPayment"},
        {text:"Prod incentive",value:"incentive"},
        {text:"Transport pay",value:"transportPay"},
        {text:"Cost sharing",value:"costSharing"},
        {text:"OT HR(1.125)",value:"otHr125"},
        {text:"OT HR(1.5)",value:"otHr15"},
        {text:"OT HR(2.0)",value:"otHr20"},
        {text:"OT HR(2,5)",value:"otHr25"},
        {text:"OT in Birr",value:"otBirr"},
        {text:"Absent incentive",value:"absentIncentive"},
        {text:"Absent",value:"absent"},
        {text:"Income tax",value:"incomeTax"},
        {text:"Pension Contri(7%)",value:"pensionContribution"},
        {text:"Pension Contri(11%)",value:"pensionDeduction"},
        {text:"Payback",value:"payback"},
        {text:"Ttl Dedn",value:"totalDeduction"},
        {text:"Gross Salary",value:"grossSalary"},
        {text:"Net pay",value:"netPay"}
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Payroll Master",
          disabled: false,
          to: "/app/payroll/master/list"
        },
        {
          text: "Create Summary Sheet",
          disabled: true
        }
      ],
      departments: [],
      totalEmp: [],
      department: "",
      dat: new Date().toISOString().substr(0, 7),
    };

  },
  created(){
     this.loadData(new Date())
  },
  methods: {
  async  loadData(dat){ 
       await api
        .create({date: dat}, path.payrollSummarySheet)
        .then(result => {
          this.totalEmp = result; 
         
        });
         this.tableValue=this.totalEmp;
          this.manageDepartment()
    },
    async manageDepartment() {
      this.departments = [];
      let tempd = [];
      for (const iterator of this.totalEmp) {
        const indexd = tempd.indexOf(iterator.department);
        if (indexd == -1) {
          this.departments.push({
            department: iterator.department,
            id: iterator.id
          });
          tempd.push(iterator.department);
        }
      }
    },

    async getData(value, type) {
      this.getHeader();
      let attended = [];
      await api
        .create({ value: value, type: type }, path.getAttendance)
        .then(result => {
          attended = result;
        });
      this.attendEmpp = attended;
      this.checkAttendance(this.attendEmpp);
     },

    // assignToTable() {
    //   this.manageDepartment();
    //   this.totalEmp = [];
    //   this.tableValue = [];
    //   for (let i = 0; i < this.summary.length; i++) {
    //     this.totalEmp.push({
    //       idno: this.summary[i].employee.idno,
    //       fullName: this.summary[i].employee.fullName,
    //       department: this.summary[i].employee.department,
    //       subDept: this.summary[i].employee.subDept,
    //       salary: this.summary[i].employee.salary,
    //       ironIncentive: this.summary[i].employee.ironIncentive,
    //       miscPayment: this.summary[i].miscPayment,
    //       incentive: this.summary[i].employee.incentiveSalary,
    //       transportPay: this.summary[i].employee.transportPay,
    //       costSharing: this.summary[i].employee.costSharing + "%",
    //       otHr15: this.otHr15[i].toFixed(2),
    //       otHr20: this.otHr20[i].toFixed(2),
    //       otHr25: this.otHr25[i].toFixed(2),
    //       otBirr: this.otBirr[i].toFixed(2),
    //       absentIncentive: this.summary[i].employee.absentIncentive,
    //       absent: 0,
    //       incomeTax: this.incomeTax[i],
    //       pensionContribution:  (
    //         parseFloat(this.summary[i].employee.salary) * 0.07
    //       ).toFixed(2),
    //        pensionDeduction: (
    //         parseFloat(this.summary[i].employee.salary) * 0.11
    //       ).toFixed(2),
    //       payback: this.summary[i].payback,
    //       totalDeduction: this.totalDeduction[i],
    //       grossSalary: this.grossSalary[i],
    //       netPay: this.netPay[i],
    //       sign: ""
    //     });
    //   }
    //   this.tableValue = this.totalEmp;
    // },
    getByDept(department) {
      this.tableValue = [];
      for (let iterator of this.totalEmp) {
        if (iterator.department == department) {
          this.tableValue.push(iterator);
        }
      }},  
  viewAllData(){ 
    this.tableValue=[]
 this.tableValue = this.totalEmp
    // alert(this.tableValue.length+"   "+this.totalEmp.length)
    this.loadData(new Date())
}
}

}

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


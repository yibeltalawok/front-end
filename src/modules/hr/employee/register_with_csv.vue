/* eslint-disable no-console */
<template>
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
      <v-btn rounded
              small
              outlined
              color="#ECBB44"
              class="text-capitalize ml-3 mr-3" @click.stop="$refs.csvfileInput.click()">
        <v-icon small style="margin-right: 10px;">mdi-file</v-icon>
        {{$t('register-from')}}
      </v-btn>
    </v-row>
  </v-flex>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Registercsv",
  components: {},
  data() {
    return {
      sortKey: null,
      sortOrders: [],
      parse_header: [],
      parse_csv: null,
      roleId: null,
      csv_headers: {
        
      }
    };
  },

  computed: {
    ...mapState("employee", ["vroles", "employeeList"]),
    
  },

  mounted() {
    
    
  },

  methods: {
    ...mapMutations("employee", ["setCSVemployeeList"]),

    test() {
      // eslint-disable-next-line no-console
      console.log(this.roleId);
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
      //   var headers = lines[0].split(",")
      vm.parse_header = lines[0].split(",");
      lines[0].split(",").forEach(function(key) {
        vm.sortOrders[key] = 1;
      });

      for (var i = 0; i < vm.vroles.length; i++) {
        
          if (vm.vroles[i].name == "employee") vm.roleId = vm.vroles[i].id;
        }

      var duplicate = [];

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return; // Jump header line

        // var obj = {}
        var currentline = line.split(",");
        // eslint-disable-next-line no-unused-vars
        var found = false;

        for (var j = 0; j < vm.employeeList.length; j++) {
          // eslint-disable-next-line no-console
          console.log(currentline[0] + " " + vm.employeeList[j].idno);
          if (currentline[0] == vm.employeeList[j].idno) {
            duplicate.push(j);
            found = true;
            break;
          }
        }

        // eslint-disable-next-line no-unused-vars
        if (currentline[4] != undefined ) var temp = currentline[4].toString().replace(/\//g, "-").split("-")

        if (!found) {
          vm.csv_headers = {
            idno: currentline[0],
            fullName: currentline[1],
            phoneNumber: currentline[2],
            gender: currentline[8] == "" ? "NA" : currentline[3],
            joiningDate: currentline[4] == undefined ? "NA" : temp[2] + "-" + temp[1] + "-" + temp[0],
            position: currentline[5] == "" ? "NA" : currentline[5],
            department: currentline[6] == "" ? "NA" : currentline[6],
            subDept: currentline[7] == "" ? "N/A" : currentline[7],
            salary: currentline[8] == "" ? 0 : currentline[8],
            totalSalary: currentline[8] == "" ? 0 : currentline[8],
            responseAllow: currentline[9] == "" ? 0 : currentline[9],
            incentiveSalary: 0,
            homeAllow: currentline[10] == "" ? 0 : currentline[10],
            absentIncentive: currentline[11] == "" ? 0 : currentline[11],
            transportPay: currentline[12] == "" ? 0 : currentline[12],
            costSharing: currentline[13] == "" ? 0 : currentline[13],
            ironIncentive: currentline[14] == "" ? 0 : currentline[14],
            foodallow: currentline[15] == "" ? 0 : currentline[15],
            mobileallow: currentline[16] == "" ? 0 : currentline[16],
            positionallow: currentline[17] == "" ? 0 : currentline[17],
            bankaccnum: currentline[18],
            userRoleId: vm.roleId
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

      this.setCSVemployeeList(result);
      return result; // JavaScript object
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

    clearCSVData() {
      this.csv_headers = {
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
        "Home allowance": "",
        "Allow absent incentive": "",
        "Transport pay": "",
        "Cost sharing": "",
        "Ironing incentive": ""
      };
    }
  }
};
</script>

<style>
.am > *{
  color: #ECBB44;
}
</style>

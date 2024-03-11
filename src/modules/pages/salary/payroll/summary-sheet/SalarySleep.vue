<template>
  <div>
    <v-toolbar dense flat>
      <v-btn
        text
        class="text-capitalize primary--text"
        @click="$router.push({ name: 'payroll-master-list' })"
      >
        <v-icon class="mx-3">mdi-chevron-left</v-icon>
        {{ $t("go_back") }}
      </v-btn>
      <v-spacer></v-spacer>
      <!-- <v-card flat width="200px" class="mx-3">
        <v-combobox
          hide-details
          outlined
          dense
          v-model="range"
          :items="printRange"
          item-text="range"
          item-value="range"
          label="Select Range to print"
          @input="mangePrint(range)"
        />  
      </v-card> -->
      <v-btn color="primary" class="text-capitalize" @click="generatePdf"
        >Print</v-btn
      >
    </v-toolbar>
    <v-container grid-list-xs fluid>
      <v-layout row wrap justify-center>
        <v-flex
          xs10
          sm10
          md5
          lg5
          pa-2
          v-for="item in totalEmp"
          :key="item.ideno"
        >
          <v-card class="mx-auto" outlined Bak="#6666">
            <v-toolbar dense flat height="30">
              <v-row>
                <v-layout row wrap>
                  <v-flex xs8 sm8 md4 lg4><label>Employee name</label></v-flex>
                  <v-flex xs8 sm8 md4 lg4>{{ item.fullName }}</v-flex>
                  <v-flex xs8 sm8 md2 lg2><label>Id No.</label></v-flex>
                  <v-flex xs8 sm8 md2 lg2>{{ item.idno }}</v-flex>
                </v-layout>
              </v-row>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex
                  xs12
                  sm12
                  md13
                  lg13
                  ref="content"
                  class="mx-auto text-center"
                >
                  <table id="myTable">
                    <tr>
                      <td class="ttle">Month</td>
                      <td>
                        {{
                          months[new Date().getMonth()] +
                            "-" +
                            (new Date().getFullYear() - 2000)
                        }}
                      </td>
                      <td class="ttle">O/T in Birr</td>
                      <td>{{ item.otBirr }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">Basic Salary</td>
                      <td>{{ item.salary }}</td>
                      <td class="ttle">Absent Incentive</td>
                      <td>{{ item.absentIncentive }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">Iron Incentive</td>
                      <td>{{ item.ironIncentive }}</td>
                      <td class="ttle">Cost Sharing</td>
                      <td>{{ item.costSharing }}%</td>
                    </tr>
                    <tr>
                      <td class="ttle">MISC Payment</td>
                      <td>{{ item.miscPayment }}</td>
                      <td class="ttle">Income Tax</td>
                      <td>{{ item.incomeTax }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">Prod incentive</td>
                      <td>{{ item.incentive }}</td>
                      <td class="ttle">Pension Contr 7%</td>
                      <td>{{ item.pensionContribution }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">Transport Pay</td>
                      <td>{{ item.transportPay }}</td>
                      <td class="ttle">Pension Dedn 11%</td>
                      <td>{{ item.pensionDeduction }}</td>
                    </tr>
                    <tr>
                     <td class="ttle">O/T in hr(1.125)</td>
                      <td>{{ item.otHr125 }}</td>
                      <td class="ttle">Payback</td>
                      <td>{{ item.payback }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">O/T in hr 1.75</td>
                      <td>{{ item.otHr15 }}</td>
                      <td class="ttle">Total Deduction</td>
                      <td>{{ item.totalDeduction }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">O/T in hr 2.0</td>
                      <td>{{ item.otHr20 }}</td>
                      <td class="ttle">Gross Salary</td>
                      <td>{{ item.grossSalary }}</td>
                    </tr>
                    <tr>
                      <td class="ttle">O/T in hr 2.5</td>
                      <td>{{ item.otHr25 }}</td>
                      <td class="ttle">Net Salary</td>
                      <td>{{ item.netSalary }}</td> 
                    </tr>
                  </table>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manageDbData from "./manageDbData";
//import {api,path} from "@/api"
import {mapState,mapActions} from "vuex"
import "jspdf-autotable";

export default {
  name: "Salary_Sleep",
  mixins: [manageDbData],
  data() {
    return {
      size: 200,
      printRange: [],
      range: null,
      headers: [
        "Id No",
        "Name",
        "Dept",
        "Sub Dept",
        "Salary",
        "Iron incentive",
        "MISC payment",
        "Prod incentive",
        "Transport pay",
        "Cost sharing",
        "OT HR(1.25)",
        "OT HR(2.0)",
        "OT HR(2,5)",
        "OT in Birr",
        "Absent incentive",
        "Absent",
        "Income tax",
        "Pension Contri(7%)",
        "Pension Dedn(11%)",
        "Payback",
        "Ttl Dedn",
        "Gross Salary",
        "Net pay"
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
          text: "Salary Slip",
          disabled: true
        }
      ],
     // totalEmp: [],
      months: [
        "Jan",
        "Febr",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },
  created() {
    this.getReport(new Date());
  },
  computed: {
    ...mapState("payrolls", ["totalEmp"])
  },
//   created(){
//  this.loadData(new Date())
//   },



  methods: {
    ...mapActions("payrolls", [
       "getSalarySleep"
    ]),
    getReport(date) {
      this.getSalarySleep(date);
    },

  // async  loadData(date){ 
  //      await api
  //       .create({ date: date}, path.payrollSummarySheet)
  //       .then(result => {
  //         this.totalEmp = result; 
         
  //       });
  //   },

    assignToTable() {
      // for (let i = 0; i < this.summary.length; i++) {
      //   this.totalEmp.push({
      //     idno: this.summary[i].employee.idno,
      //     fullName: this.summary[i].employee.fullName,
      //     department: this.summary[i].employee.department,
      //     subDept: this.summary[i].employee.subDept,
      //     salary: this.summary[i].employee.salary,
      //     ironIncentive: this.summary[i].employee.ironIncentive,
      //     miscPayment: this.summary[i].miscPayment,
      //     incentive: this.summary[i].employee.incentiveSalary,
      //     transportPay: this.summary[i].employee.transportPay,
      //     costSharing: this.summary[i].employee.costSharing,
      //     otHr15: this.otHr15[i].toFixed(2),
      //     otHr20: this.otHr20[i].toFixed(2),
      //     otHr25: this.otHr25[i].toFixed(2),
      //     otBirr: this.otBirr[i].toFixed(2),
      //     absentIncentive: this.summary[i].employee.absentIncentive,
      //     absent: 0,
      //     incomeTax: this.incomeTax[i],
      //     pensionContribution: (
      //       parseFloat(this.summary[i].employee.salary) * 0.07
      //     ).toFixed(2),
      //     pensionDeduction: (
      //       parseFloat(this.summary[i].employee.salary) * 0.11
      //     ).toFixed(2),
      //     payback: this.summary[i].payback,
      //     totalDeduction: this.totalDeduction[i],
      //     grossSalary: this.grossSalary[i],
      //     netPay: this.netPay[i],
      //     netSalary: this.netSalary[i]
      //   });
      // }
      this.tableValue = this.totalEmp;
      let end = 16;
      for (let index = 1; index < this.totalEmp.length; index += 16) {
        this.printRange.push({
          initial: index,
          end: end,
          range: index + "-" + end
        });
        if (end + 16 > this.totalEmp.length) {
          end = this.totalEmp.length;
        } else {
          end += 16;
        }
      }
    },
    mangePrint(range) {
      this.tableValue = [];

      for (let i = parseInt(range.initial) - 1; i < parseInt(range.end); i++) {
        // alert(this.totalEmp[i].idno);
        this.tableValue.push(this.totalEmp[i]);
      }
    },
    print() {
      // const doc = new jsPDF("p", "mm", "a4");
      const doc = new jsPDF({
        orientation: "portrait"
      });

      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/png", 0);

        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        doc.save("salary-slip.pdf");
      });
    },
    taxSlabe(taxableIncome) {
      for (let i = 0; i < this.taxSlab.length - 1; i++) {
        if (
          taxableIncome >= parseFloat(this.taxSlab[i].initial) &&
          taxableIncome <= parseFloat(this.taxSlab[i].end) + 0.99
        ) {
          let tax = (
            (parseFloat(this.taxSlab[i].deduction) * taxableIncome) / 100 -
            parseFloat(this.taxSlab[i].extraDeduction)
          ).toFixed(2);
          return tax;
        }
      }
      let lastSlab = this.taxSlab.length - 1;

      if (taxableIncome >= parseFloat(this.taxSlab[lastSlab].initial)) {
        let tax = (
          (parseFloat(this.taxSlab[lastSlab].deduction) * taxableIncome) / 100 -
          parseFloat(this.taxSlab[lastSlab].extraDeduction)
        ).toFixed(2);
        return tax;
      }
    },
    generatePdf() {
      var doc = new jsPDF("p", "pt", "a4");
      doc.setFontSize(8);
      doc.setTextColor(0);
      let head = [];
      let body = [];
      for (const iterator of this.totalEmp) {
        head.push([
          [
            {
              content:
                "Name: " + iterator.fullName + ",   ID No: " + iterator.idno,
              colSpan: 4,
              rowSpan: 2
            }
            // {
            //   content: iterator.fullName,
            //   colSpan: 2
            // },
            // {
            //   content: "ID No: " + iterator.idno,
            //   colSpan: 2,
            //   rowSpan: 2
            // }
            // {
            //   content: iterator.idno,
            //   colSpan: 1
            // }
          ]
        ]);
        body.push([
          [],
          [
            {
              content: "month",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content:
                this.months[new Date().getMonth()] +
                "-" +
                (new Date().getFullYear() - 2000)
              // styles: { halign: "center", fillColor: [22, 160, 133] }
            },
            {
              content: "O/T(birr)",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.otBirr
            }
          ],
          [
            {
              content: "Salary",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.salary
            },
            {
              content: "Absent incen",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.absentIncentive
            }
          ],
          [
            {
              content: "Iron incen",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.ironIncentive
            },
            {
              content: "Absent",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.absent
            }
          ],
          [
            {
              content: "MISC Pa",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.miscPayment
            },
            {
              content: "Income tax",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.incomeTax
            }
          ],
          [
            {
              content: "Prod incent",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.incentive
            },
            {
              content: "Pensi contr(7%)",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.pensionContribution
            }
          ],
          [
            {
              content: "Transp pay",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.transportPay
            },
            {
              content: "Pensi Dedu(11%)",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.pensionDeduction
            }
          ],
          [
            {
              content: "Cost sharing",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.costSharing
            },
            {
              content: "Payback",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.payback
            }
          ],
          [
            {
              content: "O/T(hr) 1.75",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.otHr15
            },
            {
              content: "Total deduc",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.totalDeduction
            }
          ],
          [
            {
              content: "O/T(hr) 2.0",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.otHr20
            },
            {
              content: "Gross Salary",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.grossSalary
            }
          ],
          [
            {
              content: "O/T(hr) 2.5",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.otHr25
            },
            {
              content: "Net salary",
              styles: { halign: "center", fillColor: [220, 220, 220] }
            },
            {
              content: iterator.netSalary
            }
          ]
        ]);
      }
      // eslint-disable-next-line no-unused-vars
      let count = 0;
      for (let i = 0; i < head.length; i++) {
        doc.autoTable({
          theme: "grid",
          tableWidth: 250,
          startY: 15 + count * 250,
          margin: 15 + (i % 2) * 290,
          styles: {
            // Defaul style
            lineWidth: 0.01,
            lineColor: 0,
            fillStyle: "DF",
            halign: "center",
            valign: "middle",
            columnWidth: "auto",
            overflow: "linebreak"
          },
          head: head[i],
          body: body[i]
          // theme: "grid"
        });

        // if (i % 2 == 0) {
        //   if (i % 6 == 0) {
        //     count = 0;
        //   } else {
        //     count += 1;
        //   }
        // }
        //
        if (i % 2 != 0) {
          count++;
        }
        if (count == 2 && i % 2 != 0) {
          doc.addPage();
          count = 0;
        }
      }

      doc.save("salary slip.pdf");
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
  text-align: left;
  border: 1px solid #5e7c8a;
  font-size: 10px;
}
th {
  cursor: pointer;
}
.ttle {
  background-color: #cccd;
  font-weight: bold;
}
</style>


<template>
  <div>
    <v-card outlined style="border-radius:12px">
    <v-toolbar dense flat>
     Print out file template
      <v-spacer></v-spacer>
      <v-card flat class="mx-3">
        <v-combobox
          :items="printPeriods"
          label="Select page"
          dense
          @input="setPeriod"
          hide-details
          item-text="time"
        />
      </v-card>
      <v-btn color="primary" @click="print">Print</v-btn>
    </v-toolbar>
    <v-divider/>
    <v-container grid-list-xs>
      <div class="page landscape-parent" id="printMe">
        <div class="landscape">
          <div class="content">

            <table class="table table-bordered" style="margin-bottom: 50px;width:150px;">
              <colgroup>
                  <col span="1" style="width: 8%;">
                </colgroup>
              <tr style="height:150px;">
                <th style="text-align:center">employee QR code</th>
              </tr>
            </table>

            <table class="table table-bordered">
                 <colgroup>
                  <col span="1" style="width: 8%;">
                  <col span="1" style="width: 100%;">
                  <col span="1" style="width: 15%;">
                </colgroup>
              <tr >
                <th style="text-align:center">Period</th>
                <th></th>
              </tr>

              <tr style="height:300px;">
                <th style="text-align:center" rowspan="1">2:00 - 3:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">3:00 - 4:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">4:00 - 5:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">5:00 - 6:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">6:00 - 7:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">7:00 - 8:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">8:00 - 9:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">9:00 - 10:00</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>

             <tr style="height:300px">
                <th style="text-align:center" rowspan="1">10:00 - 11:30</th>
                <th style="text-align:center" rowspan="1"></th>
             </tr>
            
            </table>
          </div>
        </div>
      </div>
    </v-container>
   </v-card>
    
  </div>
</template>


<script>
import { api, path } from "@/api";
import { printMixin } from "@/shared/mixins";
export default {
  mixins: [printMixin],
  data() {
    return {
      printing: false,
      paper: "a3",
      pages: ["1", "2", "Both"],
      chips: [],
      amount: 1,
      size: 40,
      periods: [],
      printPeriods: [],
      lostTimes: ["MBD", "No work", "Misc"]
    };
  },

  async created() {
    let periods = (await api.all(path.period)).rows;

    let initial = parseInt(periods[0].initial, 10);
    let length = parseInt(periods[0].length, 10);
    let last = parseInt(periods[0].last, 10);
    let half = parseInt(last / 2, 10);
    //set period-- selection box
    this.printPeriods.push(
      {
        time:
          "Page 1 (" + "from " + initial + " to " + parseInt(half + 1) + ")",
        from: initial,
        to: half + 1,
        length: length,
        paper: "a4"
      },
      {
        time: "Page 2 (" + "from " + parseInt(half + 1) + " to " + last + ")",
        from: half + 1,
        to: last,
        length: length,
        paper: "a4"
      },
      {
        time: "Both: (" + "from " + parseInt(initial) + " to " + last + ")",
        from: initial,
        to: last,
        length: length,
        paper: "a3"
      }
    );
    //call function to get periods
    //default period to be displayed

    this.setTable(initial, half, length);
  },

  methods: {
    setTable(initial, half, length) {
      for (let i = initial; i <= half; i = i + length) {
        this.periods.push({
          initial: i,
          last: i + length
        });
      }
    },
    setPeriod(val) {
      this.paper = val.paper;
      this.periods = [];
      for (let i = val.from; i < val.to; i = i + val.length) {
        this.periods.push({
          initial: i,
          last: i + val.length
        });
      }
    }
  }
};
</script>
<style lang="css" scoped>
table {
  width: 100%;
}
table,
th,
td {
  border: 1px solid grey;
  border-collapse: collapse;
}
th {
  text-align: left;
}
th,
td {
  padding: 2px;
  font-size: 12px;
}
</style>
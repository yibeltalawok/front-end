
<template>
    <div id="historyDiv">
        <v-container style="max-">
            <v-flex class="d-flex justify-end" mb-8>
                
                <v-dialog
                ref="dialog1"
                v-model="modal1"
                :return-value.sync="dt1"
                persistent
                width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            rounded
                            small
                            outlined
                            color="#ecbb44"
                            class="text-capitalize mainbtn"
                            @click="downloadDialyReport()"
                            v-bind="attrs"
                            v-on="on"
                            >
                            {{ $t("downloadReport") }}
                        </v-btn>
                    </template>

                    <v-date-picker 
                    v-model="dateRange"
                    color="#ecbb44"
                    show-adjacent-months
                    range
                    >
                        <v-spacer />
                        <v-btn text color="red" @click="modal1 = false">Cancel</v-btn>
                        <v-spacer />
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog1.save(dateRange), dateRangeSelected()">Ok</v-btn>
                    </v-date-picker>
                </v-dialog>

            </v-flex>

            <v-row>
                <v-col cols="9">
                    <v-card style="border-radius: 2px">
                        <v-toolbar dense flat>
                            
                            <v-spacer></v-spacer>
                            
                            <v-btn
                                rounded
                                small
                                outlined
                                color="#ecbb44"
                                class="text-capitalize mainbtn"
                                @click="downloadReport()"
                                >
                                <v-icon>mdi-download</v-icon>
                            </v-btn>
                        </v-toolbar>

                        <v-data-table
                        :headers="headers"
                        :rows-per-page="10"
                        :loading="loading"
                        :items="this.historyData"
                        item-key="id"
                        footer-props.items-per-page-text="`Order rec per page`"
                        >
                        </v-data-table>
                        
                    </v-card>
                </v-col>

                <v-col cols="3">
                    <v-layout wrap>
                        <v-flex class="d-flex flex-column justify-end" xs12 sm12 md12 lg12>
                            <v-row>
                                
                                <v-col cols="12" justify="center">
                                    <template>
                                        <v-date-picker 
                                        v-model="picker"
                                        color="#ecbb44"
                                        @click:date="dateSelected()"
                                        >
                                        </v-date-picker>
                                    </template>
                                        
                                </v-col>

                                <v-col cols="6" class="d-flex justify-end ordernum">
                                    <v-autocomplete
                                        :items="orders"
                                        item-text="orderNumber"
                                        item-value="id"
                                        :label="$t('Order')"
                                        @input="selectOrder"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col cols="6" class="d-flex justify-end cutnum">
                                    <v-autocomplete
                                        :items="bCSheets"
                                        item-text="cutNo"
                                        item-value="id"
                                        :label="$t('cutNumber')"
                                        @input="selectCutNumber"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col cols="6" class="d-flex justify-end bndlnum">
                                    <v-autocomplete
                                        :items="scannedOrders"
                                        item-text="bundleNo"
                                        item-value="id"
                                        :label="$t('bundle')"
                                        ref="bundleSelect"
                                        @input="selectBundleNumber"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col cols="6" class="d-flex justify-end linenum">
                                    <v-autocomplete
                                        :items="lineNums"
                                        item-text="lineNumber"
                                        item-value="id"
                                        :label="$t('line')"
                                        @input="selectLine"
                                    ></v-autocomplete>
                                </v-col>

                                
                            </v-row>
                            
                        </v-flex>
                    
                    </v-layout>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable no-console */
import { tableMixin } from "@/shared/mixins";
import { mapState, mapActions } from "vuex";
import line from '../../store/line';
export default {
    mixins: [tableMixin],
    name: "BundleHistory",
    data(){
        return{
            loading: false,
            modal1: false,
            modal2: false,
            bCSheetId:'',
            bundleId: '',
            lineNumber: '',
            orderId: "",
            item: [],
            picker: new Date().toISOString().substr(0, 10),
            dt1: new Date().toISOString().substr(0, 10),
            dt2: new Date().toISOString().substr(0, 10),
            dateRange: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
            startDate: '',
            lastDate: '',
            dailyreport: [],
            headers: [
                {
                text: this.$t("date"),
                value: "date",
                },
                {
                text: this.$t("bundleNo"),
                value: "ScannedOrderStatus.bundleNo",
                },
                {
                text: this.$t("statusFrom"),
                value: "oldStatus",
                },
                {
                text: this.$t("statusTo"),
                value: "newStatus",
                },
                {
                text: this.$t("lineNumber"),
                value: "lineNumber",
                },
            
            ],
            selectedOrder: '',
            selectedCut: '',
            selectedDate: '',
            selecttedBundle: '',
            selectedLine: ''
        }
    },
    async created() {
        this.getOrders();
        await this.getBundleHistory();

        this.getLineNumbers();
        // this.getBundleNumbers();
        this.loading = !this.loading;
        // this.items = this.historyData
    },
    computed: {
        ...mapState("bundlehistory", ["historyData", "dailyReports", "lineNums", "bundleNumbers", "bCSheets", "scannedOrders"]),
        ...mapState("order", ["orders", "bundlesInOrder", "bundles"]),
    },
    methods: {
        ...mapActions("bundlehistory", ["getBundleHistory", "getLineNumbers", "getBundleNumbers", "getBCSheets", "getBundles", "filterHistoryByOrder", "filterByCutNumber", 
        "filterHistoryByDate", "filterHistoryByBundleNum", "filterHistoryByLine", "fetchDailyReport", "fetchReportByFirstDate", "filterByOrderDate"]),
        ...mapActions("order", ["bundlesStatusInOrder", "getOrders","fetchBundleData"]),

        async fetchCuts(){
            await this.getBCSheets(this.orderId);
        },
        async fetchBundles(){
            await this.getBundles(this.bCSheetId)
        },

        async fetchByOrder(){
            await this.filterHistoryByOrder(this.orderId);

            this.$refs.bundleSelect.value = null;
        },

        async fetchByCutNumber(){
            await this.filterByCutNumber(this.bCSheetId);
        },

        async fetchByDate(){
            await this.filterHistoryByDate(this.picker);
        },

        async fetchByBundleNumber(){
            await this.filterHistoryByBundleNum(this.bundleId);
        },

        async fetchByLineNum(){
            await this.filterHistoryByLine(this.lineNumber)
        },

        async fetchByOrderandDate(){
            await this.filterByOrderDate(this.selectedOrder, this.selectedDate);
        },

        // eslint-disable-next-line no-unused-vars
        selectOrder(val) {
            this.orderId = val;
            this.selectedOrder = val;
            this.fetchByOrder();
            this.fetchCuts();

        },
        selectCutNumber(val){
            this.bCSheetId = val;
            this.selectedCut = val;
            this.fetchByCutNumber();
            this.fetchBundles();
        },
        dateSelected(){
            this.selectedDate = this.picker;
            if(this.selectedOrder){
                // fetch by date and order
                this.fetchByOrderandDate();

                if(this.selectedCut){
                    // fetch by date, order and cut
                    if(this.selecttedBundle){
                        // fetch by date, order, cut, bundle number
                    }
                    else if(this.selecttedBundle && this.selectedLine){
                        // fetch by all.
                    }
                    else{
                        // fetch by date, order and color
                    }
                }
                else if( this.selectedCut && this.selectedLine){
                    // fetch by date, order, cut and line
                }
                else{
                    // fetch by date and order
                }
            }

            else if(this.selectedOrder && line){
                // fetch by date, order, line
            }
            else{
                this.fetchByDate();
            }
            this.fetchByDate();
            
        },

        async dateRangeSelected(){
            // fetch the bundle histories between the selected dates and download
            await this.fetchDailyReport(this.dateRange);
            this.dailyreport = this.dailyReports.map(x => {
                return {
                Date: x.date,
                Bundle_Number: x.ScannedOrderStatus.bundleNo,
                Old_Status: x.oldStatus,
                New_Status: x.newStatus,
                Line_Number:x.lineNumber
                };
            });

            const csvData = await Promise.resolve(this.dataToCsv(this.dailyreport));
            this.downloadCsvData(csvData); 
        },

        selectBundleNumber(val){
            this.bundleId = val;
            this.lineNumber = val;
            this.selecttedBundle = val;
            this.fetchByBundleNumber();
        },

        selectLine (val){
            // console.log(val)
            this.lineNumber = val;
            this.selectedLine = val;
            this.fetchByLineNum();
            // fetch all the bundle histories by the line number.
        },

        async dataToCsv(data) {
            const csvRows = [];
            const headers = Object.keys(data[0]);
            csvRows.push(headers.join(","));

            for (const row of data) {
                const values = headers.map((header) => {
                const escape = ("" + row[header]).replace(/"/g, '\\"');
                return `"${escape}"`;
                });
                csvRows.push(values.join(","));
            }
            return csvRows.join("\n");
        },

        async downloadCsvData(data) {
            const blob = new Blob([data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            var dt = new Date();
            var isoFormat = dt.toISOString();
            var substringedDt = isoFormat.substr(0,19);
            var tRemovedDt = substringedDt.replace('T', ' ');

            a.setAttribute("hidden", "");
            a.setAttribute("href", url);
            a.setAttribute(
                "download",
                "BundleHistory-" + tRemovedDt  + ".csv"
            );
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        async downloadReport(){
            // TODO this function downloads only the first lists and the ones selected by order. doesn't download others filtered by other filter types.
            this.item = this.historyData.map(x => {
                return {
                Date: x.date,
                Bundle_Number: x.ScannedOrderStatus.bundleNo,
                Old_Status: x.oldStatus,
                New_Status: x.newStatus,
                Line_Number:x.lineNumber
                };
            });

            const csvData = await Promise.resolve(this.dataToCsv(this.item));
            this.downloadCsvData(csvData);
        }
    }
}
</script>

<style>

/* #historyDiv {
  margin-top: 3%;
} */
@media (min-width: 960px){
    .container {
        max-width: 1350px;
    }
}
.v-picker__title{
    display: none;
}
.ordernum, .cutnum{
    margin-top: -15%;
}
.bndlnum, .linenum{
    margin-top: -5%;
}



</style>
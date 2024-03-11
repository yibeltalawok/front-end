import Papa from "papaparse";
import Zemen from "zemen";
import i18n from "@/i18n";
import enDateFormattingFunction from "@/shared/filters/date-formating.filter";
import etTimeFunction from "@/shared/filters/et-time.filter";

const GetColumnsFunctions = {
  getEmployeeColumns() {
    return [
      { name: i18n.t("Id No"), value: "idno" },
      { name: i18n.t("Full Name"), value: "fullName" },
      { name: i18n.t("Department"), value: "department" },
      { name: i18n.t("Sub Dept"), value: "subDept" },
      { name: i18n.t("Salary"), value: "salary" },
      { name: i18n.t("Iron Incentive"), value: "ironIncentive" },
      { name: i18n.t("MISC Payment"), value: "miscPayment" },
      { name: i18n.t("Prod Incentive"), value: "incentive" },
      { name: i18n.t("ransport Pay"), value: "transportPay" },
      { name: i18n.t("Cost Sharing(%)"), value: "costSharing" },
      { name: i18n.t("OT Hour(1.125)"), value: "otHr125" },
      { name: i18n.t("OT Hour(1.5)"), value: "otHr15" },
      { name: i18n.t("OT Hour(2.0)"), value: "otHr20" },
      { name: i18n.t("OT Hour(2.5)"), value: "otHr25" },
      { name: i18n.t("OT in Birr"), value: "otBirr" },
      { name: i18n.t("Absent Incentive"), value: "absentIncentive" },
      { name: i18n.t("Absent"), value: "absent" },
      { name: i18n.t("Income Tax"), value: "incomeTax" },
      { name: i18n.t("Pension Contri"), value: "pensionContribution" },
      { name: i18n.t("Pension Dedn"), value: "pensionDeduction" },
      { name: i18n.t("Ttl Dedn"), value: "totalDeduction" },
      { name: i18n.t("Gross Salary"), value: "grossSalary" },
      { name: i18n.t("Net Pay"), value: "netPay" },
      //===============================================================
      { name: i18n.t("Sign"), value: "sign" },
    ];
  },
};

const generateRowsForExport = (getColumnsFunction, items) => {
  const headers = [];

  // populate headers
  getColumnsFunction().forEach((column) => {
    headers.push(column.name);
  });

  // populate rows
  const rows = items.map((item) => {
    const row = [];
    getColumnsFunction().forEach((column) => {
      row.push(item[column.value]);
    });

    return row;
  });

  // add header to rows
  rows.splice(0, 0, headers);

  return rows;
};

const generateCsvFileName = (listName) => {
  // const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60000;
  const now = new Date();

  let listNameString;
  let dateString;
  let hyphenatedTimeString;

  if (i18n.locale === "am") {
    // spaces are being replaced by hyphens
    listNameString = i18n.t(listName).replace(/ /g, "-");

    dateString = Zemen.toEC(now).format("MMM-DD-YYYY");
    const timeString = etTimeFunction(now.toISOString());

    // the colon is being replaced by hyphen
    hyphenatedTimeString = timeString.replace(":", "-");
  } else if (i18n.locale === "en") {
    // spaces are being replaced by hyphens
    listNameString = i18n.t(listName).replace(/ /g, "-");

    // the space and the comma with a space are replaced by hyphens
    dateString = enDateFormattingFunction(now.toISOString())
      .replace(/ /, "-")
      .replace(/, /, "-");
    const timeString = etTimeFunction(now.toISOString());

    // the colon is being replaced by hyphen
    hyphenatedTimeString = timeString.replace(":", "-");
  }

  return `${listNameString}-${dateString}-${hyphenatedTimeString}.csv`;
};

const csvDownloadSummarySheetMixin = {
  methods: {
    downloadDataAsCsv(listName, item) {
      if (!listName) {
        return;
      }

      let rows;
      let csvFileName;
      if (listName === "opmsPayrollSummarySheetList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getEmployeeColumns,
          (this.items = item)
        );
        csvFileName = generateCsvFileName("opms_summary_sheet_list");
      }

      const csvString = Papa.unparse(rows);

      const csvBlob = new Blob([csvString], {
        type: "text/csv;charset=utf-8;",
      });

      const hiddenATag = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(csvBlob);
      hiddenATag.setAttribute("href", objectUrl);
      hiddenATag.setAttribute("download", csvFileName);
      hiddenATag.style.display = "none";
      window.document.body.appendChild(hiddenATag);
      hiddenATag.click();
    },
    culculateExp(doj) {
      let date = new Date();
      let dj = new Date(doj);
      let day = date - dj;

      alert(day);
    },
  },
};
export default csvDownloadSummarySheetMixin;

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
      { name: i18n.t("Sex"), value: "gender" },
      { name: i18n.t("DOJ"), value: "joiningDate" },
      { name: i18n.t("Department"), value: "department" },
      { name: i18n.t("Sub Dept"), value: "subDept" },
      { name: i18n.t("Ttl Present(P)"), value: "totalP" },
      { name: i18n.t("Ttl Absent"), value: "totalA" },
      { name: i18n.t("Ttl Permision"), value: "totalPr" },
      { name: i18n.t("Ttl Mourning Lv(MOL)"), value: "totalMOL" },
      { name: i18n.t("Ttl Maternity Lv(ML)"), value: "totalML" },
      { name: i18n.t("AL Availed"), value: "totalAL" },
      { name: i18n.t("Ttl HLPR "), value: "totalHLPR" },
      { name: i18n.t("Ttl HLA"), value: "totalHLA" },
      { name: i18n.t("Ttl SL"), value: "totalSL" },
      { name: i18n.t("Ttl SL"), value: "totalLate" },
      { name: i18n.t("Working Days"), value: "workingDays" },
      { name: i18n.t("OT Hour(1.75)"), value: "otHr15" },
      { name: i18n.t("OT Hour(2.0)"), value: "otHr20" },
      { name: i18n.t("OT Hour(2.5)"), value: "otHr25" },
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

const csvDownloadFinanceCopyMixin = {
  methods: {
    downloadDataAsCsv(listName, item) {
      if (!listName) {
        return;
      }

      let rows;
      let csvFileName;
      if (listName === "opmsFinanceCopyList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getEmployeeColumns,
          (this.items = item)
        );
        csvFileName = generateCsvFileName("opms_finace_copy_list");
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
export default csvDownloadFinanceCopyMixin;

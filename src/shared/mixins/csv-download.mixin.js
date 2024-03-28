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
      { name: i18n.t("Phone Number"), value: "phoneNumber" },
      { name: i18n.t("Gender"), value: "gender" },
      { name: i18n.t("Joining Date"), value: "joiningDate" },
      { name: i18n.t("Role"), value: "role" },
      { name: i18n.t("Department"), value: "department" },
      { name: i18n.t("Sub Dept"), value: "subDept" },
      { name: i18n.t("Salary"), value: "salary" },
      { name: i18n.t("Total Salary"), value: "totalSalary" },
      { name: i18n.t("Response Allow"), value: "responseAllow" },
      { name: i18n.t("Incentive"), value: "incentiveSalary" },
      { name: i18n.t("Home Allow"), value: "homeAllow" },
      { name: i18n.t("Absent Incentive"), value: "absentIncentive" },
      { name: i18n.t("Transport Pay"), value: "transportPay" },
      { name: i18n.t("Cost Sharing(%)"), value: "costSharing" },
      { name: i18n.t("Iron Incentive"), value: "ironIncentive" },
      { name: i18n.t("Experience"), value: "experience" },
      { name: i18n.t("Performance"), value: "perfrm" },
      { name: i18n.t("Home Allow"), value: "homeAllow" },
    ];
  },
  getOperationListColumns() {
    return [
      { name: i18n.t("Serial Number"), value: "sr" },
      { name: i18n.t("Operation Name"), value: "operationName" },
      { name: i18n.t("Section"), value: "section" },
      { name: i18n.t("Code"), value: "code" },
      { name: i18n.t("SAM"), value: "sam" },
      { name: i18n.t("Machine Model Number"), value: "modelNumber" },
      { name: i18n.t("Machine Description"), value: "description" },
      { name: i18n.t("Folder"), value: "folder" },
      { name: i18n.t("Category"), value: "category" },
      { name: i18n.t("Output Per Hour"), value: "outputPerHour" },
      { name: i18n.t("Man Power Rqrd"), value: "mpRqrd" },
      { name: i18n.t("Man Power Allocated"), value: "mpAllocated" },
      { name: i18n.t("Machine Allocated"), value: "mcAllocated" },
      { name: i18n.t("Sewing Oprator Allocated"), value: "sewingOprAlltd" },
    ];
  },
  getOperationSummaryColumns() {
    return [
      { name: i18n.t("Machine Model Number"), value: "modelNumber" },
      { name: i18n.t("Machine Description"), value: "description" },
      { name: i18n.t("SAM"), value: "sam" },
      { name: i18n.t("Number of Machines"), value: "noOfMc" },
      { name: i18n.t("Folder Attachement"), value: "folder" },
    ];
  },
  getOrderRecColumns() {
    return [
      { name: i18n.t("Order #"), value: "orderNumber" },
      { name: i18n.t("Customer"), value: "customer" },
      { name: i18n.t("Style #"), value: "styleNumber" },
      { name: i18n.t("Style Name"), value: "styleName" },
      { name: i18n.t("Order Quantity"), value: "quantity" },
      { name: i18n.t("Planned Fabric Consumption per piece"), value: "plannedFabricConsumed" },
      { name: i18n.t("Actual Fabric Consumption  per piece"), value: "fabricConsumption" },
      { name: i18n.t("Total Planned Fabric"), value: "totalPlennedFabric" },
      { name: i18n.t("Actual Fabric Consumed"), value: "actualFabricConsumed" },
      { name: i18n.t("Extra Fabric Consumed"), value: "extra" },
      { name: i18n.t("Actual Shipment"), value: "actualShipment" },
      { name: i18n.t("rejected Piece"), value: "rejectedPiece" },
    ];
  },
  getTimeActionColumns() {
    return [
      { name: i18n.t("Order #"), value: "orderNumber" },
      { name: i18n.t("Customer"), value: "customer" },
      { name: i18n.t("Style #"), value: "styleNumber" },
      { name: i18n.t("Style Name"), value: "styleName" },
      { name: i18n.t("Order Quantity"), value: "quantity" },

      { name: i18n.t("Order Recieving Date"), value: "recievingDate" },
      { name: i18n.t("Order Confirmation Date"), value: "confirmationDate" },

      { name: i18n.t("Planned Cut Start Date"), value: "startPlannedCutDate" },
      { name: i18n.t("Actual Cut Start Date"), value: "startActualCutDate" },
      { name: i18n.t("Planned Cut End Date"), value: "endPlannedCutDate" },
      { name: i18n.t("Actual Cut End Date"), value: "endActualCutDate" },

      { name: i18n.t("Planned Sewing Start Date"), value: "plannedSewingStart" },
      { name: i18n.t("Actual Sewing Start Date"), value: "actualSewingStart" },
      { name: i18n.t("Planned Sewing End Date"), value: "plannedSewingEnd" },
      { name: i18n.t("Actual Sewing End Date"), value: "actualSewingEnd" },

      { name: i18n.t("Planned Finish Start Date"), value: "plannedFinishStart" },
      { name: i18n.t("Actual Finish Start Date"), value: "actualFinishStart" },
      { name: i18n.t("Planned Finish End Date"), value: "plannedFinishEnd" },
      { name: i18n.t("Actual Finish End Date"), value: "actualFinishEnd" },

      { name: i18n.t("Planned Packing Start Date"), value: "plannedPackingStart" },
      { name: i18n.t("Actual Packed Start Date"), value: "actualPackedStart" },
      { name: i18n.t("Planned Packing End Date"), value: "plannedPackingEnd" },
      { name: i18n.t("Actual Packing End Date"), value: "actualPackedEnd" },

      { name: i18n.t("Planned Shipping Date"), value: "plannedShippingDate" },
      { name: i18n.t("Actual Shipping Date"), value: "actualShipedDate" },
    ];
  },
  getIssueListColumns(){
    return[
      { name: i18n.t("issued date"), value:"issueDate" },
      { name: i18n.t("issued by"), value:"issuedBy" },
      { name: i18n.t("Type"), value: "type"},
      { name: i18n.t("Reason"), value: "reason"},
      { name: i18n.t("Approved by"), value: "approvedBy"},
      { name: i18n.t("State"), value: "state"},
    ];
  },


  getPackedInColumns() {
    return [
      { name: i18n.t("Packed Date"), value: "packedDate" },
      { name: i18n.t("Order #"), value: "orderNumber" },
      { name: i18n.t("Style #"), value: "styleNumber" },
      { name: i18n.t("Style Name"), value: "styleName" },
      { name: i18n.t("Carton #"), value: "cartonNo" },
      { name: i18n.t("Customer"), value: "customer" },
      { name: i18n.t("Order Quantity"), value: "orderQty" },
      { name: i18n.t("Bundle #"), value: "bundleNo" },
      { name: i18n.t("Color"), value: "color" },
      { name: i18n.t("Size"), value: "size" },
      { name: i18n.t("Bundle Quantity"), value: "bQty" },
      { name: i18n.t("Shipping Mark"), value: "shippingMark" },
      { name: i18n.t("Code Article"), value: "codeArticle" },
      { name: i18n.t("Talle"), value: "talle" },
      { name: i18n.t("Gross Weight"), value: "grossWeight" },
      { name: i18n.t("Net Weight"), value: "netWeight" },
      { name: i18n.t("CTN MSMRMNT"), value: "ctnMEAS" },
      { name: i18n.t("Total CTN"), value: "totalCtn" },
    ];
  },
  getAttendanceColumns() {
    return [
      { name: i18n.t("idno"), value: "idno" },
      { name: i18n.t("fullName"), value: "fullName" },
      { name: i18n.t("department"), value: "department" },
      { name: i18n.t("subDept"), value: "subDept" },
      { name: i18n.t("salary"), value: "salary" },
      { name: i18n.t("line"), value: "line" }
    ];
  },
  productionReportColumns() {
    return [
      { name: i18n.t("Date"), value: "date" },
      { name: i18n.t("Order number"), value: "orderNumber" },
      { name: i18n.t("Style name"), value: "styleName" },
      { name: i18n.t("Quantity"), value: "quantity" },
      { name: i18n.t("Total cutting"), value: "totalCutting" },
      { name: i18n.t("Total sewing"), value: "totalSewing" },
      { name: i18n.t("Sewing balance"), value: "sewingBalance" },
      { name: i18n.t("Total finishing"), value: "totalFinishing" },
      { name: i18n.t("Finishing balance"), value: "finishingBalance" },
      { name: i18n.t("Total packing"), value: "totalPacking" },
      { name: i18n.t("Packing balance"), value: "packingBalance" },
      { name: i18n.t("Shipment"), value: "shipment" },
      { name: i18n.t("Shipment date"), value: "shipmentDate" }
    ];
  },
  operaionalCostColumns() {
    return [
      { name: i18n.t("Date"), value: "date" },
      { name: i18n.t("Narration"), value: "narration" },
      { name: i18n.t("Type"), value: "type" },
      { name: i18n.t("Amount"), value: "amount" }
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

const csvDownloadMixin = {
  methods: {
    downloadDataAsCsv(listName, items) {
      if (!listName) {
        return;
      }
      let rows;
      let csvFileName;
      if (listName === "opmsEmployeeList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getEmployeeColumns,
          items
        );

        csvFileName = generateCsvFileName(`opms_emp_list`);
      }
      if (listName === "opmsOperationList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getOperationListColumns,
          items
        );
        csvFileName = generateCsvFileName(`opms_operation_list`);
      }
      if (listName === "opmsOperationSummaryList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getOperationSummaryColumns,
          items
        );
        csvFileName = generateCsvFileName(`opms_operation_summary_list_`);
      }
      if (listName === "opmsOrderRecList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getOrderRecColumns,
          items
        );
        csvFileName = generateCsvFileName(`opms_order_reconciliation_list_`);
      }
      if (listName === "opmsTimeActionCalList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getTimeActionColumns,
          items
        );
        csvFileName = generateCsvFileName(`opms_time_action_calendar_`);
      }

      if (listName === "PackedInList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getPackedInColumns,
          items
        );
        csvFileName = generateCsvFileName(`packed_In_`);
      }
      if (listName === "issueList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getIssueListColumns,
          items
        );
        csvFileName = generateCsvFileName(`issue_List_`);
      }
      if (listName === "NotAttendedEmployeeList") {
        rows = generateRowsForExport(
          GetColumnsFunctions.getAttendanceColumns,
          items
        );
        csvFileName = generateCsvFileName(`Not_Attended_Employee_List`);
      }
      if (listName === "orderProductionReport") {
        rows = generateRowsForExport(
          GetColumnsFunctions.productionReportColumns,
          items
        );
        csvFileName = generateCsvFileName(`Production report`);
      }
      if (listName === "opmsOperationalCost") {
        rows = generateRowsForExport(
          GetColumnsFunctions.operaionalCostColumns,
          items.map(x => {
            return {
              date: new Date(x.date).toLocaleDateString("en-US"),
              narration: x.narration,
              type: x.type,
              amount: x.amount
            }
          })
        );
        csvFileName = generateCsvFileName(`Operational cost`);
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
  },
};
export default csvDownloadMixin;

import { api, path } from "@/api"
export default {
    data() {
        return {
            resource: api,
            path: path.payroll,
            items: [],
            filter: {
                include: ["employee"]
            },
            day: [],
            summary: [],
            ot: [],
            otHr15: [],
            otHr20: [],
            otHr25: [],
            otBirr: [],
            incomeTax: [],
            taxSlab: [],
            taxableIncome: [],
            totalDeduction: [],
            payment: [],
            netPay: [],
            paymentTax: [],
            netSalary: [],
            grossSalary: [],
            tableValue: [],
            totalWorkDays: 30,
            attendance: [],
            totalP: [],
            totalA: [],
            totalPr: [],
            totalMOL: [],
            totalMGL: [],
            totalML: [],
            totalPL: [],
            totalAL: [],
            totalHLPR: [],
            totalHLA: [],
            totalLate: [],
            totalSL: [],
            workingDays: [],
            salaryPerWorkDay: [],
            dailyRate: [],
            perHrRate: [],
            attBonus: [],
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        async loadData() {
            //Filter The tax Slab 
            this.taxSlab = (await api.all(path.taxSlab)).rows;
            this.taxSlab = this.taxSlab.sort(function (a, b) {
                return parseFloat(a.initial) - parseFloat(b.initial);
            });
            if (this.taxSlab.length > 0) {
                this.summary = (await api.all(this.path, this.filter)).rows;
                let date = new Date();
                this.getTotalWorkDays(date.getMonth() + 1);
            } else {
                this.$notify({
                    type: "danger",
                    title: "Tax Slab not found",
                    message: `${this.$t("Please create tax slab")} ${this.$t(" first?")}`
                });
                this.$router.push({ name: "create-tax-slab" });
            }
        },
        async getTotalWorkDays(month) {
            let f = { where: { month: month } };
            this.day = (await api.all(path.workDay, f)).rows;
            if (this.day.length > 0) {
                this.totalWorkDays = this.day[0].noDays;
            }
            // this.manageDepartment();
            this.getAttendance()
        },
        async getAttendance() {
            for (let i = 0; i < this.summary.length; i++) {
                let f = {
                    where: {
                        employeeId: this.summary[i].employee.id,
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear()
                    }
                };
                this.attendance = (await api.all(path.attendance, f)).rows;
                this.attendance.sort(function (a, b) {
                    var dateA = new Date(a.dateAttended),
                        dateB = new Date(b.dateAttended);
                    return dateA - dateB;
                });
                if (this.attendance.length == 0) {
                    this.totalP[i] = 0;
                    this.totalA[i] = 0;
                    for (let j = 1; j <= new Date().getDate(); j++) {
                        let date = new Date();
                        date.setDate(j);
                        if (date.getDay() == 0) {
                            this.totalP[i] += 1;
                        } else {
                            this.totalA[i] += 1;
                        }
                    }
                    this.totalPr[i] = 0;
                    this.totalMOL[i] = 0;
                    this.totalMGL[i] = 0;
                    this.totalML[i] = 0;
                    this.totalPL[i] = 0;
                    this.totalAL[i] = 0;
                    this.totalHLPR[i] = 0;
                    this.totalHLA[i] = 0;
                    this.totalLate[i] = 0;
                    this.totalSL[i] = 0;
                    this.workingDays[i] = this.totalP[i];
                } else {
                    this.totalP[i] = 0;
                    this.totalA[i] = 0;
                    this.totalPr[i] = 0;
                    this.totalMOL[i] = 0;
                    this.totalMGL[i] = 0;
                    this.totalML[i] = 0;
                    this.totalPL[i] = 0;
                    this.totalAL[i] = 0;
                    this.totalHLPR[i] = 0;
                    this.totalHLA[i] = 0;
                    this.totalLate[i] = 0;
                    this.totalSL[i] = 0;
                    this.workingDays[i] = 0;
                    let used = false;
                    // alert(this.attendance.length);
                    for (let j = 0; j < this.attendance.length; j++) {
                        if (j < this.attendance.length - 1) {
                            let da = new Date(this.attendance[0].dateAttended);
                            let fd = new Date(this.attendance[j].dateAttended);
                            let nd = new Date(this.attendance[j + 1].dateAttended);
                            if (da.getDate() != 1 && used == false) {
                                used = true;
                                for (let l = 1; l < da.getDate(); l++) {
                                    let d = new Date();
                                    d.setDate(l);
                                    if (d.getDay() == 0) {
                                        this.totalP[i] += 1;
                                    }
                                }
                            }
                            if (fd.getDate() + 1 != nd.getDate()) {
                                for (let l = fd.getDate() + 1; l < nd.getDate(); l++) {
                                    let dm = new Date();
                                    dm.setDate(l);
                                    if (dm.getDay() == 0) {
                                        this.totalP[i] += 1;
                                    }
                                }
                            }
                        } else {
                            let nd = new Date(this.attendance[j].dateAttended);
                            let cd = new Date();
                            if (nd.getDate() < cd.getDate()) {
                                for (let g = nd.getDate() + 1; g < cd.getDate(); g++) {
                                    let d = new Date();
                                    d.setDate(g);
                                    if (d.getDay() == 0) {
                                        this.totalP[i] += 1;
                                    }
                                }
                            }
                        }
                    }
                    for (let iterator of this.attendance) {
                        if (iterator.value == "P") {
                            this.totalP[i] += 1;
                        }
                        if (iterator.value == "A") {
                            this.totalA[i] += 1;
                        }
                        if (iterator.value == "Pr") {
                            this.totalPr[i] += 1;
                        }
                        if (iterator.value == "AL") {
                            this.totalAL[i] += 1;
                        }
                        if (iterator.value == "MOL") {
                            this.totalMOL[i] += 1;
                        }
                        if (iterator.value == "HLPR") {
                            this.totalHLPR[i] += 0.5;
                            this.totalP[i] += 0.5;
                        }
                        if (iterator.value == "HLA") {
                            this.totalHLA[i] += 0.5;
                            this.totalP[i] += 0.5;
                        }
                        if (iterator.value == "MGL") {
                            this.totalMGL[i] += 1;
                        }
                        if (iterator.value == "ML") {
                            this.totalML[i] += 1;
                        }
                        if (iterator.value == "PL") {
                            this.totalPL[i] += 1;
                        }
                        if (iterator.value == "SL") {
                            this.totalSL[i] += 1;
                        }
                        if (iterator.value == "LeM") {
                            this.totalLate[i] += parseFloat(iterator.lateMinutes) / 480;
                            this.totalP[i] +=
                                1 - (parseFloat(iterator.lateMinutes) / 480).toFixed(2);
                        }
                    }
                }

                let totalPd = 0;
                totalPd =
                    this.totalP[i] +
                    this.totalMOL[i] +
                    this.totalMGL[i] +
                    this.totalML[i] +
                    this.totalPL[i] +
                    this.totalAL[i] +
                    this.totalSL[i];
                let totalAd = 0;
                totalAd =
                    this.totalA[i] +
                    this.totalPr[i] +
                    this.totalHLA[i] +
                    this.totalHLPR[i] +
                    this.totalLate[i];
                let ld = new Date();
                this.totalA[i] = ld.getDate() - totalPd - totalAd;
                this.workingDays[i] = totalPd;
                let attB = totalAd + totalPd - this.totalP[i] + this.totalA[i];
                this.attBonus[i] = 0;
                if (this.summary[i].employee.absentIncentive == "Yes") {
                    this.attBonus[i] = attB == 0 ? 75 : 0;
                }
                this.salaryPerWorkDay[i] = (
                    (parseFloat(this.workingDays[i]) *
                        parseFloat(this.summary[i].employee.salary)) /
                    parseInt(this.totalWorkDays)
                ).toFixed(2);
                this.dailyRate[i] = (
                    parseFloat(this.summary[i].employee.salary) / this.totalWorkDays
                ).toFixed(2);
                this.perHrRate[i] = (this.salaryPerWorkDay[i] / 208).toFixed(2);
            }
            this.manageTabe();
        },
        async manageTabe() {
            for (let i = 0; i < this.summary.length; i++) {
                this.ot[i] = 0;
                let f = {
                    where: { payrollId: this.summary[i].id }
                };
                this.ot = (await api.all(path.overtime, f)).rows;
                if (this.ot.length == 0) {
                    this.otHr15[i] = 0;
                    this.otHr20[i] = 0;
                    this.otHr25[i] = 0;
                } else {
                    this.otHr15[i] = 0;
                    this.otHr20[i] = 0;
                    this.otHr25[i] = 0;
                    for (const iterator of this.ot) {
                        if (iterator.type == "Normal Day") {
                            this.otHr15[i] += parseFloat(iterator.value);
                        }
                        if (iterator.type == "Rest Day") {
                            this.otHr20[i] += parseFloat(iterator.value);
                        }
                        if (iterator.type == "Public Holly Day") {
                            this.otHr25[i] += parseFloat(iterator.value);
                        }
                    }
                }
                this.otBirr[i] =
                    (parseFloat(this.otHr15[i]) *
                        parseFloat(this.summary[i].employee.salary) *
                        1.75) /
                    192 +
                    (parseFloat(this.otHr20[i]) *
                        parseFloat(this.summary[i].employee.salary) *
                        2.0) /
                    192 +
                    (parseFloat(this.otHr25[i]) *
                        parseFloat(this.summary[i].employee.salary) *
                        2.5) /
                    192;
                //this.otBirr[i] = this.otBirr[i].toFixed(2);
            }
            this.calculateSalary();
        },
        calculateSalary() {
            for (let i = 0; i < this.summary.length; i++) {
                if (this.summary[i].employee.department == "Supervisor") {
                    this.grossSalary[i] = (
                        parseFloat(this.salaryPerWorkDay[i]) + parseFloat(this.otBirr[i])
                    ).toFixed(2);
                } else {
                    this.grossSalary[i] = (
                        parseFloat(this.salaryPerWorkDay[i]) +
                        parseFloat(this.otBirr[i]) +
                        parseFloat(this.attBonus[i]) +
                        parseFloat(this.summary[i].employee.ironIncentive) +
                        parseFloat(this.summary[i].employee.salary) * 0.11 +
                        parseFloat(this.summary[i].employee.responseAllow) +
                        parseFloat(this.summary[i].employee.homeAllow) +
                        parseFloat(this.summary[i].employee.transportPay)
                    ).toFixed(2);
                }
            }
            this.calculateTax();
        },
        async calculateTax() {
            this.taxableIncome = [];
            this.incomeTax = [];
            for (let i = 0; i < this.summary.length; i++) {
                let tax =
                    parseFloat(this.salaryPerWorkDay[i]) +
                    parseFloat(this.summary[i].employee.ironIncentive) +
                    parseFloat(this.otBirr[i]) +
                    parseFloat(this.attBonus[i]) +
                    parseFloat(this.summary[i].employee.incentiveSalary) +
                    parseFloat(this.summary[i].payback);
                if (parseFloat(this.summary[i].employee.responseAllow) > 500) {
                    tax += parseFloat(this.summary[i].employee.responseAllow) - 500;
                }
                if (this.summary[i].employee.department == "GM") {
                    this.taxableIncome[i] = tax;
                } else {
                    if (
                        parseFloat(this.summary[i].employee.homeAllow) -
                        0.1 * parseFloat(this.salaryPerWorkDay[i]) >
                        0
                    ) {
                        tax +=
                            parseFloat(this.summary[i].employee.homeAllow) -
                            0.1 * parseFloat(this.salaryPerWorkDay[i]);

                        this.taxableIncome[i] = tax.toFixed(2);
                    } else {
                        this.taxableIncome[i] = tax.toFixed(2);
                    }
                }
                this.incomeTax[i] = this.taxSlabe(this.taxableIncome[i]);
            }
            this.calculateNetValues();
        },
        calculateNetValues() {
            for (let i = 0; i < this.summary.length; i++) {
                this.payment[i] = (
                    this.dailyRate[i] * this.summary[i].miscPayment
                ).toFixed(2);
                this.paymentTax[i] = this.taxSlabe(this.payment[i]);

                this.totalDeduction[i] = (
                    parseFloat(this.summary[i].employee.salary) * 0.07 +
                    parseFloat(this.summary[i].employee.salary) * 0.11 +
                    (parseFloat(this.summary[i].employee.costSharing) *
                        parseFloat(this.salaryPerWorkDay[i])) /
                    100 +
                    parseFloat(this.incomeTax[i]) +
                    parseFloat(this.salaryPerWorkDay[i]) * 0.01
                ).toFixed(2);

                this.netPay[i] = (
                    parseFloat(this.payment[i]) - parseFloat(this.paymentTax[i])
                ).toFixed(2);
                // eslint-disable-next-line no-console
                console.log("====================================" + this.payment[i] + " " + this.paymentTax[i])
                // this.netPay[i] =
                //     parseFloat(this.netPay[i]) > 0 ? parseFloat(this.netPay[i]) : 0;
                this.netSalary[i] = (
                    parseFloat(this.grossSalary[i]) - parseFloat(this.totalDeduction[i])
                ).toFixed(2);

                this.netSalary[i] =
                    parseFloat(this.netSalary[i]) > 0 ? parseFloat(this.netSalary[i]) : 0;
            }
            this.assignToTable();
        },
        taxSlabe(taxableIncome) {
            for (let i = 0; i < this.taxSlab.length - 1; i++) {
                if (
                    taxableIncome >= parseFloat(this.taxSlab[i].initial) &&
                    taxableIncome <= parseFloat(this.taxSlab[i].end)
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
        }

    },
}
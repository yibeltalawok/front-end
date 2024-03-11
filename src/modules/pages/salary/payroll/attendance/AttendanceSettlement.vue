<template>
  <div>
    <div class="parent">
      <div class="mainview">
        <div class="placeholder">
          <atCard />
        </div>

        <attendacneCard
          v-if="attendanceList.length > 0"
          :cards="attendanceList"
          @clicked="updateAtt"
        />
        <div v-else class="nd">
          <nodata class="nodata" />
          <span style="margin: auto">There is no data</span>
        </div>
      </div>

      <div class="sideview">
        <div class="datepicker" style="">
          <v-row justify="center">
            <v-date-picker
              class="mt-4"
              width="300px"
              v-model="picker"
              color="amber"
              range
              no-title
              @input="dateChanged"
            />
          </v-row>
        </div>

        <v-row justify="center">
          <v-flex xs12 sm12 md8 lg8 pa-2>
            <v-autocomplete
              style="margin: auto; width: 250px"
              v-model="fdept"
              :items="departments"
              hint="filter by department"
              clearable
              persistent-hint
              @input="departmentSelected"
            />
          </v-flex>
        </v-row>

        <v-text-field
          v-model="fullname"
          style="margin: auto; width: 220px"
          hint="filter by name"
          @input="departmentSelected"
          persistent-hint
        />

        <v-text-field
          v-model="subdept"
          style="margin: auto; width: 220px"
          hint="filter by sub-department"
          @input="departmentSelected"
          persistent-hint
        />
        <span class="department">Reasons</span> <br />

        <div class="chipsview">
          <div class="tooltip" v-for="val in values" :key="val.value">
            <v-chip x-small class="chips"> {{ val.value }} </v-chip>
            <span class="tooltiptext">{{ val.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300px"
      overlay-color="transparent"
      overlay-opacity="0%"
      content-class="some"
    >
      <updateAttendance
        :edit="this.feditAttValue"
        @close="close"
        @updated="update"
      />
    </v-dialog>
  </div>
</template>

<script>
import nodata from "@/assets/icons/nodata_icon.svg";
import { mapState, mapActions } from "vuex";
import attendacneCard from "./attendacneRowCard";
import updateAttendance from "./updateAttendance";
import atCard from "./atCard";
export default {
  name: "AttendanceSettlement",
  components: {
    attendacneCard,
    // eslint-disable-next-line vue/no-unused-components
    atCard,
    updateAttendance,
    nodata,
  },
  data() {
    return {
      dialog: false,
      picker: new Date().toISOString().substr(0, 10),
      daterange: [],
      editAttValue: {},
      fullname: "",
      subdept: "",
      values: [
          { name: "Present", value: "P" },
          { name: "Absent", value: "A" },
          { name: "Permision", value: "Pr" },
          { name: "Anual Live", value: "AL" },
          { name: "Death Leave", value: "MOL" },
          { name: "HLPR", value: "HLPR" },
          { name: "HLA", value: "HLA" },
          { name: "Maternity Leave", value: "ML" },
          { name: "Paternity Leave", value: "PL" },
          { name: "Sick Leave", value: "SL" },
          { name: "Marriage Leave", value: "MGL" },
          { name: "Late minutes", value: "LeM" },
          { name: "Special L", value: "SPL" },
          { name: "Free Leave", value: "FL" }
        ],
      fdept: "",
      departments: [
        "Supervisor",
        "Sampling",
        "Designing",
        "Merchandising",
        "Stores - Fabric",
        "Stores - Trims",
        "Stores - Finished Goods",
        "HR",
        "Adminstration",
        "Finance",
        "Cutting",
        "Embroidery",
        "Washing",
        "Sewing",
        "Finishing",
        "Packing",
        "Quality",
        "Dispatch",
        "Maintenance",
        "Security",
      ],
      initialfilter: {
        include: [{
          relation: "employee",
          scope: {
            where: {
              
            }
          }
        }],
        where: {
          dateAttended: {
            between: ["2021-02-03", "2021-02-27"],
          },
          value: "",
        },
      },
    };
  },
  mounted() {
    this.fetchAttendance(this.initialfilter);
    this.fetchNumberOfAbsents(this.initialfilter);
    this.fetchNumberOfPresents(this.initialfilter);
    this.fetchNumberOfReasons(this.initialfilter);
  },

  updated() {},
  watch: {},
  computed: {
    ...mapState("Nattendance", ["attendanceList"]),

    Dpicker() {
      return this.picker;
    },
    department() {
      return this.fdept;
    },
    fname() {
      return this.fullname;
    },
    feditAttValue() {
      return this.editAttValue;
    },
    fsubdepartment() {
      return this.subdept;
    },
  },
  methods: {
    ...mapActions("Nattendance", [
      "fetchAttendance",
      "fetchNumberOfAbsents",
      "fetchNumberOfPresents",
      "fetchNumberOfReasons",
    ]),

    async dateChanged() {
      if (this.Dpicker.length == 2) {
        this.initialfilter.where.dateAttended.between = this.Dpicker;
        this.update();
      }
    },

    async update() {
      await this.fetchAttendance(this.initialfilter);
      await this.fetchNumberOfPresents(this.initialfilter);
      await this.fetchNumberOfAbsents(this.initialfilter);
      await this.fetchNumberOfReasons(this.initialfilter);
    },

    async departmentSelected() {
      if (this.fdept != null && this.fdept != "")
        this.initialfilter.include[0].scope.where.department = this.fdept;
      else delete this.initialfilter.include[0].scope.where.department
      if (this.fname != null)
        this.initialfilter.include[0].scope.where.fullName = { like: this.fname };
      else delete this.initialfilter.include[0].scope.where.fullName
      
      if (this.fsubdepartment != null)
        this.initialfilter.include[0].scope.where.subDept = { like: this.fsubdepartment };
      else delete this.initialfilter.include[0].scope.where.subDept


      this.update();
    },

    updateAtt(value) {
      this.editAttValue = value;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },
  },
};
</script>

<style>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;

  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.parent {
  height: 90vmin;
  width: 100%;
  display: flex;
}

.mainview {
  flex: 2.5;
}

.chipsview {
  margin-left: 10px;
  margin-right: 10px;
}
.nodata {
  width: 200px;
  height: 200px;
  margin: auto;
  animation: shake 4.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.nd {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.sideview {
  flex: 1;
}

.chips {
  margin: 4px;
}

.datepicker {
  font-size: 5px;
}

.content {
  background-color: black;
  color: white;
}

.placeholder {
  margin-top: 30px;
  margin-bottom: 50px;
  margin-left: 20px;
  margin-right: 20px;
  /* margin: 20px; */
  background-color: white;
}
.some {
  background-color: #ffda82;
  width: 400px;
  height: 170px;
  border-radius: 20px;
}
</style>

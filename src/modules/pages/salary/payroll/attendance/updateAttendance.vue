<template>
<div>
<div class="mainwindow">
 

  <div class="closebtn"  @click="closebtnclicked">
        X 
  </div>

  
   <div class="maincard">
      <div class="fullname">{{edit.fullName}}</div>
      <div class="department">{{edit.dateAttended | date}}</div>
     <div class="autocomplete">
         <v-autocomplete
            style="width: 200px; "
            v-model="edit.value"
            :items="values"
             item-text="name"
             item-value="value"
            hint="choose value"
            persistent-hint
            @change="valueSelected"
          />
      </div>
  </div>

  

</div>

 

</div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "updateAttendance",
    props: ["edit"],
    data () {
      return {
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
        ]
      }
    },
    computed: {
    
    },
    methods: {
      ...mapActions("Nattendance", ["updateAttendance"]),
      closebtnclicked(){
        this.$emit("close")
      },
      valueSelected(){
        // eslint-disable-next-line no-console
        console.log(this.edit)
        this.updateAttendance(this.edit).then(res => {
          res
             this.$notify({
                  type: "success",
                  horizontalAlign: "right",
                  verticalAlign: "bottom",
                  title: "Attendance Updated",
                  message: `Updated attendance sucessfuly`
                });

          this.$emit("updated")

        }).catch(e => {
          e
            this.$notify({
                  type: "danger",
                  horizontalAlign: "right",
                  verticalAlign: "bottom",
                  title: "Error",
                  message: `Something wrong while updating...`
                });
        })
      }
    }
}
</script>

<style scoped>

.maincard {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
}

.closebtn {
  position: relative;
  margin-left: auto;
  width: 40px;
  height: 30px;
  background-color: tomato;
  border-radius: 0px 20px 0px 20px;
  padding: auto;
  text-align: center;
  font-weight: bold;
  color: white;
}

.closebtn:hover {
  position: relative;
  margin-left: auto;
  width: 42px;
  font-size: 16px;
  height: 32px;
  background-color: red;
  border-radius: 0px 20px 0px 20px;
  padding: auto;
  text-align: center;
  font-weight: bold;
  color: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}



</style>
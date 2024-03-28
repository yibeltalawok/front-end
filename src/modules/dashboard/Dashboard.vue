<template>
  <div>
     

    <v-container grid-list-xs>
      <attendance />

    </v-container>
  </div>
</template>

<script>
//attendance
import Attendance from "@/modules/dashboard/attendance/Attendance";
export default {
  data() {
    return {
      tab: null,
      //by tefera
    };
  },
  components: {
    Attendance,   
  },

};
</script>

<style scoped>

</style>

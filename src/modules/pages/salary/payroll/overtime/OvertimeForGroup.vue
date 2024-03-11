<template>
    <v-container grid-list-xs>
      
    </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "OverTime",
  data() {
    return {
      types: ["Normal Day", "Rest Day", "Public Holiday"],
    };
  },
  created() {
    
  },

  computed: {
    ...mapState("employee", ["employeeList"])
  },

  mounted() {
    
  },
  methods: {
    ...mapActions("employee", ["fetchAllEmployees"]),

  }
};
</script>

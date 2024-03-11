<template>
  <v-dialog
      v-model="dialog"
      width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          outlined
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          IOT Device
        </v-btn>
      </template>
      <v-card>
          <v-app-bar
          color="amber"
          >
          <v-card-title>
          <span class="headline">IoT devices List</span>
        </v-card-title>
          </v-app-bar>

        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :items="this.iotlist"
          item-key="id"
          footer-props.items-per-page-text="`Performance per page`"
           />
        
       
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"
export default {
    name: "iotpage",
    computed: {
        ...mapState("losttime", [
            "iotdialog",
            "iotlist"
        ])
    },
    data(){
        return {
            dialog: false,
            headers: [
        {
          text: "IoT ID",
          value: "iotid"
        },
        {
          text: "Assigned",
          value: "employee.fullName"
        },
        {
          text: "Gender",
          value: "employee.gender"
        },
        {
          text: "Line",
          value: "line"
        },
        
      ]
        }
    },

    mounted(){
        this.fetchIotDevices()
    },

    methods: {
        ...mapActions("losttime", [
            "fetchIotDevices"
        ])
    }
}
</script>

<style>

</style>
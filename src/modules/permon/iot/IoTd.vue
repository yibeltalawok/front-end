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
          Generate IoT QR code
        </v-btn>
      </template>

      <v-card wrap>
         <v-app-bar
          color="amber"
          >
              <v-card-title>
          <span class="headline">IoT QR codes</span>
        </v-card-title>
          </v-app-bar>
      <v-card-text>
        <v-row >
      <qrcode-vue v-for="item in this.iotlist" :key="item.id"
        :value="item.iotid"
        :size="size"
        level="H"
        style="margin: 10px;"
      />
    </v-row> 
        </v-card-text>          

      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"
import QrcodeVue from "qrcode.vue";

export default {
    name: "iotpage",
    components: {
      QrcodeVue
    },
    computed: {
        ...mapState("losttime", [
            "iotlist"
        ]),

        ...mapState("employee", [
            "employeeList",
        ])

    },
    data(){
        return {
            dialog: false,
            size: 95,
        }
    },

    mounted(){
        this.fetchIotDevices({ include: ["employee"] })
        this.fetchAllEmployees()
    },

    methods: {
        ...mapActions("losttime", [
            "fetchIotDevices"
        ]),

        ...mapActions("employee", [
            "fetchAllEmployees"
        ])
    }
}
</script>

<style>

</style>
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
          style="margin-left: 20px;"
        >
          new
        </v-btn>
      </template>
      <v-card wrap>
          <v-app-bar
          color="amber"
          >
       <v-card-title>
          <span class="headline">{{$t('assign_device')}}</span>
        </v-card-title>
          </v-app-bar>

        
        
        <v-card-text  style="padding-top: 20px;" >
            <v-form
                ref="form"
                v-model="valid"
                
                >
            <v-text-field 
                outlined
                dense
                v-model="newIot.iotid"
                :rules="nameRules"
                :label="$t('device_id')"
                />


                <v-select
                    :items="this.employeeList"
                    color="grey"
                    item-text="fullName"
                    item-value="id"
                    :label="$t('employ')"
                    :rules="nameRules"
                    v-model="newIot.employeeId"
                    required
                    outlined
                    dense
                    />

                <v-select
                    :items="this.linelist"
                    color="grey"
                    item-text="number"
                    item-value="number"
                    v-model="newIot.line"
                    :rules="nameRules"
                    label="Line"
                    required
                    outlined
                    dense
                    />

                <v-btn width="100%" outlined color="primary" small @click.stop="createNewIot()">Assign</v-btn>
            </v-form>
        </v-card-text>
        
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"
export default {
    name: "newiot",
    computed: {
        ...mapState("losttime", [
            "iotdialog",
            "iotlist"
        ]),

        ...mapState("employee", [
            "employeeList",
        ]),

        ...mapState("line", [
            "linelist",
        ])

    },
    data(){
        return {
            dialog: false,
            nameRules: [
                v => !!v || 'This field is required',
              ],
            valid: true,
            newIot: {
                iotid: "",
                asigned: true,
                line: "",
                lastmodified: new Date(),
                employeeId: ""
            }
        }
    },

    mounted(){
        this.fetchIotDevices({ include: ["employee"] })
        this.fetchAllEmployees()
    },

    methods: {
        ...mapActions("losttime", [
            "asignnewIotDevices"
        ]),

        ...mapActions("employee", [
            "fetchAllEmployees"
        ]),

        validate () {
        this.$refs.form.validate()
      },

        createNewIot(){
            this.validate()

            if(this.valid){
                this.asignnewIotDevices(this.newIot).then(r => {

                    if(r == true){
                        this.$notify({
                        type: "success",
                        title: "IoT Registeration Successful",
                    });
                this.dialog = false
                    }
                    else {
                        this.$notify({
                        type: "danger",
                        title: "IoT Registeration failed",
                    });
                    }
                }).catch(e=> {
                    // eslint-disable-next-line no-console
                    console.log(e)
                })
            }
        }
    }
}
</script>

<style>

</style>

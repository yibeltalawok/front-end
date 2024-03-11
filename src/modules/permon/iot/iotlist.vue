<template>
  <div>

      <v-container grid-list-xs>
      <v-card>
          <v-app-bar
          flat
          color="white"
          >
          <v-row style="padding-top: 20px; margin-right: 20px;" >
            <v-spacer />
              <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
                dense
                outlined
                rounded
                :label="$t('search')"
            />
            <v-spacer />
            
            <iotpage />
            <newiot />
            <addLine />
          </v-row>
           </v-app-bar>
        
        <v-data-table
          :headers="headers"
          :search="search"
          :items-per-page="10"
          :items="this.iotlist"
          item-key="id"
          footer-props.items-per-page-text="`Performance per page`"
           >
        <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-5"
                color="green"
                @click="viewdialog(item)"
                style="margin-right: 20px"
              >
                mdi-pencil
              </v-icon>
              
              <v-icon
                small
                color="red"
                @click="deleteIot(item.id)"
              >
                mdi-delete
              </v-icon> 
    </template>
        </v-data-table>
        
       
      </v-card>
      
      </v-container>

 <v-dialog
      v-model="assigndialog"
      width="600px"
    >
      <v-card wrap>
          <v-app-bar
          color="amber"
          >
              <v-card-title>
          <span class="headline">{{$t('assign_device')}}</span>
        </v-card-title>
          </v-app-bar>
        
        <v-card-text  style="padding-top: 20px;" >
          <v-form v-model="valid" ref="asform">
          <v-select
              :items="this.iotlist"
              color="grey"
              item-text="iotid"
              item-value="id"
              v-model="asigniot.id"
              :rules="nameRules"
              label="IoT"
              required
              outlined
              dense
            />
        <v-select
              :items="this.employeeList"
              color="grey"
              item-text="fullName"
              item-value="id"
              :label="$t('employ')"
              v-model="asigniot.employeeId"
              :rules="nameRules"
              required
              outlined
              dense
            />
        <v-select
              :items="this.linelist"
              color="grey"
              item-text="number"
              item-value="number"
              v-model="asigniot.line"
              :rules="nameRules"
              label="Line"
              required
              outlined
              dense
            />
        <v-btn width="100%" outlined color="primary" small @click.stop="assingIot" >Assign</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations} from "vuex";
import TableMixinWithVuex from "../../../shared/mixins/tableMixinWithVuex"
import iotpage from "./IoTd.vue";
import newiot from "./newiot.vue";
import addLine from "./addLine.vue";


export default {
  mixins: [ TableMixinWithVuex ],
    components: {
             iotpage,
             newiot,
             addLine
    },

     computed: {
        ...mapState("losttime", [
            "iotlist",
            "unassignediotlist",
            "asigniotdialog",
            "iotdialog",
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
            search: '',
            dialog: false,
            assigndialog: false,
            valid: false,
            error: "",
            nameRules: [
                v => !!v || 'This field is required',
              ],
            asigniot: { },
            headers: [
                      {
                        text: this.$t('device_id'),
                        value: "iotid"
                      },
                      {
                        text: this.$t('assigned'),
                        value: "employee.fullName"
                      },
                      {
                        text: this.$t('gender'),
                        value: "employee.gender"
                      },
                      {
                        text: this.$t('line'),
                        value: "line"
                      },
                      { text: 'Actions', 
                      value: 'actions', 
                      sortable: false },

                    ],
            fetchListData: this.fetchIotDevices,
            filteroptions: { include: ["employee"] }
        }
    },

    mounted(){
        this.setUnAssignedIoTList()
        this.fetchAllEmployees()
        this.fetchLineList()
    },

    methods: {
        ...mapActions("losttime", [
            "fetchIotDevices",
            "setUnAssignedIoTList",
            "asignIotDevices",
            "deleteIotDevices"
        ]),
        ...mapMutations("losttime",[
          "setAssIotDialog"
        ]),
        ...mapActions("employee", [
            "fetchAllEmployees"
        ]),

        ...mapActions("line", [
            "fetchLineList"
        ]),

        viewdialog(item){
          // eslint-disable-next-line no-console
          console.log(item)
          this.asigniot = item
         this.assigndialog = true
        },

       async deleteIot(id){
           const confirmed = await this.$confirm(this.$t("are_you_sure"), {
              buttonTrueText: this.$t("yes"),
              buttonFalseText: this.$t("no"),
            });
            if (confirmed) {
              await this.deleteIotDevices(id);
              this.$notify({
                type: "danger",
                title: "Deleted!",
                message: `IoT Device ${this.$t("deleted")} ${this.$t(
                  "successfully"
                )}.`,
              });
              this.fetchIotDevices()
              this.setUnAssignedIoTList()
            }
            
        },
        async assingIot(){
         this.$refs.asform.validate()
         await this.asignIotDevices(this.asigniot).then(res => {
          // eslint-disable-next-line no-console
         console.log(res)
             })
        await this.fetchIotDevices()
        await this.setUnAssignedIoTList()
        this.assigndialog = false;  
        location.reload()      
      }
    }
    
}
</script>

<style>

</style>
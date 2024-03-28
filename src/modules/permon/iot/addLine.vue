<template>
  <v-dialog
      v-model="dialog"
      width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          outlined
          color="primary"
          v-bind="attrs"
          v-on="on"
          style="margin-left: 20px;"
          >
          addline
        </v-btn>
      </template>
      <v-card wrap>
          <v-app-bar
          color="amber"
          >
        <v-card-title>
          <span class="headline">{{$t('add-New-Line')}}</span>
        </v-card-title>
          </v-app-bar>        
        <v-card-text  style="padding-top: 20px;" >
            <v-form
          @submit.prevent="addLine"
          ref="form"
          v-model="valid"
          lazy-validation 
          >
              <v-text-field 
                outlined
                dense
                v-validate="'required'"
                :rules="lineRule"
                v-model="newIot.date"
                :label="$t('date')"
                type="date"
                />
                <v-text-field 
                outlined
                dense
                v-model="newIot.number"
                v-validate="'required'"
                :rules="lineRule"
                :label="$t('line umber')"
                type="number"
                />
              <v-text-field 
                outlined
                dense
                v-model="newIot.capacity"
                v-validate="'required'"
                :rules="lineRule"
                :label="$t('capacity')"
                type="number"
                />
                <v-btn width="100%" outlined color="primary"  @click="addLine()">Add</v-btn>
            </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
<script>
import { api,path } from "@/api";
export default {
    name: "addLine",
    data(){
        return {
            dialog: false,
      lineRule: [v => !!v || "This field is required"],
            newIot: {}
        }
    },

    methods: {
 
        validate () {
        this.$refs.form.validate()
      },
      
      addLine(){
          if (this.$refs.form.validate()) {
       api
        .create(this.newIot, path.line)
        .then(() => {
          this.errMessage = "";
          this.newIot = {};
          this.$notify({
            type: "success",
            title: "Register",
            message: `${this.$t("line")} ${this.$t(
              " successfully registered!"
            )}`
        })
        this.dialog=false
        })
          .catch(() => {
            this.$notify({
              type: "danger",
              title: "Failure",
              message: `Failed to register the line.`
            });
          });
          }      
      },

        }    
}
</script>
<style>
</style>

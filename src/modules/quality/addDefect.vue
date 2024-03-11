<template>
  <v-dialog
      v-model="dialog"
      width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          outlined
          color="#255325"
          v-bind="attrs"
          v-on="on"
        >
          Add Defect
        </v-btn>
      </template>
      <v-card wrap>
          <v-app-bar
          color="amber"
          >
       <v-card-subtitle>
          {{$t('add_defect')}}
       </v-card-subtitle>
          </v-app-bar>

        
        
        <v-card-text  style="padding-top: 20px;" >
            <v-form
                ref="form"
                v-model="valid"
                
                >
            <v-text-field 
                outlined
                dense
                v-model="defect.name_english"
                :rules="nameRules"
                :label="$t('name_english')"
                />
            <v-text-field 
                outlined
                dense
                v-model="defect.name_amharic"
                :rules="nameRules"
                :label="$t('name_amharic')"
                />

                <v-btn width="100%" outlined color="primary" small @click.stop="createNewIot()">Assign</v-btn>
            </v-form>
        </v-card-text>
        
      </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from "vuex"
export default {
    name: "addDefect",
    data(){
        return {
            dialog: false,
            nameRules: [
                v => !!v || 'This field is required',
              ],
            valid: true,
            defect: {
                name_english: "",
                name_amharic: "",
                type: "MI", 
            }
        }
    },

    methods: {
        ...mapActions("defects", [
            "addADefect"
        ]),

 
        validate () {
        this.$refs.form.validate()
      },

       async createNewIot(){
            this.validate()

            if(this.valid){
              // eslint-disable-next-line no-unused-vars
                await this.addADefect(this.defect).then(res => {
                  if(res == true){
                        this.$notify({
                        type: "success",
                        title: "Defect Registeration Successful",
                    });
                this.dialog = false
                    }
                    else {
                        this.$notify({
                        type: "danger",
                        title: "Defect Registeration Failed",
                    });
                    }
              })
            }
        }
    }
}
</script>

<style>

</style>

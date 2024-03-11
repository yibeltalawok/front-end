<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            small
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'prod-qrcode' })"
          >
            <v-icon class="mr-1">arrow_back</v-icon>{{ $t("go_back") }}
            <v-card outlined> </v-card>
          </v-btn>
        </v-toolbar>
      </v-card>
      <v-divider></v-divider>
      <v-layout row justify-center>
        <!-- <v-form
          @submit.prevent="save"
          ref="form"
          v-model="valid"
          lazy-validation
        > -->
          <v-flex xs12 sm12 md4 lg4 pa-1 >
            <v-autocomplete
              v-model="emp"
              :label="$t('Select employee')"
              :items="employee"
              item-text="fullName"
              item-value="id"
               class="mt-7" 
              outlined
              dense
              @input="getByEmployee" 
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-1>
            <v-text-field
              outlined
              dense
              v-model="line"
              name="name"
              :label="$t('line')" 
               class="mt-7" 
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md1 lg1 pa-1>
            <v-btn color="primary" class="mt-7" @click="save">{{
              $t("save")
            }}</v-btn>
          </v-flex>
        <!-- </v-form> -->
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import moment from 'moment'

export default {
  data() {
    return {
      employee: [],
      line: "",
      employeeId:'',
      amountDone:''
    //   rules: [v => !!v || "This field is required!"]
    };
  },
  async created() {
      const{amountDone}=this.$route.params
      this.amountDone=amountDone
    this.employee = (await api.all(path.employee)).rows.map(x => {
      return {
        fullName: x.idno + "  [" + x.fullName + "]",
        id: x.id
      };
    });
  },
  methods: {
      getByEmployee(id){
          this.employeeId=id
      },
  async  save() {
//   if (this.$refs.form.validate()) {
  var dt = new Date()
      let filter = {where:{employeeId:this.employeeId,line:this.line, date: moment(dt).format("YYYY-MM-DD")}}
      
 let a=  (await api.all(path.job,filter)).rows 
 // eslint-disable-next-line no-console
 console.log(a)

if(a.length>0){
let item = {
    amountDone:parseFloat(this.amountDone)+parseFloat(a[a.length-1].amountDone),
    id:a[a.length-1].id
} 

 api
        .update( item, path.job)
        .then(() => {
          this.$notify({
            type: "success",
            title: "   Production ",
            message: `New Production successfully created.`
          }); 
        })
}
else{
     this.$notify({
              type: "danger",
              title: "Job not found",
              message: `No job is assigned using this information.`
            });
}
      }
    // }
  }
};
</script>
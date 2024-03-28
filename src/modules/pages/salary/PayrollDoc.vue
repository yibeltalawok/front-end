<template>
    <div>
      <v-breadcrumbs :items="camps">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
  <v-layout row justify-center>
     <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
     outlined
      >
      <v-card outlined><v-card-title>{{$t("payroll-page")}}</v-card-title></v-card>
      <v-card-text align-baseline>
       <p>{{$t("file-in-payroll")}}</p>
        <p>
          <ul>
            <p>{{$t("files-to-print")}}</p>
            <p>{{$t("total-work-day")}}</p>
            </ul>
            <p>{{$t("Add-New")}}:</p>
            <p>{{$t("add-new-employee")}}</p>
            <p>{{$t("employee-more-detail")}}</p>
            <p>{{$t("employee-more-detail")}}</p>
    </v-card-text>
      </v-card>
    </v-flex>
</v-layout>
    </div>
</template>
<script>
export default {
    data(){
        return{
camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Payroll Master",
          disabled: false,
          to: "/app/payroll/master/list"
        },
{
          text: "Payroll Master",
          disabled: false,
          to: "/app/payroll/master/list"
        },
        {
          text: "Update Payroll master",
          disabled: true
        }

      ],
        }
    }
}
</script>
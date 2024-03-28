<template>
    <v-layout row justify-center>
    
    <v-flex xs12 ms12 md12 lg12 >
      
      <v-card
     class="mx-auto"
     outlined

      >
     <v-card outlined> <v-card-title>{{$t("ob")}}</v-card-title></v-card>
      <v-card-text align-baseline>
             <h4>{{$t("operation")}}</h4>
             <p>{{$t("operation-doc")}}</p>
             <p>{{$t("add-new-operation")}}</p>
             <p>{{$t("pr-qr-print")}}</p>
             <p>{{$t("machine-summary-doc")}}</p> 
             <p>{{$t("combine-register-from-csv")}}</p>
      </v-card-text>
      <v-card-text align-baseline>
             <h4>{{$t("add-operation")}}</h4>
             <p>{{$t("operation-registration-form")}}</p>
      </v-card-text>
      </v-card>
     </v-flex>
    </v-layout>
</template>
  
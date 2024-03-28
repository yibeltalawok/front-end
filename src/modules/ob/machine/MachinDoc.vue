<template>
   <v-layout row justify-center>
     <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
     outlined
      >
      <v-card outlined> <v-card-title>{{$t("ob")}}</v-card-title></v-card>
      <v-card-text align-baseline>
               <h3>{{$t("more_detail")}}</h3>
             <p>{{$t('change_info')}}</p>
             <p>{{$t("edit-registered-machine-doc")}}</p>
             <p>{{$t("pr-qr-print")}}</p>
      </v-card-text>

      <v-card-text align-baseline>
     <h4>{{$t("addNew")}}</h4>            
  <p>{{$t('register-new-machine-doc')}}</p>
      </v-card-text>
      </v-card>
     </v-flex>
    </v-layout>
  </template>
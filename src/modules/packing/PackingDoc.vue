<template>
    <v-layout row justify-center> 
    <v-flex xs12 ms12 md12 lg12>
      <v-card
      outlined
      >
     <v-card outlined> <v-card-title>{{$t("packing")}}</v-card-title></v-card>
      <v-card-text align-baseline>
       <h3>{{$t('packing_list')}}</h3>
        <p>{{$t("list-of-packing-doc")}}</p>
      <h3>{{$t("addNew")}}:</h3>
      <p>{{$t('add-new-packing-doc')}}</p>
          <p>{{$t("fill-row-colomn-doc")}}</p>
            <p>{{$t("PCS-CTN-doc")}}</p>
            <p>{{$t("machine-sumary-doc")}}</p>
      </v-card-text>

      <v-card-text align-baseline>
        <h2>{{$t("packing_in")}}:</h2>
        <p>{{$t("select-packed-in")}}</p>
      </v-card-text>
      </v-card>
     </v-flex>
    </v-layout>
  </template>
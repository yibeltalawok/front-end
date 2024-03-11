<template>
    <div>
    <v-layout row justify-center>
    <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
      outlined
      >
      <v-card outlined> <v-card-title>{{$t("incentives-page")}}</v-card-title></v-card>
      <v-card-text align-baseline>
       <p>{{$t("incentives-slab")}}</p>
       <p>{{$t("weigtage")}}</p>
       <p>{{$t("distributeincentive")}}</p>
       <p>{{$t("distributesummary")}}</p>
        <p>{{$t("addincentive")}}</p>
     </v-card-text>
     </v-card>
    </v-flex>
  </v-layout>
  </div>
</template>

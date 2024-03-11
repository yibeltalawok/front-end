<template>
    <div>
 <v-layout row justify-center>
     <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
     outlined
      >
      <v-card outlined><v-card-title>{{$t("laysheet-page")}}</v-card-title></v-card>
      <v-card-text     
      align-baseline>
       <p>{{$t("laysheet-sub-page")}}</p>
       <h3>{{$t("addNew")}}:</h3>
        <p>
          {{$t("click-addnew")}}
       </p>
      <li>{{$t("fill-cut-number")}}</li>
      <li>{{$t("select-Order-umber")}}</li>
      <li>{{$t("fill-all-empty-field")}}</li>
      <li>{{$t("click-save-and-exit")}}</li>
      <p>{{$t("moredetail-viewbulletticks")}}</p>   
      </v-card-text>
      </v-card>
    </v-flex>
</v-layout>
    </div>
</template>
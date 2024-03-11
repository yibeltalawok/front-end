<template>
    <div>
      <v-layout row justify-center>
     <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
     outlined
      >
      <v-card outlined> <v-card-title>{{$t("emloyee-page")}}</v-card-title></v-card>
      <v-card-text align-baseline>
       <p>{{$t("file-in-employee")}}</p>
        <p>
          <ul>
            <h3>{{$t("register-from")}}</h3>
            <li>{{$t("to-upload-emp-sheet")}}</li>
            </ul>
            <h3>{{$t("AddNew")}}:</h3>
            <p>{{$t("add-new-employee")}}</p>
            <p>{{$t("employee-more-detail")}}</p>
            <p>{{$t("employee-more-detail")}}</p>
    </v-card-text>
      </v-card>
    </v-flex>
</v-layout>
    </div>
</template>
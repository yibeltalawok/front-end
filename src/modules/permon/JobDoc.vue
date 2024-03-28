<template>
  <div>
    <v-card class="mx-auto" elevation="5" Bak="#6666">
      <v-layout row justify-center>
        <v-flex xs12 ms12 md12 lg12>
          <v-card
      class="mx-auto"
      outlined
          >
           <v-card outlined> <v-card-title>{{$t("PerMon-folder")}}</v-card-title></v-card>
            <v-card-text align-baseline>
              <h4>{{ $t("job-page") }}</h4>
              <p>{{ $t("files-in-job-file") }}</p>
              <p>{{ $t("view-all") }}</p>
              <p>{{ $t("assign-all-register") }}</p>
            </v-card-text>
 
            <v-card-text align-baseline>
              <h4>{{ $t("performance") }}</h4>
              <p>{{ $t("performance-summary-calculate") }}</p>
            </v-card-text>
      
            <v-card-text align-baseline>
              <h4>{{ $t("working_hour") }}</h4>
              <h5>{{ $t("addNew") }}</h5>
              <p>{{ $t("work-hour-addnew-edit-delete") }}</p>
              <h4>{{ $t("efficiency") }}</h4>
              <h5>{{ $t("create-efficiency") }}</h5>
              <li>{{ $t("date-create-efficiency") }}</li>
            </v-card-text>
    
            <v-card-text align-baseline>
              <h4>{{ $t("iot-page") }}</h4>
              <p>{{ $t("select-new") }}</p>
              <p />
              <p>{{ $t("generate-iot-qr") }}</p>
              <p>{{ $t("add-line-doc") }}</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

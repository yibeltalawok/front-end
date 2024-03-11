<template>
  <v-layout row justify-center>
    <v-flex xs12 ms12 md12 lg12>
      <v-card class="mx-auto" outlined>
        <v-card outlined>
          <v-card-title>{{ $t("ob") }}</v-card-title></v-card
        >
        <v-card-text align-baseline>
          <h3>{{ $t("cost-entry") }}</h3>
          <p>{{ $t("add-new-machine-cost") }}</p>
        </v-card-text>

        <v-card-text align-baseline>
          <h4>{{ $t("cost-summery-doc") }}</h4>
          <p>{{ $t("create-cost-summery") }}</p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
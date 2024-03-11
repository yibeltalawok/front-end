<template>
  <v-container grid-list-sm>
    <v-layout 
      row 
      wrap>
      <v-flex xs12>
        <h1>
          <v-icon>security</v-icon>
          Unauthorized Access denied
        </h1>
        <v-btn 
          @click="$router.push({name:'dashboard'})" 
        >Return Home</v-btn>
      </v-flex>
            
    </v-layout>
  </v-container>
</template>

<script>
export default {};
</script>

<style>
</style>

<template>
  <v-container grid-list-sm>
    <v-layout 
      row 
      wrap>
      <h1>Page Not Found</h1>
      <v-btn 
        @click="$router.push({name:'dashboard'})" 
      >Return Home</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {};
</script>

<style>
</style>

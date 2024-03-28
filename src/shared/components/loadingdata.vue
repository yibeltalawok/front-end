<template>
  <div style="margin: 20px" >
      <v-layout column justify-center align-center >
       
        <semipolar-spinner :animation-duration="2500" :size="50" color="#ffa500" />
         <h3>Loading ...</h3>
        <p>Loading depends on your internet speed.</p>
      </v-layout>
    </div>
</template>

<script>
import { SemipolarSpinner } from "epic-spinners";

export default {
    name: "loadingdata",
    components: {
    SemipolarSpinner,
  },
}
</script>

<style>

</style>
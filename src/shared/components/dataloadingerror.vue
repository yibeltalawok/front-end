<template>
    <div>
         <div class="nodata">
         <img class="small" src="./erroricon1.png"/>
    </div>
    Error in loading data, please retry!
   
    <div class="btn_reload">
      <v-btn @click.stop="reload" small outlined color="amber"> Reload </v-btn>
    </div>

    </div>
</template>

<script>
export default {
    name: "errorloading",
    methods: {
        reload(){
            this.$emit('reloaddata')
        }
    }
}
</script>

<style scoped>
.btn_reload {
  margin-bottom: 20px;
  margin-top: 10px;
}

.small {
    width: 100px;
    height: 100px;
    margin: 0px;
    margin-top: 20px;
}
</style>
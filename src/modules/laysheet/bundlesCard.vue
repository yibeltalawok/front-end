<template>

  <div >
       <div class="maincontainer">
            <div class="mainrow">

                    <div class="avatar">
                      <div class="avtext">
                        {{this.bndl.bundleNo}}
                      </div>
                    </div>

                    <div class="content">
                          <div class="maincolor">
                            Color: {{this.bndl.color}}
                          </div>

                          <div class="mainsize">
                            Size: {{this.bndl.label}}
                          </div>

                          <div class="mainserial">
                            from: {{this.bndl.from}} to: {{this.bndl.to}}
                          </div>

                    </div>

            </div>
          </div>


  </div>
</template>

<script>
export default {
    name: "bundleCards",
    props: ["bndl"],
    computed: {
        bndls(){
            return this.bundles;
        },
        clrs(){
            return this.colors
        }
    }
}
</script>

<style scoped>

.maincontainer {
  width: 240px;
  height: 100px;
  border: 1px solid #FFDA82;
  border-radius: 10px;
  margin-top: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 15px;
  background-color: #FFDA82;
  box-shadow: 2px 4px 10px 0px #b89a54;
  
}

.mainrow {
  display: flex;
}

.avatar {
  width: 70px;
  height: 70px;
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 100px;
  text-align: center;
  
}
.avtext {
  margin-top: 17px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}
.content {
  width: 120px;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
}

.maincolor {
  color: white;
  font-weight: bold;
  font-size: 15px;
}

.mainsize {
  color: white;
  font-weight: bold;
  font-size: 12px;
   margin-top: 5px;
}

.mainserial {
  color: white;
  font-weight: lighter;
  font-size: 13px;
  margin-top: 10px;
}
</style>
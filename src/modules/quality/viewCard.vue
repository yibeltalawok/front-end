<template>
  <v-card
    flat
    color="white"
    width="300"
    height="80"
    class="pl-4 pr-4 yellow-card"
  >
    <!-- <v-layout row justify-center>
      <v-flex xs3 sm3 md3 lg3>
        <v-img
          class="align-self-strech"
          :src="imageUrl + icon"
          width="50"
        ></v-img>
      </v-flex>
      <v-flex xs8 sm8 md8 lg8>
        <v-row>
          <v-spacer />
          <h1 class="tittle-number">{{ tittle }}</h1>
          <v-spacer />
        </v-row>

        <v-row class="pt-0 pb-0">
          <v-spacer />
          <p class="sub-tittle-text">{{ subtittle }}</p>
          <v-spacer />
        </v-row>
      </v-flex>
    </v-layout> -->




    <!-- <v-row>
      <v-col class="col-icon">
        <v-img
          class="align-self-strech"
          :src="imageUrl + icon"
          width="70"
        ></v-img>
      </v-col>
      <v-col class="col-text">
        <v-spacer />

        <v-row>
          <v-spacer />
          <h1 class="tittle-number">{{ tittle }}</h1>
          <v-spacer />
        </v-row>

        <v-row class="pt-0 pb-0">
          <v-spacer />
          <p class="sub-tittle-text">{{ subtittle }}</p>
          <v-spacer />
        </v-row>
        <v-spacer />
      </v-col>
    </v-row> -->

    <v-list color="#F3D353">
        <v-list-item >
          <v-list-item-content>
            <v-list-item-title class="title" style="color: white;">
              {{ subtittle }}
            </v-list-item-title>
            <v-list-item-subtitle style="color: #807218;font-weight: bold;">  {{ tittle }} </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-img
                    class="align-self-strech"
                    :src="imageUrl + icon"
                    width="50"
                  ></v-img>
          </v-list-item-action>
        </v-list-item>
      </v-list>

  </v-card>
</template> 
<script>
import { API_ROOT } from "@/api";
export default {
  data() {
    return {
      imageUrl: API_ROOT + "/containers/profilePictures/download/"
    };
  },
  name: "viewCard",
  props: ["tittle", "subtittle", "color", "icon"]
};
</script>

<style scoped>
.yellow-card {
  border-radius: 20px;
  margin-right: 30px;
}

.tittle-number {
  color: white;
}

.sub-tittle-text {
  color: #807218;
  
  
}
.col-icon {
  width: 10%;
}
.col-text {
  width: 90%;
}
</style>
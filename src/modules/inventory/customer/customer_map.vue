<template>
<div>
<v-row>
  <v-spacer />
  <v-card class="mymap">

    <vl-map 
    ref="map"
    @click="onMapClick"
    :load-tiles-while-animating="true" 
    :load-tiles-while-interacting="true" 
    style="height: 400px"
    >
      <vl-view 
      :zoom.sync="zoom" 
      :center.sync="center" 
      :rotation.sync="rotation"
      projection="EPSG:4326"
      ></vl-view>

      <vl-layer-tile id="osm">
          <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

       <vl-layer-vector v-for="item in customers" :key="item.id">

        <vl-feature >
          <vl-geom-point
            :coordinates="item.location"
          ></vl-geom-point>

          <vl-style-box >
            <vl-style-circle :radius="10">
              <vl-style-fill color="green"></vl-style-fill>
              <vl-style-stroke color="yellow"></vl-style-stroke>
            </vl-style-circle>
          </vl-style-box>
        </vl-feature>

      </vl-layer-vector>


  </vl-map>


  </v-card>
  <v-spacer />

</v-row>




<v-dialog
      v-model="dialog"
      width="600px"
    >
     
      <v-card wrap>
         
        <v-card-text  style="padding-top: 20px;" >
          
          <v-layout row justify-center>
          <v-avatar height="70px" width="70px" style="margin-bottom: 20px;">
              <img
                :src="dialog_customer.imagePath"
                alt="No image"
                height="70px"
                width="100%"
              />
              <!-- () -->
            </v-avatar>
          </v-layout>
            
            <v-text-field
                dense
                disabled
                v-model="dialog_customer.customerName"
                outlined
                ></v-text-field>

            <v-text-field
                dense
                disabled
                v-model="dialog_customer.phoneNumber"
                outlined
            ></v-text-field>

            <v-layout row >
            <v-flex pa-2>
            <v-text-field
                dense
                disabled
                v-model="dialog_customer.location[0]"
                outlined
            ></v-text-field>
            </v-flex>

            <v-flex pa-2>
            <v-text-field
                dense
                disabled
                v-model="dialog_customer.location[1]"
                outlined
            ></v-text-field>

            

            </v-flex>
            </v-layout>
        </v-card-text>
        
      </v-card>
    </v-dialog>

</div>
</template>

<script>
  export default {
    props:[
      "customers"
    ],
    data () {
      return { 
        dialog: false,
        dialog_customer: {
          location: []
        },
        zoom: 6,
        center: [41.86898565942995, 9.595804713724334 ],
        rotation: 0,
        overlayCoordinate: [30, 30],
      }
    },

    methods: {
      onMapClick(evt){

        let features = this.$refs.map.$map.getFeaturesAtPixel(evt.pixel)
        if (!features) {
          return
        }

        let feature = features[0].values_.geometry.flatCoordinates

        this.customers.forEach(element => {
        
          if (JSON.stringify(element.location) === JSON.stringify(feature)){
              // eslint-disable-next-line no-console
              console.log(element)
              this.dialog_customer = element
              this.dialog = true;
          }
        });
        
      }
    },
  }
</script>

<style scoped>

.mymap {
  width: 70%;
  position: relative;
  align-content: center;
}

</style>
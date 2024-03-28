<template>
  <v-container> 
    <v-row>
      <v-hover v-slot:default="{ hover }" open-delay="300">
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h2 class="title primary--text">{{$t("production-template")}}</h2>
            </v-card-title>
            <v-card-text>
              Paper template to use for production
            </v-card-text>
            <v-expand-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="#036358"
              >
                <v-row>
                    <v-btn
                      small
                      color="primary"
                      v-on:click="toProduction()"
                      style="margin-right: 20px;"
                      > <v-icon small style="margin-right: 10px;">mdi-eye</v-icon> View </v-btn>
                  </v-row>
                </v-overlay>
              </v-expand-transition>
            </v-card>
        </v-col>
      </v-hover>
      <v-hover v-slot:default="{ hover }" open-delay="300">
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h2 class="title primary--text">Operational Costs</h2>
            </v-card-title>
            <v-card-text>
              Operational cost templete and sample csv file to upload
            </v-card-text>
            <v-expand-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="#036358"
              >
                <v-row>
                  <v-btn
                    small
                    color="primary"
                    style="margin-right: 20px;"
                    @click.stop="downloadOperationalCosttemplete()"
                  >
                    <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                    Template
                  </v-btn>
                  <v-btn
                    small
                    color="primary"
                    @click.stop="downloadOperationalCostSample()"
                  >
                    <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                    Sample
                  </v-btn>  
                </v-row>
              </v-overlay>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-hover>
    </v-row>
    <v-row>
      <v-hover v-slot:default="{ hover }" open-delay="300">
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h2 class="title primary--text">Employee registration template</h2>
            </v-card-title>
            <v-card-text>
              Excel sheet template for bulk employee registration
            </v-card-text>
            <v-expand-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="#036358"
              >
                <v-row>
                   <v-btn
              small
              color="primary"
              style="margin-right: 20px;"
              @click.stop="downloadEmployeeRegtemplete()"
            >
              <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
              Template
            </v-btn>
            <v-btn
              small
              color="primary"
              @click.stop="downloadSampleEmployeeRegtemplete()"
            >
              <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
              Sample
            </v-btn>
                  </v-row>
                </v-overlay>
              </v-expand-transition>
            </v-card>
        </v-col>
      </v-hover>
      <v-hover v-slot:default="{ hover }" open-delay="300">
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h2 class="title primary--text">Machine registration template</h2>
            </v-card-title>
            <v-card-text>
              Template for machine registration from csv files
            </v-card-text>
            <v-expand-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="#036358"
              >
                <v-row>
                  <v-btn
                    small
                    color="primary"
                    style="margin-right: 20px;"
                    @click.stop="downloadMachineRegtemplete()"
                  > 
                    <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                    Template
                  </v-btn>

                  <v-btn
                    small
                    color="primary"
                    @click.stop="downloadSampleMachineRegtemplete()"
                  > 
                    <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                    Sample
                  </v-btn>  
                </v-row>
              </v-overlay>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-hover>
    </v-row>
    <v-row>
      <v-hover v-slot:default="{ hover }" open-delay="300">
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h2 class="title primary--text">{{$t("operation-template")}}</h2>
            </v-card-title>
            <v-card-text>
              Template for operation registration from csv files
            </v-card-text>
            <v-expand-transition>
              <v-overlay
                v-if="hover"
                absolute
                color="#036358"
              >
                <v-row>
                   <v-btn
                      small
                      color="primary"
                      style="margin-right: 20px;"
                      @click.stop="downloadOpperationRegtemplete()"
                    >
                      <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                      Template
                    </v-btn>

                    <v-btn
                      small
                      color="primary"
                      @click.stop="downloadSampleOpperationRegtemplete()"
                    >
                      <v-icon small style="margin-right: 10px;">mdi-download</v-icon>
                      Sample
                    </v-btn>
                  </v-row>
                </v-overlay>
              </v-expand-transition>
            </v-card>
        </v-col>
      </v-hover>
    </v-row>
  </v-container>
</template>
  

<script>
// import { api, path } from "@/api";
import { API_ROOT } from "../../../api";


export default {


    data: () => ({
      overlay: false,
    }),

  methods: {

    async downloadEmployeeRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/empregtemplete.csv", '_blank');

    },

    async downloadSampleEmployeeRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/sample_emp.csv", '_blank');

    },

    async downloadOpperationRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/opperation.csv", '_blank');

    },

    async downloadOperationalCosttemplete(){
      window.open(API_ROOT + "/Containers/templete/download/Operational-cost-temp.csv", '_blank');
    },

    async downloadOperationalCostSample(){
      window.open(API_ROOT + "/Containers/templete/download/Operational-cost-sample.csv", '_blank');
    },

    async downloadSampleOpperationRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/sample_opperation.csv", '_blank');

    },

    async downloadMachineRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/machinereg.csv", '_blank');

    },

    async downloadSampleMachineRegtemplete(){
    
      window.open(API_ROOT + "/Containers/templete/download/sample_machine.csv", '_blank');

    },


    toProduction(){
      this.$router.push({name: 'production-template'})
    }
  }

}
</script>

<style>

</style>
<template>
  <div>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <h1 class="text-center info--text py-3">Operations Summary</h1>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <h1 class="text-center pink--text py-3">
          {{operations.length}}
          <span class="title info--text">
            operation
            <v-btn
              text
              small
              color="purple"
              class="text-capitalize"
              @click="$router.push({name:'operation-list'})"
            >More detail</v-btn>
          </span>
        </h1>
      </v-flex>
      <v-flex xs12></v-flex>
      <v-flex xs12 sm12 md6 lg6 pa-2>
        <chart
          width="1000"
          height="400"
          id="op1"
          type="line"
          title="Machine Allocated"
          :border-color="'rgba(153, 102, 255, 1)'"
          border-width="2"
          fill="false"
        ></chart>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 pa-2>
        <chart
          width="1000"
          height="700"
          id="op2"
          title="# of Votes"
          :labels="labels"
          :background-color="backgroundColor"
          :border-color="'rgba(153, 102, 255, 1)'"
        ></chart>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Chart from "./Chart";
import { api, path } from "@/api";
export default {
  data() {
    return {
      operations: [],
      filter: {
        include: ["machine"]
      },
      targetOps: []
    };
  },
  components: {
    Chart
  },
  async created() {
    this.operations = (await api.all(path.operation, this.filter)).rows;
    this.targetOps = this.operations.map(x => {
      return {
        id: x.id,
        operation: x.operationName,
        machine: x.machine.modelNumber
      };
    });
  }
};
</script>
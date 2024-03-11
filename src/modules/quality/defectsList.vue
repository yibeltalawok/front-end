<template>
  <v-dialog
      v-model="dialog"
      width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          style="margin-left: 20px;"
          outlined
          color="#255325"
          v-bind="attrs"
          v-on="on"
        >
          View Defects
        </v-btn>
      </template>
      <v-card wrap>

        <v-card-text  style="padding-top: 20px;" >

               <v-data-table
                    :headers="headers"
                    :items-per-page="10"
                    :items="defects"
                    item-key="id"
                    >

                    <template v-slot:item.action="{ item }">
                                <v-icon
                                    class="ml-2 red--text"
                                    small
                                    @click="localDeleteDefects(item.id)"
                                    >delete</v-icon
                                    >
                            </template>

               </v-data-table>

        </v-card-text>
        
      </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
    name: "viewDefect",
    computed: {
        ...mapState("defects", [
            "defects",
        ]),
    },
    data(){
        return {
            dialog: false,
             headers: [
                    {
                    text: this.$t("name_english"),
                    value: "name_english"
                    },
                    {
                    text: this.$t("name_amharic"),
                    value: "name_amharic"
                    },
                    {
                    text: "Action",
                    value: "action"
                    }
             ]
        }
    },

    mounted(){
       this.fetchDefects()
    },

    methods: {
        ...mapActions("defects", [
            "fetchDefects",
            "deleteDefects"
        ]),

        async localDeleteDefects(id){
            const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
      });
      if (confirmed) {
        // eslint-disable-next-line no-unused-vars
        await this.deleteDefects(id).then(r => {
            this.fetchDefects()
        });
        
        this.loadData();
        this.$notify({
          type: "danger",
          title: "Deleted!",
          message: `Defect deleted!`,
        });
      }

        }

     
    }
}
</script>

<style>

</style>

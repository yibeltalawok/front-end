<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-text-field
            hide-details
            prepend-inner-icon="search"
            color="primary"
            dense
            rounded
            v-model="search"
            :label="$t('searchBy') + ' ' + $t('cutNumber')"
            single-line
          />
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'laysheet' })"
            >{{ $t("addNew") }}</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :rows-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          footer-props.items-per-page-text="`${$t('laysheet')} per page`"
        >
          <template v-slot:item.action="{ item }">
            <v-btn
              small
              text
              color="info"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'laysheet-detail',
                  params: { laysheetId: item.id }
                })
              "
              >{{ $t("more_detail") }}</v-btn
            >
            <v-btn
              text
              small
              color="info"
              class="text-capitalize"
              @click="editLaysheet(item.id, edit)"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-icon
              class="ml-2 red--text"
              small
              @click="deleteLaysheet(item.id, del)"
              >delete</v-icon
            >
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- The dialog to delete the bundles in a cut -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="320"
      >
        
        <v-card>
          <v-card-title class="headline">
            Delete Bundles?
          </v-card-title>
          <v-card-text style="color: black">There are <b>{{this.bndls.length}}</b> bundles in this cut. You need to delete the bundles first to continue.</v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              style="text-transform: none"
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              style="text-transform: none"
              text
              @click="deleteBndls(bcsheet.id, action)"
            >
              Delete &rarr;
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>


<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
// eslint-disable-next-line no-unused-vars
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "LaySheetList",
  mixins: [tableMixin],
  data() {
    return {
      dialog: false,
      loading: false,
      component: "Laysheet",
      ifNoData: "laysheet",
      filter: {
        include: ["order"]
      },
      bcsheet: {},
      action: '',
      resource: api,
      path: path.laysheet,
      resourceName: "Laysheet",
      searchField: "cutNo",

      headers: [
        {
          text: this.$t("cutNumber"),
          value: "cutNo"
        },
        {
          text: this.$t("customer"),
          value: "customerName"
        },
        {
          text: this.$t("styleName"),
          value: "order.styleName"
        },
        {
          text: this.$t("styleNumber"),
          value: "order.styleNumber"
        },
        {
          text: this.$t("design"),
          value: "order.design"
        },
        {
          text: this.$t("po_Number"),
          value: "order.poNo"
        },
        {
          text: this.$t("orderQuantity"),
          value: "order.quantity"
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false
        }
      ]
    };
  },

  computed: {
    ...mapState("laysheet", ["bndls"])
  },

  methods: {
    ...mapMutations("laysheet", ["setCheckBundles"]),
    ...mapActions("laysheet", ["checkBundleList", "deleteBundleHistory", "deleteBundles", "deleteBCSheet"]),

    
    editLaysheet(id){
      this.action = "edit"
      // first check if this laysheet has bundles.
      this.checkBundleList(id).then(() =>{
        if(this.bndls.length > 0){
          this.bcsheet.id = id;
          // if the cut has bundles, display a dialog with a delete bundles option.
          this.dialog = true;
        }
        else{
          this.$router.push({
            name: 'update-laysheet',
            params: { laysheetId: id }
          })
        }
      });
    },

    deleteBndls(id, act){
      this.deleteBundleHistory(id).then(() =>{
        this.deleteBundles(id).then(() =>{
          this.dialog = false;
          if(act == "edit"){
            this.$router.push({
              name: 'update-laysheet',
              params: { laysheetId: id }
            })
          }
          else if(act == "del"){
            this.deleteBCSheet(id).then(() =>{
              this.$notify({
                type: "success",
                title: "Laysheet",
                message: `Laysheet deleted successfully.`
              });
              this.$forceUpdate();
              // this.$router.push({ name: "laysheet-list" });
            })
            
          }
          
        })
      })
      
    },

    deleteLaysheet(id){
      this.action = "del"
      // first check if this laysheet has bundles.
      this.checkBundleList(id).then(() =>{
        if(this.bndls.length > 0){
          this.bcsheet.id = id;
          // if the cut has bundles, display a dialog with a delete bundles option.
          this.dialog = true;
        }
        else{

          // confirmation alert
          // this.deleteItem(id, path)
          // delete the bcsheet / cut
          this.deleteBCSheet(id).then(() =>{
            this.$notify({
              type: "success",
              title: "Laysheet",
              message: `Laysheet deleted successfully.`
            });
            this.$forceUpdate();
            this.$router.push({ name: "laysheet-list" });
          })
        }
      });

      // 
    }

    
  }
};
</script>
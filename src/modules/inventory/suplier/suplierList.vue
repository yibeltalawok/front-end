<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <div>
            <v-text-field
              hide-details
              flat
              prepend-inner-icon="search"
              color="primary"
              dense
              solo
              rounded
              v-model="search"
              :label="$t('search-product')"
            />
          </div>
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            @click="createSupplier"
            >{{ $t("addNew") }}</v-btn
          >
        </v-toolbar>
        
        <v-divider />
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :items="supplier"
          item-key="id"
          :search="search"
          footer-props.items-per-page-text="`${$t('users')} per page`"
        >  
         <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.image="{ item }">
            <v-avatar height="45px" width="45px">
              <img
                :src="item.imagePath"
                alt="No image"
                height="70px"
                width="100%"
              />
              <!-- () -->
            </v-avatar>
          </template>   
          <template v-slot:item.action1="{ item }">
                <v-btn
                icon
                small
                @click="
                  $router.push({
                    name: 'suplier-detail',
                    params: { supplierId: item.id }
                  })
                ">
                <eye />
                </v-btn>
          </template>
          <template v-slot:item.action2="{ item }">
            <v-btn
              icon
              small
              color="info"
               @click="updateSupplier(item.id)"
            >
             <edit />
            </v-btn>
          </template>    
         <template v-slot:item.action="{ item }">
            <v-btn
              x-small
              icon
              @click="deleteItem(item.id, path)"
            >
           <Delete />
            </v-btn>
          </template>
  
        </v-data-table>
      </v-card>

      <!-- ========= Supplier Dialog =========== -->
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="800px"
        >
          <v-card wrap outlined style="border-radius:1px">
            
            <v-app-bar color="amber">
              <v-card-subtitle v-if="this.create">
                <span style="color: white">Create Supplier</span>
              </v-card-subtitle>
              <v-card-subtitle v-if="this.edit">
                <span style="color: white">Update Supplier</span>
              </v-card-subtitle>

              <v-spacer />
              
              <v-btn
                icon
                dark
                @click="closeDialog"
                color="red"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>

            </v-app-bar>

            <SupplierComponent :item="this.item" :location="this.location" />

            <v-card-actions>
              <v-btn 
              class="mr-2"
                small
                color="red"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>

              <v-spacer></v-spacer>
                <div v-if="this.create">
                  <v-btn
                    small
                    color="amber"
                    text
                    @click="save"
                  >
                    {{ $t("save") }}
                  </v-btn>

                </div>
                <div v-if="this.edit">
                  <v-btn
                    small
                    color="amber"
                    text
                    @click="update"
                  >
                    {{ $t("update") }}
                  </v-btn>

                </div>

            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
import Delete from "@/assets/icons/delete_icon.svg";
import edit from "@/assets/icons/edit_icon.svg";
import eye from "@/assets/icons/eye_icon.svg";
import SupplierComponent from "./SupplierComponent";
export default {
  name: "UserList",
  components: {
    SupplierComponent,
    Delete,
    edit,
    eye
  },
  data() {
    return {
      items:[],
      location: [0, 0],
       item: {
        location: []
      },
      create: false,
      edit: false,
      search: "",
      dialog: false,
      inputRule: [v => !!v || "This field is required"],
      sa: "tyutyuty",
      path: path.supplier,
      supplierId:"",
      resource: api,
      headers: [

        {
          text: this.$t("supplierCode"),
          value: "supplierCode"
        },
        {
          text: this.$t("supplierName"),
          value: "supplierName"
        },
         {
          text: this.$t("phone number"),
          value: "phoneNumber"
        },
        
        {
          text: this.$t("taxRate"),
          value: "taxRate"
        },
        {
          text: this.$t("country"),
          value: "country"
        },

        {
          text: this.$t("city"),
          value: "city"
        },
        {
          text: this.$t("postalCode"),
          value: "postalCode"
        },
        {
          
          value: "action"
        }, 
        {
          text: this.$t("action"),
          value: "action1"
        }, 
         {
          value: "action2"
        }, 
         
      ]
    };
  },

  computed: {
    ...mapState("inventory", ["supplier", "supplierById"])
  },
  mounted() {
    this.loadData();
  },
  methods: {
    ...mapActions("inventory", ["getSupplier", "postsuplier", "updatesuplier", "getSupplierById"]),

    loadData() {
      this.items = [];
      this.getSupplier().then(res => {
        res;
  //       for (let i = 0; i < this.supplier.length; i++) {
  //         this.getProfileImage([
  //           "supplier/download",
  //           this.supplier[i].imagePath
  //         ]).then(at => {
  //           at;
  //           this.items.push({
  //             id: this.supplier[i].id,
  //             supplierCode: this.supplier[i].supplierCode,
  //             supplierName: this.supplier[i].supplierName,
  //             phoneNumber: this.supplier[i].phoneNumber,
  //             taxRate:this.supplier[i].taxRate,
  //             country: this.supplier[i].country,
  //             city: this.supplier[i].city,
  //             postalCode: this.supplier[i].postalCode,
  //             location: this.supplier[i].location
  //           });

  //         });
  //       }
  //  //  alert(this.supplier.length)
  //   // alert(this.items.length)
      });
    },
    createSupplier(){
      this.create = true
      this.dialog = true;
    },
    async updateSupplier(val){
      this.supplierId = val;
      this.edit = true;
      this.dialog = true;
      this.getSupplierById([this.supplierId, path.supplier]).then(() =>{
        this.item = this.supplierById;
      })
      // this.item = await api.get(this.supplierId, path.supplier) 
    },
    closeDialog(){
      this.dialog = false;
      this.create = false;
      this.edit = false;
    },
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.$notify({
          type: "danger",
          title: "Deleted!",
          message: `${("supplier")} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`
        });
        this.loadData();
      }
    },
    async save() {
          if (this.profileDone) {
            this.uploadPicture(this.selectedFileSupplier);
          // alert(this.selectedFileSupplier[0])
          }
          this.item.location = [
            parseFloat(this.location[0]),
            parseFloat(this.location[1])
          ];
        //alert(this.item.location[0])
      this.postsuplier([this.item]).then(() => {
        this.dialog = false;
        this.getSupplier()
        // this.$router.push({ name: "suplier-list" });
      });

    },
    async update() {
          this.item.location = [
          parseFloat(this.location[0]),
          parseFloat(this.location[1])
        ];
      this.updatesuplier([this.item]).then(() => {
        this.dialog = false;
        this.getSupplier();
        this.$notify({
          type: "success",
          title: "Updated!",
          message: `${("supplier")} ${this.$t("updated")} ${this.$t(
            "successfully"
          )}.`
        });
      });
    },
  }
};
</script>

<template>
  <div>
    <customerMap :customers="items" />

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
              :label="$t('search-customer')"
            />
          </div>
          <v-spacer></v-spacer>

          <v-btn
            dense
            class="text-capitalize primary"
            @click="createNewCustomer()"
            >{{ $t("addNew") }}
            </v-btn>


                      
        </v-toolbar>
        <v-divider />

        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :items="customer"
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

            <!-- Image avatar -->
            <v-avatar height="45px" width="45px">
              <img
                :src="root + item.imagePath"
                alt="No image"
                height="70px"
                width="100%"
              />
            </v-avatar>
          </template>

          <template v-slot:item.action="{ item }">

            <!-- Edit Button -->
            <v-btn
              x-small
              icon
              @click.stop="
                $router.push({
                  name: 'update-customer',
                  params: { customerId: item.id }
                })
              "
            >
              <Edit class="iconclass" />
            </v-btn>

            <!-- Delete Button -->
            <v-btn style="margin-left: 20px" x-small icon  @click.stop="delItem(item.id, path)">
              <Delete class="iconclass" />
            </v-btn>

          </template>

        </v-data-table>
      </v-card>

      
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="800px"
        >
          <v-card outlined style="border-radius:12px">
            
            <v-toolbar dense flat>
              <v-card-title>
                <span class="mt-3 mb-3"> Create customer</span>
              </v-card-title>
              <v-spacer />
              <v-btn
                icon
                dark
                @click="dialog = false"
                color="red"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <v-layout row justify-center my-3>
                  
                  <v-flex xs12 sm4 md4 lg4 pa-2>
                    <v-layout column wrap justify-center my-3>
                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('customerName')"
                          v-model="item.customerName"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('phoneNumber')"
                          v-model="item.phoneNumber"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('country')"
                          v-model="item.country"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      

                        
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm4 md4 lg4 pa-2>
                    <v-layout column wrap justify-center my-3>
                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('country_state')"
                          v-model="item.state"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('city')"
                          v-model="item.city"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <v-text-field
                          dense
                          :label="$t('postalcode')"
                          v-model="item.postalcode"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm4 md4 lg4 pa-2>
                    <v-layout column wrap justify-center my-3>
                      <v-flex pa-2>
                        <v-text-field
                          dense
                          :label="$t('latitude')"
                          v-model="location[0]"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex pa-2>
                        <v-text-field
                          dense
                          :label="$t('longtude')"
                          v-model="location[1]"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md7 lg7 pa-2>
                        <input
                          type="file"
                          style="display:none"
                          @change="onCustomerFileSelected"
                          ref="fileInput1"
                        />
                        <v-btn
                          text
                          class="text-capitalize"
                          @click="$refs.fileInput1.click()"
                        >
                          <v-icon>attachment</v-icon>
                          {{ $t("customer-picture") }}
                        </v-btn>
                        <em class="text-capitalize primary--text">
                          <v-icon v-if="profileDone">done</v-icon>
                          {{ inventoryInfo }}
                        </em>
                      </v-flex>
                      
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue darken-1"
                text
                @click="save"
              >
                {{ $t("save") }}
              </v-btn>

              <v-btn 
              class="mr-2"
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Delete from "@/assets/icons/delete_icon.svg"
import Edit from "@/assets/icons/edit_icon.svg"
import { API_ROOT } from "@/api";


import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
import customerMap from "./customer_map";
export default {
  name: "UserList",
  components: {
    customerMap,
    Delete,
    Edit
  },
  data() {
    return {
      location: [0, 0],
      item: {
        location: []
      },
      root: API_ROOT + "/Containers/customer/download/",
      selectedFileInventory: "",
      userInventoryImageUrl: "",
      inventoryInfo: "",
      profileDone: false,
      pathContainer: path.container,
      inputRule: [v => !!v || "This field is required"],
      search: "",
      path: path.customer,
      resource: api,
      dialog: false,
      items: [],
      headers: [
        {
          text: this.$t("image"),
          value: "image"
        },
        {
          text: this.$t("customerName"),
          value: "customerName"
        },
        {
          text: this.$t("phoneNumber"),
          value: "phoneNumber"
        },
        {
          text: this.$t("country"),
          value: "country"
        },
        {
          text: this.$t("country_state"),
          value: "state"
        },
        {
          text: this.$t("city"),
          value: "city"
        },
        {
          text: this.$t("postalcode"),
          value: "postalcode"
        },
        {
          text: this.$t("action"),
          align: "center",
          value: "action"
        }
      ]
    };
  },
  computed: {
    ...mapState("inventory", ["customer", "inventoryImage"])
  },
  mounted() {
    this.loadData();
  },
  methods: {
    ...mapActions("inventory", [
      "getCustomer",
      "getProfileImage",
      "deleteItem","postData"
    ]),
    save() {
      if (this.$refs.form.validate()) {
        if (this.profileDone) {
          this.uploadPicture(this.selectedFileInventory);
        }
        this.item.location = [
          parseFloat(this.location[0]),
          parseFloat(this.location[1])
        ];
        // TODO remove api call
        this.postData([this.item, path.customer])
          .then(() => {
            this.$router.push({ name: "customer-list" });
             this.loadData();
             this.dialog=false
            this.$notify({
              type: "success",
              title: this.$t("create category"),
              message: `${this.$t("category")} ${this.$t(
                "registered Successfully"
              )}`
            });
          })
          .catch(err => {
            this.showErrors(err);
          });
      }
    }, 
    //Add new customer
    createNewCustomer(){
     this.dialog=true
    },
    // eslint-disable-next-line no-unused-vars
    onCustomerFileSelected(event) {
      this.selectedFileInventory = event.target.files[0];
      this.userInventoryImageUrl = URL.createObjectURL(
        this.selectedFileInventory
      );
      this.inventoryInfo = this.selectedFileInventory.name;
      this.profileDone = true;
    },
    async uploadPicture(file) {
      const formData = new FormData();
      let name = this.item.phoneNumber;
      this.item.imagePath = name;
      formData.append("Image", file, name);
      await api.upload("customer", formData, this.pathContainer);
    },
    async loadData() {
      this.items = [];
      this.getCustomer().then(res => {
        res;
       
        for (let i = 0; i < this.customer.length; i++) {
            // eslint-disable-next-line no-console
            this.items.push({
              id: this.customer[i].id,
              customerName: this.customer[i].customerName,
              phoneNumber: this.customer[i].phoneNumber,
              imagePath: this.inventoryImage,
              country: this.customer[i].country,
              state: this.customer[i].state,
              city: this.customer[i].city,
              postalcode: this.customer[i].postalcode,
              location: this.customer[i].location
            });
        
        }
      });
    },
    async delItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        this.deleteItem([id, path]).then(() => {
          this.$notify({
            type: "danger",
            title: "Deleted!",
            message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
              "successfully"
            )}.`
          });

          this.loadData();
        });
      }
    }
  }
};
</script>

<style scoped>

.iconclass {
  height: 20px;
  width: 20px;
  margin-left: 10px;
}
</style>

/* eslint-disable no-console */
import { api } from "@/api";

const TableMixinWithVuex = {
    data () {
        return {
            currentpage: 1,
            itemsperpage: 10,
            filteroptions: {
                where: {},
            }
        }
    },

    computed: {
      pagefilter(){
        return  {
         ...this.filteroptions,
          limit: this.itemsperpage, 
          skip: (this.currentpage - 1) * this.itemsperpage
      }
      }
    },

    watch: {

        // Search method which is going to be excuted whenever the serach variable is changed
        search(newval) {
            //cascade the where filter if its the first request
            this.filteroptions.where[this.searcpropertry] = { like: newval }
            this.localFetchListData();
        }
    },

    created() {
        // load initial data when the page is loaded
        this.localFetchListData();
      },

      methods: {

        async pageChanged(page){
            this.currentpage = parseInt(page)
            console.log(this.pagefilter)
            this.localFetchListData()
        },

        // Main data pool
          async localFetchListData(){
              this.setloading(true)
            await this.fetchListData(this.pagefilter)
            .then ( res => {
                res;
                this.setloading(false)
            })
            .catch( e => {
                e;
                this.setloading(false)
            })
          },

        // Delete an item method which is common for all the 
        // list pages becuase it does't need any state

         async deleteItem(id, path){
                const confirmed = await this.$confirm(this.$t("are_you_sure"), {
                  buttonTrueText: this.$t("yes"),
                  buttonFalseText: this.$t("no"),
                });
                if (confirmed) {
                  await api.remove(id, path)
                  .then( res => {
                      res;
                      this.$notify({
                        type: "danger",
                        title: "Deleted!",
                        message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
                          "successfully"
                        )}.`,
                      });
                      this.localFetchListData()
                  })
                  .catch( e => {
                      // notification when error occurs in the deleting process
                        e;
                    this.$notify({
                        type: "danger",
                        title: "Unable to Delete!",
                        message: `${this.resourceName} is Not deleted, please try again!`,
                      });

                  })
                 
                }
              
         }
      }

}

export default TableMixinWithVuex;
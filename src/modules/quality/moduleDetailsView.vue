<template>
   <div>
     
     <v-slide-x-transition  >
  
  <v-card
  outlined
  class="ml-4 mt-4 mr-5"
  >

  <v-row>
  <v-col>

    <v-form
      ref="form"
      v-model="form"
      class="pa-4 pt-6"
      >

    

  <v-text-field
        v-model="addformdata.modulename"
        :rules="[ rules.length(4)]"
        outlined
        dense
        label="Step name"
      ></v-text-field>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="addformdata.date"
        
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          
          <v-col>

            <v-text-field
            flat
            outlined
            dense
            v-on="on"
            v-model="addformdata.date"
            label="Pick a date"
            ></v-text-field>
          <v-spacer />
          
          </v-col>
          
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>

        <v-flex >
          <v-row>
            <v-card width="200" flat wid>
              <v-select
              :items="this.defectImages"
              color="grey"
              item-text="name"
              item-value="name"
              v-model="addformdata.imageurl"
              @change="imagechooserChanged"
              label="Choose image"
              style="margin-left: 10px;"
              required
              outlined
              dense
            />
            </v-card>
            <input
                type="file"
                id="csv_file"
                style="display:none"
                ref="csvfileInput"
                name="csv_file"
                @change="loadImage($event)"
              />

            <v-btn
            small
            color="green"
            icon
            @click.stop="$refs.csvfileInput.click()"
            style="margin-top: 5px; margin-left: 10px"
              >
              
              <v-icon class="mx-2">mdi-cloud-upload</v-icon>
              </v-btn>            
          </v-row>
        </v-flex>

       

         <v-btn class="ma-2" tile small outlined color="#cfa306" @click=" this.validateCreateModule" :disabled="!form">
      <v-icon left>mdi-upload</v-icon> Create a module
    </v-btn>
    </v-form>
<!-- End of v-form -->
  </v-col>
    <v-col>
     <Editor :canvasWidth="500" :canvasHeight="400" ref="editor"/>

      <v-row>
        <v-spacer />

         <v-btn class="ma-2" tile small outlined color="success" @click=" this.pen">
      <v-icon left>mdi-pencil</v-icon> Pen
    </v-btn>

        <v-btn class="ma-2" tile small outlined color="info" @click=" this.redo">
      Redo 
    </v-btn>

        <v-btn class="ma-2" tile small outlined color="pink" @click=" this.undo">
      Undo
    </v-btn>

        <v-spacer />
      </v-row>
      
    </v-col>

    <v-col>

      <div>
    <v-container
      id="scroll-target"
      style="max-height: 400px; max-width: 400px;"
      class="overflow-y-auto"
      color="traprimary"
    >
      <v-col
        v-scroll:#scroll-target="onScroll"
        align="left"
        justify="left"
        style="height: 1000px"
      >


       
       <v-list-item v-for="item in this.defects" :key="item.id">

            <v-list-item-action>
              <label class="checkboxcontainer">
                    <input type="checkbox" @click="toggle1(item.id)" />
                    <span class="checkmark"></span>
                  </label>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{item.name_english}}</v-list-item-title>
              <v-list-item-subtitle>{{item.name_amharic}}</v-list-item-subtitle>
            </v-list-item-content>

        </v-list-item>


      </v-col>
    </v-container>
  </div>


      

    </v-col>

  </v-row> 

  </v-card>
  </v-slide-x-transition>

<v-card outlined class="ml-5 mt-7 mr-7 mb-7">
  <v-data-table
    :items="this.modules"
    :headers="headers"
   >

   <template v-slot:item.defects="{ item }">
            {{ item.defects.length}}
          </template>

    <template v-slot:item.imageurl="{ item }">
            <v-btn
            text
            small
            color="teal"
            >
            <v-icon class="mx-2">image</v-icon>
            </v-btn>
          </template>

    <template v-slot:item.action="{ item }">
            <v-btn
            text
            small
            color="red"
            @click.stop="local_deleteModule(item.id)"
            >
            <v-icon class="mx-2">delete</v-icon>
            </v-btn>
          </template>

  </v-data-table>
</v-card>
   </div>
</template>

<script>
import Editor from './src/Editor.vue';
import { mapState, mapActions } from 'vuex';
import { path, API_ROOT } from  "@/api";

export default {
  name: "moduleDetails",
  components: { 
    Editor,
  },  
  
  data() {
    return {
      form: null,
      offsetTop: 0,
      localdefects: [],
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      page: 2,
      pageCount: 0,
      itemsPerPage: 10,
      image: undefined,
      canvasWidth: 500,
      canvasHeight: 500, 
      choosenDefects: [],
      imageUrl: API_ROOT +  path.downloadImages,
      imagechoosen: "Half_sleeve_shirt_Back.jpg",
      rules: {
        email: v => (v || '').match(/@/) || 'Please enter a valid email',
        length: len => v => (v || '').length >= len || `Invalid character length, required at list ${len}`,
        required: v => !!v || 'Required',
      },
      steps: {
         moduleid: "",
         ownerid: "",
         imageurl: "",
         defects: [],
      },
      styleid: "",
      addformdata: {
        modulename: "",
        OperationBulletinId: this.$route.params.styleId,
        imageurl: Date.now().toString().split(" ").join("") +  "Half_sleeve_shirt_Back.jpg" ,
        date: new Date().toISOString().substr(0, 10),
        defects: []
      },
      headers: [
          {
            text: 'Module Name',
            align: 'start',
            sortable: false,
            value: 'modulename',
          },
          { text: 'Date created', value: 'date' },
          { text: 'Number of Defects', value: 'defects' },
          { text: 'Image URL', value: 'imageurl' },
          { text: 'Action', value: 'action' },
        ],
        desserts: [],
        selectedImage: null,
        local_defectimages: null,
        stylenames: [],
        stylenametoupdate: "",
        moduleidtoupdate: "",
        styleidtoupdate: "",
        styletoupdate: {
          styleid: "",
          ownerid: "",
          date: "",
          name: "",
          modules: [],
          id: ""
        }
    }
  },

   mounted(){
    this.local_fetchModules()
    this.local_fetchDefects()
    this.local_fetchdefectImages()
    // this.local_fetchAllStyles()
    this.$refs.editor.set(this.$refs.editor.mode,this.$refs.editor.options);
    this.$refs.editor.set('freeDrawing', { stroke: 'red'})
    this.$refs.editor.setBackgroundImage(this.imageUrl + "Half_sleeve_shirt_Back.jpg");
    
},

  
  computed: {
  
    ...mapState('defects',[
        'defects',
        'defectImages',  
        'modules',
    ]),

    // ...mapState('module',[
    //       'modules'        
    // ]),

  },


  methods: {

     ...mapActions('defects', [
        'fetchDefects',
        'fetchdefectImages',
        'uploadFiletoServer',
        'fetchModules',
        'deleteModule',
        'addModule',
        'uploadMainDefectImages'
      ]),
      

       onScroll (e) {
        this.offsetTop = e.target.scrollTop
      },

      redo(){
        this.$refs.editor.redo()
      },

      pen(){
        this.$refs.editor.set('freeDrawing', { stroke: 'red'})
      },

      undo(){
          this.$refs.editor.undo()
      },

      async loadImage(e){
          // var vm = this;
          if (window.FileReader) {
            var file = e.target.files[0];
            let formData = new FormData();
            formData.append('file', file);
            try {
              await this.uploadMainDefectImages(formData);
              await this.local_fetchdefectImages()
            }
            catch(e){
            // eslint-disable-next-line no-console
              console.log(e)
            }
          } else {
            alert("FileReader are not supported in this browser.");
          }
      },

      async local_fetchModules(){
        
        // eslint-disable-next-line no-console
        console.log(this.$route.params.styleId)
        await this.fetchModules(this.$route.params.styleId)
      },

      async local_deleteModule(id){
        const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
            });
            if (confirmed) {
              await this.deleteModule(id)
              await this.local_fetchModules();
            }
        
      },

      toggle1(e){
          const idx = this.addformdata.defects.indexOf(e);

          if(idx == -1) this.addformdata.defects.push(e)
          else this.addformdata.defects.splice(idx, 1);
        
        // eslint-disable-next-line no-console
        console.log(this.addformdata.defects)
      },

      showtrial(){
        this.card1 = !this.card1
      },

    imagechooserChanged(){
      this.$refs.editor.setBackgroundImage(this.imageUrl + this.addformdata.imageurl);
    },

    async local_fetchDefects(){
      await this.fetchDefects()
    },

    async uploadaFile(tempurl){
      var blob = this.$refs.editor.saveImage();
      // const fd = new FormData()
      // fd.append('image', blob, tempurl)
      // // eslint-disable-next-line no-console
      // console.log(blob)
      await this.uploadFiletoServer({tempurl: tempurl, dataURI: blob})
    },


    async validateCreateModule() {
        var tempurl = Date.now().toString().split(" ").join("") +  this.addformdata.imageurl ;
        this.uploadaFile(tempurl)
        this.addformdata.imageurl = tempurl
        // eslint-disable-next-line no-console
        console.log(this.addformdata)
        await this.addModule(this.addformdata).then(r=>{
          if(r){
            this.$notify({
                  type: "success",
                  title: "Success",
                  message: `module added successfully`
                });
            this.local_fetchModules()
          }
          else {
            this.$notify({
                  type: "danger",
                  title: "Failed",
                  message: `module failed to add`
                });
          }
        })
       
      },

     async local_fetchdefectImages(){
      // eslint-disable-next-line no-unused-vars
      await this.fetchdefectImages()
  }
  },

}
</script>

<style scoped>
div.drawingfield {
  margin-left: 0%;
  margin-right: 100%;
  margin-bottom: 2%;
}

.elevation-1 {
  margin-left: 1%;
  margin-right: 1%;
  
}

.upper-card {
  margin-bottom: 5%;
  margin-top: 2%;
  padding: 5%;
  width: 100%;
  margin-left: 3%;
  margin-right: 3%;
}

.upperdiv {
  margin-right: 5%;
}

div.btntool {
  margin-right: 10%;
}

.cardrow {
  padding-right: 50px;
  padding-left: 50px;
  padding-top: 10px;
  padding-bottom: px;

}

.botomcard {
  margin-bottom: 50px;
  justify-items: center;
  justify-items: center;
  align-content: center;
  align-items: center;
}
.checkboxcontainer {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkboxcontainer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkboxcontainer:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkboxcontainer input:checked ~ .checkmark {
  background-color: #f38d18;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkboxcontainer input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkboxcontainer .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
<template>
    <!-- clipped-left   -->
  <v-app-bar
    flat
    app
    clipped-right
    dense
    style="border-bottom: 1px solid #f6f7f9; background-color: primary"
  >
    <v-app-bar-nav-icon @click.stop="toggleNavBar" />
    <v-toolbar-title>
      <img src="@/assets/abesha.png" class=" ml-4 mt-1" height="40px" width="55px" alt="alt" />
      <span style="color:rgb(90, 168, 214);font-style: italic;">HABESHA</span>
    </v-toolbar-title>
    <v-spacer />
    <v-spacer></v-spacer>
    <!-- <v-badge
      v-if="attendanceLists.length > 0"
      :content="attendanceLists.length"
      :value="9"
      color="red"
      overlap
      style="margin-right: 10px"
    >
      <contacts
        class="iconclass"
        @click="$router.push({ name: 'attendance-settlement' })"
      />
    </v-badge> -->

    <!-- <v-btn icon @click="$router.push({ name: 'dashboard' })">
      <v-icon>home</v-icon>
    </v-btn> -->

    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="250"
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="iconclass" v-bind="attrs" v-on="on"
            >notifications</v-icon
          >
        </template>
    <perfect-scrollbar>
        <v-card class="notifiCard">
          <v-list>
            <v-list-item v-for="ntf of notifications" :key="ntf.id" class="listbtn">
                <v-list-item-icon><notification class="iconclass iconFilter"  /></v-list-item-icon>

              <div style="display: flex; flex-direction: column; margin-right: 20px">
                <v-list-item-title class="tittle">{{ntf.title}} </v-list-item-title>
                <v-list-item-subtitle class="subtittle">{{ntf.description}}</v-list-item-subtitle>
              </div>
              <v-spacer />

              <v-list-item-action>
                <arrowRight style="width: 20px; height: 20px" />
              </v-list-item-action>


            </v-list-item>
            <v-divider />
        </v-list>
        
        </v-card>
        </perfect-scrollbar>
      </v-menu>
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

    <v-switch
      label="አማርኛ"
      :input-value="currentLanguage === 'am'"
      color="primary"
      @change="toggleLanguage()"
      class="ml-4 mt-5"
    />
   <!-- <select :input-value="currentLanguage === 'en'" class="ml-5 mt-2 text--accent-4" style=" padding:5px; margin-left:10px;color:rgb(123, 128, 131);" @change="toggleLanguage()">
  <option value="am">አማርኛ</option>
  <option value="en">english</option>
  </select> -->

    <!-- <v-switch
      label="Dark"
      color="primary"
      @change="darkmode()"
      class="ml-4 mt-5"
    /> -->
   <select color="primary" class="ml-5 mt-2 text--accent-4" style="margin-left:10px; color:rgb(123, 128, 131); padding:5px" @change="darkmode()">
   <option value="light">light</option>
   <option value="dark">dark</option>
   </select>

    <v-btn icon @click="logout">
      <img src="@/assets/icons/logout-8-256.png" class="ml-4 mr-5" height="20px" style=" margin-top:1px; " width="30px" alt="alt" />
    </v-btn>

    <!-- <v-menu bottom left transition="slide-x-transition" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text rounded small v-on="on" class="text-capitalize">
          <v-avatar height="35" width="35" color="white" class="mx-1">
            <img src="@/assets/tesfa.jpg" alt="alt" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-btn
            text
            class="primary--text text-capitalize"
            @click="$router.push({ name: 'my-profile' })"
          >
            <v-icon>person</v-icon>
            {{ $t("my_profile") }}
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            text
            rounded
            class="primary text-capitalize"
            @click="logout"
            >{{ $t("log_out") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-menu> -->
  </v-app-bar>
</template>


<script>
import { mapMutations } from "vuex";
import AccountService from "@/shared/services";
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
// import contacts from "@/assets/icons/contacts_icon.svg";
import notification from "@/assets/icons/notification.svg"
import arrowRight from "@/assets/icons/arrow-right.svg"
// import Logout from "/assets/icons/logout-8-256.png"

export default {
  name: "NavBar",
  data() {
    return {
      selectedLangue: '',
      dropdownLangue: ['English', 'አማርኛ'],
      menu: false,
      msgCount: 0,
      user: AccountService.getProfile(),
      profilePopupVisible: false,
      show: false,
    };
  },
  components: {
    // contacts,
    arrowRight,
    notification,
    // Logout
  },
  async created() {
    //get number of messages

    this.msgCount = (await api.all(path.contactUs)).count;
    this.setNotAttended();
  },
  computed: {
    notifications() {
      return this.$store.getters.getAttendance;
    },
    ...mapState("attendance", ["attendanceLists"]),
    ...mapState("notifications", ["notifications"]),
    ...mapState("core", ["currentLanguage", "appName"]),
  },
  methods: {
    ...mapActions("attendance", ["mapAttendance"]),
    setNotAttended() {
      this.mapAttendance(new Date());
    },
    goToUserProfilePage() {
      this.profilePopupVisible = false;
      this.$router.push({
        name: "user-profile",
      });
    },
    ...mapMutations("layout", ["toggleNavBar"]),
    ...mapMutations("core", ["toggleLanguage"]),

    logout() {
      AccountService.logout();
    },
    route(val) {
      this.$router.push({ name: val.route });
    },
    darkmode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>

<style scoped>
.btn {
  width: 100%;
}
.listbtn:hover {
  /* background-color: rgb(123, 128, 131);  */
  width: 100%;
}

.tittle {
  width: 12vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtittle {
  width: 12vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.listcomp {
  display: flex; 
  margin-right: 20px;
  justify-content: space-between;
}

.iconclass {
  width: 25px;
  height: 25px;
 }

.iconFilter {
   filter: invert(48%) sepia(79%) saturate(26%) hue-rotate(86deg)
    brightness(118%) contrast(119%);
 }

.notifiCard {
  height: 300px;
}

/* .iconclass:hover {
  width: 30px;
  height: 30px;
  padding: 3px;
  background-color: rgb(247, 241, 241);
  border-radius: 10px;
} */
</style>
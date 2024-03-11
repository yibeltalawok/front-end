<template>
  <v-navigation-drawer
    v-model="drawerStatus"
    app
    clipped
    :mini-variant.sync="mini"
    fixed
    width="260px"
    style="padding-right: 5px;"
    class="navdrawer"
  >
    <div class="profileContainer">
      <!-- <img class="profilePicture" src="@/assets/tesfa.jpg" @click="$refs.myprofile.click()"/> -->
      <v-img src="@/assets/tesfa.jpg" class="profilePicture" id="rounded-card">
        <v-btn
          :ripple="false"
          icon
          fab
          id="no-background-hover"
          style="postion:absolute; left: 22%; top: 20% "
          @click="$router.push({ name: 'my-profile' })"
        >
        </v-btn>
      </v-img>
      <div class="textview">
        <div class="tittletext">
          TesfamichalTesfamichalTesfamichalTesfamichal
        </div>
        <div class="subtittletext">admin</div>
      </div>
    </div>

    <v-divider />
    <perfect-scrollbar style="display: hidden">
      <!-- <v-list-item @click="$router.push({ name: 'dashboard' })">
              
                <v-icon style="margin-right: 10px" small>home</v-icon>
              <v-list-item-content >
                <v-list-item-subtitle>{{ $t("dashboard") }}</v-list-item-subtitle>
              </v-list-item-content>
         </v-list-item> -->

      <v-list-item @click="$router.push({ name: 'companyDashboard' })">
        <icon
          name="companyDashboard"
          style="width: 20%; margin-left: -15px"
        ></icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{
            $t("companyDashboard")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$router.push({ name: 'employeedashboard' })">
        <icon
          name="employeeDashboard"
          style="width: 20%; margin-left: -15px"
        ></icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{
            $t("employeedashboard")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$router.push({ name: 'qualitydashboard' })">
        <icon name="quality" style="width: 20%; margin-left: -15px"></icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{
            $t("Quality DashBoard")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="$router.push({ name: 'simulation' })">
        <icon
          name="simulation"
          style="width: 20%; margin-left: -15px"
        ></icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{
            $t("simulation")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list link dense>
        <v-expansion-panels style="padding-right: 8px" flat>
          <v-expansion-panel
            v-for="menu in menus"
            :key="menu.title"
            style="background-color: transparent"
          >
            <v-expansion-panel-header>
              <strong v-if="$roleIs(menu.allowedRoles)" class="grey--text">{{
                $t(menu.title)
              }}</strong>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <template v-for="item in menu.links">
                <v-list-item
                  :key="item.title"
                  v-if="$roleIs(item.allowedRoles)"
                  @click="$router.push({ name: item.route })"
                >
                  <v-list-item-icon>
                    <icon :name="item.icon" style="width: 20%"></icon>
                    <v-list-item-content>
                      <v-list-item-subtitle>{{
                        $t(item.title)
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item-icon>
                </v-list-item>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import AccountService from "@/shared/services";
import { mapState, mapMutations } from "vuex";
import { menusData } from "@/modules/menuData";
import icon from "./Icon";

export default {
  data() {
    return {
      drawer: true,
      user: AccountService.getProfile(),
      menus: [],

      mini: false,
    };
  },
  created() {
    this.menus = menusData;
  },
  computed: {
    ...mapState("core", ["currentLanguage", "appName"]),
    drawerStatus: {
      get() {
        return this.$store.state.layout.navDrawerToggle;
      },
      set(newValue) {
        this.$store.state.layout.navDrawerToggle = newValue;
      },
    },
  },
  components: {
    icon,
  },
  methods: {
    ...mapMutations("core", ["toggleLanguage"]),
    logout() {
    AccountService.logout();
  }
  },
};
</script>

<style scoped>
.ps {
  height: 80vh;
  overflow-x: hidden;
  overflow-y: hidden;
}

.profileContainer {
  height: 10vh;
  display: flex;
}

.profilePicture {
  width: 8vh;
  height: 8vh;
  margin: auto;
  border-radius: 10vh;
  margin-left: 5px;
  background-color: crimson;
}

.profilePicture .image {
  width: 8vh;
  height: 8vh;
}

.textview {
  display: flex;
  flex: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
}

.tittletext {
  font-size: 20px;
  width: 10vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subtittletext {
  width: fit-content;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 15px;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  color: white;
  font-size: 12px;
  font-weight: bold;
  background-color: rgb(240, 204, 44);
}
#no-background-hover::before {
  background-color: transparent !important;
}
#rounded-card {
  border-radius: 50%;
  width: 25px;
  height: 60px;
}
.iconclass {
  height: 25px;
  width: 25px;
  margin-left: 10px;
}
</style>

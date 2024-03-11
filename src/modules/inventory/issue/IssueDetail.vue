<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
        <v-toolbar dense flat>
          <p>Issue detail</p>
          <v-spacer />
        </v-toolbar>
        <v-divider></v-divider>
        <v-layout row justify-center>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              :label="$t('Full name')"
              outlined
              dense
              disabled
              :rules="inputRule"
              v-model="issueDetailData.fullName"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              :label="$t('Email')"
              outlined
              dense
              disabled
              :rules="inputRule"
              v-model="issueDetailData.email"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="issueDetailData.issueType"
              :label="$t('Issue type')"
              name="type"
              outlined
              dense
              disabled
              :rules="inputRule"
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-2>
            <v-text-field
              v-model="issueDetailData.issueCode"
              :label="$t('Issue code')"
              name="issueCode"
              outlined
              disabled
              dense
              :rules="inputRule"
            />
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 pa-2>
            <v-textarea
              rows="2"
              :label="$t('Reason')"
              v-model="issueDetailData.issueReason"
              outlined
              disabled
              :rules="inputRule"
            />
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
      </v-card>

      <br />
      <v-data-table
        :headers="headers"
        :items="itemData"
        item-key="id"
        style="border: Gainsboro 2px solid;"
      >
        <template slot="headerCell" slot-scope="props">
          <span class="table-header-text caption font-weight-bold">
            {{ $t(props.header.text) }}
          </span>
        </template>
      </v-data-table>

      <v-layout row justify-center class="mt-5 ml-3">
        <v-flex xs12 sm12 md4 lg4 pa-3 v-if="roleLogin === 'sk'">
          <v-card outlined class="rounded-card">
            <v-layout row justify-center>
              <h3 class="mt-2">Issue signature</h3>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row justify-center class="ma-3">
              <img
                style="display: block; width: 250px; height: 170px;"
                id="base64image"
                :src="
                  'data:image/jpeg;base64,' + issueDetailData.issueSignature
                "
              />
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2 v-if="roleLogin === 'sm'">
          <v-card outlined class="rounded-card">
            <v-layout row justify-center>
              <h3 class="mt-2">Store admin signature</h3>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row justify-center class="ma-3">
              <img
                style="display: block; width: 250px; height: 170px;"
                id="base64image"
                :src="
                  'data:image/jpeg;base64,' +
                  issueDetailData.storeManagerSignature
                "
              />
            </v-layout>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md4 lg4 pa-2 v-if="roleLogin === 'fi'">
          <v-card outlined class="rounded-card">
            <v-layout row justify-center>
              <h3 class="mt-2">Store admin signature</h3>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row justify-center class="ma-3">
              <img
                style="display: block; width: 250px; height: 170px;"
                id="base64image"
                :src="
                  'data:image/jpeg;base64,' + issueDetailData.financeSignature
                "
              />
            </v-layout>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md4 lg4 pa-2 v-if="roleLogin === 'gm'">
          <v-card outlined class="rounded-card">
            <v-layout row justify-center>
              <h3 class="mt-2">Store admin signature</h3>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row justify-center class="ma-3">
              <img
                style="display: block; width: 250px; height: 170px;"
                id="base64image"
                :src="
                  'data:image/jpeg;base64,' +
                  issueDetailData.generalManagerSignature
                "
              />
            </v-layout>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md4 lg4 pa-2 v-if="roleLogin === 'sk'">
          <v-card outlined class="rounded-card">
            <v-layout row justify-center>
              <h3 class="mt-2">Store admin signature</h3>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row justify-center class="ma-3">
              <img
                style="display: block; width: 250px; height: 170px;"
                id="base64image"
                :src="
                  'data:image/jpeg;base64,' + issueDetailData.storeSignature
                "
              />
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      roleLogin: '',
      headers: [
        {
          text: 'Inventory Name',
          value: 'inventoryName',
        },
        {
          text: this.$t('item num'),
          value: 'itemNumber',
        },
        {
          text: this.$t('bin card'),
          value: 'binCardNumber',
        },
        {
          text: this.$t('item name'),
          value: 'itemName',
        },
        {
          text: this.$t('total qt'),
          value: 'totalQuantity',
        },
      ],
      itemData: [],
      inputRule: [(v) => !!v || 'This field is required'],
    }
  },
  async created() {
    const { issueId } = this.$route.params
    const { roleLogin } = this.$route.params
    this.roleLogin = roleLogin

    this.getIssueDetail(issueId).then(() => {
      this.itemData = this.issueDetailData.items
    })
  },
  computed: {
    ...mapState('inventory', ['issueDetailData']),
  },
  methods: {
    ...mapActions('inventory', ['getIssueDetail']),
  },
}
</script>
<style scoped>
.rounded-card {
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
</style>

<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px;">
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
              :label="$t('search-category')"
            />
          </div>
          <v-spacer></v-spacer>
          <v-btn
            dense
            color="amber"
            class="text-capitalize white--text"
            @click="createCategory"
          >
            {{ $t('addNew') }}
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :items="category"
          item-key="id"
          :search="search"
          footer-props.items-per-page-text="`${$t('users')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{ $t(props.header.text) }}
            </span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small icon color="primary" @click="updateCategory(item.id)">
              <Edit style="height: 20px; width: 20px;" />
            </v-btn>
            <v-btn small icon color="red" @click="delItem(item.id, path)">
              <Delete style="height: 20px; width: 20px; margin-left: 20px;" />
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- =========== THE DIALOG ============== -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="400px">
          <v-card wrap outlined style="border-radius: 1px;">
            <v-app-bar color="amber">
              <v-card-subtitle v-if="this.create">
                <span style="color: white;">Create Category</span>
              </v-card-subtitle>

              <v-card-subtitle v-if="this.edit">
                <span style="color: white;">Update Category</span>
              </v-card-subtitle>

              <v-spacer />

              <v-btn icon dark @click="closeDialog" color="red">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>

            <!-- <v-card-text>
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <v-layout row justify-center my-3>
                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-layout column wrap justify-center my-3>
                      <v-flex xs12 sm12 md9 lg9 pa-2>
                        <v-text-field
                          :label="$t('date')"
                          placeholder="yyyy-mm-dd"
                          dense
                          outlined
                          v-model="item.date"
                          hide-details
                          name="date"
                          type="date"
                        />
                      </v-flex>
                      <v-flex xs12 sm12 md9 lg9 pa-2>
                        <v-text-field
                          dense
                          :label="$t('categoryName')"
                          v-model="item.categoryName"
                          outlined
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12 md9 lg9 pa-2>
                        <v-text-field
                          dense
                          :label="$t('createdBy')"
                          v-model="item.createdBy"
                          outlined
                          disabled
                          :rules="inputRule"
                        ></v-text-field>
                      </v-flex>

                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text> -->

            <CategoryPopup :item="this.item" />

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
                <v-btn small color="amber" text @click="save">
                  {{ $t('save') }}
                </v-btn>
              </div>
              <div v-if="this.edit">
                <v-btn small color="amber" text @click="update">
                  {{ $t('update') }}
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
import Delete from '@/assets/icons/delete_icon.svg'
import Edit from '@/assets/icons/edit_icon.svg'
import AccountService from '@/shared/services'
import { api, path } from '@/api'
import { tableMixin, csvDownloadMixin } from '@/shared/mixins'
import { mapActions, mapState } from 'vuex'
import CategoryPopup from './CategoryPopup'
export default {
  name: 'UserList',
  mixins: [tableMixin, csvDownloadMixin],
  components: {
    CategoryPopup,
    Delete,
    Edit,
  },
  data() {
    return {
      search: '',
      path: path.category,
      resource: api,
      searchField: 'categoryName',
      create: false,
      edit: false,
      dialog: false,
      updateDialog: false,
      categoryId: '',
      inputRule: [(v) => !!v || 'This field is required'],
      user: AccountService.getProfile(),
      item: {},
      headers: [
        {
          text: this.$t('date'),
          value: 'date',
        },
        {
          text: this.$t('categoryName'),
          value: 'categoryName',
        },
        {
          text: this.$t('createdBy'),
          value: 'createdBy',
        },
        {
          text: this.$t('action'),
          value: 'action',
        },
      ],
    }
  },
  computed: {
    ...mapState('inventory', ['category', 'itemById']),
  },

  mounted() {
    this.loadData()
  },

  created() {
    this.item.createdBy = this.user.fullName
  },
  methods: {
    ...mapActions('inventory', [
      'getCategory',
      'deleteItem',
      'postData',
      'getDataById',
      'updateData',
    ]),

    loadData() {
      this.getCategory()
    },
    createCategory() {
      this.create = true
      this.dialog = true
    },
    updateCategory(val) {
      this.edit = true
      this.categoryId = val
      this.dialog = true
      this.getDataById([this.categoryId, path.category]).then((res) => {
        res
        this.item = this.itemById
      })
    },
    closeDialog() {
      this.dialog = false
      this.create = false
      this.edit = false
    },
    async delItem(id, path) {
      const confirmed = await this.$confirm(this.$t('are_you_sure'), {
        buttonTrueText: this.$t('yes'),
        buttonFalseText: this.$t('no'),
      })
      if (confirmed) {
        this.deleteItem([id, path]).then(() => {
          this.$notify({
            type: 'danger',
            title: 'Deleted!',
            message: `${this.resourceName} ${this.$t('deleted')} ${this.$t(
              'successfully',
            )}.`,
          })

          this.loadData()
        })
      }
    },

    save() {
      this.postData([this.item, path.category])
        .then(() => {
          this.dialog = false
          this.getCategory()
          // this.$router.push({ name: "category-list" });
          this.$notify({
            type: 'success',
            title: this.$t('create category'),
            message: `${this.$t('category')} ${this.$t(
              'registered Successfully',
            )}`,
          })
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
    update() {
      this.updateData([this.item, path.category])
        .then(() => {
          this.dialog = false
          this.getCategory()
          // this.$router.push({ name: "category-list" });
          this.$notify({
            type: 'success',
            title: this.$t('create category'),
            message: `${this.$t('category')} ${this.$t(
              'registered Successfully',
            )}`,
          })
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
  },
}
</script>

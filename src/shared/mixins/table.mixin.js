import { buildFilter, buildSearchFilter } from "@/util";
import { mapMutations } from "vuex";

const debounce = require("lodash.debounce");


const tableMixin = {
  data() {
    return {
      searchable: true,
      totalItems: 0,
      items: [],
      loading: true,
      pagination: { skip: 0 },
      search: "",
      paginationShouldUpdate: true,
      searchStarted: false,
    };
  },
  created() {
    this.loadData();
  },

  watch: {
    pagination: {
      handler() {
        if (this.paginationShouldUpdate) {
          if (this.searchSupportsPagination) {
            if (this.search) {
              this.doSearch();
              return;
            }
          } else {
            this.search = "";
          }

          this.loadData();
        } else {
          this.paginationShouldUpdate = true;
        }
      },
      deep: true,
    },
    search() {
      if (this.searchSupportsPagination) {
        this.doSearch();
        return;
      }

      if (this.search) {
        if (!this.searchStarted) {
          this.paginationShouldUpdate = false;
          this.pagination.rowsPerPage = 0;
          this.pagination.page = 1;

          this.searchStarted = true;
        }

        this.doSearch();
      } else {
        // reset searchStarted
        this.searchStarted = false;

        this.paginationShouldUpdate = true;
        this.pagination.page = 1;
      }
    },
  },

  methods: {

    ...mapMutations("employee", [
      "setEmployee"
    ]),

    
    doSearch: debounce(async function s() {
      if (this.searchable) {
        if (this.searchField && this.search) {
          this.loadData(buildSearchFilter(this.searchField,
            this.search));
        } else {
          this.loadData();
        }
      }
    }, 500),
    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.$notify({
          type: "danger",
          title: "Deleted!",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`,
        });
        this.loadData();
      }
    },

    async loadData(instantFilters) {
      this.loading = true;
      const filters = {
        ...instantFilters,
        ...this.filter,
        ...buildFilter(this.pagination),
      };
      const path = this.path;
      const { rows, count } = await this.resource.all(path, filters);
      this.items = rows;

      // eslint-disable-next-line no-console
      // console.log(this.items);

      if (path == "/employees" && count > 0) {

        this.setEmployee(this.items)
      } else if (path == "/Jobs" && count > 0) {

        this.setJobsList(this.items)
      }

      this.totalItems = count;
      this.loading = false;

      if (path == "/performances") {

        this.calculatePerformance()
      }
    },
  },
};
export default tableMixin;

<template>
  <v-apps>
    <v-autocomplete
      auto-select-first
      :search-input.sync="search"
      clearable
      hide-details
      cache-items
      outlined
      dense
      :error-messages="errors.collect(name)"
      v-validate="'required'"
      required
      :box="box"
      :loading="loading"
      :label="label"
      :items="items"
      @keypress="keyPress"
      @focus="isFocused"
      v-model="model"
      :item-text="itemText"
      :item-value="itemValue"
      @input="passData"
      :name="name"
      @change="changed"
    >
      <template slot="no-data">
        <div class="no-data-template">
          <p class="mx-3 text-xs-center" v-if="!waiting">
            {{ noData }} " <strong class="red--text">{{ search }}</strong
            >"
          </p>
          <p class="mx-3 text-xs-center" v-if="waiting">
            <v-progress-circular
              :size="20"
              :width="2"
              indeterminate
              color="red"
              class="mx-3"
            />
          </p>
          <div class="text-xs-center" style="width:100%">
            <v-btn
              text
              block
              @click="showModal"
              class="primary--text text-capitalize"
              >{{ addNewBtn }}</v-btn
            >
          </div>
        </div>
      </template>

      <template slot="item" slot-scope="data">
        <div v-if="data.item === 'Add New'" style="width:100%">
          <v-btn
            text
            block
            @click="showModal"
            class="primary--text text-capitalize"
            >{{ addNewBtn }}</v-btn
          >
        </div>

        <div v-else>{{ data.item.name }}</div>
      </template>
    </v-autocomplete>
  </v-apps>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    label: String,
    name: String,
    solo: Boolean,
    box: Boolean,
    outline: Boolean,
    items: Array,
    noData: String,
    loading: Boolean,
    itemText: String,
    itemValue: String,
    addNewBtn: String
  },

  data() {
    return {
      search: null,
      isModalVisible: true,
      waiting: true,
      model: "",
      title: {}
    };
  },

  created() {
    this.items.push("Add New");
  },
  methods: {
    keyPress() {
      this.loading = true;
      this.lazySearch();
      this.waiting = true;
    },
    lazySearch: _.debounce(function() {
      this.loading = false;
      this.searching();
      this.waitIt();
    }, 500),
    waitIt: _.debounce(function() {
      this.waiting = false;
    }, 1000),

    isFocused() {
      this.loading = true;
      this.lazyLoad();
    },
    lazyLoad: _.debounce(function() {
      this.loading = false;
    }, 500),
    showModal() {
      this.$emit("onNewItem", this.isModalVisible);
    },
    searching() {
      this.$emit("search", this.search);
    },
    passData() {
      this.$emit("input", this.model);
    },
    changed() {
      this.$emit("selected", this.model);
    }
  }
};
</script>


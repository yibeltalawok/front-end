<template>
  <div>
    <div class="card-row">
      <div
        v-for="(card, index) in cards"
        :key="index"
        @mouseover="hoverCard(index)"
        @mouseout="hoverCard(-1)"
       
      >
      <div v-if="'employee' in card"  class="card">
        <!-- :src="rootpath + '/Containers/inventory/download/' + card.imagePath" -->
        <img
          class="card-image"
          :class="{ selected: isSelected(index) }"
          :src="
            rootpath +
            '/Containers/profilePictures/download/' +
            card.employee.profilePicture
          "
        />

        <div class="namecol">
          <div class="name">
            {{ card.employee.fullName }}
          </div>

          <div class="department">
            {{ card.employee.department }}
          </div>
        </div>

        <div class="rowcon">
          {{ card.employee.gender }}
        </div>

        <div class="rowcon">
          {{ card.dateAttended | date }}
        </div>

        <div class="rowcon">{{ card.lateMinutes }} mins late</div>

        <div
          class="rowcon-val"
          :class="{
            present: card.value == 'P',
            absent: card.value == 'A',
            permision: card.value == 'Pr',
          }"
          @click.stop="valueClicked(card)"
        >
          {{ card.value }}
        </div>

      </div>

      </div>
    </div>
  </div>
</template>

<script>
import { API_ROOT } from "@/api";

export default {
  name: "attendacneCard",
  props: ["cards"],
  data() {
    return {
      selectedCard: -1,
      rootpath: API_ROOT,
    };
  },

  methods: {
    hoverCard(selectedIndex) {
      this.selectedCard = selectedIndex;
    },

    isSelected(cardIndex) {
      return this.selectedCard === cardIndex;
    },

    valueClicked(item) {
      // eslint-disable-next-line no-console
      console.log("clicked");
      this.$emit("clicked", item);
    },
  },
};
</script>

<style>
.card-row {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;
  height: 550px;
}
.card-row::-webkit-scrollbar {
  display: none;
}

.present {
  color: #11a411;
}

.absent {
  color: rgb(233, 23, 23);
}

.permision {
  color: rgb(42, 137, 252);
}

.card {
  display: flex;
  height: 50px;
  width: 900px;
  min-width: 200px;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.3s, box-shadow 0.3s;
  margin-left: 30px;
  margin-right: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid green;
  font-size: 12px;
}
.card:hover {
  height: 55px;
  box-shadow: 10px 10px 30px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background-color: #acf4ac;
  color: green;
  font-size: 13px;
}
.card-image {
  transition: height 0.3s, opacity 0.3s;
  height: 30px;
  width: 30px;
  margin: 5px;
  border-radius: 40px;
}
.card-image.selected {
  height: 35px;
  width: 35px;
  border-radius: 40px;
  opacity: 0.3;
  box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.9);
  transform: rotate(-10deg);
}

.namecol {
  display: flex;
  flex-direction: column;
  width: 20%;
}

.name {
  font-size: 15px;
  margin-top: auto;
}

.department {
  font-size: 12px;
  margin-bottom: auto;
}

.rowcon {
  font-size: inherit;
  margin: auto;
}
.rowcon-val {
  font-size: inherit;
  margin: auto;
}
.rowcon-val:hover {
  font-size: inherit;
  margin: auto;
  font-weight: bold;
  cursor: pointer;
  color: rgb(230, 207, 80);
}
</style>
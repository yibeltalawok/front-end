<template>
  <v-container>
    <div class="card-row">
      <v-layout wrap row>
        <div
          class=" card"
          v-for="(card, index) in cards"
          :key="index"
          @mouseover="hoverCard(index)"
          @mouseout="hoverCard(-1)"
        >
          <img
            class="card-image"
            :class="{ selected: isSelected(index) }"
            :src="rootpath + '/Containers/product/download/' + card.imagePath"
          />

          <div class="card-footer1">
            <h5 class="card-author">{{ card.productName }}</h5>

              <div class="subtittletext">{{ card.category.categoryName }}</div>
<!-- 
            <label class="card-text">
              <strong>Stock :</strong>
              {{ card.stock }}
            </label> -->

            <div class="editingsection">
              <v-btn
                icon
                class="editbtn"
                @click="
                  $router.push({
                    name: 'product-detail',
                    params: { productId: card.id },
                  })
                "
              >
                <Eye class="deleteicon" />
              </v-btn>

              <v-btn
                icon
                class="editbtn"
                @click="
                  $router.push({
                    name: 'update-product',
                    params: { productId: card.id },
                  })
                "
              >
                <Edit class="deleteicon" />
              </v-btn>

              <v-btn icon class="editbtn" @click="deleteProduct(card.id)">
                <Delete class="deleteicon" />
              </v-btn>
            </div>
          </div>
        </div>
      </v-layout>
    </div>
  </v-container>
  <!-- :ref="`card_${index}`" -->
</template>

<script>
import Delete from '@/assets/icons/delete_icon.svg'
import Eye from '@/assets/icons/eye_icon.svg'
import Edit from '@/assets/icons/edit_icon.svg'
import { API_ROOT } from '@/api'

export default {
  name: 'productCardView',
  props: ['cards'],

  components: {
    Delete,
    Edit,
    Eye,
  },

  data() {
    return {
      selectedCard: -1,
      rootpath: API_ROOT,
    }
  },

  methods: {
    hoverCard(selectedIndex) {
      this.selectedCard = selectedIndex
    },
    isSelected(cardIndex) {
      return this.selectedCard === cardIndex
    },

    async deleteProduct(id) {
      const confirmed = await this.$confirm(this.$t('are_you_sure'), {
        buttonTrueText: this.$t('yes'),
        buttonFalseText: this.$t('no'),
      })

      if (confirmed) {
        this.$emit('deleteInv', id)
      }
    },
  },
}
</script>

<style scoped>
.card-row {
  overflow-x: auto;
  display: flex;
}
.card-row::-webkit-scrollbar {
  display: none;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  /* background-color: #ffffff; */
  height: 200px;
  width: 140px;
  min-width: 100px;
  max-width: 140px;
  margin: 20px;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  transition: height 0.3s, box-shadow 0.3s;
}
.card:hover {
  /*  height: 270px;
  box-shadow: 20px 20px 40px 0px rgba(0, 0, 0, 0.5); */
  transform: 1.5;
}
.card-image {
  /* center horizontally overflown image */
  position: absolute;
  left: -9999px;
  right: -9999px;
  margin: auto;
  transition: height 0.3s, opacity 0.3s;
  height: 50%;
  min-width: 100px;
}
.card-image.selected {
  height: 65%;
  opacity: 0.3;
}
.card-footer1 {
  position: absolute;
  bottom: 0;
  padding: 10px 15px;
}
.card-text {
  font-size: 14px;
  margin-left: 15px;
  width: 100%;
  color: rgba(0, 0, 0, 0.7);
}
.card-category {
  font-size: small;
}
.card-author {
  font-size: 14px;
  color: #bab096;
}
.editingsection {
  width: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.deleteicon {
  width: 17px;
  height: 17px;
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
</style>

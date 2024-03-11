<template>
    <div class="card-row">
      <v-layout wrap row>
        <v-flex
          class="d-flex flex-row card"
          xs12
          sm6
          md2
          lg2
          v-for="(card, index) in cards"
          :key="index"
          @mouseover="hoverCard(index)"
          @mouseout="hoverCard(-1)"
        >
          <img
            class="card-image"
            :class="{ selected: isSelected(index) }"
            :src="rootpath + '/Containers/inventory/download/' + card.imagePath"
          />

          <div class="card-footer">
            <h5 class="card-author">{{ card.inventoryName }}</h5>

            <h3 class="card-title">{{ card.category.categoryName }}</h3>
            <p class="card-text">
              {{ $t('by') }}
              <span class="card-author">{{ card.createdBy.fullName }}</span>
              {{ $t('by') }}
              <span class="card-author">{{ card.createdById.fullName }}</span>
            </p>

            <div class="editingsection">
              <v-btn
                icon
                class="editbtn"
                @click="
                  $router.push({
                    name: 'item-list',
                    params: { inventoryId: card.id },
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
                    name: 'update-inventory',
                    params: { inventoryId: card.id },
                  })
                "
              >
                <Edit class="deleteicon" />
              </v-btn>

              <v-btn icon class="editbtn" @click="deleteInventory(card.id)">
                <Delete class="deleteicon" />
              </v-btn>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-dialog v-model="deleteInventoryDialog" persistent width="800px">
        <v-card>
          <v-card-title class="headline amber lighten-2">
            <label style="color: white;">
              Deleteing "Inventory name ..." Inventory and All Items inside it!
            </label>
            <br />
            <label style="color: red;">Be sure can't undo!</label>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items-per-page="10"
              v-model="selected"
              :items="items"
            />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="deleteInventoryDialog = false">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="
                ;(deleteInventoryDialog = false), deleteInventoryAndItems()
              "
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  <!-- :ref="`card_${index}`" -->
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Delete from '@/assets/icons/delete_icon.svg'
import Eye from '@/assets/icons/eye_icon.svg'
import Edit from '@/assets/icons/edit_icon.svg'
import { API_ROOT } from '@/api'

// eslint-disable-next-line no-unused-vars
export default {
  name: 'inventoryCardView',
  props: ['cards'],

  components: {
    Delete,
    Edit,
    Eye,
  },

  computed: {
    ...mapState('inventory', ['items']),
  },

  data() {
    return {
      selectedCard: -1,
      rootpath: API_ROOT,
      inventoryName: '',
      deleteInventoryDialog: false,
      headers: [
        {
          text: this.$t('Inhouse date'),
          value: 'inHouseDate',
        },
        {
          text: this.$t('Invoice No'),
          value: 'invoiceNo',
        },
        {
          text: this.$t('UoM'),
          value: 'unitOfMeasure',
        },
        {
          text: this.$t('TQY'),
          value: 'totalQuantity',
        },
        {
          text: this.$t('Unit Price'),
          value: 'unitPrice',
        },
        {
          text: 'Available',
          value: 'available',
        },
      ],
      inventoryIdDeleted: '',
    }
  },

  methods: {
    ...mapActions('inventory', ['getItem', 'deleteInventoryAndItemsInsideIt']),

    hoverCard(selectedIndex) {
      this.selectedCard = selectedIndex
    },
    isSelected(cardIndex) {
      return this.selectedCard === cardIndex
    },

    async deleteInventoryAndItems() {
      this.deleteInventoryAndItemsInsideIt([
        this.inventoryIdDeleted,
        this.items,
      ])
      this.$notify({
        type: 'danger',
        title: 'Delete inventory',
        message: 'Inventory deleted Successfully',
      })
    },

    async deleteInventory(id) {
      this.inventoryIdDeleted = id
      await this.getItem(id)
      this.deleteInventoryDialog = true
    },
  },
}
</script>

<style scoped>
.card-row {
  overflow-x: auto;
  display: flex;
  padding-bottom: 50px;
  padding-left: 50px;

}
.card-row::-webkit-scrollbar {
  display: none;
}

.card {
  position: relative;
  background-color: #ffffff;
  height: 250px;
  width: 200px;
  min-width: 200px;
  margin: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  transition: height 0.3s, box-shadow 0.3s;
}
.card:hover {
  /* height: 270px;
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
  min-width: 100%;
}
.card-image.selected {
  height: 55%;
  opacity: 0.3;
}
.card-footer {
  position: absolute;
  bottom: 0;
  height: 130px;
  padding: 10px 15px;
}
.card-text {
  font-size: 14px;
  margin-left: 15px;
  width: 100%;
  color: rgba(0, 0, 0, 0.7);
}
.card-title {
  font-family: Serif;
}
.card-author {
  font-size: 14px;
  color: #bab096;
}
.editingsection {
  width: 170px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.deleteicon {
  width: 20px;
  height: 20px;
}
</style>

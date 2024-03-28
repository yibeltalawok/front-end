/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path, API_ROOT } from '@/api'
export default {
  namespaced: true,
  state: {
    categoryExist: false,
    updateIssuedItemValue: false,
    regiterIssueRequestResponse: false,
    category: [],
    inventory: [],
    inventoryImage: '',
    productImage: '',
    supplierImage: '',
    customer: [],
    items: [],
    purchased: [],
    fInventory: [],
    issue: [],
    employee: [],
    idInventory: {},
    unApprovedList: [],
    relatedItem: [],
    itemData: [],
    issueData: [],
    stateChart: [],
    supplier: [],
    itemById: {},
    supplierById: {},
    issueById: {},
    issueMonth: [],
    expirableSate: false,
    issueDetailData: [],
    productData: [],
    suplierData: [],
    dayActive: 'text-capitalize',
    monthActive: 'text-capitalize',
    yearActive: 'text-capitalize',
    currentInvId: '',
    tableItem: [],
    currentInventory: [],
    inventoryNames: [],
    itemNumbers: [],
  },
  mutations: {
    setcategoryExist(state, payload) {
      state.categoryExist = payload
    },
    setupdateIssuedItemValue(state, payload) {
      state.updateIssuedItemValue = payload
    },
    setInventoryName(state, payload) {
      state.inventoryNames = payload
    },
    setItemNumber(state, payload) {
      state.itemNumbers = payload
    },
    setCurrentInvId(state, payload) {
      state.currentInvId = payload
    },
    setCurrentInventoryData(state, payload) {
      state.currentInventory = payload
    },
    setregiterIssueRequest(state, payload) {
      state.regiterIssueRequestResponse = payload
    },
    setSuplier(state, payload) {
      state.suplierData = payload
    },
    setProduct(state, payload) {
      state.productData = payload
    },

    setCategories(state, payload) {
      state.category = payload
    },
    setInventory(state, payload) {
      state.inventory = payload
    },
    setProfile(state, profile) {
      state.inventoryImage = profile
      state.productImage = profile
    },
    setSupplierImage(state, profile) {
      state.supplierImage = profile
    },
    setCustomer(state, payload) {
      state.customer = payload
    },
    setSupplier(state, payload) {
      state.supplier = payload
    },
    setItem(state, payload) {
      state.items = payload
    },
    setChartData(state, payload) {
      state.stateChart = payload
    },
    setItemData(state, payload) {
      state.itemData = payload
    },
    setPurchased(state, payload) {
      state.purchased = payload
    },
    setFilteredInventory(state, payload) {
      state.fInventory = payload
    },
    setFilteredByIdInventory(state, payload) {
      state.idInventory = payload
    },
    changeExpState(state, payload) {
      state.expirableSate = payload
    },
    setIssue(state, payload) {
      // (state.issue = payload[0]), (state.issueData = payload[1])
      state.issue = payload[0]
      state.issueData = payload[1]
      //console.log(state.issueData[1])
    },
    setIssueFilter(state, payload) {
      state.issue = payload
    },
    setFilterDate(state, payload) {
      state.issue = payload
    },
    setDataById(state, payload) {
      state.itemById = payload
    },
    setSupplierById(state, payload) {
      state.supplierById = payload
    },
    setIssueById(state, payload) {
      state.issueById = payload
    },
    setEmployee(state, payload) {
      state.employee = payload
    },

    setRelatedItem(state, payload) {
      state.relatedItem = payload
    },

    addToCreateIssueTable(state, itemData) {
      let tempData = state.tableItem.map((x) => x.id)
      for (const iterator of itemData) {
        const index = tempData.indexOf(iterator.id)
        if (index < 0)
          state.tableItem.push({ ...iterator, index: state.tableItem.length })
      }
    },
    deleteSelecteIssueItem(state, index) {
      state.tableItem.splice(index, 1)
      let tempData = state.tableItem
      state.tableItem = []
      for (const [index, iterator] of tempData.entries()) {
        state.tableItem.push({ ...iterator, index: index })
      }
    },
    makeTableItemNull(state) {
      state.tableItem = []
    },
    setIssueDetail(state, payload) {
      state.issueDetailData = payload
      //console.log(payload)
    },
    addToCreateInventoryItem(state, item) {
      state.tableItem.push({ ...item, index: state.tableItem.length })
    },
  },

  actions: {
    async deleteInventoryAndItemsInsideIt({ commit }, data) {
      await api.remove(data[0], path.inventory)
      for (let i = 0; i < data[1].length; i++) {
        await api.remove(data[1][i].id, path.item)
      }
      commit(null, null)
    },
    async checkCategoryExistance({ commit }, nameCategory) {
      await api.all(path.category).then((res) => {
        for (let i = 0; i < res.rows.length; i++) {
          if (
            res.rows[i].categoryName.toString().toLowerCase() ===
            nameCategory.toString().toLowerCase()
          ) {
            commit('setcategoryExist', true)
            break
          }

          if (i === res.rows.length - 1) {
            commit('setcategoryExist', false)
          }
        }
      })
    },
    async getInventoryNames({ commit }) {
      let invNames = (await api.all(path.inventory)).rows
      let names = []
      for (let i = 0; i < invNames.length; i++) {
        names.push(invNames[i].inventoryName)
      }
      // console.log("======Inventory Name ====");
      commit('setInventoryName', names)
    },
    async getItemNumbers({ commit }) {
      let itemnums = (await api.all(path.item)).rows
      let nums = []
      for (let i = 0; i < itemnums.length; i++) {
        nums.push(itemnums[i].itemNumber)
      }
      // console.log('================= Item nums ===========')
      // console.log(itemnums)
      commit('setItemNumber', nums)
    },
    async fetchCurrentInventoryData({ commit }, data) {
      let filter = { where: { id: data } }
      await api.all(path.inventory, filter).then((res) => {
        // console.log(res.rows)
        commit('setCurrentInventoryData', res.rows)
      })
    },
    async regiterIssueRequest({ commit }, item) {
      let resp = false

      for (var i = 0; i < item.tableItem.length; i++) {
        if (
          parseInt(item.tableItem[i].maxSize) > 0 &&
          parseInt(item.tableItem[i].maxSize) <=
            parseInt(item.tableItem[i].available)
        )
          resp = true
        else {
          resp = false
          commit('setregiterIssueRequest', resp)
          break
        }
        if (i === item.tableItem.length - 1) {
          resp = await api.create({ item: item }, path.issueRequst)
          commit('setregiterIssueRequest', resp)
        }
      }
    },

    async registerPurchase({ commit }, itemData) {
      await api.create(itemData, path.purchased)
      commit(null, null)
    },

    async getProduct({ commit }) {
      let filter = { include: ['category'] }
      await api.all(path.product, filter).then((result) => {
        //console.log(result)
        commit('setProduct', result)
      })
    },

    async postProduct({ commit }, data) {
      api
      await api
        .create(data[0], path.product)
        .then((res) => {
          //console.log(res.length)
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
    async updateProduct({ commit }, data) {
      api
      await api
        .update(data[0], path.product)
        .then((res) => {
          // console.log(res.length)
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
    async postsuplier({ commit }, data) {
      // console.log(data[0].location)
      api
      await api
        .create(data[0], path.supplier)
        .then((res) => {
          // console.log(res.location)
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
    async updatesuplier({ commit }, data) {
      api
      await api
        .update(data[0], path.supplier)
        .then((res) => {
          //console.log(res.length)
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },

    async postData({ commit }, data) {
      await api
        .create(data[0], data[1])
        .then(() => {})
        .catch((err) => {
          this.showErrors(err)
        })
    },
    async postDataToInventory({ commit }, data) {
      //path.createInventoryAndItem
      await api.create(data, path.inventory).then((result) => {
        let currInvId = result.id
        commit('setCurrentInvId', currInvId)
        // commit('makeTableItemNull')
      })
    },
    async saveItemToInventory({ commit }, data) {
      await api.create(data, path.item).then(() => {
        console.log('Item added successfully.')
        commit('makeTableItemNull')
      })
    },
    async updateData({ commit }, data) {
      await api
        .update(data[0], data[1])
        .then(() => {})
        .catch((err) => {
          this.showErrors(err)
        })
    },

    async printItemQrCode({ commit }, qrCode) {
      await api
        .create(
          {
            value: qrCode,
            name: 'inventory-items',
          },
          '/printqrs/printInventoryItemsQrcode',
        )
        .then((resp) => {
          // eslint-disable-next-line no-console
          // console.log(resp);
          if (resp.status == 'success')
            window.open(
              API_ROOT + '/Containers/qrtoprint/download/' + resp.filename,
              '_blank',
            )
        })
    },

    async getDataById({ commit }, data) {
      await api.get(data[0], data[1]).then((item) => {
        commit('setDataById', item)
      })
    },
    async getSupplierById({ commit }, data) {
      await api.get(data[0], data[1]).then((res) => {
        commit('setSupplierById', res)
      })
    },
    async deleteItem({ commit }, data) {
      await api.remove(data[0], data[1])
    },

    async deleteInventory({ commit }, id) {
      return await api.remove(id, path.inventory)
    },

    async getDataByIdWithF({ commit }, data) {
      await api.get(data[0], data[1], data[2]).then((item) => {
        commit('setDataById', item)
      })
    },
    async getIssueByID({ commit }, data) {
      await api.get(data[0], data[1], data[2]).then((issue) => {
        commit('setIssueById', issue)
      })
    },

    async getEmployee({ commit }) {
      await api.all(path.employee).then((employee) => {
        commit('setEmployee', employee)
      })
    },

    async getIssue({ commit }, data) {
      let state = data[0]
      let role = data[1]
      let dateStart = data[2][0]
      let dateEnd = new Date(data[2][1])
      dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1))
        .toISOString()
        .substr(0, 10)

      let filter = { include: ['issuedBy', 'storeManager', 'inventory'] }
      let filterState = { include: ['issuedBy', 'storeManager', 'inventory'] }

      switch (role) {
        case 'sm':
          // filterState is default value
          if (state === 'New')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'pendding',
                and: [
                  { issueDate: { gte: dateStart } },
                  { issueDate: { lt: dateEnd } },
                ],
              },
            }
          else if (state === 'Approved')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'approved',
                and: [
                  { storeManaDate: { gte: dateStart } },
                  { storeManaDate: { lt: dateEnd } },
                ],
              },
            }
          else
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'rejected',
                and: [
                  { storeManaDate: { gte: dateStart } },
                  { storeManaDate: { lt: dateEnd } },
                ],
              },
            }
          break
        case 'fi':
          filterState = {
            include: ['issuedBy', 'storeManager', 'inventory'],
            where: { state: 'approved', storeManaDate: { neq: null } },
          }

          if (state === 'New')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'approved',
                state1: 'pendding',
                and: [
                  { storeManaDate: { gte: dateStart } },
                  { storeManaDate: { lt: dateEnd } },
                ],
              },
            }
          else if (state === 'Approved')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'approved',
                state1: 'approved',
                and: [
                  { financeDate: { gte: dateStart } },
                  { financeDate: { lt: dateEnd } },
                ],
              },
            }
          else
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state: 'approved',
                state1: 'rejected',
                and: [
                  { financeDate: { gte: dateStart } },
                  { financeDate: { lt: dateEnd } },
                ],
              },
            }
          break
        case 'gm':
          filterState = {
            include: ['issuedBy', 'storeManager', 'inventory'],
            where: { state1: 'approved', financeDate: { neq: null } },
          }

          if (state === 'New')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state1: 'approved',
                state2: 'pendding',
                and: [
                  { financeDate: { gte: dateStart } },
                  { financeDate: { lt: dateEnd } },
                ],
              },
            }
          else if (state === 'Approved')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state1: 'approved',
                state2: 'approved',
                and: [
                  { generalManadate: { gte: dateStart } },
                  { generalManadate: { lt: dateEnd } },
                ],
              },
            }
          else
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state1: 'approved',
                state2: 'rejected',
                and: [
                  { generalManadate: { gte: dateStart } },
                  { generalManadate: { lt: dateEnd } },
                ],
              },
            }
          break
        case 'sk':
          filterState = {
            include: ['issuedBy', 'storeManager', 'inventory'],
            where: { state2: 'approved', generalManadate: { neq: null } },
          }

          if (state === 'New')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state2: 'approved',
                state3: 'pendding',
                and: [
                  { generalManadate: { gte: dateStart } },
                  { generalManadate: { lt: dateEnd } },
                ],
              },
            }
          else if (state === 'Approved')
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state2: 'approved',
                state3: 'approved',
                and: [
                  { storeDate: { gte: dateStart } },
                  { storeDate: { lt: dateEnd } },
                ],
              },
            }
          else
            filter = {
              include: ['issuedBy', 'storeManager', 'inventory'],
              where: {
                state2: 'approved',
                state3: 'rejected',
                and: [
                  { storeDate: { gte: dateStart } },
                  { storeDate: { lt: dateEnd } },
                ],
              },
            }
          break
      }

      let issue = await api.all(path.issue, filter)
      let statePass = await api.all(path.issue, filterState)
      let approved = 0
      let rejected = 0
      let pendding = 0
      let issueList = []

      switch (role) {
        case 'sm':
          for (let i = 0; i < statePass.rows.length; i++) {
            if (statePass.rows[i].state == 'approved') {
              approved = parseInt(approved) + 1
            } else if (statePass.rows[i].state == 'rejected') {
              rejected = parseInt(rejected) + 1
            } else if (statePass.rows[i].state == 'pendding') {
              pendding = parseInt(pendding) + 1
            }
          }
          break
        case 'fi':
          for (let i = 0; i < statePass.rows.length; i++) {
            if (statePass.rows[i].state1 == 'approved') {
              approved = parseInt(approved) + 1
            } else if (statePass.rows[i].state1 == 'rejected') {
              rejected = parseInt(rejected) + 1
            } else if (statePass.rows[i].state1 == 'pendding') {
              pendding = parseInt(pendding) + 1
            }
          }
          break
        case 'gm':
          for (let i = 0; i < statePass.rows.length; i++) {
            if (statePass.rows[i].state2 == 'approved') {
              approved = parseInt(approved) + 1
            } else if (statePass.rows[i].state2 == 'rejected') {
              rejected = parseInt(rejected) + 1
            } else if (statePass.rows[i].state2 == 'pendding') {
              pendding = parseInt(pendding) + 1
            }
          }
          break
        case 'sk':
          for (let i = 0; i < statePass.rows.length; i++) {
            if (statePass.rows[i].state3 == 'approved') {
              approved = parseInt(approved) + 1
            } else if (statePass.rows[i].state3 == 'rejected') {
              rejected = parseInt(rejected) + 1
            } else if (statePass.rows[i].state3 == 'pendding') {
              pendding = parseInt(pendding) + 1
            }
          }
          break
      }

      issueList.push(issue.rows, [approved, pendding, rejected])
      commit('setIssue', issueList)
    },

    async updateIssuedItemValue({ commit }, issueId) {
      //get Single issue data
      let res = await api.all(path.issue, {
        fields: ['items'],
        where: { id: issueId },
      })

      //make object from issue to update item available size
      for (let i = 0; i < res.rows[0].items.length; i++) {
        let result = await api.all(path.item, {
          fields: ['available'],
          where: { id: res.rows[0].items[i].itemId },
        })

        api.update(
          {
            id: res.rows[0].items[i].itemId,
            available:
              parseInt(res.rows[0].items[i].issueSize) +
              parseInt(result.rows[0].available),
          },
          path.item,
        )
      }

      commit('setupdateIssuedItemValue', true)
    },

    async getState({ commit }, item) {
      // {
      //     issue = issue.rows

      // console.log(item[0])
      let filter =
        item[1] == 'state'
          ? {
              include: ['issuedBy', 'approvedBy', 'inventory'],
              where: {
                state: item[0],
              },
            }
          : {
              include: ['issuedBy', 'approvedBy', 'inventory'],
              where: {
                issueDate: { like: item[0] },
              },
            }
      let issue = {}
      await api.all(path.issue, filter).then((issueState) => {
        issue = issueState['rows']
        // console.log(issue)
      })
      commit('setIssueFilter', issue)
    },
    async getFilterDate({ commit }, item) {
      let year = new Date(item[0]).getFullYear().toString()
      let month = (new Date(item[0]).getMonth() + 1).toString()
      let filteredData = []
      if (item[1] == 'day') {
        let filter = {
          include: ['issuedBy', 'approvedBy', 'inventory'],
          where: {
            issueDate: { like: item[0] },
          },
        }
        await api.all(path.issue, filter).then((issueState) => {
          filteredData = issueState['rows']
        })
      } else if (item[1] == 'month') {
        let filter = {
          include: ['issuedBy', 'approvedBy', 'inventory'],
          where: {
            issueDate: { like: month },
          },
        }

        await api.all(path.issue, filter).then((issueState) => {
          filteredData = issueState['rows']
        })
      } else if (item[1] == 'year') {
        let filter = {
          include: ['issuedBy', 'approvedBy', 'inventory'],
          where: {
            issueDate: { like: year },
          },
        }

        await api.all(path.issue, filter).then((issueState) => {
          filteredData = issueState['rows']
        })
      }
      commit('setFilterDate', filteredData)
    },

    async filterByCategory({ commit }, categoryId) {
      let filter = {
        include: ['category', 'createdBy'],
        where: { categoryId: categoryId },
      }
      await api.all(path.inventory, filter).then((inventory) => {
        commit('setFilteredByIdInventory', inventory.rows)
      })
    },
    async getInventoryById({ commit }, inventoryId) {
      let filter = { include: ['category'] }
      await api.get(inventoryId, path.inventory, filter).then((inventory) => {
        commit('setFilteredByIdInventory', inventory)
      })
    },
    async getPurchased({ commit }) {
      let filter = { include: ['customer', 'inventory'] }
      await api.all(path.purchased, filter).then((purchased) => {
        commit('setPurchased', purchased)
      })
    },
    async getItem({ commit }, inventoryId) {
      let filter = {
        include: ['supplier', 'inventory'],
        where: { inventoryId: inventoryId },
      }
      await api.all(path.item, filter).then((item) => {
        commit('setItem', item.rows)
      })
    },
    async getChartData({ commit }, inventoryId) {
      await api
        .create({ inventoryId: inventoryId }, path.stateChart)
        .then((result) => {
          commit('setChartData', result)
        })
    },
    async getInventoryRelatedItem({ commit }, inventoryId) {
      let filter = {
        include: ['inventory'],
        where: { inventoryId: inventoryId },
      }
      await api.all(path.item, filter).then((item) => {
        // console.log(item.rows)
        commit('setRelatedItem', item.rows)
      })
    },
    getDataLists({ commit }, itemList) {
      let itemData = []
      let size = parseInt(itemList[1].totalQuantity)
      for (let i = 0; i < size; i++) {
        itemData.push({
          itemName: itemList[0],
          type: itemList[1].type,
          totalQuantity: itemList[1].totalQuantity,
          purchaseDate: itemList[1].purchaseDate,
          customorId: itemList[1].customorId,
          state: 'Working',
          description: '',
          inventoryId: itemList[1].inventoryId,
          location: '',
          gmnum: Math.floor(Math.random() * 10000 + 1),
          sivnum: Math.floor(Math.random() * 10000 + 1),
          code: 'item-' + '' + Math.floor(Math.random() * 1000 + 1),
          addition: '',
        })
      }
      commit('setItemData', itemData)
    },
    async getCategory({ commit }) {
      await api.all(path.category).then((category) => {
        commit('setCategories', category.rows)
      })
    },
    async getCustomer({ commit }) {
      await api.all(path.customer).then((res) => {
        commit('setCustomer', res.rows)
      })},

    async getSupplier({ commit }) {
      await api.all(path.supplier).then((result) => {
        commit('setSupplier', result.rows)
      })
    },

    async getInventory({ commit }) {
      let filter = { include: ['category', 'createdBy'] }
      await api.all(path.inventory, filter).then((inventory) => {
        commit('setInventory', inventory.rows)
      })
    },
    async approveIssue({ commit }, data) {
      await api
        .update(data, path.issue)

        .then(() => {
          this.$notify({})
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
    async getIssueDetail({ commit }, issueId) {
      await api
        .create({ issueId: issueId }, path.getIssueDetail)
        .then((result) => {
          commit('setIssueDetail', result)
        })
    },
    async getSupplierImage({ commit }, data) {
      // eslint-disable-next-line no-console

      return await api
        .getProfile(data[0], data[1])
        .then(
          // eslint-disable-next-line no-unused-vars
          (res) =>
            commit(
              'setSupplierImage',
              API_ROOT + '/containers/' + data[0] + '/' + data[1],
            ),
        )
        .catch(
          // eslint-disable-next-line no-unused-vars
          (err) =>
            commit(
              'setSupplierImage',
              API_ROOT + '/containers/profilePictures/download/defaultProfile',
            ),
        )
    },
    async getProfileImage({ commit }, data) {
      return await api
        .getProfile(data[0], data[1])
        .then(
          // eslint-disable-next-line no-unused-vars
          (res) =>
            commit(
              'setProfile',
              API_ROOT + '/containers/' + data[0] + '/' + data[1],
            ),
        )
        .catch(
          // eslint-disable-next-line no-unused-vars
          (err) =>
            commit(
              'setProfile',
              API_ROOT + '/containers/profilePictures/download/defaultProfile',
            ),
        )
    },
    async uploadItemData({ commit }, data) {
      // eslint-disable-next-line no-console

      return await api
        .create(data, path.item)
        .then(() => {
          this.$notify({})
        })
        .catch((err) => {
          this.showErrors(err)
        })
    },
  },
}

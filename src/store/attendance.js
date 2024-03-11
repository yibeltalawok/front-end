/* eslint-disable no-console */
/* eslint no-param-reassign:0 */
import { api, path } from '@/api'
import moment from 'moment'
export default {
  namespaced: true,
  state: {
    attendanceLists: [],
    employee: [],
    subDept: [],
    departments: [],
  },

  mutations: {
    setAttendance(state, attended) {
      state.attendanceLists = attended
    },
    setSelectItems(state, data) {
      state.employee = data.employee
      state.subDept = data.sudDept
      state.departments = data.dept
    },
  },
  actions: {
    SOCKET_Attendance_POST: async function ({ commit }, data) {
      let date = data.dateAttended
      let attended = []
      let attendance = []
      let today = moment(date).format('YYYY-MM-DD')
      let attFilter = {
        include: ['employee'],
        where: { dateAttended: { like: today }, value: { neq: 'P' } },
      }
      attendance = (await api.all(path.attendance, attFilter)).rows

      for (let iterator of attendance) {
        attended.push({
          idno: iterator.employee.idno,
          fullName: iterator.employee.fullName,
          department: iterator.employee.department,
          subDept: iterator.employee.subDept,
          joiningDate: iterator.employee.joiningDate,
          salary: iterator.employee.salary,
          id: iterator.employee.id,
        })
      }
      commit('setAttendance', attended)
      // eslint-disable-next-line no-console
    },

    async mapAttendance({ commit }, date) {
      let attended = []
      let attendance = []
      let today = moment(date).format('YYYY-MM-DD')
      let attFilter = {
        include: ['employee'],
        where: { dateAttended: { like: today }, value: { neq: 'P' } },
      }
      attendance = (await api.all(path.attendance, attFilter)).rows

      for (let iterator of attendance) {
        attended.push({
          idno: iterator.employee.idno,
          fullName: iterator.employee.fullName,
          department: iterator.employee.department,
          subDept: iterator.employee.subDept,
          joiningDate: iterator.employee.joiningDate,
          salary: iterator.employee.salary,
          id: iterator.employee.id,
        })
      }
      commit('setAttendance', attended)
      // eslint-disable-next-line no-console
    },

    async mangeChomboBox({ commit }) {
      let employees = (await api.all(path.employee)).rows
      let tempsb = []
      let tempd = []
      let subDept = []
      let departments = []
      let employee = []
      for (const iterator of employees) {
        employee.push({
          fullName: iterator.idno + '  [' + iterator.fullName + ']',
          id: iterator.id,
        })
        const indexsb = tempsb.indexOf(iterator.subDept)
        if (indexsb == -1) {
          subDept.push({
            subDept: iterator.subDept,
            id: iterator.id,
          })
          tempsb.push(iterator.subDept)
        }
        const indexd = tempd.indexOf(iterator.department)
        if (indexd == -1) {
          departments.push({
            department: iterator.department,
            id: iterator.id,
          })
          tempd.push(iterator.department)
        }
      }
      console.log(employee)
      console.log(subDept)
      console.log(departments)
      let items = { employee: employee, sudDept: subDept, dept: departments }
      commit('setSelectItems', items)
    },
  },
}

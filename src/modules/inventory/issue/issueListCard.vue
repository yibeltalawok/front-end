<template>
  <v-layout row justify-space-around>
    <div class="status-card">
      <span class="status-card__icon status-card__icon--success">
        <OK class="icons" />
      </span>
      <div class="status-card__content">
        <div class="title">Approved</div>
        <div class="number">{{ this.approved }}</div>
        <div class="description">Total Approved Issues</div>
      </div>
    </div>

    <div class="status-card">
      <span class="status-card__icon status-card__icon--danger">
        <cancel class="icons" />
      </span>
      <div class="status-card__content">
        <div class="title">Rejected</div>
        <div class="number">{{ this.rejected }}</div>
        <div class="description">Total rejected Issues</div>
      </div>
    </div>

    <div class="status-card">
      <span class="status-card__icon status-card__icon--info">
        <contacts class="icons" />
      </span>
      <div class="status-card__content">
        <div class="title">Pendding</div>
        <div class="number">{{ this.pendding }}</div>
        <div class="description">Total Pendding Issues</div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import OK from '@/assets/icons/ok_icon.svg'
import cancel from '@/assets/icons/cancel_icon.svg'
import contacts from '@/assets/icons/contacts_icons.svg'
export default {
  name: 'atCard',
  components: {
    OK,
    cancel,
    contacts,
  },
  computed: {
    ...mapState('inventory', ['issueData']),
  },
  data() {
    return {
      pendding: 0,
      approved: 0,
      rejected: 0,
    }
  },
  watch: {
    issueData: function (val) {
      this.approved = val[0]
      this.pendding = val[1]
      this.rejected = val[2]
    },
  },
}
</script>

<style scoped>
.icons {
  margin: 15px;
  transition: width 2s;
}

.icons:hover {
  transform: rotate(20deg);
  margin: 13px;
}

body {
  background-color: #eee;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.status-card {
  margin: 5px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: 500ms linear;
  border-radius: 2px;
  height: 90px;
}

.status-card:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin: 0px;
  background-color: #ffda82;
  color: white;
}

.status-card__content {
  padding: 5px;
  margin-left: 90px;
  color: inherit;
}

.status-card__icon {
  border-top-left-radius: 2px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 2px;
  float: left;
  width: 90px;
  height: 90px;
  text-align: center;
  font-size: 45px;
  line-height: 90px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
}

.number {
  font-weight: 700;
  font-size: 18px;
  color: inherit;
}

.title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  color: inherit;
}

.description {
  margin-top: 5px;
  font-size: 12px;
  font-weight: lighter;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
}

.status-card__icon--success {
  background-color: #33b86c;
}

.status-card__icon--info {
  background-color: #29b6f6;
}

.status-card__icon--warning {
  background-color: #ffd740;
}

.status-card__icon--danger {
  background-color: #ef5350;
}
</style>

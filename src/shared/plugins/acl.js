/* eslint no-param-reassign:0 */

import AccountService from "@/shared/services";

const acl = policy => {
  const policies = policy.split("|");
  const profile = AccountService.getProfile();
  if (!profile.permissions || !profile.permissions.length) {
    return false;
  }

  for (let i = 0; i < policies.length; i += 1) {
    const p = policies[i];
    if (profile.permissions.includes(p)) {
      return true;
    }
  }
  return false;
};

const roleIs = roles => {
  if (!AccountService.isAuthenticated()) {
    return false;
  }
  if (!roles || !roles.length) return true;

  const profile = AccountService.getProfile();
  if (profile && profile.role) {
    const current = profile.role;
    return roles.includes(current);
  }
  return false;
};
export default {
  install(Vue) {
    Vue.prototype.$acl = acl;
    Vue.prototype.$roleIs = roleIs;
    Vue.prototype.$authenticated = AccountService.isAuthenticated();
  }
};

import Request from "./request";
import { API_ROOT } from "./";
const api = {
  // user starts
  login(email, password, path) {
    return Request.post(`${API_ROOT}${path}/login`, {
      email,
      password,
    });
  },
  resetPassword(user, path, filter) {
    return Request.post(`${API_ROOT}${path}?access_token=${filter}`, {
      oldPassword: user.oldPassword,
      newPassword: user.newPassword
    });
  },
  logout(path) {
    return Request.post(`${API_ROOT}${path}/logout-user`);
  },
  //user ends

  // media container start
  downloadcsv(bucket, fileName, path) {
    // eslint-disable-next-line no-console
    console.log(`${API_ROOT}${path}/${bucket}/download/${fileName}`)
    return Request.get(`${API_ROOT}${path}/${bucket}/download/${fileName}`, {
      responseType: "blob",

    }).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  },

  download(bucket, fileName, path) {
    // eslint-disable-next-line no-console
    console.log(`${API_ROOT}${path}/${bucket}/download/${fileName}`)
    return Request.get(`${API_ROOT}${path}/${bucket}/download/${fileName}`, {
      responseType: "blob",
    }).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
    });
  },
  getProfile(path, fileName) {//
    let profile = Request.get(`${API_ROOT}/Containers/${path}/${fileName}`)
    //  // eslint-disable-next-line no-console
    //   console.log(Promise.resolve(profile.statusCode))
    return Promise.resolve(profile)
  },
  getRemote(path, date) {
    return Request.get(`${API_ROOT}${path}`, date)
  },

  checkFile(path, container, name) {
    return Request.get(`${API_ROOT}${path}/${container}/files${name}`);
  
  },
  removeFile(container, name, path) {
    return Request.delete(`${API_ROOT}${path}/${container}/files/${name}`);
  },
  upload(bucket, data, path) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return Request.post(`${API_ROOT}${path}/${bucket}/upload`, data, config);
  },
  //media container ends

  //data models start
  get(id, path, filter) {
    const q = filter ? `?filter=${JSON.stringify(filter)}` : "";
    return Request.get(`${API_ROOT}${path}/${id}${q}`);
  },
  put(path, data) {
    return Request.put(`${API_ROOT}${path}`, data);
  },
  getwithdata(value, data, path) {
    // const q = filter ? `?filter=${JSON.stringify(filter)}` : "";
    // eslint-disable-next-line no-console
    // console.log(`${API_ROOT}${path}?${value}=${data}`)
    return Request.get(`${API_ROOT}${path}`, {
      params: {
        [value]: data
      }
    });
  },
  getwithmoredata(path, filter) {
    return Request.get(`${API_ROOT}${path}`, filter);
  },
  all(path, filter) {
    const q = filter ? `?filter=${JSON.stringify(filter)}` : "";
    return Request.get(`${API_ROOT}${path}${q}`);
  },
  create(data, path) {
    // eslint-disable-next-line no-console
    console.log(`${API_ROOT}${path}`)
    return Request.post(`${API_ROOT}${path}`, data);
  },
  update(data, path) {
    return Request.patch(`${API_ROOT}${path}/${data.id}`, data);
  },
  remove(id, path) {
    return Request.delete(`${API_ROOT}${path}/${id}`);
  }};

export default api;

import Axios from "axios";

let urls = {
<<<<<<< HEAD
  test: "https://pure-plains-91675.herokuapp.com/https://chattapi.herokuapp.com/",
=======
  test: "https://chattapi.herokuapp.com/",
  // "test": "http://localhost:3001"
>>>>>>> 6785d826d2977d78f7ccd4eb103054518719f29d
};

const fetcher = Axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  baseURL: urls["test"],
  transformResponse: Axios.defaults.transformResponse.concat((data) => {
    if (data.message === "Authentication error.") {
      localStorage.removeItem("token");
      localStorage.removeItem("socketToken");
      window.location.replace("/signin");
      return false;
    }
    return data;
  }),
});

const token = localStorage.getItem("token");

fetcher.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default fetcher;

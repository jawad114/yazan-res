// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'http://api.laylamp.com:5000'
});

// https://layla-res.com 
// https://yazan-layla.onrender.com
// https://layla-marketplace.onrender.com

 
export default AxiosRequest;

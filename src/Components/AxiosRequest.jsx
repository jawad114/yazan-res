// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'http://localhost:5000'
});

// https://layla-marketplace.onrender.com
// https://api.laylamp.com
 
export default AxiosRequest;

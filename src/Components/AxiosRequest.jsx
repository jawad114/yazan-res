// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'https://api.laylamp.com'
});

// https://layla-marketplace.onrender.com
 
export default AxiosRequest;

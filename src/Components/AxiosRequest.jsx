// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'http://localhost:5002'
});

// https://yazan-s1ux.onrender.com
export default AxiosRequest;

// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'https://yazan-4.onrender.com'
});

export default AxiosRequest;


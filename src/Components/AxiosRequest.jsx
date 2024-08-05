// axiosInstance.js

import axios from 'axios';

const AxiosRequest = axios.create({
  baseURL: 'https://yazan-s1ux.onrender.com'
});
 
export default AxiosRequest;

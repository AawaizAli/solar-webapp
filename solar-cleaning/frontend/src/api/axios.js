// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'process.env.REACT_APP_BACKEND_URL', // Replace with your actual backend URL
});

export default instance;

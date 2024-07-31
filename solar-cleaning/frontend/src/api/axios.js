// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://hash1khn.pythonanywhere.com', // Replace with your actual backend URL
});

export default instance;

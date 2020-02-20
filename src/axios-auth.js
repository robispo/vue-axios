import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://robispo-vue-axios.firebaseio.com'
});

export default instance;

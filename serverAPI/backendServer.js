import axios from 'axios'
import { Platform } from 'react-native';

const server = axios.create({
  // baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'
  baseURL: 'http://35.247.157.227'
})

export default server
import axios from 'axios'

const server = axios.create({
    baseURL: 'http://10.0.2.2:3000',
    // baseURL: 'http://localhost:3000',
})

export default server
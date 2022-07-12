import axios from 'axios'

const poster = (url, body) => axios.post(url, body).then(res => res.data)
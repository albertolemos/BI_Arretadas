import axios from 'axios'

export default axios.create({
  baseURL: "https://arretadas-api.herokuapp.com",
  headers: {'Content-type': 'application/json'}
})

import axios from 'axios'

export default axios.create({
  baseURL: "https://arretadas-api-qdkzaivqyq-uc.a.run.app/",
  // baseURL: "https://arretadas-api.herokuapp.com",
  // baseURL: "http://localhost:3000",
  headers: { 'Content-type': 'application/json' }
})

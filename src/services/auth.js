import axios from "./api"

const AuthService = {
  async userLogin({ username, password }) {
    const response = await axios.post("/users/login/", {
      username,
      password,
    })
    return response.data
  },
  async getUser() {
    const { data } = await axios.get('/users/user/')
    return data
  },
  async getProfile() {
    const { data } = await axios.get('/user/')
    return data
  },
  
    
}

export default AuthService
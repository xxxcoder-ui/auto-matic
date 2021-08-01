import { http } from "gluegun";

const api = http.create({
  baseURL: "https://api.faucet.matic.network",
  headers: {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36"
  }
})

export default api;
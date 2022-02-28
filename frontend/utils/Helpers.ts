import { LoginDetails } from "../Interfaces"

export const handleLogin = (details: LoginDetails) => {
  localStorage.setItem("token", details.token ? details.token : "")
  localStorage.setItem("user", details.user ? details.user : "")
}
export const createHeader = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem("token")}`,
    }
  }
  return config;
}
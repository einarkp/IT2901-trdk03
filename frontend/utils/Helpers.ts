import { AxiosRequestConfig } from "axios"
import { LoginDetails, User } from "../Interfaces"
import { postRequest } from "./APIUtils"

/**
 * isTokenValid checks if there is an token stored in localStorage
 * and that is has not expired
 * @returns true if there is an valid token
 */
export const isTokenValid = (): boolean => {
  if(!localStorage.getItem("token")){return false} //check if store have token
  if(!JSON.parse(localStorage.getItem("token")!).expiry){return false} //check if token have expiry
  new Date(JSON.parse(localStorage.getItem("token")!).expiry) <= new Date() && {return: false} //expiry vs current Date check
  return true;
}
export const handleLogin = (details: LoginDetails) => {
  localStorage.setItem("token", details.token ? JSON.stringify({"token": details.token, "expiry": details.expiry}) : "")
  localStorage.setItem("user", details.user ? details.user : "")
}

/**
 * Tried to send a login request and set the current user and token 
 * if the request is succesfull
 * @returns if the request was succsesfull
 */
export async function autoLogin() {
  if(!localStorage.getItem("user")){return false;}
  localStorage.setItem("token", "")
  const storedLogin = {
    'password': localStorage.getItem("password"),
    'username': (JSON.parse(localStorage.getItem("user")!) as User).username,
  }
  return await postRequest("login/",
    storedLogin
  ).then((response) => {
    if (response) {
      localStorage.setItem("token", response.token ? JSON.stringify({"token": response.token, "expiry": response.expiry}) : "")
      return true
    }
    return false
  })
}

/**
 * Sends logout request to server.
 * Sets current user and token to empty in frontend if the logout
 * request was successful
 * @returns If the server logout request was successful
 */
export const handleLogout = () => {
  return postRequest("logout/").then(() => {
    localStorage.setItem("token", "")
    localStorage.setItem("user", "")
    return true
  }).catch(()=> {return false})
}

/**
 * Creates and axios config request with headers.
 * @returns config object
 */
export function createHeader(): AxiosRequestConfig {
  var config: AxiosRequestConfig = {};
  config.headers = {
    'content-type': 'application/json'
  }
  if (isTokenValid()) {
    config.headers.Authorization = `Token ${JSON.parse(localStorage.getItem("token")!).token}`;
  }
  return config;
}
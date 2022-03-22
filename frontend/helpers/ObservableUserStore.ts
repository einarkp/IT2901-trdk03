import { makeObservable, observable, action } from "mobx";
import { User } from "../Interfaces";
import { autoLogin } from "../utils/Helpers";

class ObservableUserStore {
  @observable activeUser: User | null = null;

  constructor() {
    makeObservable(this);
  }
  get loggedIn() {
    if (this.activeUser) {
      return true
    }
    return false
  }

  @action setActiveUser(newUser: User | null) {
    this.activeUser = newUser;
  }
  @action async tryAutoLogin() {
    await autoLogin().then((success) => {
      if(success){
        let userString: string | null = localStorage.getItem("user")
        try {
          userString && this.setActiveUser(JSON.parse(userString) as User)
        }
        catch (err) {
          //localStorage.setItem("user", "");
          //this.activeUser = null;
        }
      }
    })
  }
}

const userStore = new ObservableUserStore();
if (typeof window !== 'undefined') {
  userStore.tryAutoLogin();
} 

export default userStore;
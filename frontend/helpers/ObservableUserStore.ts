import { makeObservable, observable, computed, action, autorun } from "mobx";
import { User } from "../Interfaces";

class ObservableUserStore {
  activeUser: User | null = null;

  constructor() {
    makeObservable(this, {
      activeUser: observable,
      loggedIn: computed,
      setActiveUser: action,
    });
    autorun(() => console.log(this.activeUser));
  }
  get loggedIn() {
    if(this.activeUser){
      return true
    }
    return false
  }

  setActiveUser(newUser: User | null) {
    this.activeUser = newUser;
  }
}

const userStore = new ObservableUserStore();
export default userStore;
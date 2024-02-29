import { makeAutoObservable, toJS, runInAction } from 'mobx';

class StatusStore {
  y = 0;
  openIndex = -1;

  constructor() {
    makeAutoObservable(this);
  }

  setY = (y) => {
    runInAction(() => {
      this.y = y;
    });
  };

  setOpenIndex = (openIndex) => {
    runInAction(() => {
      this.openIndex = openIndex;
    });
  };
  
};

const actionsStore = new StatusStore();
export default actionsStore;

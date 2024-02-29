import { makeAutoObservable, toJS, runInAction } from 'mobx';

class AnswerStore {
  answerIndex = -1;
  answerCount = 0;
  answerList = [];

  constructor() {
    makeAutoObservable(this);
  };

  pervAnswer = () => {
    if (this.answerIndex - 1 < 0) return;
    runInAction(() => {
      this.answerIndex -= 1;
    })
  }

  nextAnswer = () => {
    if (this.answerIndex + 1 >= this.answerCount) return;
    runInAction(() => {
      this.answerIndex += 1;
    })
  }

  addAnswer = (text) => {
    runInAction(() => {
      let answers = this.answerList.slice(0);
      answers.push({ text });

      this.answerList = answers;
      this.answerCount += 1;
      this.answerIndex = this.answerCount - 1;
    })
  }

  updateLastAnswer = (text) => {
    runInAction(() => {
      let list = this.answerList.slice(0);
      list[list.length - 1].text += text;
      this.answerList = list;
    })
  }

  resetAnswerList = () => {
    runInAction(() => {
      this.answerList = [];
    })
  }

};


const answerStore = new AnswerStore();
export default answerStore;
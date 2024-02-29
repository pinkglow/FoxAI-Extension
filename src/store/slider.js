import { makeAutoObservable, toJS, runInAction } from 'mobx';

class SliderStore {
  // 鼠标指针的位置
  pointer = { x: 0, y: 0 };
  // 是否在加载中
  isLoading = false;
  // 是否在生成中
  isGenerating = false;

  // 用户输入的提示词
  userPrompt = "";

  // 用户选择内容
  selection = "";

  // 是否显示面板
  showPanel = false;

  // 展示答案
  showAnswer = false;

  // 是否展示动作
  showActions = false;

  showStarter = false;

  statusText = "";

  constructor() {
    makeAutoObservable(this);
  }

  setShowStarter = (showStarter) => {
    runInAction(() => {
      this.showStarter = showStarter;
    });
  }

  setStatusText = (statusText) => {
    runInAction(() => {
      this.statusText = statusText;
    });
  }
  
  setShowActions = (showActions) => {
    runInAction(() => {
      this.showActions = showActions;
    });
  }

  setShowAnswer = (showAnswer) => {
    runInAction(() => {
      this.showAnswer = showAnswer;
    });
  }

  setShowPanel = (showPanel) => {
    runInAction(() => {
      this.showPanel = showPanel;
    });
  };

  setLoading = (isLoading) => {
    runInAction(() => {
      this.isLoading = isLoading;
    });
  };

  setGenerating = (isGenerating) => {
    runInAction(() => {
      this.isGenerating = isGenerating;
    });
  }

  setPointer = (x, y) => {
    runInAction(() => {
      this.pointer = { x, y };
    });
  };

  setUserPrompt = (userPrompt) => {
    runInAction(() => {
      this.userPrompt = userPrompt;
    });
  };

  setSelection = (selection) => {
    runInAction(() => {
      this.selection = selection;
    });
  }
};

const sliderStore = new SliderStore();
export default sliderStore;
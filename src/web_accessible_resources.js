const sendMessage = (key, val, ext = "none") => {
  window.postMessage({ type: "FROM_WAR", key, val, ext }, "*");
}

// 划词监听
document.addEventListener("mouseup", function (event) {
  // 如果不是左键点击，直接返回
  if (event.button !== 0) return;
  var selectedText = window.getSelection().toString().trim();
  // 如果没有选中文字，直接返回
  if (selectedText === "") return;

  handleSelection(event);
});


const handleSelection = (event) => {
  const sel = window.getSelection();
  var selectedText = sel.toString().trim();
  let range = sel.getRangeAt(0);
  let rect = range.getBoundingClientRect();

  let selectionData = {
    text: selectedText,
    x: rect.left,
    y: event.pageY + 14,
    screenWidth: window.innerWidth,
    screenHeight: window.pageYOffset + window.innerHeight, 
  };

  sendMessage("selection", selectionData);
}


// 监听content_script发送的消息
window.addEventListener("message", (event) => {
  let { key, val } = event.data;

  switch (key) {
 
    default:
      break;
  }

});
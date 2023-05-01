// 채팅 버블 로딩하기
function loadChatBubbles(count) {
  let prevLastChatBubble;
  if(fromWhere == "start") {
    prevLastChatBubble = txtLog.lastElementChild;
  } else if (fromWhere == "end") {
    prevLastChatBubble = txtLog.firstElementChild.nextElementSibling;
  }
  

  for (let i = 0; i < count; i++) {
    if (chatIndex >= textArray.length) {
      break;
    }

    if(fromWhere == "start") {
      const chatBubbleElement = chatBubble(textArray[chatIndex-1],textArray[chatIndex],textArray[chatIndex+1]);
      detector.before(chatBubbleElement);  
    } else if (fromWhere == "end") {
      const chatBubbleElement = chatBubble(textArray[chatIndex+1],textArray[chatIndex],textArray[chatIndex-1]);
      detector.after(chatBubbleElement);
    }

    chatIndex++;
  }

  if (!prevLastChatBubble) {
      txtLog.scrollTop = txtLog.scrollHeight;
  }

}


// 채팅 버블 요소를 생성하는 함수
function chatBubble(prevline,line,nextline) {
    const kTalkBox = document.createElement('div');
    kTalkBox.classList.add("kTalkBox");

    if (line.includes("---")) { // 날짜
        kTalkBox.innerHTML = `<div class="kkodatebox">${line.replaceAll("---------------", "").trim()}</div>`;
        prevdata.length = 0;
    } else {
        if(line.includes("]")){  // 대화
          const parts = line.split("]");
          const name = parts[0].replace("[", "").trim();
          const time = parts[1].replace("[", "").trim();
          const message = parts[2].trim();

          const prevName = prevline.split("]")[0].replace("[","").trim();
          const sameNameWithPrevChat = name === prevName;
          let sameTimeWithNextChat,sameNameWithNextChat;
          if(nextline != undefined && nextline.split("]").length > 1) {
            const nextName = nextline.split("]")[0].replace("[","").trim();
            sameNameWithNextChat = name === nextName;
            const nextTime = nextline.split("]")[1].replace("[","").trim();
            sameTimeWithNextChat = time === nextTime;
          }

          // 작성자 추가
          if(talker.includes(name) == false){
            talker.push(name);
          }
          // 왼쪽 오른쪽
          if(name === talker[0]){
            kTalkBox.classList.add("right");
          } else {
            kTalkBox.classList.add("left");
          }

          const innerHtml = `${!sameNameWithPrevChat ? `<div class="kkoname">${name}</div>` : ''}
          <div class="kkotxtbox">
            <div class="kkotxt">${message}</div>
            ${!sameTimeWithNextChat || !sameNameWithNextChat ? `<div class="kkodate"> ${time}</div>` : ''}
          </div>`;

          // 대화 생성
          !sameNameWithPrevChat ? kTalkBox.classList.add("active") : '';
          kTalkBox.innerHTML = innerHtml;
          
          prevdata[0] = name;
          prevdata[1] = time;
        }
    }
    return kTalkBox;
}
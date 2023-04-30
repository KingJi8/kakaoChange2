// 현재 채팅 인덱스와 텍스트 라인 배열을 추적하기 위한 변수 초기화
let chatIndex = 0;
let textArray = [];
let detector, kkochats;
const prevdata = [],
      talker = [];
const txtLog = document.getElementById('txtlog');

// DOMContentLoaded 이벤트가 발생하면 실행되는 함수
document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.getElementById('getFileBtn');

  // 이전 파일 지우기
  textInput.onclick = function () {
    this.value = null;
  }
  // 파일 입력이 변경되면 실행되는 이벤트 리스너
  textInput.addEventListener('change', function(e) {
    // 이전 데이터 리셋
    textArray = [];
    chatIndex = 0;
    txtLog.scrollTop = 0;
    txtLog.innerHTML = '<div id="detector"></div>';
    detector = document.getElementById('detector');

    const fileReader = new FileReader();
    const file = e.target.files[0];
    fileReader.readAsText(file,'UTF-8');
    
    // 파일 읽기가 완료되면 실행되는 이벤트 핸들러
    fileReader.onload = function() {
      const text = fileReader.result;
      textArray = text.split('\r\n');
      txtLog.classList.add("show");

      const observerOptions = {
        root: txtLog,
        rootMargin: '100px', 
        threshold: [0.1,0.5,1], 
      };

      // 교차점 관찰자 인스턴스 생성
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadChatBubbles(20);
          }
        });
      },observerOptions);

      // 교차점 관찰자가 detector 요소를 관찰하도록 설정
      observer.observe(detector);
    };
  });
});


function loadChatBubbles(count) {
  const prevLastChatBubble = txtLog.lastElementChild;

  for (let i = 0; i < count; i++) {
    if (chatIndex >= textArray.length) {
      break;
    }

    console.log(textArray[chatIndex]);

    const chatBubbleElement = chatBubble(textArray[chatIndex],textArray[chatIndex+1],textArray[chatIndex+2]);
    detector.before(chatBubbleElement);

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
    kTalkBoxes = txtLog.querySelectorAll('.kTalkBox');


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
          const nextName = nextline.split("]")[0].replace("[","").trim();
          const sameNameWithNextChat = name === nextName;
          let sameTimeWithNextChat;
          if(nextline.split("]").length > 1) {
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
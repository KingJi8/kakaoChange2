// 현재 채팅 인덱스와 텍스트 라인 배열을 추적하기 위한 변수 초기화
let chatIndex = 0;
let textArray = [];
let detector;
let fromWhere = "end";
const prevdata = [],
      talker = [];
const txtLog = document.getElementById('txtlog');
const modeToggleBtn = document.getElementById('modeToggleBtn');

// 화면 모드 바꾸기
modeToggleBtn.addEventListener("click", function(e){
  if(e.target.src.includes("sunny")){
    e.target.src = "./moon-outline.png";
  } else {
    e.target.src = "./sunny-outline.png";
  };
  txtLog.classList.toggle("night");
  document.body.classList.toggle("night");
})


// DOMContentLoaded 이벤트가 발생하면 실행되는 함수
document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.querySelectorAll('.getFileBtn');

  // 이전 파일 지우기
  textInput.forEach(function(element){
    element.onclick = function () {
      this.value = null;
    }
    // 파일 입력이 변경되면 실행되는 이벤트 리스너
    element.addEventListener('change', function(e) {
      if(e.target.id == "getFileStart"){
        fromWhere = "start";
      } else {
        fromWhere = "end";
      };
      // 이전 데이터 리셋
      textArray = [];
      talker.length = 0;
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
        if(fromWhere == "end") {
          textArray = textArray.reverse();
        }
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
  })
});
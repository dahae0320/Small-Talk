// url 에서 parameter 추출
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// auto scroll, 작동이 안된다
const autoscroll = () => {
    // New message element
    const $newMessage = $('#chat-bottom').lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight
    
    // height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    } // 위에 볼때는 no autoscroll 
}

// socket.io 서버에 접속한다
var socket = io();
var myName = getParameterByName('nickname');

// 서버로 자신의 정보를 전송한다.
socket.emit("login", {
    name: myName,
});

// 로그인에 성공하면(서버 연결 성공 시)
socket.on("login", function (data) {
    $("#chatLogs").append("<div>[<strong>" + data + "</strong>님이 입장했습니다]</div>");
});

// 서버로부터의 메시지가 수신되면
socket.on("chat", function (data) {
    $("#chatLogs").append("<div><strong>" + data.from.name + "</strong> : " + data.msg + "</div>");
});

// 서버로부터의 메시지가 수신되면
socket.on("disconnect", function (data) {
    $("#chatLogs").append("<div>[<strong>" + data + "</strong>님이 나가셨습니다]</div>");
});

// Send 버튼이 클릭되면
$("form").submit(function (e) {
    e.preventDefault();
    var $msgForm = $("#msgForm");

    $("#chatLogs").append("<div><strong>" + myName + "</strong> : " + $msgForm.val() + "</div>");

    // 서버로 메시지를 전송한다.
    socket.emit("chat", { msg: $msgForm.val() });
    $msgForm.val("");
});


$(init);
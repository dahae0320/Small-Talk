// url 에서 parameter 추출
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// var socket, canvas, ctx,
//     brush = {
//         x: 0,
//         y: 0,
//         color: '#000000',
//         size: 10,
//         down: false,
//     },
//     strokes = [],
//     currentStroke = null;

// function paint() {
//     ctx.clearRect(0, 0, canvas.width(), canvas.height());
//     ctx.lineCap = 'round';
//     for (var i = 0; i < strokes.length; i++) {
//         var s = strokes[i];
//         ctx.strokeStyle = s.color;
//         ctx.lineWidth = s.size;
//         ctx.beginPath();
//         ctx.moveTo(s.points[0].x, s.points[0].y);
//         for (var j = 0; j < s.points.length; j++) {
//             var p = s.points[j];
//             ctx.lineTo(p.x, p.y);
//         }
//         ctx.stroke();
//     }
// }

// function init() {

//     canvas = $('#paint');
//     canvas.attr({
//         width: 500,
//         height: 500,
//     });
//     ctx = canvas[0].getContext('2d');

//     socket.on('painter', (data) => {
//         currentStroke = {
//                 color: brush.color,
//                 size: brush.size,
//                 points: [],
//         };
//         strokes.push(currentStroke);
//         currentStroke.points.push({
//             x: data.x,
//             y: data.y,
//         });
//         paint();
//     });

//     function mouseEvent(e) {
//         brush.x = e.pageX;
//         brush.y = e.pageY;
//         currentStroke.points.push({
//             x: brush.x,
//             y: brush.y,
//         });
//         data = {
//             x: brush.x,
//             y: brush.y
//         }
//         socket.emit('mouse', data);
//         paint();
//     }

//     canvas.mousedown(function (e) {
//         brush.down = true;

//         currentStroke = {
//             color: brush.color,
//             size: brush.size,
//             points: [],
//         };

//         strokes.push(currentStroke);

//         mouseEvent(e);
//     }).mouseup(function (e) {
//         brush.down = false;

//         mouseEvent(e);

//         currentStroke = null;
//     }).mousemove(function (e) {
//         if (brush.down)
//             mouseEvent(e);
//     });

//     $('#undo-btn').click(function () {
//         strokes.pop();
//         paint();
//     });

//     $('#clear-btn').click(function () {
//         strokes = [];
//         paint();
//     });

//     $('#color-picker').on('input', function () {
//         brush.color = this.value;
//     });

//     $('#brush-size').on('input', function () {
//         brush.size = this.value;
//     });
// }

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
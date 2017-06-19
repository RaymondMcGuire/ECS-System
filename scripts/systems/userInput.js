/* =========================================================================
 *
 * userInput.js
 * 用户输入
 *
 * ========================================================================= */
function hasTouchEnabled() { return 'ontouchstart' in window || 'onmsgesturechange' in window; }


var userInputPosition = {
    x: -100,
    y: -100,
    deltaX: false,
    deltaY: false
};

// 初始化
if(hasTouchEnabled){
    userInputPosition = {
        x: ECS.$canvas.width / 2,
        y: ECS.$canvas.height / 2,
        lastX: ECS.$canvas.width / 2,
        lastY: ECS.$canvas.height / 2
    };
}

// 更新用户鼠标坐标
// --------------------------------------
function updateMousePosition(evt) {
    var rect = ECS.$canvas.getBoundingClientRect();
    userInputPosition.x = evt.clientX - rect.left;
    userInputPosition.y = evt.clientY - rect.top;
    userInputPosition.touch = false;
}

ECS.$canvas.addEventListener('mousemove', function mouseMove (evt) {
    //// 当鼠标移动时进行更新
    updateMousePosition(evt);
}, false);

// 通过 hammer.js插件进行触屏检测
// --------------------------------------
var mc = new Hammer.Manager(ECS.$canvas);
if(hasTouchEnabled()){
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.on("panstart", function onPanStart(ev){
        var rect = ECS.$canvas.getBoundingClientRect();

        userInputPosition.lastX = userInputPosition.x;
        userInputPosition.lastY = userInputPosition.y;

        userInputPosition.x = ev.center.x - rect.left - 10;
        userInputPosition.y = ev.center.y - rect.top - 10;
    });

    mc.on("panmove", function onPanMove(ev) {
        userInputPosition.x = userInputPosition.lastX + ev.deltaX;
        userInputPosition.y = userInputPosition.lastY + ev.deltaY;
    });

    mc.on("panend", function onPanEnd(ev){
        //userInputPosition.lastX = userInputPosition.x;
        //userInputPosition.lastY = userInputPosition.y;
    });
}

// 启动用户输入系统
// --------------------------------------
ECS.systems.userInput = function systemUserInput ( entities ) {

    var curEntity; 

    for( var entityId in entities ){
        curEntity = entities[entityId];
        //当前实体为玩家控制
        if( curEntity.components.playerControlled ){
            // 玩家控制的实体位置跟随用户输入位置进行移动
            curEntity.components.position.x = userInputPosition.x; 
            curEntity.components.position.y = userInputPosition.y;
        }
    }
};

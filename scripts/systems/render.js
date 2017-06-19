/* =========================================================================
 *
 * render.js
 * 渲染系统
 *
 * ========================================================================= */
function clearCanvas () {
    // 清空Canvas
    ECS.context.save();

    ECS.context.setTransform(1, 0, 0, 1, 0, 0);
    ECS.context.clearRect(0, 0, ECS.$canvas.width, ECS.$canvas.height);

    ECS.context.restore();
}


// 渲染系统
// --------------------------------------
ECS.systems.render = function systemRender ( entities ) {
    // 刷新画布
    clearCanvas();

    var curEntity, fillStyle; 

    for( var entityId in entities ){
        curEntity = entities[entityId];

        if( curEntity.components.appearance && curEntity.components.position ){

            // 基于实体的颜色数据渲染样式
            fillStyle = 'rgba(' + [
                curEntity.components.appearance.colors.r,
                curEntity.components.appearance.colors.g,
                curEntity.components.appearance.colors.b
            ];
 
            if(!curEntity.components.collision){
                // 不存在碰撞组件，透明
                fillStyle += ',0.1)';
            } else {
                // 存在碰撞组件
                fillStyle += ',1)';
            }

            ECS.context.fillStyle = fillStyle;

            // 不是玩家控制且非常巨大，设置为黑色方块，玩家不可触碰。重新定义新的样式
            if(!curEntity.components.playerControlled &&
            curEntity.components.appearance.size > 12){
                ECS.context.fillStyle = 'rgba(0,0,0,0.8)';
            }

            //边线样式
            ECS.context.strokeStyle = 'rgba(0,0,0,1)';

            // 绘制方块
            ECS.context.fillRect( 
                curEntity.components.position.x - curEntity.components.appearance.size,
                curEntity.components.position.y - curEntity.components.appearance.size,
                curEntity.components.appearance.size * 2,
                curEntity.components.appearance.size * 2
            );
            // 绘制边线
            ECS.context.strokeRect(
                curEntity.components.position.x - curEntity.components.appearance.size,
                curEntity.components.position.y - curEntity.components.appearance.size,
                curEntity.components.appearance.size * 2,
                curEntity.components.appearance.size * 2
            );
        }
    }
};

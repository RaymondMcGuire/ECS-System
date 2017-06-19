/* =========================================================================
 *
 *  decay.js
 *  衰减系统主要控制生命值组件.
 *  每一帧都会逐渐减少生命值和方块大小
 *
 *
 * ========================================================================= */
// 启动系统
// --------------------------------------
ECS.systems.decay = function systemDecay ( entities ) {


    var curEntity; 

    // 处理所有实体
    for( var entityId in entities ){
        curEntity = entities[entityId];

        //检测实体是否已经死亡
        if(curEntity.components.playerControlled){
            if(curEntity.components.health.value < 0){
                // 死亡，结束游戏
                ECS.game.endGame();
                return false;
            }
        }

        // 如果实体包含组件
        if( curEntity.components.health ){

            // 生命值递减计算方式
            if(curEntity.components.health.value < 0.7){
                curEntity.components.health.value -= 0.01;

            } else if(curEntity.components.health.value < 2){
                curEntity.components.health.value -= 0.03;

            } else if(curEntity.components.health.value < 10){
                curEntity.components.health.value -= 0.07;

            } else if(curEntity.components.health.value < 20){
                curEntity.components.health.value -= 0.15;
            } else {
                //如果生成方块过大，快速衰退
                curEntity.components.health.value -= 1;
            }

            // 检测方块生命
            // --------------------------
            if(curEntity.components.health.value >= 0){

                //不同生命值显示不同的颜色
                if(curEntity.components.playerControlled){ 
                    if(curEntity.components.health.value > 10){
                        curEntity.components.appearance.colors.r = 50;
                        curEntity.components.appearance.colors.g = 255;
                        curEntity.components.appearance.colors.b = 50;
                    } else {
                        curEntity.components.appearance.colors.r = 255;
                        curEntity.components.appearance.colors.g = 50;
                        curEntity.components.appearance.colors.b = 50;
                    } 
                }

                // 如果实体中的方块大小存在，那么让其大小等同于生命值
                if(curEntity.components.appearance.size){
                    curEntity.components.appearance.size = curEntity.components.health.value;
                }

            } else {

                //实体已经死亡

                //实体是玩家控制的
                if(curEntity.components.playerControlled){

                    // 死亡，结束游戏
                    ECS.game.endGame();
                } else {
                    //实体不是玩家控制
                    // 移除实体
                    delete entities[entityId];
                }
            }
        }
    }
};

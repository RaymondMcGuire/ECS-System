/* =========================================================================
 *
 * collision.js
 * 碰撞系统
 *
 * ========================================================================= */


function doesIntersect(obj1, obj2) {
    //检测obj1和obj2是否进行触碰
    //  obj1: 玩家控制的方块
    //  obj2: 需要检测碰撞的方块
    //
    var rect1 = {
        x: obj1.position.x - obj1.size,
        y: obj1.position.y - obj1.size,
        height: obj1.size * 2,
        width: obj1.size * 2
    };
    var rect2 = {
        x: obj2.position.x - obj2.size,
        y: obj2.position.y - obj2.size,
        height: obj2.size * 2,
        width: obj2.size * 2
    };

    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
}

// 碰撞系统
// --------------------------------------
ECS.systems.collision = function systemCollision ( entities ) {


    var curEntity; 
    var entityIdsCollidedWith = [];

    for( var entityId in entities ){
        curEntity = entities[entityId];

        // 设置颜色，但并不进行渲染
        curEntity.components.appearance.colors.r = 0;

        // 含有必备的组件且当前为玩家控制
        if( curEntity.components.appearance &&
            curEntity.components.playerControlled && 
            curEntity.components.position ){

            curEntity.components.appearance.colors.r = 0;

            for( var entityId2 in entities){ 
                // 对实体集合当中所有包含必备组件且除了玩家控制的实体进行判别
                if( !entities[entityId2].components.playerControlled &&
                    entities[entityId2].components.position &&
                    entities[entityId2].components.collision &&
                    entities[entityId2].components.appearance ){

                    if( doesIntersect( 
                        {
                            position: curEntity.components.position,
                            size: curEntity.components.appearance.size
                        },
                        {
                            position: entities[entityId2].components.position, 
                            size: entities[entityId2].components.appearance.size
                        }
                    )){
                        //发生与玩家控制方块碰撞
                        curEntity.components.appearance.colors.r = 255;
                        entities[entityId2].components.appearance.colors.r = 150;

                        // 记录碰撞到的方块ID
                        entityIdsCollidedWith.push(entityId);
                        var negativeDamageCutoff = 12;

                        if(curEntity.components.health){
                            // 提升玩家生命值，并将吃掉其它方块
                            curEntity.components.health.value += Math.max(
                                -2,
                                negativeDamageCutoff - entities[entityId2].components.appearance.size
                            );

                            // 触碰小方块的额外奖励
                            if(entities[entityId2].components.appearance.size < 1.3){
                                if(curEntity.components.health.value < 30){
                                    curEntity.components.health.value += 9;
                                }
                            }
                            if ( entities[entityId2].components.appearance.size > negativeDamageCutoff ){
                
                                ECS.$canvas.className='badHit';
                                setTimeout(function(){
                                    ECS.$canvas.className='';
                                }, 100);

                                // 触碰黑色方块对玩家生命值进行减少
                                curEntity.components.health.value -= Math.min(
                                    5,
                                    entities[entityId2].components.appearance.size - negativeDamageCutoff
                                );


                            } else {
                                ECS.$canvas.className='goodHit';
                                setTimeout(function(){
                                    ECS.$canvas.className='';
                                }, 100);
                            }
                        }

                        // 更新分数
                        ECS.score++;
                        ECS.$score.innerHTML = ECS.score;

                        delete ECS.entities[entityId2];

                        break;
                    }
                }
            }
        }
    }

    // Add new entities if the player collided with any entities
    // ----------------------------------
    var chanceDecay = 0.8;
    var numNewEntities = 3;

    if(ECS.score > 100){
        chanceDecay = 0.6;
        numNewEntities = 4;
    }

    if(entityIdsCollidedWith.length > 0){
        for(i=0; i<entityIdsCollidedWith.length; i++){
            var newEntity;

            // Don't add more entities if there are already too many
            if(Object.keys(ECS.entities).length < 30){

                for(var k=0; k < numNewEntities; k++){
                    // Add some new collision rects randomly
                    if(Math.random() < 0.8){
                        newEntity = new ECS.Assemblages.CollisionRect();
                        ECS.entities[newEntity.id] = newEntity;

                        // add a % chance that they'll decay
                        if(Math.random() < chanceDecay){
                            newEntity.addComponent( new ECS.Components.Health() );
                        }
                    }
                }

            }
        }
    }
};

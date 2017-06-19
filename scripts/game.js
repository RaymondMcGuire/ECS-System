/* =========================================================================
 *
 * game.js
 * 组件系统。控制游戏逻辑
 *
 * ========================================================================= */
ECS.Game = function Game (){
 
    var self = this;

    // 创建实体
    // ----------------------------------
    var entities = {}; //实体JSON结构 { id: entity  }
    var entity;

    //创建随机个实体
    for(var i=0; i < 20; i++){
        entity = new ECS.Entity();
        entity.addComponent( new ECS.Components.Appearance());
        entity.addComponent( new ECS.Components.Position());

        // % 随机生成衰减方块，只有衰减方块才具备生命值
        if(Math.random() < 0.8){
            entity.addComponent( new ECS.Components.Health() );
        }

        entity.addComponent( new ECS.Components.Collision());

        entities[entity.id] = entity;
    }

    // 玩家实体
    // ----------------------------------
    entity = new ECS.Entity();
    entity.addComponent( new ECS.Components.Appearance());
    entity.addComponent( new ECS.Components.Position());
    entity.addComponent( new ECS.Components.PlayerControlled() );
    entity.addComponent( new ECS.Components.Health() );
    entity.addComponent( new ECS.Components.Collision() );


    entity.components.appearance.colors.g = 255;
    entities[entity.id] = entity;


    // 存储所有生成实体
    ECS.entities = entities;

    // 启动系统
    // ----------------------------------
    var systems = [
        ECS.systems.userInput,
        ECS.systems.collision,
        ECS.systems.decay, 
        ECS.systems.render
    ];
    
    // 游戏主进程
    // ----------------------------------
    function gameLoop (){
    
        for(var i=0,len=systems.length; i < len; i++){
            // 启动所有系统
            systems[i](ECS.entities);
        }

        // 如果当前未处于运行状态，则重新激活主进程
        if(self._running !== false){
            requestAnimationFrame(gameLoop);
        }
    }
    // 启动游戏主进程
    requestAnimationFrame(gameLoop);

    // 失败情况
    // ----------------------------------
    this._running = true; // 设置游戏正在运行
    this.endGame = function endGame(){ 
        self._running = false;
        document.getElementById('final-score').innerHTML = ECS.score;
        document.getElementById('game-over').className = '';

        setTimeout(function(){
            document.getElementById('game-canvas').className = 'game-over';
        }, 100);
    };


    return this;
};

// 启动游戏
ECS.game = new ECS.Game();

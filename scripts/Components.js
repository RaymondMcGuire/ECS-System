/* =========================================================================
 *
 *  Components.js
 *  组件定义，组件由数据组成
 *
 * ========================================================================= */

// 外观组件
// --------------------------------------
ECS.Components.Appearance = function ComponentAppearance ( params ){
    // 外观组件主要包含颜色和大小的数据信息
    params = params || {};

    this.colors = params.colors;
    if(!this.colors){
        this.colors = {
            r: 0,
            g: 100,
            b: 150
        };
    }

    this.size = params.size || (1 + (Math.random() * 30 | 0));

    return this;
};
ECS.Components.Appearance.prototype.name = 'appearance';

// 生命值组件
// --------------------------------------
ECS.Components.Health = function ComponentHealth ( value ){
    value = value || 20;
    this.value = value;

    return this;
};
ECS.Components.Health.prototype.name = 'health';

// 坐标组件
// --------------------------------------
ECS.Components.Position = function ComponentPosition ( params ){
    params = params || {};

    // 随机生成坐标数值，由于生成的点一定要在Canvas之内，所以这里才引入canvas的信息，但本质上不应该引入

    this.x = params.x || 20 + (Math.random() * (ECS.$canvas.width - 20) | 0);
    this.y = params.y || 20 + (Math.random() * (ECS.$canvas.height - 20) | 0);

    return this;
};
ECS.Components.Position.prototype.name = 'position';

// 用户控制组件 
// --------------------------------------
ECS.Components.PlayerControlled = function ComponentPlayerControlled ( params ){
    this.pc = true;
    return this;
};
ECS.Components.PlayerControlled.prototype.name = 'playerControlled';

// 碰撞器组件
// --------------------------------------
ECS.Components.Collision = function ComponentCollision ( params ){
    this.collides = true;
    return this;
};
ECS.Components.Collision.prototype.name = 'collision';

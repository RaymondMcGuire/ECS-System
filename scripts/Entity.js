/* =========================================================================
 *
 *  Entity.js
 *  定义实体. 一个实体就是一个ID 
 *  将实体作为一个数据容器
 *
 * ========================================================================= */
ECS.Entity = function Entity(){
    // 创建随机ID
    this.id = (+new Date()).toString(16) + 
        (Math.random() * 100000000 | 0).toString(16) +
        ECS.Entity.prototype._count;

    // 实体数量
    ECS.Entity.prototype._count++;

    // 组件列表
    this.components = {};

    return this;
};
// 实体数量初始化
ECS.Entity.prototype._count = 0;

ECS.Entity.prototype.addComponent = function addComponent ( component ){
    // 添加组件到实体之中
    this.components[component.name] = component;
    return this;
};
ECS.Entity.prototype.removeComponent = function removeComponent ( componentName ){
    // 通过引用移除组件
    // 允许组件名称为一个方法或是字符串

    var name = componentName; 

    if(typeof componentName === 'function'){ 
        // 获取组件方法中组件的名称
        name = componentName.prototype.name;
    }

    delete this.components[name];
    return this;
};

ECS.Entity.prototype.print = function print () {
    // 调试实体信息
    console.log(JSON.stringify(this, null, 4));
    return this;
};

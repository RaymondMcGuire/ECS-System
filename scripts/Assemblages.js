/* =========================================================================
 *
 *  Assemblages.js
 *  装配器
 *
 * ========================================================================= */

ECS.Assemblages = {
    // 每个装配器都应该生成一个实体并将其返回. 
    //实体可以进行组件的添加或者是移除的操作 
    // 类似于工厂模式

    CollisionRect: function CollisionRect(){
      
        var entity = new ECS.Entity();
        entity.addComponent( new ECS.Components.Appearance());
        entity.addComponent( new ECS.Components.Position());
        entity.addComponent( new ECS.Components.Collision());
        return entity;
    }

};

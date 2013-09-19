/**
 * This models FoodPriceEntity
 *
 **/
function FoodPriceEntity(name, year, scale, sprite, pos, data){

    this.name = name || '';
    this.year = year;
    this.scale = scale || 0;
    this.sprite = sprite || '';
    this.pos = pos || {};
    this.data = data || {};

    /**
     * All getters and setters
     **/
    FoodPriceEntity.prototype.getSprite = function getSprite(){
          return this.sprite;
    };
    FoodPriceEntity.prototype.setSprite = function setSprite(sprite){
               this.sprite = sprite;
    };
    FoodPriceEntity.prototype.getPosition = function getPosition(){
          return this.pos;
    };
    FoodPriceEntity.prototype.setPosition = function setPosition(pos){
               this.pos = pos;
    };
    FoodPriceEntity.prototype.getScale = function getScale(){
          return this.scale;
    };
    FoodPriceEntity.prototype.setScale = function setScale(scale){
              this.scale = scale;
    };
    FoodPriceEntity.prototype.getData = function getData(){
          return this.data;
    };
    FoodPriceEntity.prototype.setData = function setData(data){
              this.data = data;
    };

    /* Calculating differential
    Paddle.prototype.calcScale = function setData(data){
              this.data = data;
              //differential = current value - previous value;
              // this.scale = (differential - min(this.differentials)) / (max(this.differentials) - findMin(this.differentials)) + 1;
    };*/

}



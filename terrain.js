
/** ******************************************************************************************************************** # ScrollingBackground
* ScrollingBackground Class
*/

var ScrollingBackground = function(imageSrc,vSpeed,hSpeed,width,height,offsetX){

  if(imageSrc)
  {
    this.imageLoaded = false;
    this.image = new Image();
    var me = this;
    this.image.onload = function(){me.imageReady()};
    this.image.src = imageSrc;
  }else
    this.imageLoaded = true;

  this.width = width;
  this.height = height;
  this.vSpeed = vSpeed || 0;
  this.hSpeed = hSpeed || 0;
  this.offsetY = 0;
  this.offsetX = offsetX || 0;


  //-------------------------------------------------------------------------------------------------------------------- ScrollingBackground::imageReady
  this.imageReady = function(){
    this.imageLoaded = true;
    this.width = this.image.width;
    this.height = this.image.height;
  };



  //-------------------------------------------------------------------------------------------------------------------- ScrollingBackground::step
  this.step = function(dt){
    this.offsetY += dt * this.vSpeed;
    this.offsetY = this.offsetY % this.height;

    this.offsetX += dt * this.hSpeed;
    if(this.offsetX > this.width-Game.width)
      this.offsetX = this.width-Game.width;
    else if(this.offsetX < 0)
      this.offsetX = 0;
  };


  //-------------------------------------------------------------------------------------------------------------------- ScrollingBackground::draw
  this.draw = function(ctx){
    if(!this.imageLoaded)
      return false;
    
    var vDiff = this.height - Game.height,
        hDiff = this.width - Game.width,
        intOffsetY = Math.floor(this.offsetY),
        intOffsetX = Math.floor(this.offsetX);

    ctx.drawImage(
      this.image
      , intOffsetX , Math.max(0,vDiff - intOffsetY), Game.width, Math.min(Game.height,Game.height+vDiff - intOffsetY)
      , 0 , Game.height - Math.min(Game.height,Game.height+vDiff - intOffsetY), Game.width, Math.min(Game.height,Game.height+vDiff - intOffsetY)
    );

    if(vDiff < intOffsetY)
    {
      var shift = intOffsetY-vDiff;

      ctx.drawImage(
        this.image
        , intOffsetX , this.height - shift, Game.width, shift
        , 0 , 0, Game.width, shift
      );      
    }
  };
}.inherits(BoardItem);



/** ******************************************************************************************************************** # Terrain
* Terrain : ScrollingBackground
*/
var Terrain = function(imageSrc,options){
  
  Game.terrain = this;
  this.options = options;
  this.offsetY = options.offsetY || 0;
  this.offsetX = options.offsetX || 0;
  console.info(options);

  //-------------------------------------------------------------------------------------------------------------------- Terrain::imageReady
  this.imageReady = function(){
    this.super(ScrollingBackground,'imageReady');

    if(this.options.hScroll=='random')
      this.offsetX = this.options.offsetX===undefined ? Math.random()*(this.width-Game.width) : this.options.offsetX;
    if(this.options.offsetX=='random')
      this.offsetX = Math.random()*(this.width-Game.width);
  };


  //-------------------------------------------------------------------------------------------------------------------- Terrain::step
  this.step = function(dt){

    this.super(ScrollingBackground,'step',dt);

    if(this.options.hScroll=='random' && Math.random() < 0.001)
    {
      console.info("woosh");
      this.hSpeed = (parseInt(Math.random()*3)-1) * 50;
      this.options.hScroll = '';
      setTimeout(function(){
        this.hSpeed = 0;
        this.options.hScroll='random';
      }.bind(this),3000 + parseInt(Math.random()*2000));
    }
  };

}.inherits(ScrollingBackground,"(imageSrc,options)=>(imageSrc,options.vSpeed || 0,options.hSpeed || 0,options.width || 0,options.height || 0)");



/** ******************************************************************************************************************** # Starfield
* Starfield : ScrollingBackground
*/
var Starfield = function(speed,opacity,numStars) {

  // Set up the offscreen canvas
  this.image = document.createElement("canvas");
  this.image.width = Game.width; 
  this.image.height = Game.height;
  var starCtx = this.image.getContext("2d");

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#000";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*this.image.width),
                     Math.floor(Math.random()*this.image.height),
                     1+Math.random()*2,
                     1+Math.random()*2);
  }

}.inherits(ScrollingBackground,"(speed,opacity,numStars)=>(0,speed,0,Game.width,Game.height)");

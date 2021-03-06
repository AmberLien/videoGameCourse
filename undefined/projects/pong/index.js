(function(window, createjs, opspark, _) {

  // Variable declarations for libraries and the game engine
  const
    draw = opspark.draw, // library for drawing using createJS
    physikz = opspark.racket.physikz, // library for defining physics properties like velocity
    engine = opspark.V6().activateResize(), // game engine for actively rendering + running the game's mechanics
    canvas = engine.getCanvas(), // object for referencing the height / width of the window
    stage = engine.getStage(); // object to hold all visual components

  // load some sounds for the demo - play sounds using: createjs.Sound.play("wall");
  createjs.Sound.on("fileload", handleLoadComplete);
  createjs.Sound.alternateExtensions = ["mp3"];
  createjs.Sound.registerSounds([{ src: "hit.ogg", id: "hit" }, { src: "wall.ogg", id: "wall" }], "assets/sounds/");

  function handleLoadComplete(event) {
    console.log('sounds loaded');
  }

  engine
    .addTickHandlers(update) // establish the update function as the callback for every timer tick
    .activateTick();

  // Variable declarations for the paddles and the ball which are drawn using createJS (see bower_components/opspark-draw/draw.js)
  const
    paddlePlayer = createPaddle(),
    paddleCPU = createPaddle({ x: canvas.width - 20, y: canvas.height - 100 }),
    ball = draw.circle(20, '#CCC');

  // set initial properties for the paddles 
  paddlePlayer.yVelocity = 0;
  paddleCPU.yVelocity = 6;

  // set initial properties for the ball
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.xVelocity = 5;
  ball.yVelocity = 5;

  // add the paddles and the ball to the view
  stage.addChild(paddlePlayer, paddleCPU, ball);


  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('keydown', onKeyDown);

  // when an Arrow key is pressed down, set the paddle in motion
  function onKeyDown(event) {
    if (event.key === 'ArrowUp') {
      paddlePlayer.yVelocity = -5;
    } else if (event.key === 'ArrowDown') {
      paddlePlayer.yVelocity = 5;
    }
  }

  // when either the Arrow Up or Arrow Down key are released, stop the paddle from moving
  function onKeyUp(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      paddlePlayer.yVelocity = 0;
    }
  }

  function update(event) {
    const
      boundsCPU = paddleCPU.getBounds(),
      widthCPU = boundsCPU.width,
      heightCPU = boundsCPU.height,
      midCPU = heightCPU / 2,
      boundsPlayer = paddlePlayer.getBounds(),
      widthPlayer = paddlePlayer.width,
      heightPlayer = paddlePlayer.height;

    // Ball movement: the xVelocity and yVelocity is the distance the ball moves per update
    ball.x = ball.x + ball.xVelocity;
    ball.y = ball.y + ball.yVelocity;

    // Player movement //
    paddlePlayer.y += paddlePlayer.yVelocity;
    if (paddlePlayer.y < 0) {
      paddlePlayer.y = 0;
    }
    if (paddlePlayer.y > canvas.height - paddlePlayer.height) {
      paddlePlayer.y = canvas.height - heightPlayer;
    }

    // AI movement: CPU follows ball //
    //changing the hard-coded 14 changes the rate at which the CPU follows the ball
    if ((paddleCPU.y + midCPU) < (ball.y - 14)) { //if position of the paddle???s height and a half is above the (ball???s y position - 14)
      paddleCPU.y += paddleCPU.yVelocity;         //the CPU's paddle will move down
    } else if ((paddleCPU.y + midCPU) > (ball.y + 14)) { //if position of the paddle???s height and a half is below the (ball???s y position + 14)
      paddleCPU.y -= paddleCPU.yVelocity;                //the CPU's paddles moves up
    }

    // TODO 1: bounce the ball off the top
    if (ball.y - ball.radius <= 0){
      ball.yVelocity *= -1; // changes ball's direction
    }

    // TODO 2: bounce the ball off the bottom
    if (ball.y + ball.radius >= canvas.height){
      ball.yVelocity *= -1; // changes ball's direction
    }

    // TODO 3: bounce the ball off each of the paddles
    if ((ball.x + ball.radius) > paddleCPU.x && (ball.x - ball.radius) < paddleCPU.x + widthCPU){
      if (ball.y + ball.radius > paddleCPU.y && ball.y - ball.radius < paddleCPU.y + heightCPU){
        ball.xVelocity *= -1 // changes ball's direction
      }
    } 
    if ((ball.x + ball.radius) > paddlePlayer.x && (ball.x - ball.radius) < paddlePlayer.x + widthPlayer){
      if (ball.y + ball.radius > paddlePlayer.y && ball.y - ball.radius < paddlePlayer.y + heightPlayer){
        ball.xVelocity *= -1 // changes ball's direction
      }
    }

  }

  // helper function that wraps the draw.rect function for easy paddle making
  function createPaddle({ width = 20, height = 100, x = 0, y = 0, color = '#CCC' } = {}) {
    const paddle = draw.rect(width, height, color);
    paddle.x = x;
    paddle.y = y;
    return paddle;
  }


}(window, window.createjs, window.opspark, window._));

import * as createjs from 'createjs-module';

export function Galaga(stage: createjs.Stage) {
  var bgImg = new Image();
  var bg: createjs.Bitmap;
  var bg2Img = new Image();
  var bg2: createjs.Bitmap;

  var sImg = new Image();
  var ship: any;

  var eImg = new Image();

  var bImg = new Image();
  var boss: any;

  var lImg = new Image();

  var bltImg = new Image();

  var winImg = new Image();
  var loseImg = new Image();
  var win;
  var lose;

  var lives = new createjs.Container(); //stores the lives gfx
  var bullets = new createjs.Container(); //stores the bullets gfx
  var enemies = new createjs.Container(); //stores the enemies gfx
  var bossHealth = 20;
  var score: createjs.Text = new createjs.Text();
  var gfxLoaded = 0; //used as a preloader, counts the already loaded items
  var centerX = 160;
  var centerY = 240;
  var tkr = new Object(); //used as a Ticker listener
  var timerSource; //references a setInterval method

  function update() {
    /* Move Background */

    bg.y += 5;
    bg2.y += 5;

    if (bg.y >= 480) {
      bg.y = -480;
    }
    else if (bg2.y >= 480) {
      bg2.y = -480;
    }

    /* Move Bullets */
    for (var i = 0; i < bullets.children.length; i++) {
      bullets.children[i].y -= 10;

      /* Remove Offstage Bullets */

      if (bullets.children[i].y < - 20) {
        bullets.removeChildAt(i);
      }
    }

    /* Show Boss */

    if (parseInt(score.text) >= 500 && boss == null) {
      boss = new createjs.Bitmap(bImg);

      // createjs.SoundJS.play('boss');

      boss.x = centerX - 90;
      boss.y = -183;

      stage.addChild(boss);
      createjs.Tween.get(boss).to({ y: 40 }, 2000)   //tween the boss onto the play area
    }

    /* Move Enemies */

    for (var j = 0; j < enemies.children.length; j++) {
      enemies.children[j].y += 5;
      /* Remove Offstage Enemies */

      if (enemies.children[j].y > 480 + 50) {
        enemies.removeChildAt(j);
      }

      for (var k = 0; k < bullets.children.length; k++) {
        /* Bullet - Enemy Collision */

        if (bullets.children[k].x >= enemies.children[j].x && bullets.children[k].x + 11 < enemies.children[j].x + 49 && bullets.children[k].y < enemies.children[j].y + 40) {
          bullets.removeChildAt(k);
          enemies.removeChildAt(j);
          stage.update();
          // SoundJS.play('explo');
          score.text = (+score.text + 50).toString();
          // }
        }
        /* Bullet - Boss Collision */

        if (boss != null && bullets.children[k].x >= boss.x && bullets.children[k].x + 11 < boss.x + 183 && bullets.children[k].y < boss.y + 162) {
          bullets.removeChildAt(k);
          bossHealth--;
          stage.update();
          // SoundJS.play('explo');
          score.text = (+score.text + 50).toString();
        }
      }
      /* Ship - Enemy Collision */

      if (enemies.hitTest(ship.x, ship.y) || enemies.hitTest(ship.x + 37, ship.y)) {
        enemies.removeChildAt(j);
        lives.removeChildAt(0);
        ship.y = 480 + 34;
        createjs.Tween.get(ship).to({ y: 425 }, 500)
        // SoundJS.play('explo');
      }
    }
    /* Check for win */

    if (boss != null && bossHealth <= 0) {
      alert('win');
    }

    /* Check for lose */

    if (lives.children.length <= 0) {
      alert('lose');
    }
  }

function alert(e: any) {
    /* Remove Listeners */

    stage.on('mousemove', () => { null });
    // bg.removeAllEventListeners();
    // bg2.removeAllEventListeners();

    // createjs.Ticker.removeAllEventListeners();

    timerSource = null;

    /* Display Correct Message */

    if (e == 'win') {
      win = new createjs.Bitmap(winImg);
      win.x = centerX - 64;
      win.y = centerY - 23;
      stage.addChild(win);
      stage.removeChild(enemies, boss);
    }
    else {
      lose = new createjs.Bitmap(loseImg);
      lose.x = centerX - 64;
      lose.y = centerY - 23;
      stage.addChild(lose);
      stage.removeChild(enemies, ship);
    }

    bg.addEventListener('click', () => window.location.reload());
    bg2.addEventListener('click', () => window.location.reload());
    stage.update();
  }

  function addEnemy() {
    var e = new createjs.Bitmap(eImg);

    e.x = Math.floor(Math.random() * (320 - 50))
    e.y = -50

    enemies.addChild(e);
    // stage.update();
    update();
  }

  function startGame() {
    stage.on('stagemousemove', moveShip);
    bg.on('click', shoot);
    bg2.on('click', shoot);

    createjs.Ticker.addEventListener('tick', stage, false);
    stage.update();

    timerSource = setInterval(function () {
      addEnemy();
    }, 1000);
  }

  function shoot() {
    var b = new createjs.Bitmap(bltImg);

    b.x = ship.x + 13;
    b.y = ship.y - 20;

    bullets.addChild(b);
    stage.update();

    // SoundJS.play('shot');
  }

  function moveShip(e: any) {
    ship.x = e.stageX - 18.5;
  }

  function addGameView() {
    ship!.x = centerX - 18.5;
    ship!.y = 480 + 34;

    /* Add Lives */

    for (var i = 0; i < 3; i++) {
      var l = new createjs.Bitmap(lImg);

      l.x = 248 + (25 * i);
      l.y = 463;

      lives.addChild(l);
      stage.update();
    }

    /* Score Text */

    score = new createjs.Text('0', 'bold 14px Courier New', '#FFFFFF');
    score.maxWidth = 1000;	//fix for Chrome 17
    score.x = 2;
    score.y = 460;

    /* Second Background */

    bg2.y = -480;

    /* Add gfx to stage and Tween Ship */

    stage.addChild(bg, bg2, ship, enemies, bullets, lives, score);
    createjs.Tween.get(ship).to({ y: 425 }, 1000).call(startGame);
  }

  function loadGfx(e: any) {
    if (e.target.id = 'bg') { bg = new createjs.Bitmap(bgImg); }
    if (e.target.id = 'bg2') { bg2 = new createjs.Bitmap(bg2Img); }
    if (e.target.id = 'ship') { ship = new createjs.Bitmap(sImg); }

    gfxLoaded++;

    if (gfxLoaded == 9) {
      addGameView();
    }
  }

  init: {
    stage.mouseEnabled = false;

    bgImg.src = 'assets/img/bg.png';
    bgImg.id = 'bg';
    bgImg.onload = loadGfx;

    bg2Img.src = 'assets/img/bg2.png';
    bg2Img.id = 'bg2';
    bg2Img.onload = loadGfx;

    sImg.src = 'assets/img/ship.png';
    sImg.id = 'ship';
    sImg.onload = loadGfx;

    eImg.src = 'assets/img/enemy1.png';
    eImg.id = 'enemy';
    eImg.onload = loadGfx;

    bImg.src = 'assets/img/boss.png';
    bImg.id = 'boss';
    bImg.onload = loadGfx;

    lImg.src = 'assets/img/live.png';
    lImg.id = 'live';
    lImg.onload = loadGfx;

    bltImg.src = 'assets/img/bullet.png';
    bltImg.id = 'bullet';
    bltImg.onload = loadGfx;

    winImg.src = 'assets/img/win.png';
    winImg.id = 'win';
    winImg.onload = loadGfx;

    loseImg.src = 'assets/img/lose.png';
    loseImg.id = 'lose';
    loseImg.onload = loadGfx;

    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener('tick', () => update());
  }
}

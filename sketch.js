let walkImg, fitImg, standImg, char3Img, char4Img, char5Img;
let numFrames = 6;
let fitNumFrames = 12;
let standNumFrames = 2;
let char3NumFrames = 5;
let char4NumFrames = 5;
let char5NumFrames = 7;
let currentFrame = 0;
let fitCurrentFrame = 0;
let standCurrentFrame = 0;
let char3CurrentFrame = 0;
let char4CurrentFrame = 0;
let char5CurrentFrame = 0;
let frameW, frameH, fitFrameW, fitFrameH, standFrameW, standFrameH, char3FrameW, char3FrameH, char4FrameW, char4FrameH, char5FrameW, char5FrameH;
let posX, posY;
let facing = 1;
let isAttacking = false;
let input, button, restartBtn, startGameBtn;
let questionText = "";
let currentAnswer = "";
let btnOptions = [];
let answerResult = "";
let score = 0;
let decorations = [];
let clouds = [];
let houses = [];
let fireworks = [];
let fountainParticles = [];
let gameState = 'LOADING';
let role2CorrectCount = 0;
let role4CorrectCount = 0;
let role5CorrectCount = 0;
let showRole4 = false;
let showRole5 = false;
let remainingAnimals = [];
let loadingProgress = 0;
let displayedEmoji = "";
let emojiTimer = 0;
let sceneIntroText = "";
let sceneIntroTimer = 0;
let hasAnsweredChar3 = false;

const animals = [
  { cn: '狗', en: 'Dog', emoji: '🐶' },
  { cn: '貓', en: 'Cat', emoji: '🐱' },
  { cn: '大象', en: 'Elephant', emoji: '🐘' },
  { cn: '獅子', en: 'Lion', emoji: '🦁' },
  { cn: '老虎', en: 'Tiger', emoji: '🐯' },
  { cn: '猴子', en: 'Monkey', emoji: '🐵' },
  { cn: '兔子', en: 'Rabbit', emoji: '🐰' },
  { cn: '熊', en: 'Bear', emoji: '🐻' },
  { cn: '馬', en: 'Horse', emoji: '🐴' },
  { cn: '豬', en: 'Pig', emoji: '🐷' }
];

function preload() {
  walkImg = loadImage('1/walk/walk1.png');
  fitImg = loadImage('1/fit/fit1.png');
  standImg = loadImage('2/stand/1.png');
  char3Img = loadImage('3/5.png');
  char4Img = loadImage('4/跳.png');
  char5Img = loadImage('5/關公.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameW = walkImg.width / numFrames;
  frameH = walkImg.height;
  fitFrameW = fitImg.width / fitNumFrames;
  fitFrameH = fitImg.height;
  standFrameW = standImg.width / standNumFrames;
  standFrameH = standImg.height;
  char3FrameW = char3Img.width / char3NumFrames;
  char3FrameH = char3Img.height;
  char4FrameW = char4Img.width / char4NumFrames;
  char4FrameH = char4Img.height;
  char5FrameW = char5Img.width / char5NumFrames;
  char5FrameH = char5Img.height;
  posX = width / 2;
  posY = height / 2;

  input = createInput();
  input.position(width / 2 - 100, height - 50);
  input.size(150);
  input.style('font-size', '16px');
  input.style('padding', '5px');
  input.style('border-radius', '5px');
  input.style('border', 'none');
  input.changed(checkAnswer);

  button = createButton('送出');
  button.position(input.x + input.width + 25, height - 50);
  button.mousePressed(checkAnswer);
  button.style('font-size', '16px');
  button.style('padding', '5px 10px');
  button.style('border-radius', '5px');
  button.style('background-color', '#4CAF50');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('cursor', 'pointer');
  
  // 建立三個選項按鈕
  for (let i = 0; i < 3; i++) {
    let btn = createButton('');
    btn.position(width / 2 - 160 + i * 110, height - 50);
    btn.size(100, 35);
    btn.style('font-size', '16px');
    btn.style('cursor', 'pointer');
    btn.style('background-color', '#4CAF50');
    btn.style('color', 'white');
    btn.style('border', 'none');
    btn.style('border-radius', '5px');
    btn.mousePressed(() => checkOption(i));
    btn.hide();
    btnOptions.push(btn);
  }

  remainingAnimals = [...animals]; // 初始化題目佇列
  generateQuestion();
  input.hide();
  button.hide();

  // 建立重新開始按鈕
  restartBtn = createButton('重新開始');
  restartBtn.position(width / 2 - 60, height / 2 + 100);
  restartBtn.size(120, 50);
  restartBtn.style('font-size', '20px');
  restartBtn.style('cursor', 'pointer');
  restartBtn.style('background-color', '#FF4500');
  restartBtn.style('color', 'white');
  restartBtn.style('border', 'none');
  restartBtn.style('border-radius', '10px');
  restartBtn.mousePressed(resetGame);
  restartBtn.hide();

  // 建立開始遊戲按鈕
  startGameBtn = createButton('開始遊戲');
  startGameBtn.position(width / 2 - 60, height / 2 + 50);
  startGameBtn.size(120, 50);
  startGameBtn.style('font-size', '20px');
  startGameBtn.style('cursor', 'pointer');
  startGameBtn.style('background-color', '#2196F3');
  startGameBtn.style('color', 'white');
  startGameBtn.style('border', 'none');
  startGameBtn.style('border-radius', '10px');
  startGameBtn.mousePressed(startGame);
  startGameBtn.hide();

  initScenery();
}

function initScenery() {
  decorations = [];
  clouds = [];
  houses = [];
  
  let theme = 'EARTH';
  let intro = "第一關: 人間";
  if (showRole5) {
    theme = 'HEAVEN';
    intro = "第三關: 天堂";
  } else if (showRole4) {
    theme = 'HELL';
    intro = "第二關: 地獄";
  }
  sceneIntroText = intro;
  sceneIntroTimer = 180; // 顯示約 3 秒

  // 根據主題生成裝飾物
  if (theme === 'HELL') {
    // 地獄：飄浮的火星/餘燼
    for (let i = 0; i < 60; i++) {
      decorations.push({
        x: random(width),
        y: random(height),
        size: random(3, 8),
        color: random(['#FF4500', '#FF0000', '#FFA500']),
        speedY: random(-1, -3), // 向上飄
        type: 'ember'
      });
    }
  } else if (theme === 'HEAVEN') {
    // 天堂：閃爍的星星 (在天空)
    for (let i = 0; i < 60; i++) {
      decorations.push({
        x: random(width),
        y: random(height / 2), // 只在天空
        size: random(2, 6),
        color: '#FFFFFF',
        type: 'star'
      });
    }
  } else {
    // 地球：地上的花朵
    for (let i = 0; i < 50; i++) {
      decorations.push({
        x: random(width),
        y: random(height / 2, height),
        size: random(5, 15),
        color: random(['#FFC0CB', '#FFFF00', '#FFFFFF', '#228B22']),
        type: 'flower'
      });
    }
  }

  // 生成雲朵 (顏色與數量不同)
  let cloudCount = (theme === 'HEAVEN') ? 20 : 10;
  let cloudColor = (theme === 'HELL') ? 50 : 255; // 地獄是黑煙，其他是白雲
  
  for (let i = 0; i < cloudCount; i++) {
    clouds.push({
      x: random(width),
      y: random(50, height / 2 - 50),
      size: random(60, 100),
      speed: random(0.5, 1.5),
      color: cloudColor
    });
  }

  // 生成豪宅/皇宮風格的房子
  let attempts = 0;
  while (houses.length < 3 && attempts < 100) {
    attempts++;
    let hW = random(300, 500);
    let hH = random(250, 400);
    let hX = random(0, width - hW); // 確保不超出右邊界
    
    // 檢查重疊
    let overlap = false;
    for (let h of houses) {
      if (hX < h.x + h.w + 50 && hX + hW + 50 > h.x) { // 保持 50px 間距
        overlap = true;
        break;
      }
    }
    
    if (overlap) continue;

    // 根據主題決定房子顏色
    let mainColors, roofColors;
    if (theme === 'HELL') {
      mainColors = ['#2F4F4F', '#1a0505', '#3d0c02']; // 深灰、黑紅
      roofColors = ['#000000', '#4B0082', '#8B0000']; // 黑、深紫、深紅
    } else if (theme === 'HEAVEN') {
      mainColors = ['#FFFFFF', '#F0FFFF', '#FFFFF0']; // 純白、象牙白
      roofColors = ['#FFD700', '#87CEEB', '#E0FFFF']; // 金色、天藍
    } else {
      mainColors = ['#F8F8FF', '#FFF5EE', '#F0FFF0', '#FFFACD'];
      roofColors = ['#B22222', '#4169E1', '#DAA520', '#800080'];
    }

    let houseObj = {
      x: hX,
      y: height / 2,
      w: hW,
      h: hH,
      mainColor: random(mainColors),
      roofColor: random(roofColors),
      pillarCount: floor(random(4, 8)), // 柱子數量
      windows: []
    };

    // 生成窗戶位置
    let winCols = floor(hW / 60);
    let winRows = floor(hH / 90);
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        if (random() > 0.3) { // 隨機保留窗戶
          houseObj.windows.push({
            rx: (c + 0.5) * (hW / winCols) - 15, // 相對 X
            ry: -(r + 0.5) * (hH / winRows) - 20, // 相對 Y
            w: 30,
            h: 50
          });
        }
      }
    }
    houses.push(houseObj);
  }
}

function draw() {
  if (gameState === 'LOADING') {
    background('#87CEEB');
    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("載入中...", width / 2, height / 2 - 50);
    
    // 繪製進度條
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(width / 2 - 150, height / 2, 300, 30, 15);
    
    noStroke();
    fill('#FFD700');
    let w = map(loadingProgress, 0, 100, 0, 296);
    rect(width / 2 - 148, height / 2 + 2, w, 26, 13);
    
    loadingProgress += 1.5; // 載入速度
    if (loadingProgress >= 100) {
      gameState = 'START';
      startGameBtn.show();
    }
    return;
  }

  if (gameState === 'START') {
    background('#87CEEB');
    fill(255);
    stroke(0);
    strokeWeight(8);
    textSize(100);
    textAlign(CENTER, CENTER);
    text("英文生存大冒險", width / 2, height / 2 - 80);
    return;
  }

  // 通關成功畫面 (獨立畫面)
  if (gameState === 'CLEARED') {
    background(0); // 純黑夜空
    
    // 煙火邏輯
    for (let i = fireworks.length - 1; i >= 0; i--) {
      let f = fireworks[i];
      fill(f.color);
      noStroke();
      ellipse(f.x, f.y, f.size, f.size);
      f.x += f.vx;
      f.y += f.vy;
      f.size *= 0.98;
      if (f.size < 1) fireworks.splice(i, 1);
    }
    if (frameCount % 10 === 0) {
      fireworks.push({
        x: random(width),
        y: random(height / 2),
        vx: random(-2, 2),
        vy: random(-2, 2),
        size: random(5, 15),
        color: random(['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'])
      });
    }

    // UI 顯示
    restartBtn.show();
    input.hide(); button.hide(); for (let btn of btnOptions) btn.hide();

    fill(255);
    stroke(0);
    strokeWeight(4);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("通關成功", width / 2, height / 2);
    return; // 停止繪製原本的遊戲世界
  }

  if (showRole5) {
    background('#87CEFA'); // 天堂：亮藍天/聖潔感
  } else if (showRole4) {
    background('#2b0000'); // 地獄：深紅/黑暗
  } else {
    background('#87CEEB'); // 早上
  }
  noStroke();
  
  for (let c of clouds) {
    fill(c.color, 200);
    ellipse(c.x, c.y, c.size, c.size * 0.8);
    ellipse(c.x - c.size * 0.4, c.y + c.size * 0.1, c.size * 0.7, c.size * 0.5);
    ellipse(c.x + c.size * 0.4, c.y + c.size * 0.1, c.size * 0.7, c.size * 0.5);
    c.x += c.speed;
    if (c.x > width + 100) c.x = -100;
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    fill(f.color);
    ellipse(f.x, f.y, f.size, f.size);
    f.x += f.vx;
    f.y += f.vy;
    f.size *= 0.98;
    if (f.size < 1) {
      fireworks.splice(i, 1);
    }
  }

  noStroke();
  // 地面顏色
  if (showRole5) fill('#F0FFFF'); // 天堂：雲朵般的地面
  else if (showRole4) fill('#3d0c02'); // 地獄：焦土
  else fill('#669900'); // 地球：草地
  rect(0, height / 2, width, height / 2);

  // 繪製房子 (豪宅/皇宮風格)
  for (let h of houses) {
    // 地基
    fill(100);
    rect(h.x - 10, h.y, h.w + 20, 10);

    // 主體
    fill(h.mainColor);
    rect(h.x, h.y - h.h, h.w, h.h); 
    
    // 繪製窗戶 (帶發光效果)
    for (let win of h.windows) {
      if (showRole4) {
        // 地獄：窗戶透出紅光
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = 'red';
        fill(255, 50, 0, 200);
      } else {
        // 白天：普通窗戶
        drawingContext.shadowBlur = 0;
        fill(50, 70, 90);
      }
      rect(h.x + win.rx, h.y + win.ry, win.w, win.h, 10); // 圓角窗戶
    }
    drawingContext.shadowBlur = 0; // 重置光暈效果

    // 柱子 (Pillars)
    fill(240); // 灰白色柱子
    let pillarW = h.w / (h.pillarCount * 2 + 1);
    for(let i=0; i<h.pillarCount; i++) {
        let px = h.x + pillarW + i * 2 * pillarW;
        rect(px, h.y - h.h, pillarW, h.h);
    }

    // 屋頂 (大三角 + 圓頂)
    fill(h.roofColor);
    if (showRole4) {
      // 地獄：尖刺屋頂
      beginShape();
      vertex(h.x - 20, h.y - h.h);
      let spikes = 5;
      let sw = (h.w + 40) / spikes;
      for(let k=0; k<spikes; k++){
        vertex(h.x - 20 + k*sw + sw/2, h.y - h.h - random(80, 150)); // 尖端
        vertex(h.x - 20 + (k+1)*sw, h.y - h.h); // 底部
      }
      endShape(CLOSE);
    } else {
      // 一般/天堂：圓頂風格
      triangle(h.x - 30, h.y - h.h, h.x + h.w + 30, h.y - h.h, h.x + h.w / 2, h.y - h.h - 120);
      arc(h.x + h.w / 2, h.y - h.h - 60, 120, 120, PI, 0);
      
      if (showRole5) {
        // 天堂：加上光環
        noFill();
        stroke('#FFD700');
        strokeWeight(5);
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'white';
        ellipse(h.x + h.w / 2, h.y - h.h - 140, 150, 30);
        drawingContext.shadowBlur = 0;
        noStroke();
      }
    }

    // 大門 (拱門風格)
    fill('#4A3C31'); 
    let doorW = 80;
    let doorH = 120;
    rect(h.x + h.w / 2 - doorW/2, h.y - doorH, doorW, doorH);
    arc(h.x + h.w / 2, h.y - doorH, doorW, doorW, PI, 0);
    
    // 金色邊框裝飾
    stroke('#FFD700');
    strokeWeight(3);
    noFill();
    rect(h.x, h.y - h.h, h.w, h.h); // 建築外框
    noStroke();
  }

  // 繪製超大氣派噴水池
  let fx = width / 2;
  let fy = height / 2 + 60;

  if (showRole4 && !showRole5) {
    // --- 第二關：地獄 (岩漿坑) ---
    push();
    noStroke();
    
    // 坑洞邊緣 (深色岩石)
    fill(30, 0, 0);
    ellipse(fx, fy + 40, 620, 110);
    
    // 岩漿表面
    fill(200, 50, 0);
    ellipse(fx, fy + 40, 580, 90);
    
    // 岩漿中心發光
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = '#FF4500';
    fill(255, 100, 0, 220);
    ellipse(fx, fy + 40, 500, 70);
    drawingContext.shadowBlur = 0;

    // 產生岩漿泡泡粒子
    if (frameCount % 5 === 0) {
      fountainParticles.push({
        x: random(fx - 200, fx + 200),
        y: fy + 40 + random(-20, 20),
        vx: 0,
        vy: random(-1, -2), // 向上飄
        size: random(5, 15),
        color: color(255, 200, 0, 200),
        type: 'bubble'
      });
    }
    pop();
  } else {
    // --- 第一關與第三關：噴水池 ---
    let waterColor, baseColor, decorColor;
    if (showRole5) { // 天堂
      waterColor = color(200, 240, 255, 200); // 聖水
      baseColor = color(255, 255, 240); // 象牙白
      decorColor = color(255, 215, 0); // 金色
    } else { // 地球
      waterColor = color('#40E0D0');
      baseColor = color(230);
      decorColor = color('#FFD700');
    }

    push();
    noStroke();
    // 基座
    fill(baseColor); ellipse(fx, fy + 40, 600, 100);
    fill(waterColor); ellipse(fx, fy + 40, 560, 85);
    // 下層
    fill(baseColor); rect(fx - 70, fy - 40, 140, 80);
    fill(decorColor); rect(fx - 75, fy + 30, 150, 10);
    fill(baseColor); ellipse(fx, fy - 40, 300, 50);
    fill(waterColor); ellipse(fx, fy - 40, 280, 40);
    // 中層
    fill(baseColor); rect(fx - 50, fy - 110, 100, 70);
    ellipse(fx, fy - 110, 200, 40);
    fill(waterColor); ellipse(fx, fy - 110, 180, 30);
    // 頂層
    fill(baseColor); rect(fx - 30, fy - 170, 60, 60);
    ellipse(fx, fy - 170, 100, 25);
    fill(decorColor); ellipse(fx, fy - 190, 40, 60);

    // 產生噴水粒子
    for(let k=0; k<5; k++){
      fountainParticles.push({ x: fx, y: fy - 200, vx: random(-4, 4), vy: random(-7, -4), size: random(5, 10), color: waterColor, type: 'water' });
    }
    pop();
  }

  for (let i = fountainParticles.length - 1; i >= 0; i--) {
    let p = fountainParticles[i];
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    if (p.type === 'bubble') {
      // 岩漿泡泡：向上飄並變小
      p.y += p.vy;
      p.size *= 0.96; 
      if (p.size < 1) fountainParticles.splice(i, 1);
    } else {
      // 噴泉水滴：受重力影響
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // 重力
      if (p.y > fy + 40) fountainParticles.splice(i, 1);
    }
  }

  for (let d of decorations) {
    fill(d.color);
    if (d.type === 'ember') {
      // 地獄餘燼：向上飄
      ellipse(d.x, d.y, d.size, d.size);
      d.y += d.speedY;
      if (d.y < 0) d.y = height;
    } else if (d.type === 'star') {
      // 天堂星星：閃爍
      let alpha = 150 + 100 * sin(frameCount * 0.1 + d.x);
      let c = color(d.color);
      c.setAlpha(alpha);
      fill(c);
      ellipse(d.x, d.y, d.size, d.size);
    } else {
      // 普通花朵
      ellipse(d.x, d.y, d.size, d.size);
    }
  }

  let char3Sx = char3CurrentFrame * char3FrameW;
  push();
  translate(width / 2 - 500, height / 2);
  scale(4);
  image(char3Img, -char3FrameW / 2, -char3FrameH / 2, char3FrameW, char3FrameH, char3Sx, 0, char3FrameW, char3FrameH);
  pop();

  if (frameCount % 10 === 0) {
    char3CurrentFrame = (char3CurrentFrame + 1) % char3NumFrames;
  }

  if (showRole5) {
    let char5Sx = char5CurrentFrame * char5FrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(char5Img, -char5FrameW / 2, -char5FrameH / 2, char5FrameW, char5FrameH, char5Sx, 0, char5FrameW, char5FrameH);
    pop();

    if (frameCount % 10 === 0) {
      char5CurrentFrame = (char5CurrentFrame + 1) % char5NumFrames;
    }
  } else if (showRole4) {
    let char4Sx = char4CurrentFrame * char4FrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(char4Img, -char4FrameW / 2, -char4FrameH / 2, char4FrameW, char4FrameH, char4Sx, 0, char4FrameW, char4FrameH);
    pop();

    if (frameCount % 10 === 0) {
      char4CurrentFrame = (char4CurrentFrame + 1) % char4NumFrames;
    }
  } else {
    let standSx = standCurrentFrame * standFrameW;
    push();
    translate(width - 200, height / 2);
    scale(1.5);
    image(standImg, -standFrameW / 2, -standFrameH / 2, standFrameW, standFrameH, standSx, 0, standFrameW, standFrameH);
    pop();

    if (frameCount % 10 === 0) {
      standCurrentFrame = (standCurrentFrame + 1) % standNumFrames;
    }
  }

  if (keyIsDown(32) && !isAttacking) {
    isAttacking = true;
    fitCurrentFrame = 0;
  }

  if (isAttacking) {
    posX += 5 * facing;
    let sx = fitCurrentFrame * fitFrameW;
    push();
    translate(posX, posY);
    scale(facing * 3, 3);
    image(fitImg, -fitFrameW / 2, -fitFrameH / 2, fitFrameW, fitFrameH, sx, 0, fitFrameW, fitFrameH);
    pop();

    if (frameCount % 5 === 0) {
      fitCurrentFrame++;
      if (fitCurrentFrame >= fitNumFrames) {
        isAttacking = false;
      }
    }
  } else {
    let isMoving = false;
    if (keyIsDown(RIGHT_ARROW)) {
      posX += 3;
      facing = 1;
      isMoving = true;
    } else if (keyIsDown(LEFT_ARROW)) {
      posX -= 3;
      facing = -1;
      isMoving = true;
    }

    let sx = currentFrame * frameW;
    push();
    translate(posX, posY);
    scale(facing * 3, 3);
    image(walkImg, -frameW / 2, -frameH / 2, frameW, frameH, sx, 0, frameW, frameH);
    pop();

    if (isMoving && frameCount % 5 === 0) {
      currentFrame = (currentFrame + 1) % numFrames;
    } else if (!isMoving) {
      currentFrame = 0;
    }
  }

  let char3X = width / 2 - 500;
  let char3Y = height / 2;
  let standX = width - 200;
  let standY = height / 2;
  
  // 根據距離控制 UI 顯示
  if (gameState === 'PLAY') {
    if (dist(posX, posY, standX, standY) < 250) {
      // 接近出題角色：顯示選項按鈕，隱藏輸入框
      input.hide();
      button.hide();
      for (let btn of btnOptions) btn.show();
      
      // 繪製更明顯的問題背景與文字
      push();
      rectMode(CENTER);
      fill(0, 0, 0, 180); // 半透明黑色背景
      rect(width / 2, height / 2 - 150, 500, 80, 10); // 改為畫面正中央
      fill(255, 255, 0); // 黃色文字
      textSize(32); // 加大字體
      textAlign(CENTER, CENTER);
      text(questionText, width / 2, height / 2 - 150);
      pop();
    } else if (dist(posX, posY, char3X, char3Y) < 250) {
      // 接近大學角色
      for (let btn of btnOptions) btn.hide();
      
      if (!hasAnsweredChar3) {
        // 尚未回答：顯示輸入框與問題
        input.show();
        button.show();
        push();
        fill(0);
        textSize(24);
        textAlign(CENTER);
        text("請問你是甚麼大學?", char3X, char3Y - 120);
        pop();
      } else {
        // 已經回答過：顯示提示 (隱藏輸入框)
        input.hide();
        button.hide();
        push();
        fill(0);
        textSize(24);
        textAlign(CENTER);
        text("提示: 英文首字母是 " + currentAnswer.charAt(0), char3X, char3Y - 120);
        pop();
      }
    } else {
      // 都不在範圍內：全部隱藏
      input.hide();
      button.hide();
      for (let btn of btnOptions) btn.hide();
    }
  }

  fill(255);
  textSize(24);
  textAlign(CENTER);

  // 顯示回答結果
  text(answerResult, width / 2, 50);
  
  textAlign(LEFT);
  text("分數: " + score, 50, 50);

  push();
  textSize(30);
  fill('#FFD700');
  stroke(0);
  strokeWeight(4);
  textAlign(RIGHT, TOP);
  text("學號: 730946", width - 20, 20);
  pop();

  // 顯示答對的動物樣子 (Emoji)
  if (emojiTimer > 0) {
    push();
    textSize(150);
    textAlign(CENTER, CENTER);
    text(displayedEmoji, width / 2, height / 2 - 280);
    pop();
    emojiTimer--;
  }

  // 顯示場景介紹文字 (例如：第二關: 地獄)
  if (sceneIntroTimer > 0) {
    push();
    
    // 計算淡入淡出透明度
    let alpha = 255;
    if (sceneIntroTimer > 150) {
      alpha = map(sceneIntroTimer, 180, 150, 0, 255);
    } else if (sceneIntroTimer < 30) {
      alpha = map(sceneIntroTimer, 30, 0, 255, 0);
    }

    textSize(80);
    textAlign(CENTER, CENTER);
    
    // 加入半透明背景讓文字更清楚
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0, alpha * 0.6); // 背景透明度隨之變化
    rect(width / 2, height / 2, textWidth(sceneIntroText) + 100, 120, 20);

    fill(255, alpha);
    stroke(0, alpha);
    strokeWeight(5);
    text(sceneIntroText, width / 2, height / 2);
    pop();
    sceneIntroTimer--;
  }
}

function generateQuestion() {
  // 如果題目用完了，重新填滿
  if (remainingAnimals.length === 0) {
    remainingAnimals = [...animals];
  }

  // 從剩餘題目中隨機選一個
  let index = floor(random(remainingAnimals.length));
  let correctAnimal = remainingAnimals[index];
  remainingAnimals.splice(index, 1); // 移除已選題目

  currentAnswer = correctAnimal.en;
  questionText = correctAnimal.cn + " 的英文是?";
  
  // 產生選項
  let options = [currentAnswer];
  while (options.length < 3) {
    let other = random(animals).en;
    if (!options.includes(other)) {
      options.push(other);
    }
  }
  
  // 打亂選項順序
  options = shuffle(options);
  
  // 更新按鈕文字
  for (let i = 0; i < 3; i++) {
    btnOptions[i].html(options[i]);
    // 將選項文字存入按鈕物件中以便檢查
    btnOptions[i].value = options[i];
  }
}

function checkOption(index) {
  let selected = btnOptions[index].value;
  if (selected === currentAnswer) {
    answerResult = "答對了！";
    score++;
    
    // 設定要顯示的動物 Emoji 與時間
    let animalData = animals.find(a => a.en === currentAnswer);
    if (animalData) displayedEmoji = animalData.emoji;
    emojiTimer = 60; // 顯示約 1 秒 (60 frames)

    if (!showRole4) {
      role2CorrectCount++;
      if (role2CorrectCount >= 2) {
        showRole4 = true;
        initScenery();
      }
    } else if (!showRole5) {
      role4CorrectCount++;
      if (role4CorrectCount >= 2) {
        showRole5 = true;
        initScenery();
      }
    } else {
      role5CorrectCount++;
      if (role5CorrectCount >= 2) {
        gameState = 'CLEARED';
      }
    }
    for (let i = 0; i < 100; i++) {
      fireworks.push({
        x: random(width),
        y: random(height / 2),
        vx: random(-2, 2),
        vy: random(-2, 2),
        size: random(5, 15),
        color: random(['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'])
      });
    }
    generateQuestion();
  } else {
    answerResult = "答錯了，再試試看！";
  }
}

function checkAnswer() {
  let ans = input.value();
  let char3X = width / 2 - 500;
  let char3Y = height / 2;

  if (dist(posX, posY, char3X, char3Y) < 250) {
    answerResult = "你好，" + ans + " 的同學！";
    hasAnsweredChar3 = true;
  }
  input.value('');
}

function startGame() {
  gameState = 'PLAY';
  startGameBtn.hide();
  sceneIntroText = "第一關: 人間";
  sceneIntroTimer = 180;
}

function resetGame() {
  score = 0;
  role2CorrectCount = 0;
  role4CorrectCount = 0;
  role5CorrectCount = 0;
  showRole4 = false;
  showRole5 = false;
  gameState = 'START'; // 回到開始畫面
  startGameBtn.show(); // 顯示開始按鈕
  remainingAnimals = [...animals];
  generateQuestion();
  restartBtn.hide();
  fireworks = [];
  posX = width / 2;
  posY = height / 2;
  hasAnsweredChar3 = false;
  initScenery();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  input.position(width / 2 - 100, height - 50);
  button.position(width / 2 - 100 + input.width + 25, height - 50);
  
  for (let i = 0; i < 3; i++) {
    btnOptions[i].position(width / 2 - 160 + i * 110, height - 50);
  }
  restartBtn.position(width / 2 - 60, height / 2 + 100);
  startGameBtn.position(width / 2 - 60, height / 2 + 50);
  
  posX = width / 2;
  posY = height / 2;
}

function mousePressed() {
  // 移除原本點擊畫面任意處開始遊戲的邏輯
  // 改由 startGameBtn 控制
}

/* The compositions of two reflections are rotations.
 * The compositions of two rotations of different centers are rotations of ...
 * The compositions of two glide reflection are translation 
 * version0.21 2025/06/15
 * \href{https://creativecommons.org/licenses/by-nc-nd/4.0/}{\ccbyncsa}
 */ 
const WIDTH_CANVAS = 720 * 3/2  ; //=1080
const HEIGHT_CANVAS = 405 * 3/2 ; //=607.5
const CENTER_X = WIDTH_CANVAS/2 ;
const CENTER_Y = HEIGHT_CANVAS/2 ;
const BACK_COLOR = [200, 220, 200] ;
const RADIUS_LARGE = WIDTH_CANVAS ;
const AUTO_SPEED = 0.005 ;
const EPSILON = 5;
const RADIUS_AUT_1 = 250 ;
const RADIUS_AUT_2 = 150;
const RADIUS_AUT_3 = 100;
const RADIUS_AUT_4 = 30;
const SHIFT_GR = 100 ;
const DIV = 5;
const DIV_1 = 10;
const FIRST_PERIOD = 2000;//period
const SECOND_PERIOD = FIRST_PERIOD + 2600;
const THIRD_PERIOD = SECOND_PERIOD + 2600;
const TEST_PERIOD = 200;

let selectComp ;
let selectMode ;
let tilteRatioP ;
let tilteRatioS ;
let stopSwitch ;
let switchState ; 
let autoMode ;
let modeSelect;

const MAX_REFRECT0 = THIRD_PERIOD;
const MAX_REFRECT = MAX_REFRECT0 + SECOND_PERIOD;
const MAX_ROTATE = MAX_REFRECT + FIRST_PERIOD;
const MAX_GLID_REF = MAX_ROTATE + THIRD_PERIOD;

function setup() {
  selectComp = createSelect() ;
  selectComp.option('automatic', 'auto');
  selectComp.option('parallel reflections', 'reflections0') ; /* compositions of two reflections with respect to parallel line */
  selectComp.option('reflections', 'reflections') ; /* compositions of two reflections with respect to non parallel line   */
  selectComp.option('rotations', 'rotations') ; /* compositions of two rotations of different centers  */
  selectComp.option('glide Reflections', 'glideRef'); /* compsition of the same glide refrection is a translation */
  selectComp.selected('auto') ;
  selectComp.position(130 -110, 10) ;
  selectComp.changed( resetBackground ) ;

  autoMode = selectComp.value();

  selectMode = createSelect() ;
  selectMode.option('auto', 'auto') ; /*  auto demo mode */
  selectMode.option('mouse', 'mouse') ; /*  mouse input mode */
  selectMode.selected('auto') ;
  selectMode.position(300 -110, 10) ;

  stopSwitch = createRadio();
  stopSwitch.option('ongoing');
  stopSwitch.option('stopping');
  stopSwitch.selected('ongoing');
  stopSwitch.position(380 -110, 10);

  tilteRatioP = createSlider(0.1, 100-0.1, 100/6) ; /* percentage of angle to PI */
  tilteRatioP.position(660, 10) ;

  tilteRatioS = createSlider(0.1, 100-0.1, 100 * 2.5/5) ; /* percent of angle to PI(1-tilteRatioP/100) */
  tilteRatioS.position(930, 10) ;

  createCanvas(WIDTH_CANVAS, HEIGHT_CANVAS) ;
  background(BACK_COLOR) ;

  textSize(16);//We need to set the fontsize here for using in the draw functin.
}

let i = 0; // time parameter
let h = 0; //parameter controlling auto mode 
let periodState = 0;

function draw() {
  // auto play mode or selecting mode: processing of h
  if (autoMode === 'auto'){
    if (h < MAX_REFRECT0){
      modeSelect = 'reflections0';
      h++; 
    } else if (h < MAX_REFRECT){
      modeSelect = 'reflections';
      h++; 
    } else if (h < MAX_ROTATE){
      modeSelect = 'rotations';
      h++; 
    } else if (h === MAX_ROTATE) {// We need to reset periodState = 0, i = 0 here. 
        // Otherwise in 'glideRef' mode, periodState is 1 and i => i++
      modeSelect = 'glideRef';
      periodState = 0;
      i = 0;
      h++;
    } else if (h < MAX_GLID_REF){
      modeSelect = 'glideRef';
      h++;
    } else {
      h = 0;
    }
  } else {
    modeSelect = autoMode;
  }

  //processing priod state and i
  if (i < FIRST_PERIOD) {
    periodState = 0;
  } else if ( i < SECOND_PERIOD && (modeSelect === 'reflections0' || modeSelect === 'reflections' || modeSelect === 'glideRef') ){
    periodState = 1;
  } else if ( i < THIRD_PERIOD && (modeSelect === 'reflections0' || modeSelect === 'glideRef') ){
    periodState = 2;
  } else {
    periodState = 0;
    i = 0 ;
  }

  // test
  // if (i % TEST_PERIOD === 0){
  //   console.log(periodState);
  //   console.log(modeSelect);
  //   console.log(h);
  //   console.log(i);
  // }

  background(BACK_COLOR) ;
  let p0X ; 
  let p0Y ;
  let q0X ;
  let q0Y ;
  let r0X ;
  let r0Y ;
  let pX ; 
  let pY ;
  let qX ;
  let qY ;
  let rX ;
  let rY ;
  let pqX ;
  let pqY ; 
  let qpX ;
  let qpY ; 
  let prX ;
  let prY ;
  let p1q1X ;
  let p1q1Y ;
  let q1p1X ;
  let q1p1Y ;
  let qrX ;
  let qrY ; 
  let rqX ;
  let rqY ; 
  const NUM_FLICK_1 = 1;
  const NUM_FLICK_2 = 2;
  const NUM_FLICK_3 = 3;
  let angleP;
  let angleS;
  let xX ;
  let xY ;
  let x1X;
  let x1Y;
  let x2X;
  let x2Y;
  let x3X;
  let x3Y;
  let xM1X;
  let xM1Y;
  let xM2X;
  let xM2Y;
  let xM3X;
  let xM3Y;

  let smallShift = 2;// shift segments in 'reflection0' to separete each other

  // text('Composition of:', 10, 29-2);
  text('Main Angle:', 570, 29-2);
  text('Secondary Angle:', 800, 29-2);
  switchState = stopSwitch.value();

  let radiusAut;
  if (modeSelect === 'reflections') {
    radiusAut = RADIUS_AUT_1;
  } else if (modeSelect === 'rotations' || modeSelect === 'glideRef'){
    radiusAut = RADIUS_AUT_2;
  } else if (modeSelect === 'reflections0') {
    radiusAut = RADIUS_AUT_3;
  }

  if (selectMode.value() === 'auto') {
    xX = CENTER_X + radiusAut * cos(AUTO_SPEED * i) ;
    xY = CENTER_Y - radiusAut * sin(AUTO_SPEED * i) ;
    i = freezingFrame(switchState,i);//i=i++ ; or i = i;
  } else if ( selectMode.value() === 'mouse' ) {
    if ( mouseX >= 0 && mouseX <= WIDTH_CANVAS &&  mouseY >= 0 && mouseY <=HEIGHT_CANVAS ){
      xX = mouseX ;
      xY = mouseY ;
    }
  }

  let xPX = xX + RADIUS_AUT_4 * cos(AUTO_SPEED * i /2);
  let xPY = xY + RADIUS_AUT_4 * sin(AUTO_SPEED * i /2);
  let xDX = xX - RADIUS_AUT_4 * cos(AUTO_SPEED * i /2);
  let xDY = xY - RADIUS_AUT_4 * sin(AUTO_SPEED * i /2);
  
  if (modeSelect === 'reflections0'){
    let halfWidth = HEIGHT_CANVAS/DIV_1;
    pqX = WIDTH_CANVAS;
    pqY = CENTER_Y - halfWidth;
    qpX = 0;
    qpY = pqY;
    p1q1X = pqX;
    p1q1Y = CENTER_Y + halfWidth;
    q1p1X = qpX;
    q1p1Y = p1q1Y;
    let p2q2X = pqX;
    let p2q2Y = p1q1Y+2 * halfWidth;
    let q2p2X = qpX;
    let q2p2Y = p2q2Y;
    let p3q3X = pqX;
    let p3q3Y = p2q2Y+ 2 * halfWidth;
    let q3p3X = qpX;
    let q3p3Y = p3q3Y;
    let pM1qM1X = pqX;
    let pM1qM1Y = pqY - 2 * halfWidth;
    let qM1pM1X = qpX ;
    let qM1pM1Y = pM1qM1Y;
    let pM2qM2X = pqX;
    let pM2qM2Y = pqY - 4 * halfWidth;
    let qM2pM2X = qpX ;
    let qM2pM2Y = pM2qM2Y;
    let pM3qM3X = pqX;
    let pM3qM3Y = pqY - 6 * halfWidth;
    let qM3pM3X = qpX ;
    let qM3pM3Y = pM3qM3Y;
    let xP1X;
    let xP1Y;
    let xD1X;
    let xD1Y;
    let xP2X;
    let xP2Y;
    let xD2X;
    let xD2Y;
    let xPM2X;
    let xPM2Y;
    let xDM2X;
    let xDM2Y;
    let xPM3X;
    let xPM3Y;
    let xP3X;
    let xP3Y;
    let xD3X;
    let xD3Y;
    let xP4X;
    let xP4Y;
    let xD4X;
    let xD4Y;
    let xPM4X;
    let xPM4Y;
    let xDM4X;
    let xDM4Y;

    [xPM1X, xPM1Y] = refPoint(xPX, xPY, pqX, pqY, qpX, qpY);
    [xDM1X, xDM1Y] = refPoint(xDX, xDY, pqX, pqY, qpX, qpY);
    [xP1X, xP1Y] = refPoint(xPX, xPY, p1q1X, p1q1Y, q1p1X, q1p1Y);
    [xD1X, xD1Y] = refPoint(xDX, xDY, p1q1X, p1q1Y, q1p1X, q1p1Y);

    [xP2X, xP2Y] = refPoint(xPM1X, xPM1Y, p1q1X, p1q1Y, q1p1X, q1p1Y);
    [xD2X, xD2Y] = refPoint(xDM1X, xDM1Y, p1q1X, p1q1Y, q1p1X, q1p1Y);
    [xPM2X, xPM2Y] = refPoint(xP1X, xP1Y, pqX, pqY, qpX, qpY);
    [xDM2X, xDM2Y] = refPoint(xD1X, xD1Y, pqX, pqY, qpX, qpY);
    
    [xPM3X, xPM3Y] = refPoint(xP2X, xP2Y, pqX, pqY, qpX, qpY);
    [xDM3X, xDM3Y] = refPoint(xD2X, xD2Y, pqX, pqY, qpX, qpY);
    [xP3X, xP3Y] = refPoint(xPM2X, xPM2Y, p1q1X, p1q1Y, q1p1X, q1p1Y);
    [xD3X, xD3Y] = refPoint(xDM2X, xDM2Y, p1q1X, p1q1Y, q1p1X, q1p1Y);
   
    [xP4X, xP4Y] = refPoint(xPM3X, xPM3Y, p1q1X, p1q1Y, q1p1X, q1p1Y);
    [xD4X, xD4Y] = refPoint(xDM3X, xDM3Y, p1q1X, p1q1Y, q1p1X, q1p1Y,pqX);
    [xPM4X, xPM4Y] = refPoint(xP3X, xP3Y, pqX, pqY, qpX, qpY );
    [xDM4X, xDM4Y] = refPoint(xD3X, xD3Y, pqX, pqY, qpX, qpY);
    strokeWeight(2) ;
    line(pqX, pqY, qpX, qpY);
    strokeWeight(1) ;

    if (periodState === 0) {
      strokeWeight(1) ;
      drawRef(xPX - smallShift, xPY, xPM1X - smallShift, xPM1Y, NUM_FLICK_2);
      drawRef(xDX - smallShift, xDY, xDM1X - smallShift, xDM1Y, NUM_FLICK_3);
      lineFlickMark(xPX, xPY, xDX, xDY, NUM_FLICK_1);
      lineFlickMark(xPM1X, xPM1Y, xDM1X, xDM1Y, NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(xDX, xDY);

      stroke('red'); 
      point(xPM1X, xPM1Y);
      point(xDM1X, xDM1Y);

    } else if  (periodState === 1) {
      drawRef(xPM1X - smallShift, xPM1Y, xPX - smallShift, xPY, NUM_FLICK_2);
      drawRef(xDM1X - smallShift, xDM1Y, xDX - smallShift, xDY, NUM_FLICK_3);
      drawRef(xP1X + smallShift, xP1Y, xPX + smallShift, xPY, NUM_FLICK_2);
      drawRef(xD1X + smallShift, xD1Y, xDX + smallShift, xDY, NUM_FLICK_3);

      strokeWeight(2) ;
      line(p1q1X, p1q1Y, q1p1X, q1p1Y);

      strokeWeight(1) ;
      lineFlickMark(xPX, xPY, xDX, xDY,NUM_FLICK_1);
      lineFlickMark(xPM1X, xPM1Y, xDM1X, xDM1Y,NUM_FLICK_1);
      lineFlickMark(xP1X, xP1Y, xD1X, xD1Y,NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(xDX, xDY);

      stroke('red'); 
      point(xPM1X, xPM1Y);
      point(xDM1X, xDM1Y);
      point(xP1X, xP1Y);
      point(xD1X, xD1Y);
    } else if  (periodState === 2) {
      strokeWeight(2) ;
      line(p1q1X, p1q1Y, q1p1X, q1p1Y);
      line(p2q2X, p2q2Y, q2p2X, q2p2Y);
      // line(p3q3X, p3q3Y, q3p3X, q3p3Y);
      line(pM1qM1X, pM1qM1Y, qM1pM1X, qM1pM1Y);
      strokeWeight(1) ;

      lineFlickMark(xPX, xPY, xDX, xDY, NUM_FLICK_1);
      lineFlickMark(xP1X, xP1Y, xD1X, xD1Y, NUM_FLICK_1);
      lineFlickMark(xP2X, xP2Y, xD2X, xD2Y, NUM_FLICK_1);
      lineFlickMark(xP3X, xP3Y, xD3X, xD3Y, NUM_FLICK_1);
      lineFlickMark(xP4X, xP4Y, xD4X, xD4Y, NUM_FLICK_1);
      lineFlickMark(xPM1X, xPM1Y, xDM1X, xDM1Y, NUM_FLICK_1);
      lineFlickMark(xPM2X, xPM2Y, xDM2X, xDM2Y, NUM_FLICK_1);
      lineFlickMark(xPM3X, xPM3Y, xDM3X, xDM3Y, NUM_FLICK_1);
      lineFlickMark(xPM4X, xPM4Y, xDM4X, xDM4Y, NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(xDX, xDY);
      point(xP2X, xP2Y);
      point(xD2X, xD2Y);
      point(xP4X, xP4Y);
      point(xD4X, xD4Y);
      point(xPM2X, xPM2Y);
      point(xDM2X, xDM2Y);
      point(xPM4X, xPM4Y);
      point(xDM4X, xDM4Y);

      stroke('red'); 
      point(xP1X, xP1Y);
      point(xD1X, xD1Y);
      point(xP3X, xP3Y);
      point(xD3X, xD3Y);
      point(xPM1X, xPM1Y);
      point(xDM1X, xDM1Y);
      point(xPM3X, xPM3Y);
      point(xDM3X, xDM3Y);
    }
    strokeWeight(1);
    stroke('black'); 
  } else if (modeSelect === 'reflections'){
    angleP = PI * tilteRatioP.value()/100 ;
    pX = CENTER_X;
    pY = CENTER_Y;
    qX = pX + RADIUS_AUT_1;
    qY = pY;
    rX = pX + RADIUS_AUT_1 * cos(angleP) ;
    rY = pY - RADIUS_AUT_1 * sin(angleP) ; 
    pqX = qX + 3 * RADIUS_LARGE;
    pqY = qY ;
    qpX = 0 ;
    qpY = qY ;
    prX = pX + RADIUS_LARGE * cos(angleP) ;
    prY = pY - RADIUS_LARGE * sin(angleP) ; 
    rpX = pX - RADIUS_LARGE * cos(angleP) ;
    rpY = pY + RADIUS_LARGE * sin(angleP) ;
  
    strokeWeight(2) ;
    line(pqX, pqY, qpX, qpY);

    if (periodState === 0) {
      [x1X, x1Y] = refPoint(xX, xY, pX, pY, qX, qY);
      drawRef(xX, xY, x1X, x1Y, 1);
      strokeWeight(5) ;
      stroke('red');
      line(pX, pY, xX, xY);
      stroke('black') ;
      line(pX, pY, x1X, x1Y);
      strokeWeight(12);
      stroke('black'); 
      point(xX, xY);
      stroke('red'); 
      point(x1X, x1Y);

    } else if  (periodState === 1) {
      line(prX, prY, rpX ,rpY);

      [x1X, x1Y] = refPoint(xX, xY, pX, pY, qX, qY);
      drawRef(xX, xY, x1X, x1Y, 1);

      [xdPX, xdPY] = refPoint(x1X, x1Y,pX, pY, rX, rY);
      drawRef(x1X, x1Y, xdPX, xdPY, 2);

      strokeWeight(5) ;
      stroke('red');
      line(pX, pY, xX, xY);
      line(pX, pY, xdPX, xdPY);
      stroke('black') ;
      line(pX, pY, x1X, x1Y);

      strokeWeight(12);
      stroke('black'); 
      point(xX, xY);
      stroke('red'); 
      point(x1X, x1Y);
      stroke('green'); 
      point(xdPX, xdPY);
    } 
  
    strokeWeight(1);
    stroke('black'); 
  } else if (modeSelect === 'rotations') {
    angleP = PI * tilteRatioP.value()/100 ;
    angleS = (PI - angleP) * tilteRatioS.value()/100 ;

    p0X = 0;
    p0Y = 0;
    q0X = p0X + RADIUS_AUT_2 * (cos(angleP) - sin(angleP)/tan(angleP + angleS) );// + =>  - 
    q0Y = p0Y;
    r0X = p0X + RADIUS_AUT_2 * cos(angleP) ;
    r0Y = p0Y - RADIUS_AUT_2 * sin(angleP) ; 
    pqr0X =(p0X + q0X +r0X)/3;
    pqr0Y =(p0Y + q0Y +r0Y)/3;

    let D = max(abs(q0X-p0X), abs(q0Y-p0Y),abs(r0X-p0X),abs(r0Y-p0Y), abs(q0X-r0X),abs(q0Y-r0Y));
    let scaleF = 2*RADIUS_AUT_2/D;
    pX = CENTER_X +scaleF*(p0X-pqr0X);
    pY = CENTER_Y + scaleF*(p0Y-pqr0Y);
    qX = CENTER_X +scaleF*(q0X-pqr0X);
    qY = CENTER_Y + scaleF*(q0Y-pqr0Y);                                          //since y axis is the inverse direction
    rX = CENTER_X +scaleF*(r0X-pqr0X);
    rY = CENTER_Y + scaleF*(r0Y-pqr0Y);
    pqX = qX + 3 * WIDTH_CANVAS;
    pqY = qY ;
    qpX = 0 ;
    qpY = qY ;
    prX = pX +  3 * WIDTH_CANVAS * cos(angleP) ;
    prY = pY -  3 * WIDTH_CANVAS * sin(angleP) ; 
    rpX = pX -  3 * WIDTH_CANVAS * cos(angleP) ;
    rpY = pY +  3 * WIDTH_CANVAS * sin(angleP) ;

    strokeWeight(2) ;
    line(pqX, pqY, qpX, qpY);
    line(prX, prY, rpX ,rpY);

    let d = dist(qX, qY, rX, rY);
    if (d > EPSILON ){
      let replaceX =  3 * WIDTH_CANVAS * (rX - qX)/d;
      let replaceY =  3 * WIDTH_CANVAS * (rY - qY)/d; 
      rqX = qX + replaceX;
      rqY = qY + replaceY;
      qrX = qX - replaceX;
      qrY = qY - replaceY;
      line(rqX ,rqY, qrX, qrY);   
    } else {
      ;
    }

    if (periodState === 0 || periodState === 1) {
      [x1X, x1Y] = refPoint(xX, xY, pX, pY, qX, qY);
      drawRef(xX, xY, x1X, x1Y, NUM_FLICK_1);

      [xdPX, xdPY] = refPoint(x1X, x1Y,pX, pY, rX, rY)
      drawRef(x1X, x1Y, xdPX, xdPY, NUM_FLICK_2);

      [xtPX, xtPY] = refPoint(x1X, x1Y, qX, qY, rX, rY)
      drawRef(x1X, x1Y, xtPX, xtPY, NUM_FLICK_3);

      strokeWeight(5) ;
      line(pX, pY, x1X, x1Y);
      line(rX, rY, x1X, x1Y);
      line(qX, qY, x1X, x1Y);

      stroke(255, 0, 0) ;
      line(pX, pY, xX, xY);
      line(pX, pY, xdPX, xdPY);
      stroke(0, 0,255) ;
      line(rX, rY, xdPX, xdPY);
      line(rX, rY, xtPX, xtPY);
      stroke(0,255, 0) ;
      line(qX, qY, xtPX, xtPY);
      line(qX, qY, xX, xY);

      stroke(0, 0, 0) ;
      strokeWeight(1) ;

      strokeWeight(12);
      stroke('black'); 
      point(xX, xY);
      stroke('green'); 
      point(x1X, x1Y);
      stroke('blue'); 
      point(xdPX, xdPY);
      stroke('red'); 
      point(xtPX, xtPY);     
    }
    strokeWeight(1);
    stroke('black'); 
  } else if (modeSelect === 'glideRef') {
    pqX = WIDTH_CANVAS;
    pqY = CENTER_Y;
    qpX = 0;
    qpY = pqY;
    strokeWeight(2) ;
    line(pqX,pqY, qpX, qpY);
    strokeWeight(1) ;
    let mPX;
    let mPY;
    let mDX;
    let mDY;
    let mP1X;
    let mP1Y;
    let mP2X;
    let mP2Y;
    let mP3X;
    let mP3Y;
    let mP4X;
    let mP4Y;
    let mP5X;
    let mP5Y;
    let mD1X;
    let mD1Y;
    let mD2X;
    let mD2Y;
    let mD3X;
    let mD3Y;
    let mD4X;
    let mD4Y;
    let mD5X;
    let mD5Y;
    let gP1X;
    let gP1Y;
    let gP2X;
    let gP2Y;
    let gP3X;
    let gP3Y;
    let gP4X;
    let gP4Y;
    let gP5X;
    let gP5Y;
    let gD1X;
    let gD1Y;
    let gD2X;
    let gD2Y;
    let gD3X;
    let gD3Y;
    let gD4X;
    let gD4Y;
    let gD5X;
    let gD5Y;
    let mPM1X;
    let mPM1Y;
    let mPM2X;
    let mPM2Y;
    let mPM3X;
    let mPM3Y;
    let mPM4X;
    let mPM4Y;
    let mPM5X;
    let mPM5Y;
    let mDM1X;
    let mDM1Y;
    let mDM2X;
    let mDM2Y;
    let mDM3X;
    let mDM3Y;
    let mDM4X;
    let mDM4Y;
    let mDM5X;
    let mDM5Y;
    let gPM1X;
    let gPM1Y;
    let gPM2X;
    let gPM2Y;
    let gPM3X;
    let gPM3Y;
    let gPM4X;
    let gPM4Y;
    let gPM5X;
    let gPM5Y;
    let gDM1X;
    let gDM1Y;
    let gDM2X;
    let gDM2Y;
    let gDM3X;
    let gDM3Y;//gdM3Y
    let gDM4X;
    let gDM4Y;
    let gDM5X;
    let gDM5Y;
 
    [mPX, mPY, mP1X, mP1Y, gP1X, gP1Y] = glideRef(xPX, xPY, pqX, pqY, qpX, qpY);
    [mP1X, mP1Y, mP2X, mP2Y, gP2X, gP2Y] = glideRef(gP1X, gP1Y, pqX, pqY, qpX, qpY);
    [mP2X, mP2Y, mP3X, mP3Y, gP3X, gP3Y] = glideRef(gP2X, gP2Y, pqX, pqY, qpX, qpY);
    [mP3X, mP3Y, mP4X, mP4Y, gP4X, gP4Y] = glideRef(gP3X, gP3Y, pqX, pqY, qpX, qpY);
    [mP4X, mP4Y, mP5X, mP5Y, gP5X, gP5Y] = glideRef(gP4X, gP4Y, pqX, pqY, qpX, qpY);

    [mPMX, mPMY, mPM1X, mPM1Y, gPM1X, gPM1Y] = glideRef(xPX, xPY, qpX, qpY, pqX, pqY);//another direction
    [mPM1X, mPM1Y, mPM2X, mPM2Y, gPM2X, gPM2Y] = glideRef(gPM1X, gPM1Y, qpX, qpY, pqX, pqY);//another direction
    [mPM2X, mPM2Y, mPM3X, mPM3Y, gPM3X, gPM3Y] = glideRef(gPM2X, gPM2Y, qpX, qpY, pqX, pqY);//another direction
    [mPM3X, mPM3Y, mPM4X, mPM4Y, gPM4X, gPM4Y] = glideRef(gPM3X, gPM3Y, qpX, qpY, pqX, pqY);//another direction
    [mPM4X, mPM4Y, mPM5X, mPM5Y, gPM5X, gPM5Y] = glideRef(gPM4X, gPM4Y, qpX, qpY, pqX, pqY);//another direction

    [mDX, mDY, mD1X, mD1Y, gD1X, gD1Y] = glideRef(xDX, xDY, pqX, pqY, qpX, qpY);
    [mD1X, mD1Y, mD2X, mD2Y, gD2X, gD2Y] = glideRef(gD1X, gD1Y, pqX, pqY, qpX, qpY);//another direction
    [mD2X, mD2Y, mD3X, mD3Y, gD3X, gD3Y] = glideRef(gD2X, gD2Y, pqX, pqY, qpX, qpY);
    [mD3X, mD3Y, mD4X, mD4Y, gD4X, gD4Y] = glideRef(gD3X, gD3Y, pqX, pqY, qpX, qpY);
    [mD4X, mD4Y, mD5X, mD5Y, gD5X, gD5Y] = glideRef(gD4X, gD4Y, pqX, pqY, qpX, qpY);

    [mDMX, mDMY, mDM1X, mDM1Y, gDM1X, gDM1Y] = glideRef(xDX, xDY, qpX, qpY, pqX, pqY);//another direction
    [mDM1X, mDM1Y, mDM2X, mDM2Y, gDM2X, gDM2Y] = glideRef(gDM1X, gDM1Y, qpX, qpY, pqX, pqY);//another direction
    [mDM2X, mDM2Y, mDM3X, mDM3Y, gDM3X, gDM3Y] = glideRef(gDM2X, gDM2Y, qpX, qpY, pqX, pqY);//another direction
    [mDM3X, mDM3Y, mDM4X, mDM4Y, gDM4X, gDM4Y] = glideRef(gDM3X, gDM3Y, qpX, qpY, pqX, pqY);//another direction
    [mDM4X, mDM4Y, mDM5X, mDM5Y, gDM5X, gDM5Y] = glideRef(gDM4X, gDM4Y, qpX, qpY, pqX, pqY);//another direction
    
    if (periodState === 0) {
      drawGridRef (xPX, xPY, mPX, mPY, mP1X, mP1Y, gP1X, gP1Y, NUM_FLICK_2);
      drawGridRef (xDX, xDY, mDX, mDY, mD1X, mD1Y, gD1X, gD1Y, NUM_FLICK_3);

      lineFlickMark(xPX, xPY,xDX, xDY, NUM_FLICK_1);
      lineFlickMark(gP1X, gP1Y, gD1X, gD1Y, NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(xDX, xDY);
      stroke('red'); 
      point(gP1X, gP1Y);
      point(gD1X, gD1Y);
      // stroke('red'); 
      // point(xdPX, xdPY);
    } else if (periodState === 1) {
      drawGridRef (xPX, xPY, mPX, mPY, mP1X, mP1Y, gP1X, gP1Y, NUM_FLICK_2);
      drawGridRef (xDX, xDY, mDX, mDY, mD1X, mD1Y, gD1X, gD1Y, NUM_FLICK_3);
      drawGridRef (xPX, xPY, mPX, mPY, mPM1X, mPM1Y, gPM1X, gPM1Y, NUM_FLICK_2);
      drawGridRef (xDX, xDY, mDMX, mDMY, mDM1X, mDM1Y, gDM1X, gDM1Y, NUM_FLICK_3);

      lineFlickMark(xPX, xPY, xDX, xDY, NUM_FLICK_1);
      lineFlickMark(gP1X, gP1Y, gD1X, gD1Y, NUM_FLICK_1);
      lineFlickMark(gPM1X, gPM1Y, gDM1X, gDM1Y, NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(xDX, xDY);
      stroke('red'); 
      point(gP1X, gP1Y);
      point(gPM1X, gPM1Y);
      point(gD1X, gD1Y);
      point(gDM1X, gDM1Y);
    } else if (periodState === 2) {
      lineFlickMark(xPX, xPY, xDX, xDY, NUM_FLICK_1);
      lineFlickMark(gP1X, gP1Y, gD1X, gD1Y, NUM_FLICK_1);
      lineFlickMark(gP2X, gP2Y, gD2X, gD2Y, NUM_FLICK_1);
      lineFlickMark(gP3X, gP3Y, gD3X, gD3Y, NUM_FLICK_1);
      lineFlickMark(gP4X, gP4Y, gD4X, gD4Y, NUM_FLICK_1);
      lineFlickMark(gP5X, gP5Y, gD5X, gD5Y, NUM_FLICK_1);

      lineFlickMark(gPM1X, gPM1Y, gDM1X, gDM1Y, NUM_FLICK_1);
      lineFlickMark(gPM2X, gPM2Y, gDM2X, gDM2Y, NUM_FLICK_1);
      lineFlickMark(gPM3X, gPM3Y, gDM3X, gDM3Y, NUM_FLICK_1);
      lineFlickMark(gPM4X, gPM4Y, gDM4X, gDM4Y, NUM_FLICK_1);
      lineFlickMark(gPM5X, gPM5Y, gDM5X, gDM5Y, NUM_FLICK_1);

      strokeWeight(12);
      stroke('black'); 
      point(xPX, xPY);
      point(gP2X, gP2Y);
      point(gPM2X, gPM2Y);
      point(gP4X, gP4Y);
      point(gPM4X, gPM4Y);
      point(xDX, xDY);
      point(gD2X, gD2Y);
      point(gDM2X, gDM2Y);
      point(gD4X, gD4Y);
      point(gDM4X, gDM4Y);
      
      stroke('red'); 
      point(gP1X, gP1Y);
      point(gPM1X, gPM1Y);
      point(gP3X, gP3Y);
      point(gPM3X, gPM3Y);
      point(gP5X, gP5Y);
      point(gPM5X, gPM5Y);

      point(gD1X, gD1Y);
      point(gDM1X, gDM1Y);
      point(gD3X, gD3Y);
      point(gDM3X, gDM3Y);
      point(gD5X, gD5Y);
      point(gDM5X, gDM5Y);
    }
    strokeWeight(1);
    stroke('black'); 
  } 
}

function refPoint (xXcd, xYcd, pXcd, pYcd, qXcd, qYcd ){
  let sqdistancePQ = sq(qXcd - pXcd) + sq(qYcd - pYcd);
  let innerProduct = (xXcd - pXcd)*(qXcd - pXcd)
    + (xYcd - pYcd)*(qYcd-pYcd);
  let uXcd ;
  let uYcd ;
  let x1Xcd ;
  let x1Ycd ;
  if (sqdistancePQ == 0){
    uXcd = 0;
    uYcd = 0;
  } else {
    uXcd = innerProduct * (qXcd-pXcd)/sqdistancePQ;
    uYcd = innerProduct * (qYcd-pYcd)/sqdistancePQ;
    x1Xcd = 2 * (pXcd + uXcd) - xXcd;
    x1Ycd = 2 * (pYcd + uYcd) - xYcd;
  //  line(xXcd, xYcd, pXcd +uXcd, pYcd +uYcd );
    return [x1Xcd, x1Ycd]; 
  }
}

function glideRef (xXcd, xYcd, pXcd, pYcd, qXcd, qYcd) {
  let x1X;
  let x1Y;
  [x1X, x1Y] = refPoint (xXcd, xYcd, pXcd, pYcd, qXcd, qYcd );
  let mxx1X = (xXcd + x1X)/2;
  let mxx1Y = (xYcd + x1Y)/2;

  let dispX = (qXcd - pXcd)/DIV;
  let dispY = (qYcd - pYcd)/DIV;
  let gxx1X = mxx1X + dispX; // g.=gride
  let gxx1Y = mxx1Y + dispY;
  let gx1X = x1X + dispX;
  let gx1Y = x1Y + dispY;
  return [mxx1X, mxx1Y, gxx1X,gxx1Y, gx1X, gx1Y];
}

function lineFlickMark(xXcd, xYcd, x1Xcd, x1Ycd, num) {
  let mxx1X = (xXcd +  x1Xcd)/2;
  let mxx1Y = (xYcd +  x1Ycd)/2;
  let unitX;
  let unitY;
  let dxxP = dist(xXcd, xYcd, x1Xcd, x1Ycd);
  if (dxxP > EPSILON ){
    unitX = EPSILON * (xXcd - x1Xcd)/dxxP;
    unitY = EPSILON * (xYcd - x1Ycd)/dxxP; 
  } else {
    unitX = xXcd - x1Xcd;
    unitY = xYcd - x1Ycd; 
  }

  strokeWeight(1) ;
  if (num == 1){
    line(mxx1X -unitY, mxx1Y + unitX, mxx1X +unitY, mxx1Y - unitX);   
  } else if (num == 2){
    line(mxx1X -unitX/2 -unitY, mxx1Y -unitY/2  + unitX, mxx1X -unitX/2 +unitY, mxx1Y - unitY/2 - unitX); 
    line(mxx1X +unitX/2 -unitY, mxx1Y +unitY/2  + unitX, mxx1X +unitX/2 +unitY, mxx1Y + unitY/2 - unitX);   
  }  else if (num == 3){
    line(mxx1X -unitX -unitY, mxx1Y -unitY  + unitX, mxx1X -unitX +unitY, mxx1Y - unitY - unitX); 
    line(mxx1X +unitX -unitY, mxx1Y +unitY  + unitX, mxx1X +unitX +unitY, mxx1Y + unitY - unitX);
    line(mxx1X -unitY, mxx1Y + unitX, mxx1X +unitY, mxx1Y - unitX);   
  }
  line(xXcd, xYcd, x1Xcd, x1Ycd);
}

function rightAngleMark(xXcd, xYcd, x1Xcd, x1Ycd, instR) {
  let unitX;
  let unitY;
  let dxxP = dist(xXcd, xYcd, x1Xcd, x1Ycd);
  if (dxxP > EPSILON ){
    unitX = EPSILON * (xXcd - x1Xcd)/dxxP;
    unitY = EPSILON * (xYcd - x1Ycd)/dxxP; 
  } else {
    unitX = xXcd - x1Xcd;
    unitY = xYcd - x1Ycd; 
  }
  if (instR === 'botRight'){
      line(x1Xcd + 2*unitY, x1Ycd - 2*unitX, x1Xcd + 2*unitY + 2*unitX, x1Ycd - 2*unitX + 2*unitY );
      line(x1Xcd + 2*unitX, x1Ycd + 2*unitY, x1Xcd + 2*unitY + 2*unitX, x1Ycd - 2*unitX + 2*unitY );
  } else if (instR === 'botLeft') {
      line(x1Xcd - 2*unitY, x1Ycd + 2*unitX, x1Xcd - 2*unitY + 2*unitX, x1Ycd + 2*unitX + 2*unitY );
      line(x1Xcd +2*unitX, x1Ycd + 2*unitY, x1Xcd -2*unitY + 2*unitX, x1Ycd + 2*unitX + 2*unitY );
  } else if (instR === 'topRight') {
      line(xXcd - 2*unitY, xYcd + 2*unitX, xXcd - 2*unitY - 2*unitX, xYcd + 2*unitX - 2*unitY );
      line(xXcd - 2*unitX, xYcd - 2*unitY, xXcd - 2*unitX - 2*unitY, xYcd - 2*unitY + 2*unitX );
  } else if (instR === 'topleft') {
    line(xXcd + 2*unitY, xYcd - 2*unitX, xXcd + 2*unitY - 2*unitX, xYcd - 2*unitX - 2*unitY );
    line(xXcd - 2*unitX, xYcd - 2*unitY, xXcd - 2*unitX + 2*unitY, xYcd - 2*unitY - 2*unitX );
  } 
}

function drawRef (xXcd, xYcd, x1Xcd, x1Ycd, num){
  let cXcd = (xXcd + x1Xcd)/2 ;
  let cYcd = (xYcd + x1Ycd)/2 ;
  let instR = 'botRight';
  lineFlickMark(xXcd, xYcd, cXcd, cYcd, num);
  lineFlickMark(x1Xcd, x1Ycd, cXcd, cYcd, num);
  //rightAngleMark(xXcd, xYcd, cYcd, cYcd, instR);
  rightAngleMark(x1Xcd, x1Ycd, cXcd, cYcd, instR);
}

function drawGridRef (xXcd, xYcd, mxx1X, mxx1Y, gxx1X, gxx1Y, gx1X, gx1Y, num){
  let instR = 'botRight';
  lineFlickMark(xXcd, xYcd, mxx1X, mxx1Y, num);
  lineFlickMark(gx1X, gx1Y, gxx1X, gxx1Y, num);
  rightAngleMark(xXcd, xYcd, mxx1X, mxx1Y, instR);
  rightAngleMark(gx1X, gx1Y, gxx1X, gxx1Y, instR);
}

function freezingFrame(sState,num){
  if ( sState == 'ongoing' ){ //'ongoing'
    return num + 1;
  } else if ( sState == 'stopping') {
    return num ;
  }
}

function resetBackground () {
    background(BACK_COLOR) ;
    i = 0;
    h = 0;
    periodState = 0;
    autoMode = selectComp.value();
}

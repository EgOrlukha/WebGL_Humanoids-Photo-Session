"use strict";

var canvas;
var gl;
var program;

var theta_slider;
var phi_slider;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// IDs of the model
var torsoId = 0;
var headId  = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var neckId = 10;
var RshoulderId = 11;
var LshoulderId = 12;
var RshoeId = 13;
var LshoeId = 14;

// IDs of the photographer
var PhtorsoId = 15;
var PhheadId  = 16;
var PhleftUpperArmId = 17;
var PhleftLowerArmId = 18;
var PhrightUpperArmId = 19;
var PhrightLowerArmId = 20;
var PhleftUpperLegId = 21;
var PhleftLowerLegId = 22;
var PhrightUpperLegId = 23;
var PhrightLowerLegId = 24;
var PhneckId = 25;
var PhRshoulderId = 26;
var PhLshoulderId = 27;
var PhRshoeId = 28;
var PhLshoeId = 29;

// sizes of humanoids' bodyparts
var torsoHeight = 5.0*0.5;
var torsoWidth = 1.3*0.5;
var upperArmHeight = 3.0*0.5;
var lowerArmHeight = 2.0*0.5;
var upperArmWidth  = 0.7*0.5;
var lowerArmWidth  = 0.5*0.5;
var upperLegWidth  = 0.8*0.5;
var lowerLegWidth  = 0.5*0.5;
var lowerLegHeight = 3.0*0.5;
var upperLegHeight = 3.0*0.5;
var headHeight = 1.5*0.5;
var headWidth = 1.5*0.5;
var neckHeight = 0.9*0.5;
var neckWidth = 0.7*0.5;
var shoulderWidth = 1.0*0.5;
var shoulderHeight = 1.0*0.5;
var shoeWidth = 0.7*0.5;
var shoeHeight = 1.3*0.5;

// Size of the photocamera
var legHeight = 4;
var legWidth = 0.3;
var platformHeight = 0.2;
var platformWidth = 2;
var blockHeight = 1.9;
var blockWidth = 1.9;
var lensHeight = 0.7;
var lensWidth = 0.7;

var numNodes = 15*2+6; // (humanoid body)*2+(camera)
var numAngles = 11;
var angle = 0;

// to change positions of bodyparts play here
// Model
var ModelTorso = [0, 90, 0]; //rotation [X,Y,Z]
var ModelHead = [0, 0, 0]; //rotation [X,Y,Z]
var ModelLupArm = [140, 0, 10]; //rotation [X,Y,Z]
var ModelLlowArm = [-30, 0, 0]; //rotation [X,Y,Z]
var ModelRupArm = [130, 0, -10]; //rotation [X,Y,Z]
var ModelRlowArm = [-60, 0, 0]; //rotation [X,Y,Z]
var ModelLupLeg = [165, 0, 5]; //rotation [X,Y,Z]
var ModelLlowLeg = [10, 0, 0]; //rotation [X,Y,Z]
var ModelRupLeg = [185, 0, -5]; //rotation [X,Y,Z]
var ModelRlowLeg = [10, 0, 0]; //rotation [X,Y,Z]
var ModelNeck = [0, 90, 0]; //rotation [X,Y,Z]
var ModelRshoulder = [0, 0, 0]; //rotation [X,Y,Z]
var ModelLshoulder = [0, 0, 0]; //rotation [X,Y,Z]
var ModelRshoe = [-90, 0, 0]; //rotation [X,Y,Z]
var ModelLshoe = [-90, 0, 0]; //rotation [X,Y,Z]
// Photographer
var PhTorso = [0, -90, 0]; //rotation [X,Y,Z]
var PhHead = [0, 0, 0]; //rotation [X,Y,Z]
var PhLupArm = [140, 0, 10]; //rotation [X,Y,Z]
var PhLlowArm = [-30, 0, 0]; //rotation [X,Y,Z]
var PhRupArm = [130, 0, -10]; //rotation [X,Y,Z]
var PhRlowArm = [-60, 0, 0]; //rotation [X,Y,Z]
var PhLupLeg = [165, 0, 5]; //rotation [X,Y,Z]
var PhLlowLeg = [10, 0, 0]; //rotation [X,Y,Z]
var PhRupLeg = [185, 0, -5]; //rotation [X,Y,Z]
var PhRlowLeg = [10, 0, 0]; //rotation [X,Y,Z]
var PhNeck = [0, 90, 0]; //rotation [X,Y,Z]
var PhRshoulder = [0, 0, 0]; //rotation [X,Y,Z]
var PhLshoulder = [0, 0, 0]; //rotation [X,Y,Z]
var PhRshoe = [-90, 0, 0]; //rotation [X,Y,Z]
var PhLshoe = [-90, 0, 0]; //rotation [X,Y,Z]

// Moving of humanoids
var distancePh = [0, 0, -8];
var distance = [0, 0, -8];

var theta = [ModelTorso, ModelHead, ModelLupArm, ModelLlowArm, ModelRupArm, ModelRlowArm, ModelLupLeg, ModelLlowLeg, ModelRupLeg, ModelRlowLeg, ModelNeck, ModelRshoulder, ModelLshoulder, ModelRshoe, ModelLshoe];
var thetaPh = [PhTorso, PhHead, PhLupArm, PhLlowArm, PhRupArm, PhRlowArm, PhLupLeg, PhLlowLeg, PhRupLeg, PhRlowLeg, PhNeck, PhRshoulder, PhLshoulder, PhRshoe, PhLshoe];

// IDs of camera's parts
var leg1Id = 30;
var leg2Id = 31;
var leg3Id = 32;
var platformId = 33;
var blockId = 34;
var lensId = 35;

// Changing of the camera's position
var C_leg1 = [30, 0, 30];
var C_leg2 = [30, 0, -30];
var C_leg3 = [-40, 0, 0];
var C_platform = [0, 90, 0];
var C_block = [0, 0, 0];
var C_lens = [0, 0, 0];

// Moving the camera's position
var thetaC = [C_leg1, C_leg2, C_leg3, C_platform, C_block, C_lens];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:

    m = rotate(theta[torsoId][0], 1, 0, 0 );
    m = mult(m, rotate(theta[torsoId][1], 0, 1, 0));
    m = mult(m, rotate(theta[torsoId][2], 0, 0, 1));
    m = mult(m, translate(distance[0], 0.0, 0.0));
    m = mult(m, translate(0.0, distance[1], 0.0));
    m = mult(m, translate(0.0, 0.0, distance[2]));
    figure[torsoId] = createNode( m, torso, PhtorsoId, LshoulderId );
    break;

    case LshoulderId:

    m = rotate(theta[LshoulderId][0], 1, 0, 0 );
    m = mult(m, rotate(theta[LshoulderId][1], 0, 1, 0));
    m = mult(m, rotate(theta[LshoulderId][2], 0, 0, 1));
    m = mult(m, translate(0.5*torsoWidth, 0.8*torsoHeight, 0.0));
    figure[LshoulderId] = createNode( m, Lshoulder, RshoulderId, null );
    break;

    case RshoulderId:

    m = rotate(theta[RshoulderId][0], 1, 0, 0 );
    m = mult(m, rotate(theta[RshoulderId][1], 0, 1, 0));
    m = mult(m, rotate(theta[RshoulderId][2], 0, 0, 1));
    m = mult(m, translate(-0.5*torsoWidth, 0.8*torsoHeight, 0.0));
    figure[RshoulderId] = createNode( m, Rshoulder, neckId, null );
    break;

    case neckId:
    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[neckId][0], 1, 0, 0));
    m = mult(m, rotate(theta[neckId][1], 0, 1, 0));
    m = mult(m, rotate(theta[neckId][2], 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[neckId] = createNode( m, neck, leftUpperArmId, headId);
    break;

    case headId:

    m = translate(0.0, headHeight, 0.0);
	m = mult(m, rotate(theta[headId][0], 1, 0, 0));
    m = mult(m, rotate(theta[headId][1], 0, 1, 0));
    m = mult(m, rotate(theta[headId][2], 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, null, null);
    break;


    case leftUpperArmId:

    m = translate(-(torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
    m = mult(m, rotate(theta[leftUpperArmId][0], 1, 0, 0));
    m = mult(m, rotate(theta[leftUpperArmId][1], 0, 1, 0));
    m = mult(m, rotate(theta[leftUpperArmId][2], 0, 0, 1));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
    m = mult(m, rotate(theta[rightUpperArmId][0], 1, 0, 0));
    m = mult(m, rotate(theta[rightUpperArmId][1], 0, 1, 0));
    m = mult(m, rotate(theta[rightUpperArmId][2], 0, 0, 1));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(torsoWidth), 0.1*upperLegHeight, 0.0);
    m = mult(m , rotate(theta[leftUpperLegId][0], 1, 0, 0));
    m = mult(m , rotate(theta[leftUpperLegId][1], 0, 1, 0));
    m = mult(m , rotate(theta[leftUpperLegId][2], 0, 0, 1));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth, 0.1*upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightUpperLegId][0], 1, 0, 0));
    m = mult(m, rotate(theta[rightUpperLegId][1], 0, 1, 0));
    m = mult(m, rotate(theta[rightUpperLegId][2], 0, 0, 1));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId][0], 1, 0, 0));
    m = mult(m, rotate(theta[leftLowerArmId][1], 0, 1, 0));
    m = mult(m, rotate(theta[leftLowerArmId][2], 0, 0, 1));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId][0], 1, 0, 0));
    m = mult(m, rotate(theta[rightLowerArmId][1], 0, 1, 0));
    m = mult(m, rotate(theta[rightLowerArmId][2], 0, 0, 1));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId][0], 1, 0, 0));
    m = mult(m, rotate(theta[leftLowerLegId][1], 0, 1, 0));
    m = mult(m, rotate(theta[leftLowerLegId][2], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, LshoeId );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId][0], 1, 0, 0));
    m = mult(m, rotate(theta[rightLowerLegId][1], 0, 1, 0));
    m = mult(m, rotate(theta[rightLowerLegId][2], 0, 0, 1));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, RshoeId );
    break;

    case LshoeId:

    m = translate(0.0, 0.9*lowerLegHeight, 0.5*lowerLegWidth);
    m = mult(m, rotate(theta[LshoeId][0], 1, 0, 0));
    m = mult(m, rotate(theta[LshoeId][1], 0, 1, 0));
    m = mult(m, rotate(theta[LshoeId][2], 0, 0, 1));
    figure[LshoeId] = createNode( m, Lshoe, null, null );
    break;

    case RshoeId:

    m = translate(0.0, 0.9*lowerLegHeight, 0.5*lowerLegWidth);
    m = mult(m, rotate(theta[RshoeId][0], 1, 0, 0));
    m = mult(m, rotate(theta[RshoeId][1], 0, 1, 0));
    m = mult(m, rotate(theta[RshoeId][2], 0, 0, 1));
    figure[RshoeId] = createNode( m, Rshoe, null, null );
    break;

    // PHOTOGRAPHER
    case PhtorsoId:

    m = rotate(thetaPh[torsoId][0], 1, 0, 0 );
    m = mult(m, rotate(thetaPh[torsoId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[torsoId][2], 0, 0, 1));
    m = mult(m, translate(distancePh, 0.0, 0.0));
    figure[PhtorsoId] = createNode( m, torso, platformId, PhLshoulderId );
    break;

    case PhLshoulderId:

    m = rotate(thetaPh[LshoulderId][0], 1, 0, 0 );
    m = mult(m, rotate(thetaPh[LshoulderId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[LshoulderId][2], 0, 0, 1));
    m = mult(m, translate(0.5*torsoWidth, 0.8*torsoHeight, 0.0));
    figure[PhLshoulderId] = createNode( m, Lshoulder, PhRshoulderId, null );
    break;

    case PhRshoulderId:

    m = rotate(thetaPh[RshoulderId][0], 1, 0, 0 );
    m = mult(m, rotate(thetaPh[RshoulderId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[RshoulderId][2], 0, 0, 1));
    m = mult(m, translate(-0.5*torsoWidth, 0.8*torsoHeight, 0.0));
    figure[PhRshoulderId] = createNode( m, Rshoulder, PhneckId, null );
    break;

    case PhneckId:
    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(thetaPh[neckId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[neckId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[neckId][2], 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[PhneckId] = createNode( m, neck, PhleftUpperArmId, PhheadId);
    break;

    case PhheadId:

    m = translate(0.0, headHeight, 0.0);
	m = mult(m, rotate(thetaPh[headId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[headId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[headId][2], 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[PhheadId] = createNode( m, head, null, null);
    break;


    case PhleftUpperArmId:

    m = translate(-(torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
    m = mult(m, rotate(thetaPh[leftUpperArmId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[leftUpperArmId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[leftUpperArmId][2], 0, 0, 1));
    figure[PhleftUpperArmId] = createNode( m, leftUpperArm, PhrightUpperArmId, PhleftLowerArmId );
    break;

    case PhrightUpperArmId:

    m = translate(torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
    m = mult(m, rotate(thetaPh[rightUpperArmId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[rightUpperArmId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[rightUpperArmId][2], 0, 0, 1));
    figure[PhrightUpperArmId] = createNode( m, rightUpperArm, PhleftUpperLegId, PhrightLowerArmId );
    break;

    case PhleftUpperLegId:

    m = translate(-(torsoWidth), 0.1*upperLegHeight, 0.0);
    m = mult(m , rotate(thetaPh[leftUpperLegId][0], 1, 0, 0));
    m = mult(m , rotate(thetaPh[leftUpperLegId][1], 0, 1, 0));
    m = mult(m , rotate(thetaPh[leftUpperLegId][2], 0, 0, 1));
    figure[PhleftUpperLegId] = createNode( m, leftUpperLeg, PhrightUpperLegId, PhleftLowerLegId );
    break;

    case PhrightUpperLegId:

    m = translate(torsoWidth, 0.1*upperLegHeight, 0.0);
    m = mult(m, rotate(thetaPh[rightUpperLegId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[rightUpperLegId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[rightUpperLegId][2], 0, 0, 1));
    figure[PhrightUpperLegId] = createNode( m, rightUpperLeg, null, PhrightLowerLegId );
    break;

    case PhleftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(thetaPh[leftLowerArmId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[leftLowerArmId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[leftLowerArmId][2], 0, 0, 1));
    figure[PhleftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case PhrightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(thetaPh[rightLowerArmId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[rightLowerArmId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[rightLowerArmId][2], 0, 0, 1));
    figure[PhrightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case PhleftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(thetaPh[leftLowerLegId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[leftLowerLegId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[leftLowerLegId][2], 0, 0, 1));
    figure[PhleftLowerLegId] = createNode( m, leftLowerLeg, null, PhLshoeId );
    break;

    case PhrightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(thetaPh[rightLowerLegId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[rightLowerLegId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[rightLowerLegId][2], 0, 0, 1));
    figure[PhrightLowerLegId] = createNode( m, rightLowerLeg, null, PhRshoeId );
    break;

    case PhLshoeId:

    m = translate(0.0, 0.9*lowerLegHeight, 0.5*lowerLegWidth);
    m = mult(m, rotate(thetaPh[LshoeId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[LshoeId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[LshoeId][2], 0, 0, 1));
    figure[PhLshoeId] = createNode( m, Lshoe, null, null );
    break;

    case PhRshoeId:

    m = translate(0.0, 0.9*lowerLegHeight, 0.5*lowerLegWidth);
    m = mult(m, rotate(thetaPh[RshoeId][0], 1, 0, 0));
    m = mult(m, rotate(thetaPh[RshoeId][1], 0, 1, 0));
    m = mult(m, rotate(thetaPh[RshoeId][2], 0, 0, 1));
    figure[PhRshoeId] = createNode( m, Rshoe, null, null );
    break;
    
    //CAMERA

    case platformId:

    m = rotate(thetaC[3][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[3][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[3][2], 0, 0, 1));
    m = mult(m, translate(0.0, 0.0, 4));
    figure[platformId] = createNode( m, platform, null, leg1Id );
    break;
    

    case leg1Id:

    m = rotate(thetaC[0][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[0][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[0][2], 0, 0, 1));
    m = mult(m, translate(0, -3, 0));
    figure[leg1Id] = createNode( m, leg, leg2Id, null );
    break;

    case leg2Id:

    m = rotate(thetaC[1][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[1][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[1][2], 0, 0, 1));
    m = mult(m, translate(0.0, -3, 0.0));
    figure[leg2Id] = createNode( m, leg, leg3Id, null);
    break;

    case leg3Id:

    m = rotate(thetaC[2][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[2][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[2][2], 0, 0, 1));
    m = mult(m, translate(0.0, -3, 0.0));
    figure[leg3Id] = createNode( m, leg, blockId, null );
    break;

    case blockId:

    m = rotate(thetaC[4][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[4][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[4][2], 0, 0, 1));
    m = mult(m, translate(0.0, 0.0, 0.0));
    figure[blockId] = createNode( m, block, lensId, null );
    break;

    case lensId:

    m = rotate(thetaC[5][0], 1, 0, 0 );
    m = mult(m, rotate(thetaC[5][1], 0, 1, 0));
    m = mult(m, rotate(thetaC[5][2], 0, 0, 1));
    m = mult(m, translate(0, 0.5*blockHeight, -0.5*blockWidth));
    figure[lensId] = createNode( m, lens, null, null );
    break;
    }
}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Lshoulder() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*shoulderHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( shoulderWidth, shoulderHeight, shoulderWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Rshoulder() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*shoulderHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( shoulderWidth, shoulderHeight, shoulderWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function neck() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*neckHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( neckWidth, neckHeight, neckWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Lshoe() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * shoeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(shoeWidth, shoeHeight, shoeWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Rshoe() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * shoeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(shoeWidth, shoeHeight, shoeWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function platform() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * platformHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(platformWidth, platformHeight, platformWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * legHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function block() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * blockHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(blockWidth, blockHeight, blockWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function lens() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lensHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lensWidth, lensHeight, lensWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // get info from the screen
    theta_slider = document.getElementById("slide_theta");
    phi_slider = document.getElementById("slide_phi");

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}

function updateModelViewMatrix() {
    var radius = 1;
    var thetha = theta_slider.value;    
    var phi = phi_slider.value;

    var eye = vec3(radius*Math.sin(thetha*Math.PI/360)*Math.cos(phi*Math.PI/360), 
    radius*Math.sin(thetha*Math.PI/360)*Math.sin(phi*Math.PI/360), radius*Math.cos(thetha*Math.PI/360));

    modelViewMatrix = lookAt(eye, /*at*/vec3(0.0, 0.0, 0.0), /*up*/vec3(0.0, 1.0, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(-90));
    modelViewMatrix = mult(modelViewMatrix, rotateY(90));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.8, 0.8, 0.8));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

var render = function() {

        updateModelViewMatrix();

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        traverse(torsoId);
        requestAnimFrame(render);
}

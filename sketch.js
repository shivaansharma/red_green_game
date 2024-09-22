import { store } from "./js/redux/store.js";
import { updateLegs } from "./js/redux/feature/trackingMovement.js";

let video;
let bodyPose;
let poses = [];
let connections;

function preload() {
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      if (pointA.score > 0.1 && pointB.score > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function gotPoses(results) {
  poses = results;
  if (poses.length > 0) {
    let pose = poses[0];
    
   
    const findKeypoint = (name) => pose.keypoints.find(kp => kp.name === name);
    
    
    const getPosition = (keypoint) => keypoint ? { x: keypoint.x, y: keypoint.y } : { x: 0, y: 0 };
    
    
    const getScore = (keypoint) => keypoint ? keypoint.score || 0 : 0;

    let rightHip = findKeypoint("right_hip");
    let leftHip = findKeypoint("left_hip");
    let rightAnkle = findKeypoint("right_ankle");
    let leftAnkle = findKeypoint("left_ankle");

    const rightLeg = {
      rightHip: {
        x: getPosition(rightHip).x,
        y: getPosition(rightHip).y,
        score: getScore(rightHip)
      },
      rightAnkle: {
        x: getPosition(rightAnkle).x,
        y: getPosition(rightAnkle).y,
        score: getScore(rightAnkle)
      }
    };

    const leftLeg = {
      leftHip: {
        x: getPosition(leftHip).x,
        y: getPosition(leftHip).y,
        score: getScore(leftHip)
      },
      leftAnkle: {
        x: getPosition(leftAnkle).x,
        y: getPosition(leftAnkle).y,
        score: getScore(leftAnkle)
      }
    };

   // console.log("Dispatching updateLegs with:", { rightLeg, leftLeg });
    store.dispatch(
      updateLegs({
        rightLeg,
        leftLeg
      })
    );
  }
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
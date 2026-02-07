//import { Hands } from "@mediapipe/hands";

// MediaPipe has a landmark array of 21 connected 3D hand-knuckle coordinates
// This constant LANDMARKS stores indexes along the array for each point
export const LANDMARKS = {
    WRIST: 0,
  
    // THUMB
    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,

    INDEX_FINGER_MCP: 5,
    INDEX_FINGER_PIP: 6,
    INDEX_FINGER_DIP: 7,
    INDEX_FINGER_TIP: 8,

    MIDDLE_FINGER_MCP: 9,
    MIDDLE_FINGER_PIP: 10,
    MIDDLE_FINGER_DIP: 11,
    MIDDLE_FINGER_TIP: 12,

    RING_FINGER_MCP: 13,
    RING_FINGER_PIP: 14,
    RING_FINGER_DIP: 15,
    RING_FINGER_TIP: 16,

    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20

  };

  // Function to get the distance between two points, a and b
  function get_distance(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2 +
      (a.z - b.z) ** 2
    );
  }

  // Caluculate the vector of the line between two landmarks, a and b:
  function get_vector() {
    // return a dictionary which represents the vector
    /*
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
    */
   // return an array which represents the vector
   const vector = [a.x - b.x, a.y - b.y, a.z - b.z]; // [x, y, z]
   return vector;
  }

  // Dot product between two functions
  function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  // Calculate the angle of a joint:
  // Input: landmarks array from MediaPipe, and specific landmarks a, b, and c
  export function getAngleOfJoint(landmarks, a, b, c) {

    // Check if landmarks a, b, c and sequential

    // Get the vectors from a to b, and from c to b
    const vector1 = vector(landmarks[a], landmarks[b]);
    const vector2 = vector(landmarks[c], landmarks[b]);

    // Calculate the angle between vector1 and vector2
    const cosTheta = 
        dot(vector1, vector2)

    // This is not done yet
  }

  // Or wait, should I just 

  // Measure the angle between two joints:



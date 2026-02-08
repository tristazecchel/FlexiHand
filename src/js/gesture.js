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

  // Function to get the distance between two points, a and b (in ))
  function getDistance(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
      (a.y - b.y) ** 2 +
      (a.z - b.z) ** 2
    );
  }

  // Caluculate the vector of the line between two landmarks, a and b:
  function getVector(a, b) {
    return [
        a.x - b.x,
        a.y - b.y,
        a.z - b.z
    ];
 }

  // Dot product between two functions
  function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  // Function to get the magnitude of a 3D vector
  function magnitude3D(vector) {
    return Math.sqrt((vector[0]**2) + (vector[1]**2) + (vector[2]**2))
  }

  // Calculate the angle of a joint:
  // Input: landmarks array from MediaPipe, and specific landmarks a, b, and c
  export function getAngleOfJoint(landmarks, a, b, c) {

    // Check if landmarks a, b, c and sequential (i.e. on the same finger?)
    if ( ( ( ( (a == 0) || ((1 <= a) && (a <= 4)) ) && (1 <= b) && (b <= 4) && (1 <= c) && (c <= 4))       // Check if all landmarks are on THUMB
      || ( ( (a == 0) || ((5 <= a) && (a <= 8))) && (5 <= b) && (b <= 8) && (5 <= c) && (c <= 8))          // Check if all landmarks are on INDEX
      || ( ( (a == 0 ) || ((9 <= a) && (a <= 12))) && (9 <= b) && (b <= 12) && (9 <= c) && (c <= 12))      // Check if all landmarks are on MIDDLE
      || ( ( (a == 0) || ((13 <= a) && (a <= 16))) && (13 <= b) && (b <= 16) && (13 <= c) && (c <= 16))    // Check if all landmarks are on RING
      || ( ( (a == 0) || ((17 <= a) && (a <= 20))) && (17 <= b) && (b <= 20) && (17 <= c) && (c <= 20)) )  // Check if all landmarks are on PINKY
       && ( ((b == a+1) && (c == b+1)) || ((a == 0) && (c == b+1)) ) ) {                                   // Check is all landmakrs are sequential
        // Get the vectors from a to b, and from c to b
        const vector1 = getVector(landmarks[a], landmarks[b]);
        const vector2 = getVector(landmarks[c], landmarks[b]);

        // Calculate the angle between vector1 and vector2, and return
        const cosTheta = dot(vector1, vector2) / (magnitude3D(vector1) * magnitude3D(vector2));
        return Math.acos(cosTheta)
        //
        /* 
          Maybe for numerical safety should do this instead?:
          const clamped = Math.min(1, Math.max(-1, cosTheta));

        return Math.acos(clamped) * (180 / Math.PI);
        */
    } else {
      console.error('Argument is not valid. a, b, c, must be values between 0 and 20, and b=a+1, and c=b+1.');
    }
  }
  

// Getting landmarks from mediapipe.js
export function onLandmarksDetected(landmarksArray) {

    // landmarksArray = array of hands
    const landmarks = landmarksArray[0];
    if (!landmarks) return;

    // Normalize landmarks (removes hand size & position differences)
    const normalizedLandmarks = normalizeLandmarks(landmarks);

    const features = extractFeatures(normalizedLandmarks);

    console.log(features);

}

// Normalized function
export function normalizeLandmarks(landmarks) {

    // Use wrist as origin
    const wrist = landmarks[LANDMARKS.WRIST];

    const shifted = landmarks.map(point => ({
        x: point.x - wrist.x,
        y: point.y - wrist.y,
        z: point.z - wrist.z
    }));


    // Use wrist to point 9 (middle MCP) as scale reference
    const middleMCP = landmarks[LANDMARKS.MIDDLE_FINGER_MCP];

    const scale = Math.sqrt(
        (middleMCP.x - wrist.x) ** 2 +
        (middleMCP.y - wrist.y) ** 2 +
        (middleMCP.z - wrist.z) ** 2
    );

    if (scale === 0) return shifted;


    // Scale all points
    const normalized = shifted.map(point => ({
        x: point.x / scale,
        y: point.y / scale,
        z: point.z / scale
    }));

    return normalized;
}

// Extract features
function extractFeatures(landmarks) {

    const features = {

        jointAngles: {},
        fingerDistances: {},
        fingertipDistances: {}

    };

    // Extracting joint angles
    // Thumb MCP
    features.jointAngles.thumb_MCP =
    getAngleOfJoint(landmarks,
        LANDMARKS.THUMB_CMC,
        LANDMARKS.THUMB_MCP,
        LANDMARKS.THUMB_IP);
      
    // Thumb IP
    features.jointAngles.thumb_IP =
        getAngleOfJoint(landmarks,
            LANDMARKS.THUMB_MCP,
            LANDMARKS.THUMB_IP,
            LANDMARKS.THUMB_TIP);
    
    // Index PIP
    features.jointAngles.index_PIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.INDEX_FINGER_MCP,
            LANDMARKS.INDEX_FINGER_PIP,
            LANDMARKS.INDEX_FINGER_DIP);
    
    // Index DIP
    features.jointAngles.index_DIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.INDEX_FINGER_PIP,
            LANDMARKS.INDEX_FINGER_DIP,
            LANDMARKS.INDEX_FINGER_TIP);
      
    // Index MCP
    features.jointAngles.index_MCP =
        getAngleOfJoint(landmarks,
            LANDMARKS.WRIST,
            LANDMARKS.INDEX_FINGER_MCP,
            LANDMARKS.INDEX_FINGER_PIP);

    // Middle PIP
    features.jointAngles.middle_PIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.MIDDLE_FINGER_MCP,
            LANDMARKS.MIDDLE_FINGER_PIP,
            LANDMARKS.MIDDLE_FINGER_DIP);
    
    // Middle DIP
    features.jointAngles.middle_DIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.MIDDLE_FINGER_PIP,
            LANDMARKS.MIDDLE_FINGER_DIP,
            LANDMARKS.MIDDLE_FINGER_TIP);

    // Middle MCP
    features.jointAngles.middle_MCP =
        getAngleOfJoint(landmarks,
            LANDMARKS.WRIST,
            LANDMARKS.MIDDLE_FINGER_MCP,
            LANDMARKS.MIDDLE_FINGER_PIP);

    // Ring PIP
    features.jointAngles.ring_PIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.RING_FINGER_MCP,
            LANDMARKS.RING_FINGER_PIP,
            LANDMARKS.RING_FINGER_DIP);

    // Ring DIP
    features.jointAngles.ring_DIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.RING_FINGER_PIP,
            LANDMARKS.RING_FINGER_DIP,
            LANDMARKS.RING_FINGER_TIP);

    // Ring MCP
    features.jointAngles.ring_MCP =
        getAngleOfJoint(landmarks,
            LANDMARKS.WRIST,
            LANDMARKS.RING_FINGER_MCP,
            LANDMARKS.RING_FINGER_PIP);

    // Pinky PIP
    features.jointAngles.pinky_PIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.PINKY_MCP,
            LANDMARKS.PINKY_PIP,
            LANDMARKS.PINKY_DIP);

    // Pinky DIP
    features.jointAngles.pinky_DIP =
        getAngleOfJoint(landmarks,
            LANDMARKS.PINKY_PIP,
            LANDMARKS.PINKY_DIP,
            LANDMARKS.PINKY_TIP);

    // Pinky MCP
    features.jointAngles.pinky_MCP =
        getAngleOfJoint(landmarks,
            LANDMARKS.WRIST,
            LANDMARKS.PINKY_MCP,
            LANDMARKS.PINKY_PIP);

    // Extracting finger distance
    features.fingerDistances.thumb =
        getDistance(landmarks[LANDMARKS.WRIST],
                    landmarks[LANDMARKS.THUMB_TIP]);

    features.fingerDistances.index =
        getDistance(landmarks[LANDMARKS.WRIST],
                    landmarks[LANDMARKS.INDEX_FINGER_TIP]);

    features.fingerDistances.middle =
        getDistance(landmarks[LANDMARKS.WRIST],
                    landmarks[LANDMARKS.MIDDLE_FINGER_TIP]);

    features.fingerDistances.ring =
        getDistance(landmarks[LANDMARKS.WRIST],
                    landmarks[LANDMARKS.RING_FINGER_TIP]);

    features.fingerDistances.pinky =
        getDistance(landmarks[LANDMARKS.WRIST],
                    landmarks[LANDMARKS.PINKY_TIP]);


    return features;
}
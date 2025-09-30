import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";

// Global state for tracking data
let recordedTrackingData = [];
let isRecording = false;
let holistic;
let camera;
let videoElement;
let currentFrame = 0;
let isInitialized = false;

export const initializeHolistic = async () => {
    if (isInitialized) return;

    videoElement = document.getElementById('videoInput');

    // 1. Initialize Holistic Model
    holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1633596781/${file}`;
        }
    });

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: true, // Detailed face tracking (468 points)
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    holistic.onResults(onResults);

    // 2. Setup camera stream
    camera = new Camera(videoElement, {
        onFrame: async () => {
            await holistic.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    await camera.start();
    isInitialized = true;
    console.log("Holistic and camera initialized successfully.");
}

function onResults(results) {
    if (isRecording) {
        // Collect relevant tracking data. Only store normalized coordinates.
        const data = {
            frame: currentFrame++,
            timestamp: Date.now(),
            faceLandmarks: results.faceLandmarks,
            poseLandmarks: results.poseLandmarks,
            leftHandLandmarks: results.leftHandLandmarks,
            rightHandLandmarks: results.rightHandLandmarks,
        };
        recordedTrackingData.push(data);
    }
}

export const startRecording = () => {
    if (!isInitialized) {
        console.error("Tracking model is not initialized.");
        return false;
    }
    if (isRecording) return true;

    recordedTrackingData = [];
    currentFrame = 0;
    isRecording = true;
    console.log("Recording started.");
    return true;
}

export const stopRecording = () => {
    if (!isRecording) return;
    isRecording = false;
    console.log(`Recording stopped. Captured ${recordedTrackingData.length} frames.`);
}

export const getRecordedData = () => {
    return recordedTrackingData;
}

export const downloadTrackingData = () => {
    // Ensure recording is stopped before downloading
    if (isRecording) {
        stopRecording();
    }
    
    const dataToDownload = getRecordedData();

    if (dataToDownload.length === 0) {
        alert("No tracking data recorded.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToDownload));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tracking_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export const isCurrentlyRecording = () => {
    return isRecording;
}
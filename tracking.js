import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";

// Global state for tracking data
let recordedTrackingData = [];
let isRecording = false;
let holistic;
let camera;
let videoElement;
let currentFrame = 0;

export const initializeHolistic = (onReadyCallback) => {
    videoElement = document.getElementById('videoInput');

    // 1. Initialize Holistic Model
    holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`;
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
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        camera = new Camera(videoElement, {
            onFrame: async () => {
                // Ensure the model processes frames only if the video is ready
                if (videoElement.readyState >= 3) {
                    await holistic.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });
        camera.start().then(() => {
            console.log("Camera started successfully.");
            // Ensure video element size is set so MediaPipe works correctly
            videoElement.width = 640;
            videoElement.height = 480;
            if (onReadyCallback) {
                onReadyCallback();
            }
        }).catch(err => {
            console.error("Failed to start camera:", err);
            // We alert the user if camera fails, as the application cannot proceed without it
            alert("Error accessing webcam. Please ensure permissions are granted.");
        });
    } else {
        alert("Your browser does not support getUserMedia.");
    }
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
    // Check if the camera stream is active (though the video element is hidden, it needs to be streaming)
    if (!videoElement || videoElement.paused || videoElement.ended) {
        // We cannot reliably check if MediaPipe is 100% ready, but if the camera isn't running, it won't work.
        console.error("Camera is not running or tracking model is not initialized.");
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
    stopRecording();
    if (recordedTrackingData.length === 0) {
        alert("No tracking data recorded.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recordedTrackingData));
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


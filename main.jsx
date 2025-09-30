import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { TrackingVisualization } from "./visualization.jsx";
import {
  initializeHolistic,
  startRecording,
  stopRecording,
  getRecordedData,
  downloadTrackingData,
  isCurrentlyRecording
} from "./tracking.js";
const App = () => {
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const [recordedData, setRecordedData] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Initializing camera and tracking model...");
  useEffect(() => {
    initializeHolistic(() => {
      setIsCameraInitialized(true);
      setStatusMessage("Ready. Press 'Start Recording' when ready to move.");
    });
  }, []);
  const handleStartRecording = useCallback(() => {
    if (!isCameraInitialized) {
      setStatusMessage("Error: Camera not initialized.");
      return;
    }
    if (startRecording()) {
      setIsRecordingState(true);
      setRecordedData([]);
      setStatusMessage("\u{1F534} Recording... capturing full body and facial data.");
    } else {
      setStatusMessage("Error: Could not start recording. Check console for camera access issues.");
    }
  }, [isCameraInitialized]);
  const handleStopRecording = useCallback(() => {
    stopRecording();
    const data = getRecordedData();
    setRecordedData(data);
    setIsRecordingState(false);
    setStatusMessage(`Recording stopped. Captured ${data.length} frames. Preview available below.`);
  }, []);
  const handleDownload = useCallback(() => {
    if (isCurrentlyRecording()) {
      handleStopRecording();
    }
    downloadTrackingData();
  }, [handleStopRecording]);
  const durationInFrames = useMemo(() => recordedData.length, [recordedData]);
  const showPlayer = durationInFrames > 0;
  return /* @__PURE__ */ jsxDEV("div", { style: { padding: 20, maxWidth: 900, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxDEV("h1", { children: "Webcam Tracking Data Capture (Hidden Feed)" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 62,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("p", { children: "Uses MediaPipe Holistic to capture 3D body, hand, and 2D facial tracking data without displaying the raw webcam feed. The output is a sequence of landmark coordinates ready for video composition." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 63,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      margin: "20px 0",
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "white"
    }, children: [
      /* @__PURE__ */ jsxDEV("p", { style: { fontWeight: "bold" }, children: [
        "Status: ",
        statusMessage
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 72,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "15px", display: "flex", gap: "10px" }, children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleStartRecording,
            disabled: !isCameraInitialized || isRecordingState,
            style: { padding: "10px 20px", backgroundColor: isRecordingState ? "#aaa" : "green", color: "white", border: "none", borderRadius: "5px", cursor: isRecordingState ? "not-allowed" : "pointer", fontWeight: "bold" },
            children: isRecordingState ? "Recording (Do Not Refresh)" : "Start Recording"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 75,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleStopRecording,
            disabled: !isRecordingState,
            style: { padding: "10px 20px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", cursor: !isRecordingState ? "not-allowed" : "pointer" },
            children: "Stop Recording"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleDownload,
            disabled: isRecordingState || recordedData.length === 0,
            style: { padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: isRecordingState || recordedData.length === 0 ? "not-allowed" : "pointer" },
            children: [
              "Download JSON Data (",
              recordedData.length,
              " frames)"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 89,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 74,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 65,
      columnNumber: 13
    }),
    showPlayer && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: 30, width: "100%", aspectRatio: "540 / 960", maxWidth: "400px", margin: "30px auto" }, children: [
      /* @__PURE__ */ jsxDEV("h2", { children: "Tracking Visualization Preview (540x960 Portrait)" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 101,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: TrackingVisualization,
          durationInFrames,
          fps: 30,
          compositionWidth: 540,
          compositionHeight: 960,
          loop: true,
          controls: true,
          inputProps: { trackingData: recordedData },
          autoplay: true,
          style: { width: "100%", height: "100%", border: "1px solid #333", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 102,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 100,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 61,
    columnNumber: 9
  });
};
createRoot(document.getElementById("app")).render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 120,
  columnNumber: 51
}));

import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
const VIS_WIDTH = 540;
const VIS_HEIGHT = 960;
const scale = (x, y) => ({
  x: x * VIS_WIDTH,
  y: y * VIS_HEIGHT
});
const LandmarkDot = ({ x, y, color = "red", size = 5 }) => {
  if (x === void 0 || y === void 0 || x === null || y === null) return null;
  const scaled = scale(x, y);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        left: scaled.x - size / 2,
        top: scaled.y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        zIndex: 10
      }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 9
    }
  );
};
const LandmarkLine = ({ start, end, color = "white", thickness = 1 }) => {
  if (!start || !end || start.x === void 0 || end.x === void 0 || start.x === null || end.x === null) return null;
  const startScaled = scale(start.x, start.y);
  const endScaled = scale(end.x, end.y);
  const length = Math.sqrt(
    (endScaled.x - startScaled.x) ** 2 + (endScaled.y - startScaled.y) ** 2
  );
  const angle = Math.atan2(
    endScaled.y - startScaled.y,
    endScaled.x - startScaled.x
  ) * (180 / Math.PI);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        left: startScaled.x,
        top: startScaled.y,
        width: length,
        height: thickness,
        backgroundColor: color,
        transformOrigin: "0 0",
        transform: `rotate(${angle}deg)`,
        zIndex: 5
      }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 53,
      columnNumber: 9
    }
  );
};
const POSE_CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [27, 29],
  [27, 31],
  [24, 26],
  [26, 28],
  [28, 30],
  [28, 32]
].map(([start, end]) => ({ start, end }));
const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Index
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  // Middle
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  // Ring
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  // Pinky
  [5, 9],
  [9, 13],
  [13, 17]
  // Palm connections (simplified)
].map(([start, end]) => ({ start, end }));
const drawLandmarks = (landmarks, connections, color, dotSize, lineColor) => {
  if (!landmarks || landmarks.length === 0) return [];
  const elements = [];
  connections.forEach(({ start, end }) => {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    elements.push(
      /* @__PURE__ */ jsxDEV(
        LandmarkLine,
        {
          start: p1,
          end: p2,
          color: lineColor,
          thickness: 3
        },
        `line-${start}-${end}-${Math.random()}`,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 99,
          columnNumber: 13
        }
      )
    );
  });
  landmarks.forEach((p, index) => {
    elements.push(
      /* @__PURE__ */ jsxDEV(
        LandmarkDot,
        {
          x: p.x,
          y: p.y,
          color,
          size: dotSize
        },
        `dot-${index}-${Math.random()}`,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 112,
          columnNumber: 13
        }
      )
    );
  });
  return elements;
};
const TrackingVisualization = ({ trackingData = [] }) => {
  const frame = useCurrentFrame();
  const currentData = useMemo(() => {
    const index = Math.min(Math.floor(frame), trackingData.length - 1);
    return trackingData[index] || null;
  }, [frame, trackingData]);
  if (!currentData) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#111", justifyContent: "center", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxDEV("h1", { style: { color: "white", fontSize: 36 }, children: "Tracking Data Preview" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 137,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("p", { style: { color: "white" }, children: "Start recording to see visualization." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 138,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 136,
      columnNumber: 16
    });
  }
  const { poseLandmarks, faceLandmarks, leftHandLandmarks, rightHandLandmarks } = currentData;
  const elements = [];
  elements.push(...drawLandmarks(poseLandmarks, POSE_CONNECTIONS, "lime", 8, "green"));
  elements.push(...drawLandmarks(faceLandmarks, [], "yellow", 2, "yellow"));
  elements.push(...drawLandmarks(leftHandLandmarks, HAND_CONNECTIONS, "cyan", 5, "blue"));
  elements.push(...drawLandmarks(rightHandLandmarks, HAND_CONNECTIONS, "magenta", 5, "purple"));
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#111" }, children: [
    elements,
    /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", bottom: 10, left: 10, color: "white", fontSize: 24, zIndex: 20 }, children: [
      "Frame: ",
      frame + 1,
      " / ",
      trackingData.length
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 161,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 159,
    columnNumber: 9
  });
};
export {
  TrackingVisualization
};

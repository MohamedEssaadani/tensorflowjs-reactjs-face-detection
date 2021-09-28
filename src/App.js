//import logo from './logo.svg';
import { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  // Setup references
  const webcamRef = useRef(null);
  const canvasref = useRef(null);

  // Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.0,
    });

    setInterval(() => {
      detect(net);
    }, 100);
  };

  // Define detect function
  const detect = async (net) => {
    // check for webcam is running
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Props
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set Video Width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set Canvas Width
      canvasref.current.width = videoWidth;
      canvasref.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces(video);
      console.log(face);

      // Get Canvas Context For Drawing
      const ctx = canvasref.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };

  runFacemesh();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        ></Webcam>

        <canvas
          ref={canvasref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </header>
    </div>
  );
}

export default App;

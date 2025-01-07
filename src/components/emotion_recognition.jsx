import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";
import { Appwrite } from '../constants/appwrite';
import { useParams } from 'react-router-dom';

const EmotionRecognition = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { uid } = useParams();
  const [detectedEmotion, setDetectedEmotion] = useState(null);

  useEffect(()=>{
    console.log(detectedEmotion)
  },[detectedEmotion])

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.loadSsdMobilenetv1Model('/models');
      await faceapi.loadFaceLandmarkModel('/models');
      await faceapi.loadFaceRecognitionModel('/models');
      await faceapi.loadFaceExpressionModel('/models');
    };

    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        const canvas = canvasRef.current;
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);


        const expressions = resizedDetections[0]?.expressions;
        if (expressions) {
          const emotion = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
          setDetectedEmotion(emotion); 
        }

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, displaySize.width, displaySize.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const updateEmotion = async () => {
      if (detectedEmotion) {
        try {
          const response = await Appwrite.databases.updateDocument(
            Appwrite.databaseId,
            Appwrite.collectionId,
            uid, 
            { emotion: detectedEmotion } 
          );
          console.log("Emotion updated:", response);
        } catch (error) {
          console.error("Error updating emotion:", error);
        }
      }
    };

    const intervalId = setInterval(updateEmotion, 60000);

    return () => clearInterval(intervalId);
  }, [detectedEmotion]); 

  return (
    <div className="relative w-full h-full">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "80%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          borderRadius: "15px",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "80%",
          pointerEvents: "none", 
        }}
      />
    </div>
  );
};

export default EmotionRecognition;

import React, { useEffect, useState } from "react";
import EmotionRecognition from "../components/emotion_recognition";
import { useNavigate, useParams } from "react-router-dom";
import { Appwrite } from "../constants/appwrite";
import { Query } from "appwrite";

const Emolyzer = () => {
  const navigate = useNavigate();
  const { sessionId, uid } = useParams();
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const response = await Appwrite.databases.listDocuments(
        Appwrite.databaseId,
        Appwrite.collectionId,
        [Query.equal("uid", uid)] 
      );
  
      if (response.documents.length > 0) {
        const foundDocument = response.documents[0]; 
        const session = foundDocument.sessionId; 
        if(!session || session !== sessionId){
          navigate("/");
        }
        if(foundDocument){
          setUser(foundDocument)
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSignout = async () => {
    try {
      if (user && uid) {
        const updateResponse = await Appwrite.databases.updateDocument(
          Appwrite.databaseId,
          Appwrite.collectionId,
          uid,
          {sessionId: ''},
        )
        console.log('Session cleared:', updateResponse);
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating sessionId:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="fixed nav z-40 mx-auto p-6 px-2 lg:px-32 w-full flex justify-between items-center">
        <a
          href="/"
          className="font-bold italic text-3xl text-[#1A73E8] font-mono tracking-widest cursor-pointer"
        >
          Emolyzer
        </a>
        <p
          className="bg-[#1A73E8] text-white rounded px-3 py-2 font-bold hover:bg-blue-600"
        >
          {user != null ? user.name : uid}
        </p>
      </nav>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-40 w-full h-screen px-4 md:px-10 lg:px-40">
        <div className="flex flex-col lg:justify-center lg:items-end justify-end items-center text-center lg:text-left">
          <p className="text-[#1A73E8] text-[36px] md:text-[48px] lg:text-[64px] font-bold">
            Emotion Analyzer
          </p>
          <p className="text-[18px] md:text-[24px] lg:text-[28px] font-bold text-black max-w-[500px] m-1">
            Analyze Emotions of your patients Live from anywhere.
          </p>
          <p className="m-1 text-[14px] md:text-[16px] lg:text-[18px] text-black max-w-[500px]">
            A fast, easy way to collect facial expression data, from anywhere in
            the world.
          </p>
          <div className="w-[500px]">
            <button
              onClick={handleSignout}
              className="bg-[#1A73E8] mt-4 text-white rounded px-6 py-3 font-bold hover:bg-blue-600"
            >
              Signout
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center lg:items-center lg:justify-start">
          <EmotionRecognition />
        </div>
      </div>
    </>
  );
};

export default Emolyzer;

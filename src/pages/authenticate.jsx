import React, { useState } from "react";
import { Header } from "../components/header";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE } from "../constants/firebase";

const sessionId = uuidv4();

const Authenticate = () => {
  const [uid, setuid] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(FIRESTORE, "users"), where("uid", "==", uid)));
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          const session = user?.sessionId;
          if (session && sessionId && session == sessionId) {
                navigate(`/authenticate/${session}/${uid}`);
              } else if (session !== sessionId && uid.length === 28) {
                toast.error("Please Scan again!");
              } else {
                console.log(null);
              }
            }
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

  return (
    <>
      <Header />
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
          <div className="w-[500px] py-3">
            <p className="m-1 text-[14px] md:text-[16px] lg:text-[18px] text-black max-w-[500px]">
              1. Scan the QR code first
            </p>
            <p className="m-1 text-[14px] md:text-[16px] lg:text-[18px] text-black max-w-[500px]">
              2. Paste the uidId
            </p>
          </div>
        </div>

        <div className="flex  justify-center items-center lg:items-center lg:justify-start">
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <QRCode
              value={sessionId}
              size={256}
              level="H"
              includemargin="true"
            />
            <p className="mt-4 text-center text-black text-sm">
              Scan this QR code to authenticate.
            </p>
            <input
              autoComplete="off"
              autoCorrect="off"
              value={uid}
              onChange={(e) => setuid(e.target.value)}
              className="mt-4 focus:outline-none w-full px-2 py-2 rounded text-center italic"
              placeholder="Enter UID"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Authenticate;

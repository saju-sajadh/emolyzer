import { Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "../pages/home";
import Authenticate from "../pages/authenticate";
import Emolyzer from "../pages/emolyzer";


export default function Mainrouter() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/authenticate"} element={<Authenticate />} />
        <Route path={"/authenticate/:sessionId/:uid"} element={<Emolyzer />} />
      </Routes>
    </>
  );
}

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainHome from "./pages/CaptainHome";
import CaptainRiding from "./pages/CaptainRiding";
import Riding from "./pages/Riding";
import UserLogout from "./pages/UserLogout";
import CaptainLogout from "./pages/CaptainLogout";
import CaptainProtectWrapper from "./components/CaptainProtectWrapper";
import UserProtectWrapper from "./components/UserProtectWrapper";
import "remixicon/fonts/remixicon.css";

function App() {

  return (
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/signup" element={<UserSignup/>} />
          <Route
            path="/riding"
            element={
              <UserProtectWrapper>
                <Riding />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/user/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup/>}/>
          <Route
            path="/captain-home"
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            }
          />
          <Route
            path="/captain-riding"
            element={
              <CaptainProtectWrapper>
                <CaptainRiding />
              </CaptainProtectWrapper>
            }
          />
          <Route
            path="/captain-logout"
            element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            }
          />
          <Route
            path="/captain/logout"
            element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            }
          />
        </Routes>
      </div>
  );
}

export default App;
